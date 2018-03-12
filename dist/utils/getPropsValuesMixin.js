'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  methods: {
    getPropsValues: function getPropsValues() {
      var _this = this;

      return (0, _mapValues2.default)(this.$options.props, function (v, k) {
        return _this[k];
      });
    }
  }
};