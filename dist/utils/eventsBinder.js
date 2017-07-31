'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

exports.default = function (vueElement, googleMapObject, events) {
  (0, _forEach3.default)(events, function (eventName) {
    var exposedName = eventName;
    googleMapObject.addListener(eventName, function (ev) {
      vueElement.$emit(exposedName, ev);
    });
  });
};