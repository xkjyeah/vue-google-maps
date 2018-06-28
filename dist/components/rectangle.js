'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapElementFactory = require('./mapElementFactory.js');

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  bounds: {
    type: Object,
    twoWay: true
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
    type: Object,
    twoWay: false
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  name: 'rectangle',
  ctr: function ctr() {
    return google.maps.Rectangle;
  },
  events: events
});