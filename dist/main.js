'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapElementMixin = exports.PlaceInput = exports.Map = exports.InfoWindow = exports.Rectangle = exports.Circle = exports.Polygon = exports.Polyline = exports.Cluster = exports.Marker = exports.loaded = exports.load = undefined;
exports.install = install;

var _manager = require('./manager.js');

var _marker = require('./components/marker');

var _marker2 = _interopRequireDefault(_marker);

var _cluster = require('./components/cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _polyline = require('./components/polyline');

var _polyline2 = _interopRequireDefault(_polyline);

var _polygon = require('./components/polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _circle = require('./components/circle');

var _circle2 = _interopRequireDefault(_circle);

var _rectangle = require('./components/rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _infoWindow = require('./components/infoWindow.vue');

var _infoWindow2 = _interopRequireDefault(_infoWindow);

var _map = require('./components/map.vue');

var _map2 = _interopRequireDefault(_map);

var _placeInput = require('./components/placeInput.vue');

var _placeInput2 = _interopRequireDefault(_placeInput);

var _mapElementMixin = require('./components/mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _deferredReady = require('./utils/deferredReady');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export everything
exports.load = _manager.load;
exports.loaded = _manager.loaded;
exports.Marker = _marker2.default;
exports.Cluster = _cluster2.default;
exports.Polyline = _polyline2.default;
exports.Polygon = _polygon2.default;
exports.Circle = _circle2.default;
exports.Rectangle = _rectangle2.default;
exports.InfoWindow = _infoWindow2.default;
exports.Map = _map2.default;
exports.PlaceInput = _placeInput2.default;
exports.MapElementMixin = _mapElementMixin2.default;

// Vue component imports

function install(Vue, options) {
  options = _lodash2.default.defaults(options, {
    installComponents: true
  });

  Vue.use(_deferredReady.DeferredReady);

  if (options.load) {
    (0, _manager.load)(options.load);
  }

  if (options.installComponents) {
    Vue.component('GmapMap', _map2.default);
    Vue.component('GmapMarker', _marker2.default);
    Vue.component('GmapCluster', _cluster2.default);
    Vue.component('GmapInfoWindow', _infoWindow2.default);
    Vue.component('GmapPolyline', _polyline2.default);
    Vue.component('GmapPolygon', _polygon2.default);
    Vue.component('GmapCircle', _circle2.default);
    Vue.component('GmapRectangle', _rectangle2.default);
    Vue.component('GmapPlaceInput', _placeInput2.default);
  }
}