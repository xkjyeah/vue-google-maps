import _ from "lodash";
import eventsBinder from "../utils/eventsBinder.js";
import propsBinder from "../utils/propsBinder.js";
import getPropsValuesMixin from "../utils/getPropsValuesMixin.js";
import MapElementMixin from "./mapElementMixin";
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = [
  "animation", "clickable", "cursor", "draggable", "icon", "position", "shape", "title", "zIndex", "visible"
];
const props = {
  animation: {
    type: Number
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    default: true
  },
  cursor: {
    type: String,
  },
  draggable: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object,
  },
  label: {},
  opacity: {
    type: Number,
    default: 1
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
  },
  shape: {
    type: Object,
  },
  title: {
    type: String,
  },
  zIndex: {
    type: Number,
  },
  visible: {
    default: true
  }
};

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
];

var container;

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,
  render(h) {
    return h( // So that infowindows can have a marker parent
      'div',
      this.$slots.default
    )
  },
  created() {
    this.$parentAcceptMarker = null;
    this.$acceptInfoWindow = true;
    this.$on('register-info-window', this.registerInfoWindow);
    this.$on('unregister-info-window', this.unregisterInfoWindow);
  },
  destroyed() {
    if (!this.$markerObject)
      return;
    if (this.$parentAcceptMarker) {
      this.$parentAcceptMarker.$emit('unregister-marker', this, this.$markerObject);
    }
    this.$markerObject.setMap(null);
  },
  deferredReady() {
    // search ancestors for cluster object
    this.$parentAcceptMarker = this.$findAncestor(
      ans => ans.$acceptMarker
    );
    const options = _.clone(this.getPropsValues());
    options.map = this.$map;
    this.createMarker(options, this.$map);
  },
  methods: {
    createMarker (options, map) {
      this.$markerObject = this.createMarkerObject(options);
      propsBinder(this, this.$markerObject, generatePropsToBind(props,twoWayProps));
      eventsBinder(this, this.$markerObject, events);

      /* Send an event to any <cluster ou similar> parent */
      if (this.$parentAcceptMarker) {
        this.$parentAcceptMarker.$emit('register-marker', this, this.$markerObject);
      }
    },
    createMarkerObject(options){
      return new google.maps.Marker(options);
    },
    registerInfoWindow(infoWindow) {
      infoWindow.$markerObject = this.$markerObject;
      this.infoWindowClickEvent = () => {
        infoWindow.local_opened = !infoWindow.local_opened;
      };
      this.$on('click', this.infoWindowClickEvent);
    },
    unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('click', this.infoWindowClickEvent);
      }
      this.infoWindowClickEvent = null;
    },
  }
}
