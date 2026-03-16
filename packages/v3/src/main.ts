import type {
  Autocomplete,
  Circle,
  DrawingManager,
  HeatmapLayer,
  InfoWindow,
  KmlLayer,
  MapLayer,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
  StreetViewPanorama,
} from '@/components';
import {
  googleMapsApiInitializer,
  pluginComponentBuilder,
  saveLazyPromiseAndFinalOptions,
  usePromiseLazyBuilderFn,
} from '@/composables';
import type { IGmapVuePluginOptions, IGoogleMapsApiObject } from '@/interfaces';
import type { TGlobalGoogleObject, IGmvUtilities } from '@/types';
import type { Emitter, EventType } from 'mitt';
import { defineAsyncComponent, type App, type FunctionPlugin } from 'vue';
import { $gmapOptions } from './keys';

/**
 * Vue augmentations
 */
declare module 'vue' {
  interface ComponentCustomProperties {
    $gmapDefaultResizeBus: Emitter<Record<EventType, unknown>>;
    $gmapApiPromiseLazy: () => Promise<unknown>;
    $gmapOptions: IGmapVuePluginOptions;
  }
  interface GlobalComponents {
    GmvMap: typeof MapLayer;
    GmvMarker: typeof Marker;
    GmvInfoWindow: typeof InfoWindow;
    GmvKmlLayer: typeof KmlLayer;
    GmvAutocomplete: typeof Autocomplete;
    GmvStreetViewPanorama: typeof StreetViewPanorama;
    GmvHeatmapLayer: typeof HeatmapLayer;
    GmvCircle: typeof Circle;
    GmvPolygon: typeof Polygon;
    GmvPolyline: typeof Polyline;
    GmvRectangle: typeof Rectangle;
    GmvDrawingManager: typeof DrawingManager;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var GoogleMapsApi: IGoogleMapsApiObject;
  // eslint-disable-next-line no-var
  var GoogleMapsCallback: () => void;

  interface Window {
    GoogleMapsApi: IGoogleMapsApiObject;
    GoogleMapsCallback: () => unknown;
    google?: TGlobalGoogleObject;

    [key: string | number | symbol]: unknown;
  }
}

/**
 * @var
 * @type {Object|undefined}
 *
 * An independent Vue instance that helps us to know when the Google Maps API is loaded.
 */
globalThis.GoogleMapsApi = { isReady: false };

/**
 * This function helps you to get the Google Maps API
 * when its ready on the window object
 * @function
 */
function getGoogleMapsAPI(): false | TGlobalGoogleObject {
  return globalThis.GoogleMapsApi.isReady && globalThis.google;
}

/**
 * Export all utilities
 *
 * @constant
 * @type  {Object} object containing all utilities
 * @property  {Function}  googleMapsApiInitializer - function to initialize the Google Maps API
 * @property  {Function}  pluginComponentBuilder - function to initialize the Google Maps API
 * @property  {Function}  getGoogleMapsAPI - function to get the original Google Maps API
 */
const utilities: IGmvUtilities = {
  googleMapsApiInitializer,
  pluginComponentBuilder,
  getGoogleMapsAPI,
};

/**
 * GmapVuePlugin factory function
 *
 * @param  {IGmapVuePluginOptions} [options] configuration object to initialize the GmapVue plugin
 */
const createGmapVuePlugin = (
  options: IGmapVuePluginOptions,
): FunctionPlugin => {
  /**
   * install function
   *
   * @param  {Object} app the vue app instance
   */
  return (app: App): void => {
    // see defaults
    const finalOptions: IGmapVuePluginOptions = {
      dynamicLoad: false,
      ...options,
      load: {
        libraries: 'places',
        ...options.load,
      },
    };

    /**
     * Use a lazy to only load the API when
     * a GMap component is loaded
     *
     * @constant
     * @type {Function} the promise lazy creator function
     */
    const promiseLazyCreator = usePromiseLazyBuilderFn(
      googleMapsApiInitializer,
      globalThis.GoogleMapsApi,
    );
    /**
     * The googleMapsApiPromiseLazy function to can wait until Google Maps API is ready
     *
     * @constant
     * @type {Function}
     */
    const googleMapsApiPromiseLazy = promiseLazyCreator(finalOptions);
    saveLazyPromiseAndFinalOptions(finalOptions, googleMapsApiPromiseLazy);

    /**
     * Static properties
     *
     * These properties are the same references that you can find in the instance,
     * but they are static because they are attached to the main Vue object.
     * app.config.globalProperties.$googleMapsApiPromiseLazy - function that you can use to wait until Google Maps API is ready
     * app.config.globalProperties.$gmapOptions - object with the final options passed to Google Maps API to configure it
     */
    app.config.globalProperties.$gmapApiPromiseLazy = googleMapsApiPromiseLazy;
    app.config.globalProperties.$gmapOptions = finalOptions;
    app.provide($gmapOptions, finalOptions);

    app
      .component(
        'GmvMap',
        defineAsyncComponent(() => import('./components/map-layer.vue')),
      )
      .component(
        'GmvMarker',
        defineAsyncComponent(() => import('./components/marker-icon.vue')),
      )
      .component(
        'GmvInfoWindow',
        defineAsyncComponent(() => import('./components/info-window.vue')),
      )
      .component(
        'GmvKmlLayer',
        defineAsyncComponent(() => import('./components/kml-layer.vue')),
      )
      .component(
        'GmvAutocomplete',
        defineAsyncComponent(
          () => import('./components/autocomplete-input.vue'),
        ),
      )
      .component(
        'GmvStreetViewPanorama',
        defineAsyncComponent(
          () => import('./components/street-view-panorama.vue'),
        ),
      )
      .component(
        'GmvHeatmapLayer',
        defineAsyncComponent(() => import('./components/heatmap-layer.vue')),
      )
      .component(
        'GmvCircle',
        defineAsyncComponent(() => import('./components/circle-shape.vue')),
      )
      .component(
        'GmvPolygon',
        defineAsyncComponent(() => import('./components/polygon-shape.vue')),
      )
      .component(
        'GmvPolyline',
        defineAsyncComponent(() => import('./components/polyline-shape.vue')),
      )
      .component(
        'GmvRectangle',
        defineAsyncComponent(() => import('./components/rectangle-shape.vue')),
      )
      .component(
        'GmvDrawingManager',
        defineAsyncComponent(() => import('./components/drawing-manager.vue')),
      )
      .component(
        'GmvCluster',
        defineAsyncComponent(() => import('./components/cluster-icon.vue')),
      );
  };
};

export { createGmapVuePlugin, utilities };
