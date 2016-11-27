'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var polylineProps = {
  path: {
    type: Array,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  deepWatch: {
    type: Boolean
  },
  options: {
    type: Object
  }
};

var props = {
  path: {
    type: Array
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  deepWatch: {
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

  computed: {
    local_path: {
      get: function get() {
        return this.path;
      },
      set: function set(value) {
        this.$emit('path_changed', value);
      }
    },
    local_draggable: function local_draggable() {
      return this.draggable;
    },
    local_editable: function local_editable() {
      return this.editable;
    },
    local_deepWatch: function local_deepWatch() {
      return this.deepWatch;
    },
    local_options: function local_options() {
      return this.options;
    }
  },
  destroyed: function destroyed() {
    if (this.$polylineObject) {
      this.$polylineObject.setMap(null);
    }
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = _lodash2.default.clone(this.getPropsValues());
    delete options.options;
    _lodash2.default.assign(options, this.local_options);
    this.$polylineObject = this.createPolylineObject(options);
    this.$polylineObject.setMap(this.$map);

    (0, _propsBinder2.default)(this, this.$polylineObject, _lodash2.default.omit(polylineProps, ['deepWatch', 'path']));
    (0, _eventsBinder2.default)(this, this.$polylineObject, events);

    var clearEvents = function clearEvents() {};

    this.$watch('local_path', function (path) {
      if (path) {
        (function () {
          clearEvents();

          _this.$polylineObject.setPath(path);

          var mvcPath = _this.$polylineObject.getPath();
          var eventListeners = [];

          var updatePaths = function updatePaths() {
            _this.local_path = _lodash2.default.map(_this.$polylineObject.getPath().getArray(), function (v) {
              return {
                lat: v.lat(),
                lng: v.lng()
              };
            });
          };

          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);

          clearEvents = function clearEvents() {
            eventListeners.map(function (_ref) {
              var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
                  obj = _ref2[0],
                  listenerHandle = _ref2[1];

              return google.maps.event.removeListener(listenerHandle);
            });
          };
        })();
      }
    }, {
      deep: this.local_deepWatch
    });

    // Display the map
    this.$polylineObject.setMap(this.$map);
  },

  methods: {
    createPolylineObject: function createPolylineObject(options) {
      return new google.maps.Polyline(options);
    }
  }
};