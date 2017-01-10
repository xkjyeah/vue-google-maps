'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
} /* vim: set softtabstop=2 shiftwidth=2 expandtab : */

exports.default = function (vueElement, googleMapsElement, props, options) {
  options = options || {};
  var _options = options,
      afterModelChanged = _options.afterModelChanged;

  _lodash2.default.forEach(props, function (_ref, attribute) {
    var twoWay = _ref.twoWay,
        type = _ref.type;

    var setMethodName = 'set' + capitalizeFirstLetter(attribute);
    var getMethodName = 'get' + capitalizeFirstLetter(attribute);
    var eventName = attribute.toLowerCase() + '_changed';

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    var timesSet = 0;

    vueElement.$watch(attribute, function () {
      var attributeValue = vueElement[attribute];

      timesSet++;
      googleMapsElement[setMethodName](attributeValue);
      if (afterModelChanged) {
        afterModelChanged(attribute, attributeValue);
      }
    }, {
      deep: type === Object
    });

    if (twoWay) {
      googleMapsElement.addListener(eventName, function (ev) {
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