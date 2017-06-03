'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

var _ = require('lodash');
var assert = require('assert');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.default = function (vueElement, googleMapsElement, props, options) {
  options = options || {};
  var _options = options,
      afterModelChanged = _options.afterModelChanged;

  _.forEach(props, function (_ref, attribute) {
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
      // (function () {
      //   // The indicator variable that is updated whenever any of the properties have changed
      //   // This ensures that the event handler will only be fired once
      //   var attributeTrackerName = '_' + attribute + '_changeTracker';
      //   var attributeTrackerRoot = '$data._changeIndicators';
      //   var attributeValue = vueElement[attribute];

      //   vueElement.$set(vueElement.$data._changeIndicators, attributeTrackerName, 0);

      //   vueElement.$watch(attributeTrackerRoot + '.' + attributeTrackerName, function () {
      //     googleMapsElement[setMethodName](vueElement[attribute]);
      //     if (afterModelChanged) {
      //       afterModelChanged(attribute, attributeValue);
      //     }
      //   }, {
      //     immediate: typeof initialValue !== 'undefined'
      //   });

      //   trackProperties.forEach(function (propName) {
      //     vueElement.$watch(attribute + '.' + propName, function () {
      //       vueElement.$set(attributeTrackerRoot, attributeTrackerName, vueElement.$get(attributeTrackerRoot, attributeTrackerName) + 1);
      //     }, {
      //       immediate: typeof initialValue !== 'undefined'
      //     });
      //   });
      // })();
    }

    if (twoWay) {
      googleMapsElement.addListener(eventName, function (ev) {
        // eslint-disable-line no-unused-vars
        if (timesSet > 0) {
          timesSet--;
          return;
        } else {
          vueElement.$emit(eventName, googleMapsElement[getMethodName]());
        }
      });
    }
  });
};