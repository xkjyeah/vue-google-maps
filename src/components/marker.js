import _ from "lodash";
import eventsBinder from "../utils/eventsBinder.js";
import propsBinder from "../utils/propsBinder.js";
import getPropsValuesMixin from "../utils/getPropsValuesMixin.js";
import MapElementMixin from "./mapElementMixin";

const markerProps = {
  animation: {
    type: Number,
    twoWay: true
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true
  },
  icon: {
    type: Object,
    twoWay: true
  },
  label: {
    type: String
  },
  opacity: {
    type: Number
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true,
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true
  }
};

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
  computed: {
    local_animation: {
      get(){
        return this.animation;
      },
      set(value){
        this.$emit('animation_changed', value);
      }
    },
    local_attribution(){
      return this.attribution;
    },
    local_clickable: {
      get(){
        return this.clickable;
      },
      set(value){
        this.$emit('clickable_changed', value);
      }
    },
    local_cursor: {
      get(){
        return this.cursor;
      },
      set(value){
        this.$emit('cursor_changed', value);
      }
    },
    local_draggable: {
      get(){
        return this.draggable;
      },
      set(value){
        this.$emit('draggable_changed', value);
      }
    },
    local_icon: {
      get(){
        return this.icon;
      },
      set(value){
        this.$emit('icon_changed', value);
      }
    },
    local_label(){
      return this.label;
    },
    local_opacity(){
      return this.opacity;
    },
    local_place(){
      return this.place;
    },
    local_position: {
      get(){
        return this.position;
      },
      set(value){
        this.$emit('position_changed', value);
      }
    },
    local_shape: {
      get(){
        return this.shape;
      },
      set(value){
        this.$emit('shape_changed', value);
      }
    },
    local_title: {
      get(){
        return this.title;
      },
      set(value){
        this.$emit('title_changed', value);
      }
    },
    local_zIndex: {
      get(){
        return this.zIndex;
      },
      set(value){
        this.$emit('z-index_changed', value);
      }
    },
    local_visible: {
      get(){
        return this.visible;
      },
      set(value){
        this.$emit('visible_changed', value);
      }
    },
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
      propsBinder(this, this.$markerObject, markerProps);
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
      this.$on('g-click', this.infoWindowClickEvent);
    },
    unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('g-click', this.infoWindowClickEvent);
      }
      this.infoWindowClickEvent = null;
    },
    getParentAcceptMarker(child){
      return getParentTest(child, function (component) {
        return component._acceptMarker == true;
      });
    }
  }
}
