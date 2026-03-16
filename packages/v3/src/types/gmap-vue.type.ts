import type {
  Autocomplete,
  Circle,
  Cluster,
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
import type {
  IGmapVueElementOptions,
  IGmapVuePluginOptions,
  IGoogleMapProp,
  ILoadPluginOptions,
  IVueProp,
} from '@/interfaces';
import type { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Emitter, EventType } from 'mitt';
import type { ComponentOptions, Ref } from 'vue';

/** @internal */
export type TPluginComponentNames =
  | 'GmvMap'
  | 'GmvMarker'
  | 'GmvCluster'
  | 'GmvInfoWindow'
  | 'GmvAutocomplete'
  | 'GmvKmlLayer'
  | 'GmvStreetViewPanorama'
  | 'GmvHeatmapLayer'
  | 'GmvCircle'
  | 'GmvPolygon'
  | 'GmvPolyline'
  | 'GmvRectangle'
  | 'GmvDrawingManager';

/**
 * @typedef {Object} SinglePluginComponentConfigWithoutEvents
 * @property {string[]} noBind - Props with should not be bind to Google Maps. Has precedence over twoWay
 * @property {string[]} twoWay - Props that should be bind in two-way data binding
 * @property {Object} trackProperties - Object with nested properties of a prop that should be watched
 * @property {string} trackProperties.key - Should be a string
 * @property {string[]} trackProperties.value - Should be an array of nested properties of the prop that should be watched
 */
/**
 * @typedef {Object} SinglePluginComponentConfig
 * @property {string[]} noBind - Props with should not be bind to Google Maps. Has precedence over twoWay
 * @property {string[]} twoWay - Props that should be bind in two-way data binding
 * @property {Object} trackProperties - Object with nested properties of a prop that should be watched
 * @property {string} trackProperties.key - Should be a string
 * @property {string[]} trackProperties.value - Should be an array of nested properties of the prop that should be watched
 * @property {Object} events - Events should be bind on the component
 * @property {string[]} events.auto - Events of the Google Maps component instance that should be bind
 * @property {string[]} events.manual - Manual events that should emit or bind
 */
/** @internal */
export interface ISinglePluginComponentConfig {
  noBind: string[];
  twoWay: string[];
  trackProperties: Record<string, string[]>;
  events: {
    auto: string[];
    manual: string[]; // TODO: try to improve this to be an object with specific keys that can be used in the code
  };
}

/** @internal */
export type TPluginComponentConfig = Record<
  TPluginComponentNames,
  ISinglePluginComponentConfig
>;

/** @public */
export type TGlobalGoogleObject = Partial<typeof google>;

export type TGoogleMapsAPIInitializerFn = (options: ILoadPluginOptions) => void;

/** @internal */
export type TLazyValueGetterFn<T> = () => Promise<T>;

/** @internal */
export type TPromiseLazyCreatorFn = (
  options: IGmapVuePluginOptions,
) => TLazyValueGetterFn<TGlobalGoogleObject>;

/** @internal */
export type TOldHtmlInputElement = HTMLInputElement & {
  attachEvent: (type: string, listener: () => unknown) => void;
};

/** @internal */
export type TGmapVuePluginProps = Record<string, IVueProp & IGoogleMapProp>;

export interface IGmvComponents {
  Autocomplete: typeof Autocomplete;
  Circle: typeof Circle;
  Cluster: typeof Cluster;
  DrawingManager: typeof DrawingManager;
  HeatmapLayer: typeof HeatmapLayer;
  InfoWindow: typeof InfoWindow;
  KmlLayer: typeof KmlLayer;
  MapLayer: typeof MapLayer;
  Marker: typeof Marker;
  Polyline: typeof Polyline;
  Polygon: typeof Polygon;
  Rectangle: typeof Rectangle;
  StreetViewPanorama: typeof StreetViewPanorama;
}

export interface IGmvSharedComposables {
  useMapPromise: () => Promise<google.maps.Map | undefined>;
  useResizeBus: () => {
    currentResizeBus: Ref<Emitter<Record<EventType, unknown>> | undefined>;
    _resizeCallback: () => void;
    _delayedResizeCallback: () => Promise<void>;
  };
  useGoogleMapsApiPromiseLazy: () => Promise<unknown>;
  useStreetViewPanoramaPromise: () => Promise<
    google.maps.StreetViewPanorama | undefined
  >;
  usePluginOptions: () => IGmapVuePluginOptions;
}

export interface IGmvUtilities {
  googleMapsApiInitializer: TGoogleMapsAPIInitializerFn;
  pluginComponentBuilder: (
    providedOptions: IGmapVueElementOptions,
  ) => ComponentOptions;
  getGoogleMapsAPI: () => false | TGlobalGoogleObject;
}

/** @internal */
export type TGoogleMapsInstances =
  | google.maps.Map
  | google.maps.marker.AdvancedMarkerElement
  | google.maps.InfoWindow
  | google.maps.places.Autocomplete
  | google.maps.KmlLayer
  | google.maps.StreetViewPanorama
  | google.maps.visualization.HeatmapLayer
  | google.maps.Circle
  | google.maps.Polygon
  | google.maps.Polyline
  | google.maps.Rectangle
  | google.maps.drawing.DrawingManager
  | MarkerClusterer;

export interface IGoogleRecycleObject {
  map: google.maps.Map;
  div: HTMLElement;
}
