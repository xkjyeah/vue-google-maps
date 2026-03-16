import type { ISinglePluginComponentConfig } from '@/types';
import type {
  Algorithm,
  MarkerClusterer,
  Renderer,
  onClusterClickHandler,
} from '@googlemaps/markerclusterer';
import type { Emitter, EventType } from 'mitt';
import type { Ref, RendererElement, RendererNode, VNode } from 'vue';

/**
 * @public
 */
export interface IGoogleMapsApiObject {
  isReady: boolean;
}

/**
 * The object which contain all event names to and params that should be used to add listener to the Google Maps instance
 * @typedef {Object} LoadPluginOptions
 * @property {string} key - The Google Maps key
 * @property {string?} callback - The callback name that should be called when Google Maps is ready, if you set this do not forget to call `globalThis.GoogleMapsCallback` function in your callback
 * @property {string?} v - The version of the Maps JavaScript API to load.
 * @property {string} libraries - A comma-separated list of additional Maps JavaScript API libraries to load. Specifying a fixed set of libraries is not generally recommended, but is available for developers who wish to finely tune the caching behavior on their website.
 * @property {string} language - The language to use. This affects the names of controls, copyright notices, driving directions, and control labels, and the responses to service requests. See the list of supported languages.
 * @property {string} region - The region code to use. This alters the map's behavior based on a given country or territory.
 * @property {string} authReferrerPolicy - Maps JS customers can configure HTTP Referrer Restrictions in the Cloud Console to limit which URLs are allowed to use a particular API Key. By default, these restrictions can be configured to allow only certain paths to use an API Key. If unknown URL on the same domain or origin may use the API Key, you can set authReferrerPolicy: "origin" to limit the amount of data sent when authorizing requests from the Maps JavaScript API. When this parameter is specified and HTTP Referrer Restrictions are enabled on Cloud Console, Maps JavaScript API will only be able to load if there is an HTTP Referrer Restriction that matches the current website's domain without a path specified.
 * @property {string} mapIds - An array of map Ids. Causes the configuration for the specified map Ids to be preloaded.
 * @property {string} channel - See Usage tracking per channel.
 * @property {string} solutionChannel - Google Maps Platform provides munknown types of sample code to help you get up and running quickly. To track adoption of our more complex code samples and improve solution quality, Google includes the solutionChannel query parameter in API calls in our sample code.
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
  mapIds?: string[];
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

/**
 * @internal
 */
export interface IVueProp {
  type?:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor
    | FunctionConstructor
    | SymbolConstructor;
  required?: boolean;
  default?: () => undefined;
  validator?: () => boolean;
}

/**
 * @internal
 */
export interface IGoogleMapProp {
  twoWay?: boolean;
  noBind?: boolean;
  trackProperties?: string[];
}

export interface IGmapVueElementOptions {
  mappedProps: Omit<ISinglePluginComponentConfig, 'events'>;
  props: Record<string, IVueProp>;
  events: string[];
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctr: () => (...args: any[]) => InstanceType<any>;
  ctrArgs?: (
    options: Record<string, unknown>,
    props: Record<string, IVueProp | undefined>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Record<string, any>[];
  beforeCreate?: (options: Record<string, unknown>) => unknown;
  afterCreate?: (mapElementInstance: Record<string, unknown>) => unknown;
}

/** @internal */
export interface PromiseDeferred<T> {
  resolve: ((value: T | undefined) => void) | undefined;
  reject: ((reason?: unknown) => void) | undefined;
}

/**
 * Autocomplete input Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.bounds
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.componentRestrictions
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.fields
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.strictBounds
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.types
 */
export interface IAutoCompleteInputVueComponentProps {
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  componentRestrictions?: google.maps.places.ComponentRestrictions;
  fields?: string[];
  strictBounds?: boolean;
  types?: string[];
  /**
   * Select the first result in the list when press enter keyboard
   * @values true, false
   */
  selectFirstOnEnter?: boolean;
  /**
   * the unique ref set to the component passed in the slot input
   */
  slotRef?: HTMLInputElement;
  /**
   * To avoid paying for data that you don't need,
   * be sure to use Autocomplete.setFields() to specify
   * only the place data that you will use.
   *
   * @see [Place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
   * @see [setFields](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)
   * @see [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)
   */
  setFieldsTo?: string[];
  autocompleteKey?: string;
  options?: Record<string, unknown>;
}

export interface IAutoCompleteInputVueComponentExpose {
  autocompleteInstance: google.maps.places.Autocomplete | undefined;
}

/**
 * Circle shape Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.center
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.clickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.draggable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.editable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.radius
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokePosition
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeWeight
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.visible
 */
export interface ICircleShapeVueComponentProps {
  center?: google.maps.LatLng | google.maps.LatLngLiteral;
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  radius?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokePosition?: google.maps.StrokePosition;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
  circleKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface ICircleShapeVueComponentExpose {
  circleShapeInstance: google.maps.Circle | undefined;
  circleShapePromise: Promise<google.maps.Circle>;
}

/**
 * Marker Clusterer documentation
 *
 * @see [algorithm](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#algorithm)
 * @see [markers](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#markers)
 * @see [onClusterClick](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#onClusterClick)
 * @see [renderer](https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html#renderer)
 */
export interface IMarkerClusterVueComponentProps {
  algorithm?: Algorithm;
  markers?: google.maps.marker.AdvancedMarkerElement[];
  onClusterClick?: onClusterClickHandler;
  renderer?: Renderer;
  clusterKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IMarkerClusterVueComponentExpose {
  clusterInstance: MarkerClusterer | undefined;
  clusterPromise: Promise<MarkerClusterer>;
}

/**
 * Drawing manager Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.circleOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.drawingControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.drawingControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.drawingMode
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.markerOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.polygonOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.polylineOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/drawing#DrawingManagerOptions.rectangleOptions
 */
export interface IDrawingManagerVueComponentProps
  extends Omit<google.maps.drawing.DrawingManagerOptions, 'map'> {
  circleOptions?: google.maps.CircleOptions;
  drawingControl?: boolean;
  drawingControlOptions?: google.maps.drawing.DrawingControlOptions;
  drawingMode?: google.maps.drawing.OverlayType | null;
  markerOptions?: google.maps.marker.AdvancedMarkerElementOptions;
  polygonOptions?: google.maps.PolygonOptions;
  polylineOptions?: google.maps.PolylineOptions;
  rectangleOptions?: google.maps.RectangleOptions;
  position?:
    | 'TOP_CENTER'
    | 'TOP_LEFT'
    | 'TOP_RIGHT'
    | 'LEFT_TOP'
    | 'RIGHT_TOP'
    | 'LEFT_CENTER'
    | 'RIGHT_CENTER'
    | 'LEFT_BOTTOM'
    | 'RIGHT_BOTTOM'
    | 'BOTTOM_CENTER'
    | 'BOTTOM_LEFT'
    | 'BOTTOM_RIGHT';
  drawingModes?: google.maps.drawing.OverlayType[];
  shapes?: google.maps.drawing.OverlayCompleteEvent[];
  drawingKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IDrawingManagerVueComponentExpose {
  setDrawingMode: (mode: google.maps.drawing.OverlayType | null) => void;
  deleteSelection: () => void;
  clearAll: () => void;
  drawingManagerInstance: google.maps.drawing.DrawingManager | undefined;
  drawingManagerPromise: Promise<google.maps.drawing.DrawingManager>;
}

/**
 * Heatmap Layer Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.data
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.dissipating
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.gradient
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.maxIntensity
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.opacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions.radius
 */
export interface IHeatmapLayerVueComponentProps {
  data?:
    | google.maps.MVCArray<
        google.maps.LatLng | google.maps.visualization.WeightedLocation
      >
    | (google.maps.LatLng | google.maps.visualization.WeightedLocation)[];
  dissipating?: boolean;
  gradient?: string[];
  maxIntensity?: number;
  opacity?: number;
  number?: number;
  heatmapKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IHeatmapLayerVueComponentExpose {
  heatMapLayerInstance: google.maps.visualization.HeatmapLayer | undefined;
  heatmapLayerPromise: Promise<google.maps.visualization.HeatmapLayer>;
}

/**
 * Info Window Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.ariaLabel
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.content
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.disableAutoPan
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.maxWidth
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.minWidth
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.pixelOffset
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.position
 * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.zIndex
 */
export interface IInfoWindowVueComponentProps {
  ariaLabel?: string;
  content?: string | Element | Text | null;
  disableAutoPan?: boolean;
  maxWidth?: number;
  minWidth?: number;
  pixelOffset?: google.maps.Size;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  zIndex?: number;
  opened?: boolean;
  marker?: google.maps.marker.AdvancedMarkerElement;
  infoWindowKey?: string;
  markerKey?: string;
  mapKey?: string;
  options?: Record<string | number | symbol, unknown>;
}

export interface IInfoWindowVueComponentExpose {
  infoWindowInstance: google.maps.InfoWindow | undefined;
  infoWindowPromise: Promise<google.maps.InfoWindow>;
}

/**
 * Kml layer Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.clickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.preserveViewport
 * @see https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.screenOverlays
 * @see https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.suppressInfoWindows
 * @see https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.url
 */
export interface IKmlLayerVueComponentProps {
  clickable?: boolean;
  preserveViewport?: boolean;
  screenOverlays?: boolean;
  suppressInfoWindows?: boolean;
  url?: string;
  zIndex?: number;
  kmlKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IKmlLayerVueComponentExpose {
  kmlLayerInstance: google.maps.KmlLayer | undefined;
  kmlLayerPromise: Promise<google.maps.KmlLayer>;
}

/**
 * MapOptions interface
 *
 * MapOptions object used to define the properties that can be set on a Map.
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.backgroundColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.center
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.clickableIcons
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.controlSize
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDoubleClickZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggableCursor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggingCursor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.fullscreenControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.fullscreenControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.heading
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.isFractionalZoomEnabled
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.keyboardShortcuts
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapId
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeId
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.maxZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.minZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.noClear
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.restriction
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.rotateControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.rotateControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scaleControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scaleControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scrollwheel
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetView
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetViewControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetViewControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.styles
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tilt
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoomControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoomControlOptions
 */
export interface IMapLayerVueComponentProps {
  backgroundColor?: string;
  center: google.maps.LatLng | google.maps.LatLngLiteral;
  clickableIcons?: boolean;
  controlSize?: number;
  disableDefaultUI?: boolean;
  disableDoubleClickZoom?: boolean;
  draggableCursor?: string;
  draggingCursor?: string;
  fullscreenControl?: boolean;
  fullscreenControlOptions?: google.maps.FullscreenControlOptions;
  gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
  heading?: number;
  isFractionalZoomEnabled?: boolean;
  keyboardShortcuts?: boolean;
  mapId?: string;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: google.maps.MapTypeControlOptions;
  mapTypeId?: google.maps.MapTypeId;
  maxZoom?: number;
  minZoom?: number;
  noClear?: boolean;
  restriction?: google.maps.MapRestriction;
  rotateControl?: boolean;
  rotateControlOptions?: google.maps.RotateControlOptions;
  scaleControl?: boolean;
  scaleControlOptions?: google.maps.ScaleControlOptions;
  scrollwheel?: boolean;
  streetView?: google.maps.StreetViewPanorama;
  streetViewControl?: boolean;
  streetViewControlOptions?: google.maps.StreetViewControlOptions;
  styles?: google.maps.MapTypeStyle[];
  tilt?: number;
  zoom?: number;
  zoomControl?: boolean;
  zoomControlOptions?: google.maps.ZoomControlOptions;
  mapKey?: string;
  resizeBus?: Emitter<Record<EventType, unknown>>;
  options?: Record<string, unknown>;
}

export interface IMapLayerVueComponentExpose {
  mapPromise: Promise<google.maps.Map | undefined>;
  mapInstance: google.maps.Map | undefined;
  panBy: (x: number, y: number) => void;
  panTo: (latLng: google.maps.LatLng | google.maps.LatLngLiteral) => void;
  panToBounds: (
    latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    padding: number | google.maps.Padding,
  ) => void;
  fitBounds: (
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    padding: number | google.maps.Padding,
  ) => void;
  currentResizeBus: Ref<Emitter<Record<EventType, unknown>> | undefined>;
  _resizeCallback: () => void;
  _delayedResizeCallback: () => Promise<void>;
  resize: () => void;
  resizePreserveCenter: () => void;
  getRecycleKey: () => string;
}

/**
 * Marker Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.collisionBehavior
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.content
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpClickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.gmpDraggable
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.position
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.title
 * @see https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions.zIndex
 */
export interface IMarkerIconVueComponentProps {
  collisionBehavior?: google.maps.CollisionBehavior;
  content?: HTMLElement;
  gmpClickable?: boolean; // Notice: Available only in the v=beta channel.
  gmpDraggable?: boolean;
  position?:
    | google.maps.LatLng
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral;
  title?: string;
  zIndex?: number;
  markerKey?: string;
  clusterKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IMarkerIconVueComponentExpose {
  VNodeMarkerIcon: VNode<
    RendererNode,
    RendererElement,
    Record<string, unknown>
  >;
  markerInstance: google.maps.marker.AdvancedMarkerElement | undefined;
  markerPromise: Promise<google.maps.marker.AdvancedMarkerElement>;
}

/**
 * Polygon Shape Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.clickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.draggable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.editable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.fillColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.fillOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.geodesic
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.paths
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.strokeColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.strokeOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.strokePosition
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.strokeWeight
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.visible
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolygonOptions.zIndex
 */
export interface IPolygonShapeVueComponentProps {
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  geodesic?: boolean;
  paths?:
    | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    | google.maps.MVCArray<google.maps.LatLng>
    | (google.maps.LatLng | google.maps.LatLngLiteral)[][]
    | (google.maps.LatLng | google.maps.LatLngLiteral)[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokePosition?: google.maps.StrokePosition;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
  deepWatch?: boolean;
  polygonKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IPolygonShapeVueComponentExpose {
  polygonShapeInstance: google.maps.Polygon | undefined;
  polygonShapePromise: Promise<google.maps.Polygon>;
}

/**
 * Marker Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.clickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.draggable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.editable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.geodesic
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.icons
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.path
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeWeight
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.visible
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.zIndex
 */
export interface IPolylineShapeVueComponentProps {
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  geodesic?: boolean;
  icons?: google.maps.IconSequence[];
  path?:
    | google.maps.MVCArray<google.maps.LatLng>
    | (google.maps.LatLng | google.maps.LatLngLiteral)[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
  deepWatch?: boolean;
  polylineKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IPolylineShapeVueComponentExpose {
  polylineShapeInstance: google.maps.Polyline | undefined;
  polylineShapePromise: Promise<google.maps.Polyline>;
}

/**
 * Rectangle shape Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.bounds
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.clickable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.draggable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.editable
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.fillColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.fillOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeOpacity
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokePosition
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeWeight
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.visible
 * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.zIndex
 */
export interface IRectangleShapeVueComponentProps {
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  clickable?: boolean;
  draggable?: boolean;
  editable?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokePosition?: google.maps.StrokePosition;
  strokeWeight?: number;
  visible?: boolean;
  zIndex?: number;
  rectangleKey?: string;
  mapKey?: string;
  options?: Record<string, unknown>;
}

export interface IRectangleShapeVueComponentExpose {
  rectangleShapeInstance: google.maps.Rectangle | undefined;
  rectangleShapePromise: Promise<google.maps.Rectangle>;
}

/**
 * Street View Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.addressControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.addressControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.clickToGo
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.controlSize
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.disableDefaultUI
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.disableDoubleClickZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.enableCloseButton
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.fullscreenControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.fullscreenControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.imageDateControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.linksControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.motionTracking
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.motionTrackingControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.motionTrackingControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.panControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.panControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pano
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.position
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pov
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.scrollwheel
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.showRoadLabels
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.visible
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.zoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.zoomControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.zoomControlOptions
 */
export interface IStreetViewPanoramaVueComponentProps {
  addressControl?: boolean;
  addressControlOptions?: google.maps.StreetViewAddressControlOptions;
  clickToGo?: boolean;
  controlSize?: number;
  disableDefaultUI?: boolean;
  disableDoubleClickZoom?: boolean;
  enableCloseButton?: boolean;
  fullscreenControl?: boolean;
  fullscreenControlOptions?: google.maps.FullscreenControlOptions;
  imageDateControl?: boolean;
  linksControl?: boolean;
  motionTracking?: boolean;
  motionTrackingControl?: boolean;
  motionTrackingControlOptions?: google.maps.MotionTrackingControlOptions;
  panControl?: boolean;
  panControlOptions?: google.maps.PanControlOptions;
  pano?: string;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  pov?: google.maps.StreetViewPov;
  scrollwheel?: boolean;
  showRoadLabels?: boolean;
  visible?: boolean;
  zoom?: number;
  zoomControl?: boolean;
  zoomControlOptions?: google.maps.ZoomControlOptions;
  streetViewKey?: string;
  options?: Record<string, unknown>;
}

export interface IStreetViewPanoramaVueComponentExpose {
  streetViewPanoramaInstance: google.maps.StreetViewPanorama | undefined;
  currentResizeBus: Ref<Emitter<Record<EventType, unknown>> | undefined>;
  _resizeCallback: () => void;
  _delayedResizeCallback: () => Promise<void>;
  resize: () => void;
  resizePreserveCenter: () => void;
  streetViewPanoramaPromise: Promise<
    google.maps.StreetViewPanorama | undefined
  >;
}
