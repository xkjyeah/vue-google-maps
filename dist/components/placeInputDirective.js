'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  inserted: function inserted(el, binding, vnode) {
    _assert2.default.strictEquals(el.tagName, 'INPUT');

    this.$autoCompleter = new google.maps.places.Autocomplete(el);
  }
};