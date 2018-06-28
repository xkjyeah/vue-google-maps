'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _markerClustererPlus = require('marker-clusterer-plus');

var _markerClustererPlus2 = _interopRequireDefault(_markerClustererPlus);

var _mapElementFactory = require('./mapElementFactory.js');

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                               * @class Cluster
                                                                                                                                                                                                                               * @prop $clusterObject -- Exposes the marker clusterer to
                                                                                                                                                                                                                                     descendent Marker classes. Override this if you area
                                                                                                                                                                                                                                     extending the class
                                                                                                                                                                                                                             **/


var props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  events: events,
  name: 'cluster',
  ctr: function ctr() {
    if (typeof _markerClustererPlus2.default === 'undefined') {
      /* eslint-disable no-console */
      console.error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js');
      throw new Error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js');
    }
    return _markerClustererPlus2.default;
  },
  ctrArgs: function ctrArgs(_ref) {
    var map = _ref.map,
        otherOptions = _objectWithoutProperties(_ref, ['map']);

    return [map, [], otherOptions];
  },

  render: function render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },
  afterCreate: function afterCreate(inst) {
    var reinsertMarkers = function () {
      var oldMarkers = inst.getMarkers();
      inst.clearMarkers();
      inst.addMarkers(oldMarkers);
    };

    for (var prop in props) {
      if (props[prop].twoWay) {
        this.$on(prop.toLowerCase() + '_changed', reinsertMarkers);
      }
    }
  },
  updated: function updated() {
    if (this.$clusterObject) {
      this.$clusterObject.repaint();
    }
  },
  beforeDestroy: function beforeDestroy() {
    var _this = this;

    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(function (marker) {
      if (marker.$clusterObject === _this.$clusterObject) {
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  }
});