'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _generatePropsToBind = require('../utils/generatePropsToBind.js');

var _generatePropsToBind2 = _interopRequireDefault(_generatePropsToBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var twoWayProps = ["bounds"];
var props = {
  bounds: {
    type: Object
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render() {
    return '';
  },
  deferredReady: function deferredReady() {
    var options = _lodash2.default.clone(this.getPropsValues());
    options.map = this.$map;
    this.createRectangle(options, this.$map);
  },

  methods: {
    createRectangleObject: function createRectangleObject(options) {
      return new google.maps.Rectangle(options);
    },
    createRectangle: function createRectangle(options, map) {
      this.$rectangleObject = this.createRectangleObject(options);
      (0, _propsBinder2.default)(this, this.$rectangleObject, (0, _generatePropsToBind2.default)(props, twoWayProps));
      (0, _eventsBinder2.default)(this, this.$rectangleObject, events);
    }
  },
  destroyed: function destroyed() {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null);
    }
  }
};