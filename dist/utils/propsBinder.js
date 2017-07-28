'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var assert = require('assert'); /* vim: set softtabstop=2 shiftwidth=2 expandtab : */

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.default = function (vueElement, googleMapsElement, props, options) {
  options = options || {};
  var _options = options,
      afterModelChanged = _options.afterModelChanged;

  (0, _lodash.forEach)(props, function (_ref, attribute) {
    var twoWay = _ref.twoWay,
        type = _ref.type,
        trackProperties = _ref.trackProperties;

    var setMethodName = 'set' + capitalizeFirstLetter(attribute);
    var getMethodName = 'get' + capitalizeFirstLetter(attribute);
    var eventName = attribute.toLowerCase() + '_changed';
    var initialValue = vueElement[attribute];

    assert(googleMapsElement[setMethodName], setMethodName + ' is not a method of (the Maps object corresponding to) ' + vueElement.$options._componentTag);

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    var timesSet = 0;
    if (type !== Object || !trackProperties) {
      // Track the object deeply
      vueElement.$watch(attribute, function () {
        var attributeValue = vueElement[attribute];

        timesSet++;
        googleMapsElement[setMethodName](attributeValue);
        if (afterModelChanged) {
          afterModelChanged(attribute, attributeValue);
        }
      }, {
        immediate: typeof initialValue !== 'undefined',
        deep: type === Object
      });
    } else if (type === Object && trackProperties) {
      // I can watch multiple properties, but the danger is that each of
      // them triggers the event handler multiple times
      // This ensures that the event handler will only be fired once
      var tick = 0,
          expectedTick = 0;

      var raiseExpectation = function raiseExpectation() {
        expectedTick += 1;
      };

      var updateTick = function updateTick() {
        tick = Math.max(expectedTick, tick + 1);
      };

      var respondToChange = function respondToChange() {
        if (tick < expectedTick) {
          googleMapsElement[setMethodName](vueElement[attribute]);

          if (afterModelChanged) {
            afterModelChanged(attribute, attributeValue);
          }

          updateTick();
        }
      };

      trackProperties.forEach(function (propName) {
        // When any props change -- assume they change on the same tick
        vueElement.$watch(attribute + '.' + propName, function () {
          raiseExpectation();
          vueElement.$nextTick(respondToChange);
        }, {
          immediate: typeof initialValue !== 'undefined'
        });
      });
    }

    if (twoWay) {
      googleMapsElement.addListener(eventName, function (ev) {
        // eslint-disable-line no-unused-vars
        /* Check for type === Object because we're quite happy
          when primitive types change -- the change detection is cheap
        */
        if (type === Object && timesSet > 0) {
          timesSet--;
          return;
        } else {
          vueElement.$emit(eventName, googleMapsElement[getMethodName]());
        }
      });
    }
  });
};