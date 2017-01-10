'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _manager = require('../manager.js');

var _deferredReady = require('../utils/deferredReady.js');

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _mountableMixin = require('../utils/mountableMixin.js');

var _mountableMixin2 = _interopRequireDefault(_mountableMixin);

var _latlngChangedHandler = require('../utils/latlngChangedHandler.js');

var _latlngChangedHandler2 = _interopRequireDefault(_latlngChangedHandler);

var _generatePropsToBind = require('../utils/generatePropsToBind.js');

var _generatePropsToBind2 = _interopRequireDefault(_generatePropsToBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var twoWayProps = ["center", "zoom", "heading", "mapTypeId", "projection", "tilt"];
var excludedProps = ['center', 'zoom', 'bounds'];
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
}).fromPairs().value();

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
  },


  /// Override mountableMixin::_resizeCallback
  /// because resizePreserveCenter is usually the
  /// expected behaviour
  _resizeCallback: function _resizeCallback() {
    this.resizePreserveCenter();
  }
};

// Methods is a combination of customMethods and linkedMethods
var methods = _lodash2.default.assign({}, customMethods, linkedMethods);

exports.default = {
  mixins: [_getPropsValuesMixin2.default, _deferredReady.DeferredReadyMixin, _mountableMixin2.default],
  props: props,
  replace: false, // necessary for css styles

  created: function created() {
    var _this = this;

    this.$mapCreated = new _promise2.default(function (resolve, reject) {
      _this.$mapCreatedDeferred = { resolve: resolve, reject: reject };
    });
  },


  watch: {
    center: {
      deep: true,
      handler: (0, _latlngChangedHandler2.default)(function (val, oldVal) {
        if (this.$mapObject) {
          this.$mapObject.setCenter(val);
        }
      })
    },
    zoom: function zoom(_zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(_zoom);
      }
    }
  },

  deferredReady: function deferredReady() {
    var _this2 = this;

    return _manager.loaded.then(function () {
      // getting the DOM element where to create the map
      var element = _this2.$refs['vue-map'];

      // creating the map
      var copiedData = _lodash2.default.clone(_this2.getPropsValues());
      delete copiedData.options;
      var options = _lodash2.default.clone(_this2.options);
      _lodash2.default.assign(options, copiedData);
      _this2.$mapObject = new google.maps.Map(element, options);

      // binding properties (two and one way)
      (0, _propsBinder2.default)(_this2, _this2.$mapObject, (0, _generatePropsToBind2.default)(props, twoWayProps, excludedProps));

      // manually trigger center and zoom
      _this2.$mapObject.addListener('center_changed', function () {
        _this2.$emit('center_changed', _this2.$mapObject.getCenter());
        _this2.$emit('bounds_changed', _this2.$mapObject.getBounds());
      });
      _this2.$mapObject.addListener('zoom_changed', function () {
        _this2.$emit('zoom_changed', _this2.$mapObject.getZoom());
        _this2.$emit('bounds_changed', _this2.$mapObject.getBounds());
      });

      //binding events
      (0, _eventsBinder2.default)(_this2, _this2.$mapObject, events);

      _this2.$mapCreatedDeferred.resolve(_this2.$mapObject);

      return _this2.$mapCreated;
    }).catch(function (error) {
      throw error;
    });
  },

  methods: methods
};