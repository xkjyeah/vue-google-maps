"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _manager = require("../manager.js");

var _eventsBinder = require("../utils/eventsBinder.js");

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require("../utils/propsBinder.js");

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _deferredReady = require("../utils/deferredReady.js");

var _getPropsValuesMixin = require("../utils/getPropsValuesMixin.js");

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapsProps = {
  center: {
    twoWay: true,
    type: Object
  },
  zoom: {
    twoWay: true,
    type: Number
  },
  heading: {
    twoWay: true,
    type: Number
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  projection: {
    twoWay: true,
    type: Object
  },
  tilt: {
    twoWay: true,
    type: Number
  },
  options: {
    twoWay: false,
    type: Object
  }
};

var props = {
  center: {
    type: Object,
    required: true
  },
  zoom: {
    type: Number,
    default: 8
  },
  heading: {
    type: Number
  },
  mapTypeId: {
    type: String
  },
  bounds: {
    type: Object
  },
  projection: {
    type: Object
  },
  tilt: {
    type: Number
  },
  options: {
    type: Object,
    default: function _default() {
      return {};
    }
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'mousemove', 'mouseout', 'mouseover', 'resize', 'rightclick', 'tilesloaded'];

// Plain Google Maps methods exposed here for convenience
var linkedMethods = (0, _lodash2.default)(['panBy', 'panTo', 'panToBounds', 'fitBounds']).map(function (methodName) {
  return [methodName, function () {
    if (this.$mapObject) this.$mapObject[methodName].apply(this.$mapObject, arguments);
  }];
}).toPairs().value();

// Other convenience methods exposed by Vue Google Maps
var customMethods = {
  resize: function resize() {
    if (this.$mapObject) {
      google.maps.event.trigger(this.$mapObject, 'resize');
    }
  },
  resizePreserveCenter: function resizePreserveCenter() {
    if (!this.$mapObject) return;

    var oldCenter = this.$mapObject.getCenter();
    google.maps.event.trigger(this.$mapObject, 'resize');
    this.$mapObject.setCenter(oldCenter);
  }
};

// Methods is a combination of customMethods and linkedMethods
var methods = _lodash2.default.assign({}, customMethods, linkedMethods);

exports.default = {
  mixins: [_getPropsValuesMixin2.default, _deferredReady.DeferredReadyMixin],
  props: props,
  //replace: false, // necessary for css styles
  computed: {
    local_center: {
      get: function get() {
        return this.center;
      },
      set: function set(value) {
        this.$emit('center-changed', value);
      }
    },
    local_zoom: {
      get: function get() {
        return this.zoom;
      },
      set: function set(value) {
        this.$emit('zoom-changed', value);
      }
    },
    local_heading: {
      get: function get() {
        return this.heading;
      },
      set: function set(value) {
        this.$emit('heading-changed', value);
      }
    },
    local_mapTypeId: {
      get: function get() {
        return this.mapTypeId;
      },
      set: function set(value) {
        this.$emit('mapTypeId-changed', value);
      }
    },
    local_bounds: {
      get: function get() {
        return this.bounds;
      },
      set: function set(value) {
        this.$emit('bounds-changed', value);
      }
    },
    local_projection: {
      get: function get() {
        return this.projection;
      },
      set: function set(value) {
        this.$emit('projection-changed', value);
      }
    },
    local_tilt: {
      get: function get() {
        return this.tilt;
      },
      set: function set(value) {
        this.$emit('tilt-changed', value);
      }
    },
    local_options: function local_options() {
      return this.options;
    }
  },
  created: function created() {
    var _this = this;

    this.$mapCreated = new _promise2.default(function (resolve, reject) {
      _this.$mapCreatedDeferred = { resolve: resolve, reject: reject };
    });
  },
  deferredReady: function deferredReady() {
    var _this2 = this;

    return _manager.loaded.then(function () {
      // getting the DOM element where to create the map
      var element = _this2.$refs['vue-map'];

      // creating the map
      var copiedData = _lodash2.default.clone(_this2.getPropsValues());
      delete copiedData.options;
      var options = _lodash2.default.clone(_this2.local_options);
      _lodash2.default.assign(options, copiedData);
      _this2.$mapObject = new google.maps.Map(element, options);

      //binding properties (two and one way)
      (0, _propsBinder2.default)(_this2, _this2.$mapObject, mapsProps);

      //binding events
      (0, _eventsBinder2.default)(_this2, _this2.$mapObject, events);

      var updateBounds = function updateBounds() {
        _this2.local_bounds = _this2.$mapObject.getBounds();
      };

      _this2.$watch('local_center', updateBounds);
      _this2.$watch('local_zoom', updateBounds);

      _this2.$mapCreatedDeferred.resolve(_this2.$mapObject);

      return _this2.$mapCreated;
    }).catch(function (error) {
      throw error;
    });
  },

  methods: methods
};