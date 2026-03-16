// This piece of code was orignally written by amirnissim and can be seen here
// http://stackoverflow.com/a/11703018/2694653
// This has been ported to Vanilla.js by GuillaumeLeclerc
export default (input) => {
  var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent

  function addEventListenerWrapper (type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type === 'keydown') {
      var origListener = listener
      listener = function (event) {
        var suggestionSelected = document.getElementsByClassName('pac-item-selected').length > 0
        if (event.which === 13 && !suggestionSelected) {
          var simulatedEvent = document.createEvent('Event')
          simulatedEvent.keyCode = 40
          simulatedEvent.which = 40
          origListener.apply(input, [simulatedEvent])
        }
        origListener.apply(input, [event])
      }
    }
    _addEventListener.apply(input, [type, listener])
  }

  input.addEventListener = addEventListenerWrapper
  input.attachEvent = addEventListenerWrapper
}
