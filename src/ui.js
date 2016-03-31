const types = require('./lib/types');
var {createButton} = require('./lib/util');

module.exports = function(ctx) {

  var buttons = {};

  var lastClass;

  ctx.ui = {
    setClass: function(nextClass) {
      if(lastClass !== undefined) {
        ctx.container.classList.remove(lastClass);
      }

      if(nextClass !== undefined) {
        ctx.container.classList.add(nextClass);
      }

      lastClass = nextClass;
    },
    clearClass: function() {
      ctx.ui.setClass();
    },
    addButtons: function() {
      var controlClass = 'mapbox-gl-draw_ctrl-draw-btn';
      var controls = ctx.options.controls;
      var ctrlPos = 'mapboxgl-ctrl-top-left';

      let controlContainer = ctx.container.getElementsByClassName(ctrlPos)[0].getElementsByClassName('mapboxgl-ctrl-group')[0];

      if (controls.line_string) {
        buttons[types.LINE] = createButton(controlContainer, {
          className: `${controlClass} mapbox-gl-draw_line`,
          title: `LineString tool ${ctx.options.keybindings && '(l)'}`,
          fn: () => ctx.api.changeMode('draw_line_string')
        }, controlClass);
      }

      if (controls[types.POLYGON]) {
        buttons[types.POLYGON] = createButton(controlContainer, {
          className: `${controlClass} mapbox-gl-draw_polygon`,
          title: `Polygon tool ${ctx.options.keybindings && '(p)'}`,
          fn: () => ctx.api.changeMode('draw_polygon')
        }, controlClass);
      }

      if (controls[types.POINT]) {
        buttons[types.POINT] = createButton(controlContainer, {
          className: `${controlClass} mapbox-gl-draw_point`,
          title: `Marker tool ${ctx.options.keybindings && '(m)'}`,
          fn: () => ctx.api.changeMode('draw_point')
        }, controlClass);
      }

      if (controls.trash) {
        buttons.trash = createButton(controlContainer, {
          className: `${controlClass} mapbox-gl-draw_trash`,
          title: 'delete',
          fn: function() {
            ctx.api.trash();
            ctx.ui.setButtonInactive('trash');
          }
        }, controlClass);
      }
    },
    setButtonActive: function(id) {
      if (buttons[id] && id !== 'trash') {
        buttons[id].classList.add('active');
      }
    },
    setButtonInactive: function(id) {
      if (buttons[id]) {
        buttons[id].classList.remove('active');
      }
    },
    setAllInactive: function() {
      var buttonIds = Object.keys(buttons);

      buttonIds.forEach(buttonId => {
        if (buttonId !== 'trash') {
          var button = buttons[buttonId];
          button.classList.remove('active');
        }
      });
    },
    removeButtons: function() {
      var buttonIds = Object.keys(buttons);

      buttonIds.forEach(buttonId => {
        var button = buttons[buttonId];
        button.parentNode.removeChild(button);
        buttons[buttonId] = null;
      });
    }
  };
};