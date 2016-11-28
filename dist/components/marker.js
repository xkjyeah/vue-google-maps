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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var markerProps = {
  animation: {
    type: Number,
    twoWay: true
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true
  },
  icon: {
    type: Object,
    twoWay: true
  },
  label: {
    type: String
  },
  opacity: {
    type: Number
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true
  }
};

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

  computed: {
    local_animation: {
      get: function get() {
        return this.animation;
      },
      set: function set(value) {
        this.$emit('animation-changed', value);
      }
    },
    local_attribution: function local_attribution() {
      return this.attribution;
    },

    local_clickable: {
      get: function get() {
        return this.clickable;
      },
      set: function set(value) {
        this.$emit('clickable-changed', value);
      }
    },
    local_cursor: {
      get: function get() {
        return this.cursor;
      },
      set: function set(value) {
        this.$emit('cursor-changed', value);
      }
    },
    local_draggable: {
      get: function get() {
        return this.draggable;
      },
      set: function set(value) {
        this.$emit('draggable-changed', value);
      }
    },
    local_icon: {
      get: function get() {
        return this.icon;
      },
      set: function set(value) {
        this.$emit('icon-changed', value);
      }
    },
    local_label: function local_label() {
      return this.label;
    },
    local_opacity: function local_opacity() {
      return this.opacity;
    },
    local_place: function local_place() {
      return this.place;
    },

    local_position: {
      get: function get() {
        return this.position;
      },
      set: function set(value) {
        this.$emit('position-changed', value);
      }
    },
    local_shape: {
      get: function get() {
        return this.shape;
      },
      set: function set(value) {
        this.$emit('shape-changed', value);
      }
    },
    local_title: {
      get: function get() {
        return this.title;
      },
      set: function set(value) {
        this.$emit('title-changed', value);
      }
    },
    local_zIndex: {
      get: function get() {
        return this.zIndex;
      },
      set: function set(value) {
        this.$emit('z-index-changed', value);
      }
    },
    local_visible: {
      get: function get() {
        return this.visible;
      },
      set: function set(value) {
        this.$emit('visible-changed', value);
      }
    }
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
      (0, _propsBinder2.default)(this, this.$markerObject, markerProps);
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
    },
    getParentAcceptMarker: function getParentAcceptMarker(child) {
      return getParentTest(child, function (component) {
        return component._acceptMarker == true;
      });
    }
  }
};