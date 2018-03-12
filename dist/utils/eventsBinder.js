'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (vueElement, googleMapObject, events) {
  (0, _forEach2.default)(events, function (eventName) {
    var exposedName = eventName;
    googleMapObject.addListener(eventName, function (ev) {
      vueElement.$emit(exposedName, ev);
    });
  });
}; /* vim: set softtabstop=2 shiftwidth=2 expandtab : */