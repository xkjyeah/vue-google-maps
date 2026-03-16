/**
 * This are GoogleMapsOptions that we want to have like
 * props in our Vue component.
 * This properties are in the way that GoogleMaps accept it
 * and with extraneous properties for the VueJs API.
 * In a previous version of this plugin, to avoid repetition,
 * we created a .js file component with a `mappedProps` key on it
 * and used a variety of helper functions to clean it and bind it
 * to Vue props and watch them, etc.
 * To day our primary main goal is get a more intuitive and descriptive
 * API and a better documentation of it, following this goals we move
 * this extraneous properties to an independent file in order to consume
 * it when is needed.
 * Please you need to remind that you need to create properties in the
 * correspondent Vue component with the same names and the same values
 * for those properties that are not extraneous to Vue.
 */

export const autocompleteMappedProps = {
  bounds: {
    type: Object,
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true,
  },
  types: {
    type: Array,
    default() {
      return [];
    },
  },
};

export const drawingManagerMappedProps = {
  circleOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  markerOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  polygonOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  polylineOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  rectangleOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
};

export const heatMapLayerMappedProps = {
  options: {
    type: Object,
    twoWay: false,
    default: () => {},
  },
  data: {
    type: Array,
    twoWay: true,
  },
};

export const infoWindowMappedProps = {
  content: {
    type: Object,
    twoWay: true,
  },
  options: {
    type: Object,
    required: false,
    default() {
      return {};
    },
  },
  position: {
    type: Object,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
};

export const kmlLayerMappedProps = {
  clickable: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  map: {
    type: Object,
    twoWay: true,
  },
  preserveViewport: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  screenOverlays: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  suppressInfoWindows: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  url: {
    type: String,
    twoWay: false,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
  options: {
    type: Object,
    default() {
      return {};
    },
  },
};

export const mapMappedProps = {
  center: {
    required: true,
    twoWay: true,
    type: Object,
    noBind: true,
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number,
    noBind: true,
  },
  heading: {
    type: Number,
    twoWay: true,
  },
  mapTypeId: {
    twoWay: true,
    type: String,
  },
  tilt: {
    twoWay: true,
    type: Number,
  },
  options: {
    type: Object,
    default() {
      return {};
    },
  },
};

export const markerMappedProps = {
  animation: {
    twoWay: true,
    type: Number,
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true,
  },
  cursor: {
    type: String,
    twoWay: true,
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false,
  },
  icon: {
    twoWay: true,
  },
  label: {},
  opacity: {
    type: Number,
    default: 1,
  },
  options: {
    type: Object,
  },
  place: {
    type: Object,
  },
  position: {
    type: Object,
    twoWay: true,
  },
  shape: {
    type: Object,
    twoWay: true,
  },
  title: {
    type: String,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
  visible: {
    twoWay: true,
    default: true,
  },
};

export const streetViewPanoramaMappedProps = {
  zoom: {
    twoWay: true,
    type: Number,
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading'],
  },
  position: {
    twoWay: true,
    type: Object,
    noBind: true,
  },
  pano: {
    twoWay: true,
    type: String,
  },
  motionTracking: {
    twoWay: false,
    type: Boolean,
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true,
  },
  options: {
    twoWay: false,
    type: Object,
    default() {
      return {};
    },
  },
};

export const polygonMappedProps = {
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
  },
  editable: {
    type: Boolean,
  },
  fillColor: {
    type: String,
    noBind: true,
  },
  fillOpacity: {
    type: Number,
    noBind: true,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
    type: Number,
    noBind: true,
  },
  strokePosition: {
    type: Number,
    noBind: true,
  },
  strokeWeight: {
    type: Number,
    noBind: true,
  },
  visible: {
    type: Boolean,
  },
  options: {
    type: Object,
  },
  path: {
    type: Array,
    twoWay: true,
    noBind: true,
  },
  paths: {
    type: Array,
    twoWay: true,
    noBind: true,
  },
};

export const polylineMappedProps = {
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
  },
  editable: {
    type: Boolean,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
    type: Number,
    noBind: true,
  },
  strokeWeight: {
    type: Number,
    noBind: true,
  },
  visible: {
    type: Boolean,
  },
  options: {
    twoWay: false,
    type: Object,
  },
  path: {
    type: Array,
    twoWay: true,
  },
};

export const rectangleMappedProps = {
  bounds: {
    type: Object,
    twoWay: true,
  },
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  fillColor: {
    type: String,
    noBind: true,
  },
  fillOpacity: {
    type: Number,
    noBind: true,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
    type: Number,
    noBind: true,
  },
  strokePosition: {
    type: Number,
    noBind: true,
  },
  strokeWeight: {
    type: Number,
    noBind: true,
  },
  visible: {
    type: Boolean,
  },
  options: {
    type: Object,
    twoWay: false,
  },
};

export const circleMappedProps = {
  center: {
    type: Object,
    twoWay: true,
    required: true,
  },
  radius: {
    type: Number,
    twoWay: true,
  },
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  fillColor: {
    type: String,
    noBind: true,
  },
  fillOpacity: {
    type: Number,
    noBind: true,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
    type: Number,
    noBind: true,
  },
  strokePosition: {
    type: Number,
    noBind: true,
  },
  strokeWeight: {
    type: Number,
    noBind: true,
  },
  visible: {
    type: Boolean,
  },
  options: {
    type: Object,
    twoWay: false,
  },
};

export const placeInputMappedProps = {
  bounds: {
    type: Object,
  },
  defaultPlace: {
    type: String,
    default: '',
  },
  componentRestrictions: {
    type: Object,
    default: null,
  },
  types: {
    type: Array,
    default() {
      return [];
    },
  },
  placeholder: {
    required: false,
    type: String,
  },
  className: {
    required: false,
    type: String,
  },
  label: {
    required: false,
    type: String,
    default: null,
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false,
  },
};

export const clusterIconMappedProps = {
  algorithm: {
    type: Object,
  },
  onClusterClick: {
    type: Function,
  },
  renderer: {
    type: Object,
  },
  options: {
    type: Object,
  },
};

export default {
  autocompleteMappedProps,
  circleMappedProps,
  drawingManagerMappedProps,
  heatMapLayerMappedProps,
  infoWindowMappedProps,
  kmlLayerMappedProps,
  mapMappedProps,
  markerMappedProps,
  streetViewPanoramaMappedProps,
  polygonMappedProps,
  polylineMappedProps,
  rectangleMappedProps,
  placeInputMappedProps,
  clusterIconMappedProps,
};
