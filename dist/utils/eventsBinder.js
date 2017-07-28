'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

exports.default = function (vueElement, googleMapObject, events) {
  (0, _lodash.forEach)(events, function (eventName) {
    var exposedName = eventName;
    googleMapObject.addListener(eventName, function (ev) {
      vueElement.$emit(exposedName, ev);
    });
  });
}; /* vim: set softtabstop=2 shiftwidth=2 expandtab : */