'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

exports.default = {
  methods: {
    getPropsValues: function getPropsValues() {
      var _this = this;

      return (0, _lodash.mapValues)(this.$options.props, function (v, k) {
        return _this[k];
      });
    }
  }
};