"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _eventsBinder = require("../utils/eventsBinder.js");

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require("../utils/propsBinder.js");

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _getPropsValuesMixin = require("../utils/getPropsValuesMixin.js");

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _mapElementMixin = require("./mapElementMixin");

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _generatePropsToBind = require("../utils/generatePropsToBind");

var _generatePropsToBind2 = _interopRequireDefault(_generatePropsToBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var twoWayProps = ["animation", "clickable", "cursor", "draggable", "icon", "position", "shape", "title", "zIndex", "visible"];
var props = {
  animation: {
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    default: true
  },
  cursor: {
    type: String
  },
  draggable: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object
  },
  label: {},
  opacity: {
    type: Number,
    default: 1
  },
  place: {
    type: Object
  },
  position: {
    type: Object
  },
  shape: {
    type: Object
  },
  title: {
    type: String
  },
  zIndex: {
    type: Number
  },
  visible: {
    default: true
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

var container;

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,
  render: function render(h) {
    return h( // So that infowindows can have a marker parent
    'div', this.$slots.default);
  },
  created: function created() {
    this.$parentAcceptMarker = null;
    this.$acceptInfoWindow = true;
    this.$on('register-info-window', this.registerInfoWindow);
    this.$on('unregister-info-window', this.unregisterInfoWindow);
  },
  destroyed: function destroyed() {
    if (!this.$markerObject) return;
    if (this.$parentAcceptMarker) {
      this.$parentAcceptMarker.$emit('unregister-marker', this, this.$markerObject);
    }
    this.$markerObject.setMap(null);
  },
  deferredReady: function deferredReady() {
    // search ancestors for cluster object
    this.$parentAcceptMarker = this.$findAncestor(function (ans) {
      return ans.$acceptMarker;
    });
    var options = _lodash2.default.clone(this.getPropsValues());
    options.map = this.$map;
    this.createMarker(options, this.$map);
  },

  methods: {
    createMarker: function createMarker(options, map) {
      this.$markerObject = this.createMarkerObject(options);
      (0, _propsBinder2.default)(this, this.$markerObject, (0, _generatePropsToBind2.default)(props, twoWayProps));
      (0, _eventsBinder2.default)(this, this.$markerObject, events);

      /* Send an event to any <cluster ou similar> parent */
      if (this.$parentAcceptMarker) {
        this.$parentAcceptMarker.$emit('register-marker', this, this.$markerObject);
      }
    },
    createMarkerObject: function createMarkerObject(options) {
      return new google.maps.Marker(options);
    },
    registerInfoWindow: function registerInfoWindow(infoWindow) {
      infoWindow.$markerObject = this.$markerObject;
      this.infoWindowClickEvent = function () {
        infoWindow.local_opened = !infoWindow.local_opened;
      };
      this.$on('click', this.infoWindowClickEvent);
    },
    unregisterInfoWindow: function unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('click', this.infoWindowClickEvent);
      }
      this.infoWindowClickEvent = null;
    }
  }
};