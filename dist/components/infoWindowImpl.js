"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _propsBinder = require("../utils/propsBinder.js");

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _eventsBinder = require("../utils/eventsBinder.js");

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _mapElementMixin = require("./mapElementMixin");

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var infoWindowProps = {
  options: {
    type: Object,
    twoWay: false
  },
  content: {
    twoWay: false
  },
  position: {
    type: Object,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  }
};

var props = {
  options: {
    type: Object,
    default: function _default() {
      return {};
    }
  },
  content: {
    default: null
  },
  opened: {
    type: Boolean,
    default: true
  },
  position: {
    type: Object
  },
  zIndex: {
    type: Number
  }
};

var events = ['domready', 'closeclick', 'content_changed'];

exports.default = {
  mixins: [_mapElementMixin2.default],
  replace: false,
  props: props,
  data: function data() {
    return {
      infoWindowObj: {
        opened: true,
        position: {}
      }
    };
  },

  computed: {
    local_options: function local_options() {
      return this.options;
    },
    local_content: function local_content() {
      return this.content;
    },

    local_opened: {
      get: function get() {
        return typeof this.$options.propsData['opened'] !== 'undefined' ? this.opened : this.infoWindowObj.opened;
      },
      set: function set(value) {
        this.infoWindowObj.opened = value;
        this.$emit('opened-changed', value);
        this.$nextTick(function () {
          if (this.infoWindowObj.opened == this.local_opened) return;
          this.infoWindowObj.opened = this.local_opened;
          this.openInfoWindow();
        });
      }
    },
    local_position: {
      get: function get() {
        return typeof this.$options.propsData['position'] !== 'undefined' ? this.position : this.infoWindowObj.position;
      },
      set: function set(value) {
        this.infoWindowObj.position = value;
        this.$emit('position-changed', value);
      }
    },
    local_zIndex: {
      get: function get() {
        return this.zIndex;
      },
      set: function set(value) {
        this.$emit('z-index-changed', value);
      }
    }
  },
  beforeCreate: function beforeCreate() {
    this.$parentAcceptInfoWindow = null;
    this.$markerObject = null;
  },
  mounted: function mounted() {
    var el = this.$refs.flyaway;
    el.parentNode.removeChild(el);
  },
  deferredReady: function deferredReady() {
    this.$parentAcceptInfoWindow = this.$findAncestor(function (ans) {
      return ans.$acceptInfoWindow;
    });
    if (this.$parentAcceptInfoWindow) {
      this.$parentAcceptInfoWindow.$emit('register-info-window', this);
    }
    this.createInfoWindow(this.$map);
  },
  destroyed: function destroyed() {
    if (this.$parentAcceptInfoWindow) {
      this.$parentAcceptInfoWindow.$emit('unregister-info-window', this);
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
  },


  methods: {
    openInfoWindow: function openInfoWindow() {
      if (this.local_opened) {
        if (this.$markerObject !== null) {
          this.$infoWindow.open(this.$map, this.$markerObject);
        } else {
          this.$infoWindow.open(this.$map);
        }
      } else {
        this.$infoWindow.close();
      }
    },
    createInfoWindowObject: function createInfoWindowObject(options) {
      return new google.maps.InfoWindow(options);
    },
    createInfoWindow: function createInfoWindow(map) {
      var _this = this;

      // setting options
      var options = _lodash2.default.clone(this.local_options);
      options.content = this.$refs.flyaway;

      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.local_position;
      }

      this.$infoWindow = this.createInfoWindowObject(options);

      // Binding
      (0, _propsBinder2.default)(this, this.$infoWindow, infoWindowProps);
      (0, _eventsBinder2.default)(this, this.$infoWindow, events);

      // watching
      this.$on('closeclick', function (ev) {
        this.local_opened = false;
      });

      this.$watch('local_opened', function () {
        _this.openInfoWindow();
      });

      this.openInfoWindow();
    }
  }
};