'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _markerClustererPlus = require('marker-clusterer-plus');

var _markerClustererPlus2 = _interopRequireDefault(_markerClustererPlus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  maxZoom: {
    type: Number
  },
  calculor: {
    type: Function
  },
  gridSize: {
    type: Number
  },
  styles: {
    type: Array
  }
}; /* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,
  render: function render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },
  created: function created() {
    this.$acceptMarker = true;
    this.$on('register-marker', this.addMarker);
    this.$on('unregister-marker', this.removeMarker);
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = _lodash2.default.clone(this.getPropsValues());
    this.$clusterObject = this.createMarkerClusterObject(this.$map, [], options);

    (0, _propsBinder2.default)(this, this.$clusterObject, props, {
      afterModelChanged: function afterModelChanged(a, v) {
        var oldMarkers = _this.$clusterObject.getMarkers();
        _this.$clusterObject.clearMarkers();
        _this.$clusterObject.addMarkers(oldMarkers);
      }
    });
  },
  destroyed: function destroyed() {
    this.$clusterObject.clearMarkers();
  },

  methods: {
    createMarkerClusterObject: function createMarkerClusterObject(map, opt_markers, opt_options) {
      if (typeof _markerClustererPlus2.default === 'undefined') {
        console.error("MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js");
        throw new Error("MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js");
      }
      return new _markerClustererPlus2.default(map, opt_markers, opt_options);
    },
    addMarker: function addMarker(element, marker) {
      this.$clusterObject.addMarker(marker);
    },
    removeMarker: function removeMarker(element, marker) {
      this.$clusterObject.removeMarker(marker);
    }
  }
};