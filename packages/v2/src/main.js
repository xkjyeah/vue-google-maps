import Autocomplete from './components/autocomplete-input.vue';
import Circle from './components/circle-shape.vue';
import Cluster from './components/cluster-icon.vue';
import DrawingManager from './components/drawing-manager.vue';
import HeatmapLayer from './components/heatmap-layer.vue';
import InfoWindow from './components/info-window.vue';
import KmlLayer from './components/kml-layer.vue';
import MapLayer from './components/map-layer.vue';
import Marker from './components/marker-icon.vue';
import PlaceInput from './components/place-input.vue';
import Polygon from './components/polygon-shape.vue';
import Polyline from './components/polyline-shape.vue';
import Rectangle from './components/rectangle-shape.vue';
import StreetViewPanorama from './components/street-view-panorama.vue';
import MapElementMixin from './mixins/map-element';
import MountableMixin from './mixins/mountable';
import MapElementFactory from './utils/factories/map-element';
import getPromiseLazyCreatorFn from './utils/factories/promise-lazy';
import googleMapsApiInitializer from './utils/initializer/google-maps-api-initializer';

/**
 * HACK: Cluster should be loaded conditionally
 * However in the web version, it's not possible to write
 * `import 'gmap-vue/src/components/cluster'`, so we need to
 * import it anyway (but we don't have to register it)
 * Therefore we use babel-plugin-transform-inline-environment-variables to
 * set BUILD_DEV to truthy / falsy
 */
// const Cluster = ((s) => s.default || s)(
//   require('./components/cluster-icon.vue')
// );

/**
 * @var
 * @type {Object|undefined}
 *
 * An independent Vue instance that helps us to know when the Google Maps API is loaded.
 */
let GoogleMapsApi;

// TODO: analyze the possibility of use globalThis here
/**
 * This function helps you to get the Google Maps API
 * when its ready on the window object
 * @function
 */
function getGoogleMapsAPI() {
  return GoogleMapsApi.isReady && window.google;
}

/**
 * Export all components and mixins
 * @constant
 * @type  {Object} components and mixins object
 * @property  {Object}  HeatmapLayer - Vue component HeatmapLayer
 * @property  {Object}  KmlLayer - Vue component KmlLayer
 * @property  {Object}  Marker - Vue component Marker
 * @property  {Object}  Polyline - Vue component Polyline
 * @property  {Object}  Polygon - Vue component Polygon
 * @property  {Object}  Circle - Vue component Circle
 * @property  {Object}  Cluster - Vue component Cluster
 * @property  {Object}  Rectangle - Vue component Rectangle
 * @property  {Object}  DrawingManager - Vue component DrawingManager
 * @property  {Object}  InfoWindow - Vue component InfoWindow
 * @property  {Object}  MapLayer - Vue component MapLayer
 * @property  {Object}  PlaceInput - Vue component PlaceInput
 * @property  {Object}  Autocomplete - Vue component Autocomplete
 * @property  {Object}  StreetViewPanorama - Vue component StreetViewPanorama
 * @property  {Object}  MapElementMixin - Vue component MapElementMixin
 * @property  {Object}  MountableMixin - Vue component MountableMixin
 */
const components = {
  HeatmapLayer,
  KmlLayer,
  Marker,
  Polyline,
  Polygon,
  Circle,
  Cluster,
  Rectangle,
  DrawingManager,
  InfoWindow,
  MapLayer,
  PlaceInput,
  Autocomplete,
  StreetViewPanorama,
  MapElementMixin,
  MountableMixin,
};

/**
 * Export all helpers
 * @constant
 * @type  {Object} object containing all helpers
 * @property  {Function}  initGoogleMapsApi - function to initialize the Google Maps API
 * @property  {Function}  MapElementFactory - function to initialize the Google Maps API
 */
const helpers = {
  googleMapsApiInitializer,
  MapElementFactory,
};

/**
 * GmapVue install function
 *
 * @param  {Object} Vue the vue instance
 * @param  {Object|undefined} options=undefined configuration object to initialize the GmapVue plugin
 * @param  {boolean} options.dynamicLoad=false load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
 * @param  {boolean} options.installComponents=true install all components
 * @param  {boolean} options.autoBindAllEvents=false auto bind all Google Maps API events
 * @param  {Object|undefined} options.load=undefined options to configure the Google Maps API
 * @param  {string} options.load.key your Google Maps API key
 * @param  {string} options.load.libraries=places the Google Maps libraries that you will use eg: 'places,drawing,visualization'
 * @param  {string|undefined} options.load.v=undefined the Google Maps API version, default latest
 * @param  {string|undefined} options.load.callback=GoogleMapsCallback This must be ignored if have another callback that you need to run when Google Maps API is ready please use the `customCallback` option.
 * @param  {string|undefined} options.load.customCallback=undefined This option was added on v3.0.0 but will be removed in the next major release. If you already have an script tag that loads Google Maps API and you want to use it set you callback in the `customCallback` option and our `GoogleMapsCallback` callback will execute your custom callback at the end; it must attached to the `window` object, is the only requirement.
 */
function gmapVuePluginInstallFn(Vue, options) {
  // see defaults
  const finalOptions = {
    dynamicLoad: false,
    installComponents: true,
    autoBindAllEvents: false,
    load: {
      libraries: 'places',
    },
    ...options,
  };

  /**
   * Update the global `GoogleMapsApi`. This will allow
   * components to use the `google` global reactively
   * via:
   *   import { getGoogleMapsAPI } from 'gmap-vue'
   *   export default {  computed: { google: getGoogleMapsAPI }  }
   */
  GoogleMapsApi = new Vue({ data: { isReady: false } });

  const defaultResizeBus = new Vue();

  /**
   * Use a lazy to only load the API when
   * a GMap component is loaded
   *
   * @constant
   * @type {Function} the promise lazy creator function
   */
  const promiseLazyCreator = getPromiseLazyCreatorFn(
    googleMapsApiInitializer,
    GoogleMapsApi
  );
  /**
   * The gmapApiPromiseLazy function to can wait until Google Maps API is ready
   *
   * @constant
   * @type {Function}
   */
  const gmapApiPromiseLazy = promiseLazyCreator(finalOptions);

  /**
   * Instance properties
   *
   * In every component you have a references to
   * this.$gmapDefaultResizeBus - function to use the default resize bus
   * this.$gmapApiPromiseLazy - function that you can use to wait until Google Maps API is ready
   * this.$gmapOptions - object with the final options passed to Google Maps API to configure it
   */
  Vue.mixin({
    created() {
      this.$gmapDefaultResizeBus = defaultResizeBus;
      this.$gmapApiPromiseLazy = gmapApiPromiseLazy;
      this.$gmapOptions = finalOptions;
    },
  });

  /**
   * Static properties
   *
   * These properties are the same references that you can find in the instance
   * but they are static because they are attached to the main Vue object.
   * Vue.$gmapDefaultResizeBus - function to use the default resize bus
   * Vue.$gmapApiPromiseLazy - function that you can use to wait until Google Maps API is ready
   * Vue.$gmapOptions - object with the final options passed to Google Maps API to configure it
   */
  Vue.$gmapDefaultResizeBus = defaultResizeBus;
  Vue.$gmapApiPromiseLazy = gmapApiPromiseLazy;
  Vue.$gmapOptions = finalOptions;

  if (finalOptions.installComponents) {
    Vue.component('GmapMap', MapLayer);
    Vue.component('GmapMarker', Marker);
    Vue.component('GmapInfoWindow', InfoWindow);
    Vue.component('GmapHeatmapLayer', HeatmapLayer);
    Vue.component('GmapKmlLayer', KmlLayer);
    Vue.component('GmapPolyline', Polyline);
    Vue.component('GmapPolygon', Polygon);
    Vue.component('GmapCircle', Circle);
    Vue.component('GmapRectangle', Rectangle);
    Vue.component('GmapDrawingManager', DrawingManager);
    Vue.component('GmapAutocomplete', Autocomplete);
    Vue.component('GmapPlaceInput', PlaceInput);
    Vue.component('GmapStreetViewPanorama', StreetViewPanorama);
  }
}

/**
 * Export objects and install function for ESM and UMD modules
 *
 * @property {Function} getGoogleMapsAPI function to get the Google Maps API
 * @property {Object} components all exported components
 * @property {Object} helpers all exported helpers
 * @property {Function} install function to install the plugin
 * @see gmapVuePluginInstallFn
 */
export {
  getGoogleMapsAPI,
  components,
  helpers,
  gmapVuePluginInstallFn as install,
};

/**
 * Export default of the default Vue object for plugins
 * Export for ESM modules
 *
 * @property {Function} install function to install the plugin
 * @see gmapVuePluginInstallFn
 */
export default { install: gmapVuePluginInstallFn };
