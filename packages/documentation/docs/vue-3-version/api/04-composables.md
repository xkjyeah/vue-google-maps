---
id: composables
sidebar_position: 4
sidebar_label: composables
---
# The exposed composables

:::info
**From versions above `v2.0.1`** all components have its own composable to get their promises.
:::

The plugin expose composables from the following path `@gmap-vue/v3/composables`. You can use in your application using the composition API.

You can use it in the following way

```ts showLineNumbers
import {
  useMapPromise,
  useResizeBus,
  useGoogleMapsApiPromiseLazy,
  useStreetViewPanoramaPromise,
  usePluginOptions,
} from '@gmap-vue/v3/composables';

const promise = useMapPromise('yourMapKey');
// ...
```

## `useGoogleMapsApiPromiseLazy`

This composable return the a promise that when it is resolved return the global `google` object, this mean the `window.google` object added to the `globalThis` object bye the Google Maps API.

You can use it in the following way

```ts showLineNumbers
import { useGoogleMapsApiPromiseLazy } from '@gmap-vue/v3/composables';

const googlePromise = useGoogleMapsApiPromiseLazy();

if (googlePromise) {
  const googleObject = await googlePromise;
}
```

:::warning
If the Google API was not loaded yet you will see a warning message in the console like this: `'$googleMapsApiPromiseLazy was not created yet...'` and the composable function should return `undefined`.
:::

### `useGoogleMapsApiPromiseLazy` API

```ts showLineNumbers
let $googleMapsApiPromiseLazy: LazyValueGetterFn<GlobalGoogleObject>;

/**
 * This function helps to save the final options passed to the plugin and
 * the function to get the promise useful to wait until the Google Maps API
 * is loaded and ready to use it
 *
 * @param  {IPluginOptions} finalOptions
 * @param  {LazyValueGetterFn} googleMapsApiPromiseLazy
 * @returns void
 *
 * @internal
 */
export function saveLazyPromiseAndFinalOptions(
  finalOptions: IPluginOptions,
  googleMapsApiPromiseLazy: LazyValueGetterFn<GlobalGoogleObject>
): void {
  if (!$finalOptions) {
    $finalOptions = finalOptions;
  }

  if (!$googleMapsApiPromiseLazy) {
    $googleMapsApiPromiseLazy = googleMapsApiPromiseLazy;
  }
}

/**
 * This function returns a promise when is resolved returns the original Google
 * Maps API. With this promise you can wait until the Google Maps API is fully
 * loaded.
 *
 * @public
 * @returns {Promise<any>}
 */
export function useGoogleMapsApiPromiseLazy(): Promise<
  GlobalGoogleObject | undefined
> {
  if (!$googleMapsApiPromiseLazy) {
    globalThis.console.warn('$googleMapsApiPromiseLazy was not created yet...');
  }

  return $googleMapsApiPromiseLazy?.();
}
```

Like the plugin options this lazy promise is saved when the plugin is loaded

```ts title="main.ts" showLineNumbers
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
```

:::info

- Check the `LazyValueGetterFn` type [here](/docs/vue-3-version/api/types#lazyvaluegetterfn)
- Check the `GlobalGoogleObject` type [here](/docs/vue-3-version/api/types#GlobalGoogleObject)

:::

## `usePluginOptions`

This composable return the final options object used by the plugin when it was initialized.

How to use it

```ts showLineNumbers
import { usePluginOptions } from '@gmap-vue/v3/composables';

const options = usePluginOptions();

// do something with the options
```

### `usePluginOptions` API

- Check the [**Options Interface**](/docs/vue-3-version/api/gmap-vue-plugin#plugin-options)

- The options are saved when the plugin is load as we show below

```ts title="main.ts" showLineNumbers
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
```

- The core API of this composable

```ts showLineNumbers
let $finalOptions: IPluginOptions;

/**
 * This function helps to save the final options passed to the plugin and
 * the function to get the promise useful to wait until the Google Maps API
 * is loaded and ready to use it
 *
 * @param  {IPluginOptions} finalOptions
 * @param  {LazyValueGetterFn} googleMapsApiPromiseLazy
 * @returns void
 *
 * @internal
 */
export function saveLazyPromiseAndFinalOptions(
  finalOptions: IPluginOptions,
  googleMapsApiPromiseLazy: LazyValueGetterFn<GlobalGoogleObject>
): void {
  if (!$finalOptions) {
    $finalOptions = finalOptions;
  }

  if (!$googleMapsApiPromiseLazy) {
    $googleMapsApiPromiseLazy = googleMapsApiPromiseLazy;
  }
}

/**
 * This function returns the configuration passed to the plugin
 *
 * @returns IPluginOptions
 */
export function usePluginOptions(): IPluginOptions {
  if (!$finalOptions) {
    globalThis.console.warn('$finalOptions was not defined yet...');
  }

  return $finalOptions;
}
```

:::warning
The `saveLazyPromiseAndFinalOptions` is internal and it is not exposed by the plugin
:::

## `useResizeBus`

This composable returns the `currentResizeBus`, `_resizeCallback`, `_delayedResizeCallback`. If you provide your own resize bus through the `GmvMap` component props, it should be assigned to the `currentResizeBus` otherwise the `defaultResizeBus` (a mitt object) should be assigned to it.

You can use it in the following way

```ts showLineNumbers
import { useResizeBus } from '@gmap-vue/v3/composables';

const { currentResizeBus, _resizeCallback, _delayedResizeCallback } = useResizeBus();

currentResizeBus.emit('foo', { a: 'b' });
```

The `_resizeCallback` is a function used to preserve the map center when it is resized. The `_delayedResizeCallback` use the `nextTick` function to call the `_resizeCallback` in the next change.

### `useResizeBus` API

```ts showLineNumbers
// this code is executed when the GmvMap component is initialized

const currentResizeBus = ref<Emitter<Record<EventType, unknown>> | undefined>();
let _resizeCallback: () => void;
let _delayedResizeCallback: () => Promise<void>;

// ...

if (!props.resizeBus) {
  currentResizeBus.value = defaultResizeBus; // default resize bus is mitt();
}

if (props.resizeBus) {
  currentResizeBus.value = props.resizeBus; // your custom resize bus
}

_resizeCallback = (): void => {
  resizeFn();
};

_delayedResizeCallback = (): Promise<void> => {
  return nextTick(() => _resizeCallback());
};

// ...

/**
 * @typedef ResizeBus
 * @property {() => void} currentResizeBus
 * @property {() => void} _resizeCallback
 * @property {() => void} _delayedResizeCallback
 */
/**
 * this function returns the rezise bus functions
 *
 * @public
 * @returns {ResizeBus}
 */
export function useResizeBus() {
  return {
    currentResizeBus,
    _resizeCallback,
    _delayedResizeCallback,
  };
}
```

## `useMapPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of map, because in the previous implementation we always use the same promise to return the same map or we overwrite that promise with a new map instance. **From versions above v2.0.1** every map and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `mapKey` prop on each map**, the old `recycle` prop, we use that key to get the correct map instance and add marker, shapes, etc to the correct map instance.

:::

This composable returns a promise and, when it is resolved return the `GmvMap` component.

You can use it to be sure that the `GmvMap` component is ready.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Maps component instance
 *
 * @param  {string} key - the recycle prop of the map
 * @returns {Promise}
 * @public
 */
export function useMapPromise(
  key: string | InjectionKey<Promise<google.maps.Map | undefined>>,
): Promise<google.maps.Map | undefined> {
  return usePromise<google.maps.Map>(key);
}
```

When the GmvMap component is initialized and the map is ready this promise is resolved

```ts title="map-layer.vue" showLineNumbers
//...

const mapPromiseDeferred = usePromiseDeferred(props.mapKey || $mapPromise);
promiseDeferred.resolve(mapInstance);

// ...
```

:::warning
If the Map object was not loaded yet the composable function returns `undefined`.
:::

## `useStreetViewPanoramaPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of street view panorama, because in the previous implementation we always use the same promise to return the same street view panorama or we overwrite that promise with a new street view panorama instance. **From versions above v2.0.1** every street view panorama and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `streetViewKey` prop on each street view panorama**, we use this key to get the correct street view panorama instance.

:::

This composable is similar to the previous above, the only difference is that it return the street view panorama object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map StreetViewPanorama component instance
 *
 * @param  {string} key - the streetViewKey prop of the StreetViewPanorama
 * @returns {Promise}
 * @public
 */
export function useStreetViewPanoramaPromise(
  key:
    | string
    | InjectionKey<Promise<google.maps.StreetViewPanorama | undefined>>,
): Promise<google.maps.StreetViewPanorama | undefined> {
  return usePromise<google.maps.StreetViewPanorama>(key);
}
```

:::warning
If the Street View Panorama object was not loaded yet the composable function returns `undefined`.
:::

## `useMarkerPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of marker, because in the previous implementation we always use the same promise to return the same marker or we overwrite that promise with a new marker instance. **From versions above v2.0.1** every marker and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `markerKey` prop on each marker**, we use this key to get the correct marker instance.

:::

This composable is similar to the previous above, the only difference is that it return the marker object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Advanced Marker Element component instance
 *
 * @param  {string} key - the markerKey prop of the marker
 * @returns {Promise}
 * @public
 */
export function useMarkerPromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.marker.AdvancedMarkerElement | undefined>
      >,
): Promise<google.maps.marker.AdvancedMarkerElement | undefined> {
  return usePromise<google.maps.marker.AdvancedMarkerElement>(key);
}
```

:::warning
If the marker object was not loaded yet the composable function returns `undefined`.
:::

## `useCirclePromise`

:::warning

- From **v2.0.1 and below** we only use one instance of circle, because in the previous implementation we always use the same promise to return the same circle or we overwrite that promise with a new circle instance. **From versions above v2.0.1** every circle and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `circleKey` prop on each circle**, we use this key to get the correct circle instance.

:::

This composable is similar to the previous above, the only difference is that it return the circle object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Circle component instance
 *
 * @param  {string} key - the circleKey prop of the CircleShape
 * @returns {Promise}
 * @public
 */
export function useCirclePromise(
  key: string | InjectionKey<Promise<google.maps.Circle | undefined>>,
): Promise<google.maps.Circle | undefined> {
  return usePromise<google.maps.Circle>(key);
}
```

:::warning
If the circle object was not loaded yet the composable function returns `undefined`.
:::

## `useClusterPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of cluster, because in the previous implementation we always use the same promise to return the same cluster or we overwrite that promise with a new cluster instance. **From versions above v2.0.1** every cluster and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `clusterKey` prop on each cluster**, we use this key to get the correct cluster instance.

:::

This composable is similar to the previous above, the only difference is that it return the cluster object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Cluster component instance
 *
 * @param  {string} key - the clusterKey prop of the Cluster
 * @returns {Promise}
 * @public
 */
export function useClusterPromise(
  key: string | InjectionKey<Promise<MarkerClusterer | undefined>>,
): Promise<MarkerClusterer | undefined> {
  return usePromise<MarkerClusterer>(key);
}
```

:::warning
If the cluster object was not loaded yet the composable function returns `undefined`.
:::

## `useDrawingPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of drawing, because in the previous implementation we always use the same promise to return the same drawing or we overwrite that promise with a new drawing instance. **From versions above v2.0.1** every drawing and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `drawingKey` prop on each drawing**, we use this key to get the correct drawing instance.

:::

This composable is similar to the previous above, the only difference is that it return the drawing object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Drawing Manager component instance
 *
 * @param  {string} key - the drawingKey prop of the DrawingManager
 * @returns {Promise}
 * @public
 */
export function useDrawingPromise(
  key:
    | string
    | InjectionKey<Promise<google.maps.drawing.DrawingManager | undefined>>,
): Promise<google.maps.drawing.DrawingManager | undefined> {
  return usePromise<google.maps.drawing.DrawingManager>(key);
}
```

:::warning
If the drawing object was not loaded yet the composable function returns `undefined`.
:::

## `useHeatmapLayerPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of heatmap, because in the previous implementation we always use the same promise to return the same heatmap or we overwrite that promise with a new heatmap instance. **From versions above v2.0.1** every heatmap and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `heatmapKey` prop on each heatmap**, we use this key to get the correct heatmap instance.

:::

This composable is similar to the previous above, the only difference is that it return the heatmap object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Heatmap Layer component instance
 *
 * @param  {string} key - the heatmapKey prop of the Heatmap Layer
 * @returns {Promise}
 * @public
 */
export function useHeatmapLayerPromise(
  key:
    | string
    | InjectionKey<Promise<google.maps.visualization.HeatmapLayer | undefined>>,
): Promise<google.maps.visualization.HeatmapLayer | undefined> {
  return usePromise<google.maps.visualization.HeatmapLayer>(key);
}
```

:::warning
If the heatmap object was not loaded yet the composable function returns `undefined`.
:::

## `useInfoWindowPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of Info Window, because in the previous implementation we always use the same promise to return the same Info Window or we overwrite that promise with a new Info Window instance. **From versions above v2.0.1** every Info Window and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `infoWindowKey` prop on each Info Window**, we use this key to get the correct Info Window instance.

:::

This composable is similar to the previous above, the only difference is that it return the Info Window object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Info Window component instance
 *
 * @param  {string} key - the infoWindowKey prop of the Info Window
 * @returns {Promise}
 * @public
 */
export function useInfoWindowPromise(
  key: string | InjectionKey<Promise<google.maps.InfoWindow | undefined>>,
): Promise<google.maps.InfoWindow | undefined> {
  return usePromise<google.maps.InfoWindow>(key);
}
```

:::warning
If the Info Window object was not loaded yet the composable function returns `undefined`.
:::

## `useKmlPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of Kml layer, because in the previous implementation we always use the same promise to return the same Kml layer or we overwrite that promise with a new Kml layer instance. **From versions above v2.0.1** every Kml layer and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `kmlKey` prop on each Kml layer**, we use this key to get the correct Kml layer instance.

:::

This composable is similar to the previous above, the only difference is that it return the Kml layer object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Kml Layer component instance
 *
 * @param  {string} key - the kmlKey prop of the Kml Layer
 * @returns {Promise}
 * @public
 */
export function useKmlPromise(
  key: string | InjectionKey<Promise<google.maps.KmlLayer | undefined>>,
): Promise<google.maps.KmlLayer | undefined> {
  return usePromise<google.maps.KmlLayer>(key);
}
```

:::warning
If the Kml layer object was not loaded yet the composable function returns `undefined`.
:::

## `usePolygonPromise`

:::warning

- From **v2.0.1 and below** we only use one instance of polygon, because in the previous implementation we always use the same promise to return the same polygon or we overwrite that promise with a new polygon instance. **From versions above v2.0.1** every polygon and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `polygonKey` prop on each polygon**, we use this key to get the correct polygon instance.

:::

This composable is similar to the previous above, the only difference is that it return the polygon object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Polygon component instance
 *
 * @param  {string} key - the polygonKey prop of the Polygon
 * @returns {Promise}
 * @public
 */
export function usePolygonPromise(
  key: string | InjectionKey<Promise<google.maps.Polygon | undefined>>,
): Promise<google.maps.Polygon | undefined> {
  return usePromise<google.maps.Polygon>(key);
}
```

:::warning
If the polygon object was not loaded yet the composable function returns `undefined`.
:::

## `usePolylinePromise`

:::warning

- From **v2.0.1 and below** we only use one instance of polyline, because in the previous implementation we always use the same promise to return the same polyline or we overwrite that promise with a new polyline instance. **From versions above v2.0.1** every polyline and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `polylineKey` prop on each polyline**, we use this key to get the correct polyline instance.

:::

This composable is similar to the previous above, the only difference is that it return the polyline object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Polyline component instance
 *
 * @param  {string} key - the polylineKey prop of the Polyline
 * @returns {Promise}
 * @public
 */
export function usePolylinePromise(
  key: string | InjectionKey<Promise<google.maps.Polyline | undefined>>,
): Promise<google.maps.Polyline | undefined> {
  return usePromise<google.maps.Polyline>(key);
}
```

:::warning
If the polyline object was not loaded yet the composable function returns `undefined`.
:::

## `useRectanglePromise`

:::warning

- From **v2.0.1 and below** we only use one instance of rectangle, because in the previous implementation we always use the same promise to return the same rectangle or we overwrite that promise with a new rectangle instance. **From versions above v2.0.1** every rectangle and component is saved in its own promise and is independent to other components.
- **We strongly recommend to set the `rectangleKey` prop on each rectangle**, we use this key to get the correct rectangle instance.

:::

This composable is similar to the previous above, the only difference is that it return the rectangle object from the Google Maps API.

```ts title="How to use it" showLineNumbers
/**
 * This function returns a promise, when it is resolved returns the Google Map Rectangle component instance
 *
 * @param  {string} key - the rectangleKey prop of the Rectangle
 * @returns {Promise}
 * @public
 */
export function useRectanglePromise(
  key: string | InjectionKey<Promise<google.maps.Rectangle | undefined>>,
): Promise<google.maps.Rectangle | undefined> {
  return usePromise<google.maps.Rectangle>(key);
}
```

:::warning
If the rectangle object was not loaded yet the composable function returns `undefined`.
:::
