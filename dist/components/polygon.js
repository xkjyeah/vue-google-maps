'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _generatePropsToBind = require('../utils/generatePropsToBind');

var _generatePropsToBind2 = _interopRequireDefault(_generatePropsToBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var twoWayProps = ["path", "paths"];
var excludedProps = ["path", "paths", "deepWatch"];
var props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  },
  path: {
    type: Array
  },
  paths: {
    type: Array
  },
  deepWatch: {
    type: Boolean,
    default: false
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render() {
    return '';
  },
  destroyed: function destroyed() {
    if (this.$polygonObject) {
      this.$polygonObject.setMap(null);
    }
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = _lodash2.default.clone(this.getPropsValues());
    delete options.options;
    _lodash2.default.assign(options, this.options);
    if (!options.path) {
      delete options.path;
    }
    if (!options.paths) {
      delete options.paths;
    }
    this.$polygonObject = this.createPolygonObject(options);

    (0, _propsBinder2.default)(this, this.$polygonObject, (0, _generatePropsToBind2.default)(props, twoWayProps, excludedProps));
    (0, _eventsBinder2.default)(this, this.$polygonObject, events);

    var clearEvents = function clearEvents() {};

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    var pathsChange = function pathsChange(paths) {
      if (paths) {
        (function () {
          clearEvents();
          if (typeof paths[0][0] == 'undefined') {
            _this.$polygonObject.setPaths([paths]);
          } else {
            _this.$polygonObject.setPaths(paths);
          }

          var updatePaths = function updatePaths() {
            _this.$emit('paths_changed', _this.$polygonObject.getPaths());
          };
          var eventListeners = [];

          var mvcArray = _this.$polygonObject.getPaths();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(mvcArray.getArray()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var mvcPath = _step.value;

              eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
              eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
              eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          eventListeners.push([mvcArray, mvcArray.addListener('insert_at', updatePaths)]);
          eventListeners.push([mvcArray, mvcArray.addListener('remove_at', updatePaths)]);
          eventListeners.push([mvcArray, mvcArray.addListener('set_at', updatePaths)]);

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
    };
    if (this.paths) {
      pathsChange(this.paths);
    }
    this.$watch('paths', pathsChange, {
      deep: this.deepWatch
    });

    var pathChange = function pathChange(path) {
      if (path) {
        (function () {
          clearEvents();

          _this.$polygonObject.setPath(path);

          var mvcPath = _this.$polygonObject.getPath();
          var eventListeners = [];

          var updatePaths = function updatePaths() {
            _this.$emit('path_changed', _this.$polygonObject.getPath());
          };

          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);

          clearEvents = function clearEvents() {
            eventListeners.map(function (_ref3) {
              var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
                  obj = _ref4[0],
                  listenerHandle = _ref4[1];

              return google.maps.event.removeListener(listenerHandle);
            });
          };
        })();
      }
    };
    if (this.path) {
      pathChange(this.path);
    }
    this.$watch('path', pathChange, {
      deep: this.deepWatch
    });

    // Display the map
    this.$polygonObject.setMap(this.$map);
  },

  methods: {
    createPolygonObject: function createPolygonObject(options) {
      return new google.maps.Polygon(options);
    }
  }
};