import type { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { InjectionKey } from 'vue';
import type { IGmapVuePluginOptions } from '../interfaces';

export const $recyclePrefix = '__gmc__';
export const $autocompletePromise = Symbol(
  'autocompletePromise',
) as InjectionKey<Promise<google.maps.places.Autocomplete | undefined>>;
export const $mapPromise = Symbol('mapPromise') as InjectionKey<
  Promise<google.maps.Map | undefined>
>;
export const $streetViewPanoramaPromise = Symbol(
  'streetViewPanoramaPromise',
) as InjectionKey<Promise<google.maps.StreetViewPanorama | undefined>>;
export const $clusterPromise = Symbol('clusterPromise') as InjectionKey<
  Promise<MarkerClusterer | undefined>
>;
export const $markerPromise = Symbol('markerPromise') as InjectionKey<
  Promise<google.maps.marker.AdvancedMarkerElement | undefined>
>;
export const $infoWindowPromise = Symbol('infoWindowPromise') as InjectionKey<
  Promise<google.maps.InfoWindow | undefined>
>;
export const $kmlLayerPromise = Symbol('kmlLayerPromise') as InjectionKey<
  Promise<google.maps.KmlLayer | undefined>
>;
export const $heatmapLayerPromise = Symbol(
  'heatmapLayerPromise',
) as InjectionKey<Promise<google.maps.visualization.HeatmapLayer | undefined>>;
export const $circleShapePromise = Symbol('circleShapePromise') as InjectionKey<
  Promise<google.maps.Circle | undefined>
>;
export const $polygonShapePromise = Symbol(
  'polygonShapePromise',
) as InjectionKey<Promise<google.maps.Polygon | undefined>>;
export const $polylineShapePromise = Symbol(
  'polylineShapePromise',
) as InjectionKey<Promise<google.maps.Polyline | undefined>>;
export const $rectangleShapePromise = Symbol(
  'rectangleShapePromise',
) as InjectionKey<Promise<google.maps.Rectangle | undefined>>;
export const $drawingManagerPromise = Symbol(
  'drawingManagerPromise',
) as InjectionKey<Promise<google.maps.drawing.DrawingManager | undefined>>;
export const $gmapOptions = Symbol('gmapOptions') as InjectionKey<
  IGmapVuePluginOptions | undefined
>;
