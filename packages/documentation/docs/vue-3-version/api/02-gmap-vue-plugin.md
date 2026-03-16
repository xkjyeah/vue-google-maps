---
id: gmap-vue-plugin
sidebar_position: 2
sidebar_label: GmapVuePlugin
---

# The `GmapVuePlugin` object

It implements the `Plugin` interface from Vue and get the plugin options.

## Plugin options

The available options of the plugin are the following

```ts showLineNumbers
/**
 * The object which contain all event names to and params that should be used to add listener to the Google Maps instance
 * @typedef {Object} LoadPluginOptions
 * @property {string} key - The Google Maps key
 * @property {string?} callback - The callback name that should be called when Google Maps is ready, if you set this do not forget to call `globalThis.GoogleMapsCallback` function in your callback
 * @property {string?} v - The version of the Maps JavaScript API to load.
 * @property {string} libraries - A comma-separated list of additional Maps JavaScript API libraries to load. Specifying a fixed set of libraries is not generally recommended, but is available for developers who wish to finely tune the caching behavior on their website.
 * @property {string} language - The language to use. This affects the names of controls, copyright notices, driving directions, and control labels, and the responses to service requests. See the list of supported languages.
 * @property {string} region - The region code to use. This alters the map's behavior based on a given country or territory.
 * @property {string} authReferrerPolicy - Maps JS customers can configure HTTP Referrer Restrictions in the Cloud Console to limit which URLs are allowed to use a particular API Key. By default, these restrictions can be configured to allow only certain paths to use an API Key. If any URL on the same domain or origin may use the API Key, you can set authReferrerPolicy: "origin" to limit the amount of data sent when authorizing requests from the Maps JavaScript API. When this parameter is specified and HTTP Referrer Restrictions are enabled on Cloud Console, Maps JavaScript API will only be able to load if there is an HTTP Referrer Restriction that matches the current website's domain without a path specified.
 * @property {string} mapIds - An array of map Ids. Causes the configuration for the specified map Ids to be preloaded.
 * @property {string} channel - See Usage tracking per channel.
 * @property {string} solutionChannel - Google Maps Platform provides many types of sample code to help you get up and running quickly. To track adoption of our more complex code samples and improve solution quality, Google includes the solutionChannel query parameter in API calls in our sample code.
 * @see https://developers.google.com/maps/documentation/javascript/load-maps-js-api#optional_parameters
 */
export interface ILoadPluginOptions {
  key?: string;
  callback?: string;
  v?: string;
  libraries?: string;
  language?: string;
  region?: string;
  authReferrerPolicy?: string;
  mapIds?: string;
  channel?: string;
  solutionChannel?: string;
}

/**
 * @typedef {() => string[]} ExcludeEvents
 *
 *
 * The object which contain all event names to and params that should be used to add listener to the Google Maps instance
 * @public
 * @typedef {object} PluginOptions - The options required to configure the plugin
 * @property {boolean} [dynamicLoad=false] - The plugin should be loaded dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
 * @property {LoadPluginOptions} [load] - All load plugin options
 * @property {ExcludeEvents} [excludeEventsOnAllComponents] - A function that should return an array of events that should not be fired
 */
export interface IGmapVuePluginOptions {
  dynamicLoad?: boolean;
  load?: ILoadPluginOptions;
  excludeEventsOnAllComponents?: () => string[];
}
```

:::warning DEPRECATED
The `customCallback` option was removed and it is no longer supported
:::

## The install function

```ts showLineNumbers
/**
 * @var
 * @type {Object|undefined}
 *
 * An independent Vue instance that helps us to know when the Google Maps API is loaded.
 */
globalThis.GoogleMapsApi = { isReady: false };

/**
 * GmapVuePlugin factory function
 *
 * @param  {IGmapVuePluginOptions} [options] configuration object to initialize the GmapVue plugin
 */
const createGmapVuePlugin = (
  options: IGmapVuePluginOptions
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
        ...options?.load,
      } as any,
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
      globalThis.GoogleMapsApi
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
        defineAsyncComponent(() => import('./components/map-layer.vue'))
      )
      .component(
        'GmvMarker',
        defineAsyncComponent(() => import('./components/marker-icon.vue'))
      )
      .component(
        'GmvInfoWindow',
        defineAsyncComponent(() => import('./components/info-window.vue'))
      )
      .component(
        'GmvKmlLayer',
        defineAsyncComponent(() => import('./components/kml-layer.vue'))
      )
      .component(
        'GmvAutocomplete',
        defineAsyncComponent(
          () => import('./components/autocomplete-input.vue')
        )
      )
      .component(
        'GmvStreetViewPanorama',
        defineAsyncComponent(
          () => import('./components/street-view-panorama.vue')
        )
      )
      .component(
        'GmvHeatmapLayer',
        defineAsyncComponent(() => import('./components/heatmap-layer.vue'))
      )
      .component(
        'GmvCircle',
        defineAsyncComponent(() => import('./components/circle-shape.vue'))
      )
      .component(
        'GmvPolygon',
        defineAsyncComponent(() => import('./components/polygon-shape.vue'))
      )
      .component(
        'GmvPolyline',
        defineAsyncComponent(() => import('./components/polyline-shape.vue'))
      )
      .component(
        'GmvRectangle',
        defineAsyncComponent(() => import('./components/rectangle-shape.vue'))
      )
      .component(
        'GmvDrawingManager',
        defineAsyncComponent(() => import('./components/drawing-manager.vue'))
      )
      .component(
        'GmvCluster',
        defineAsyncComponent(() => import('./components/cluster-icon.vue'))
      );
  };
};
```
