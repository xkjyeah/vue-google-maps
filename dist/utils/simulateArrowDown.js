'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

//This piece of code was orignally written by amirnissim and can be seen here
//http://stackoverflow.com/a/11703018/2694653
//This has been ported to Vanilla.js by GuillaumeLeclerc
exports.default = function (input) {
  var _addEventListener = input.addEventListener ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type == "keydown") {
      var orig_listener = listener;
      listener = function listener(event) {
        var suggestion_selected = document.getElementsByClassName('pac-item-selected').length > 0;
        if (event.which == 13 && !suggestion_selected) {
          var simulatedEvent = document.createEvent('Event');
          simulatedEvent.keyCode = 40;
          simulatedEvent.which = 40;
          orig_listener.apply(input, [simulatedEvent]);
        }
        orig_listener.apply(input, [event]);
      };
    }
    _addEventListener.apply(input, [type, listener]);
  }

  input.addEventListener = addEventListenerWrapper;
  input.attachEvent = addEventListenerWrapper;
};