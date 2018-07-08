'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreetViewPanorama = exports.MountableMixin = exports.Autocomplete = exports.MapElementFactory = exports.MapElementMixin = exports.PlaceInput = exports.Map = exports.InfoWindow = exports.Rectangle = exports.Cluster = exports.Circle = exports.Polygon = exports.Polyline = exports.Marker = exports.loaded = exports.load = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Vue component imports


exports.install = install;
exports.gmapApi = gmapApi;

var _manager = require('./manager.js');

var _marker = require('./components/marker');

var _marker2 = _interopRequireDefault(_marker);

var _polyline = require('./components/polyline');

var _polyline2 = _interopRequireDefault(_polyline);

var _polygon = require('./components/polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _circle = require('./components/circle');

var _circle2 = _interopRequireDefault(_circle);

var _rectangle = require('./components/rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _infoWindow = require('./components/infoWindow.vue');

var _infoWindow2 = _interopRequireDefault(_infoWindow);

var _map = require('./components/map.vue');

var _map2 = _interopRequireDefault(_map);

var _streetViewPanorama = require('./components/streetViewPanorama.vue');

var _streetViewPanorama2 = _interopRequireDefault(_streetViewPanorama);

var _placeInput = require('./components/placeInput.vue');

var _placeInput2 = _interopRequireDefault(_placeInput);

var _autocomplete = require('./components/autocomplete.vue');

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _mapElementMixin = require('./components/mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _mapElementFactory = require('./components/mapElementFactory');

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

var _mountableMixin = require('./utils/mountableMixin');

var _mountableMixin2 = _interopRequireDefault(_mountableMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// HACK: Cluster should be loaded conditionally
// However in the web version, it's not possible to write
// `import 'vue2-google-maps/src/components/cluster'`, so we need to
// import it anyway (but we don't have to register it)
// Therefore we use babel-plugin-transform-inline-environment-variables to
// set BUILD_DEV to truthy / falsy
var Cluster = undefined;

var GmapApi = void 0;

// export everything
exports.load = _manager.load;
exports.loaded = _manager.loaded;
exports.Marker = _marker2.default;
exports.Polyline = _polyline2.default;
exports.Polygon = _polygon2.default;
exports.Circle = _circle2.default;
exports.Cluster = Cluster;
exports.Rectangle = _rectangle2.default;
exports.InfoWindow = _infoWindow2.default;
exports.Map = _map2.default;
exports.PlaceInput = _placeInput2.default;
exports.MapElementMixin = _mapElementMixin2.default;
exports.MapElementFactory = _mapElementFactory2.default;
exports.Autocomplete = _autocomplete2.default;
exports.MountableMixin = _mountableMixin2.default;
exports.StreetViewPanorama = _streetViewPanorama2.default;
function install(Vue, options) {
  options = _extends({
    installComponents: true,
    autobindAllEvents: false
  }, options);

  var defaultResizeBus = new Vue();
  Vue.$gmapDefaultResizeBus = defaultResizeBus;
  Vue.mixin({
    created: function created() {
      this.$gmapDefaultResizeBus = defaultResizeBus;
      this.$gmapOptions = options;
    }
  });

  GmapApi = new Vue({ data: { gmapApi: null } });
  _manager.loaded.then(function () {
    GmapApi.gmapApi = {};
  });

  if (options.load) {
    (0, _manager.load)(options.load, options.loadCn);
  }

  if (options.installComponents) {
    Vue.component('GmapMap', _map2.default);
    Vue.component('GmapMarker', _marker2.default);
    Vue.component('GmapInfoWindow', _infoWindow2.default);
    Vue.component('GmapPolyline', _polyline2.default);
    Vue.component('GmapPolygon', _polygon2.default);
    Vue.component('GmapCircle', _circle2.default);
    Vue.component('GmapRectangle', _rectangle2.default);
    Vue.component('GmapAutocomplete', _autocomplete2.default);
    Vue.component('GmapPlaceInput', _placeInput2.default);
    Vue.component('GmapStreetViewPanorama', _streetViewPanorama2.default);
  }
}

function gmapApi() {
  return GmapApi.gmapApi && window.google;
}