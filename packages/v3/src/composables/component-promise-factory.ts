import {
  componentPromiseFactory,
  deferredPromiseFactory,
} from '@/composables/helpers';
import type { PromiseDeferred } from '@/interfaces';
import {
  $autocompletePromise,
  $circleShapePromise,
  $clusterPromise,
  $drawingManagerPromise,
  $heatmapLayerPromise,
  $infoWindowPromise,
  $kmlLayerPromise,
  $mapPromise,
  $markerPromise,
  $polygonShapePromise,
  $polylineShapePromise,
  $rectangleShapePromise,
  $streetViewPanoramaPromise,
} from '@/keys';
import type { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { InjectionKey } from 'vue';

const deferredPromisesList = new Map<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  string | InjectionKey<Promise<any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PromiseDeferred<any>
>();
const componentPromisesList = new Map<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  string | InjectionKey<Promise<any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Promise<any>
>();

/**
 * @param  {string|InjectionKey<Promise<T|undefined>>} key
 *
 * @internal
 * @returns {void}
 */
function createPromises<T>(
  key: string | InjectionKey<Promise<T | undefined>>,
): void {
  const mapPromiseDeferred = deferredPromiseFactory<T>();
  const promise = componentPromiseFactory(mapPromiseDeferred);
  deferredPromisesList.set(key, mapPromiseDeferred);
  componentPromisesList.set(key, promise);
}

/**
 * This function returns a promise, when it is resolved returns the map-layer component
 * object
 *
 * @internal
 * @returns {Promise}
 */
function usePromise<T>(
  key: string | InjectionKey<Promise<T | undefined>>,
): Promise<T | undefined> {
  if (!componentPromisesList.has(key)) {
    createPromises(key);
  }

  return componentPromisesList.get(key) as Promise<T | undefined>;
}

/**
 * @internal
 * @returns {Promise}
 */
function usePromiseDeferred<T>(
  key: string | InjectionKey<Promise<T | undefined>>,
): PromiseDeferred<T> {
  if (!deferredPromisesList.has(key)) {
    createPromises(key);
  }

  return deferredPromisesList.get(key) as PromiseDeferred<T>;
}

/**
 * @internal
 * @param  {string|InjectionKey<Promise<T|undefined>>} key
 * @returns Object
 */
export function useComponentPromiseFactory<T>(
  key: string | InjectionKey<Promise<T | undefined>>,
): { promiseDeferred: PromiseDeferred<T>; promise: Promise<T | undefined> } {
  const promiseDeferred = usePromiseDeferred(key);
  const promise = usePromise(key);

  return { promiseDeferred, promise } as {
    promiseDeferred: PromiseDeferred<T>;
    promise: Promise<T | undefined>;
  };
}

/**
 * @internal
 * @returns {Promise}
 */
export function useDestroyPromisesOnUnmounted<T>(
  key: string | InjectionKey<Promise<T | undefined>>,
): void {
  componentPromisesList.delete(key);
  deferredPromisesList.delete(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Maps component instance
 *
 * @param  {string} key - the recycle prop of the map
 * @returns {Promise}
 * @public
 */
export function useAutocompletePromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.places.Autocomplete | undefined>
      > = $autocompletePromise,
): Promise<google.maps.places.Autocomplete | undefined> {
  return usePromise<google.maps.places.Autocomplete>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Maps component instance
 *
 * @param  {string} key - the recycle prop of the map
 * @returns {Promise}
 * @public
 */
export function useMapPromise(
  key:
    | string
    | InjectionKey<Promise<google.maps.Map | undefined>> = $mapPromise,
): Promise<google.maps.Map | undefined> {
  return usePromise<google.maps.Map>(key);
}

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
      > = $markerPromise,
): Promise<google.maps.marker.AdvancedMarkerElement | undefined> {
  return usePromise<google.maps.marker.AdvancedMarkerElement>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Circle component instance
 *
 * @param  {string} key - the circleKey prop of the CircleShape
 * @returns {Promise}
 * @public
 */
export function useCirclePromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.Circle | undefined>
      > = $circleShapePromise,
): Promise<google.maps.Circle | undefined> {
  return usePromise<google.maps.Circle>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Cluster component instance
 *
 * @param  {string} key - the clusterKey prop of the Cluster
 * @returns {Promise}
 * @public
 */
export function useClusterPromise(
  key:
    | string
    | InjectionKey<Promise<MarkerClusterer | undefined>> = $clusterPromise,
): Promise<MarkerClusterer | undefined> {
  return usePromise<MarkerClusterer>(key);
}

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
    | InjectionKey<
        Promise<google.maps.drawing.DrawingManager | undefined>
      > = $drawingManagerPromise,
): Promise<google.maps.drawing.DrawingManager | undefined> {
  return usePromise<google.maps.drawing.DrawingManager>(key);
}

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
    | InjectionKey<
        Promise<google.maps.visualization.HeatmapLayer | undefined>
      > = $heatmapLayerPromise,
): Promise<google.maps.visualization.HeatmapLayer | undefined> {
  return usePromise<google.maps.visualization.HeatmapLayer>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Map Info Window component instance
 *
 * @param  {string} key - the infoWindowKey prop of the Info Window
 * @returns {Promise}
 * @public
 */
export function useInfoWindowPromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.InfoWindow | undefined>
      > = $infoWindowPromise,
): Promise<google.maps.InfoWindow | undefined> {
  return usePromise<google.maps.InfoWindow>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Map Kml Layer component instance
 *
 * @param  {string} key - the kmlKey prop of the Kml Layer
 * @returns {Promise}
 * @public
 */
export function useKmlPromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.KmlLayer | undefined>
      > = $kmlLayerPromise,
): Promise<google.maps.KmlLayer | undefined> {
  return usePromise<google.maps.KmlLayer>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Map Polygon component instance
 *
 * @param  {string} key - the polygonKey prop of the Polygon
 * @returns {Promise}
 * @public
 */
export function usePolygonPromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.Polygon | undefined>
      > = $polygonShapePromise,
): Promise<google.maps.Polygon | undefined> {
  return usePromise<google.maps.Polygon>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Map Polyline component instance
 *
 * @param  {string} key - the polylineKey prop of the Polyline
 * @returns {Promise}
 * @public
 */
export function usePolylinePromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.Polyline | undefined>
      > = $polylineShapePromise,
): Promise<google.maps.Polyline | undefined> {
  return usePromise<google.maps.Polyline>(key);
}

/**
 * This function returns a promise, when it is resolved returns the Google Map Rectangle component instance
 *
 * @param  {string} key - the rectangleKey prop of the Rectangle
 * @returns {Promise}
 * @public
 */
export function useRectanglePromise(
  key:
    | string
    | InjectionKey<
        Promise<google.maps.Rectangle | undefined>
      > = $rectangleShapePromise,
): Promise<google.maps.Rectangle | undefined> {
  return usePromise<google.maps.Rectangle>(key);
}

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
    | InjectionKey<
        Promise<google.maps.StreetViewPanorama | undefined>
      > = $streetViewPanoramaPromise,
): Promise<google.maps.StreetViewPanorama | undefined> {
  return usePromise<google.maps.StreetViewPanorama>(key);
}
