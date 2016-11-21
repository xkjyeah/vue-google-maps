/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

import _ from 'lodash';
import eventHub from '../utils/eventHub';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
import Q from 'q';
import MapComponent from './mapComponent';
import {getParentTest} from '../utils/getParentTest';
import assert from 'assert';

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
}

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
  label: {
  },
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
}

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

const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.markerObj[field];
};
const setLocalField = function (self, field, value){
  self.markerObj[field] = value;
  self.$emit(field.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase()+'_changed', value);
  self.$nextTick(function (){
    self.markerObj[field] = getLocalField(self, field);
  });
};
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
export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  data(){
    return {
        markerObj:{
            animation:null,
            attribution:{},
            clickable:null,
            cursor:null,
            draggable:null,
            icon:{},
            label:null,
            opacity:null,
            place:{},
            position:{},
            shape:{},
            title:null,
            zIndex:null,
            visible:null
        }
    };
  },
  computed:{
    local_animation: {
      get(){
        return getLocalField(this, 'animation');
      },
      set(value){
        setLocalField(this, 'animation', value);
      }
    },
    local_attribution: {
      get(){
        return getLocalField(this, 'attribution');
      },
      set(value){
        //setLocalField(this, 'attribution', value);
      }
    },
    local_clickable: {
      get(){
        return getLocalField(this, 'clickable');
      },
      set(value){
        setLocalField(this, 'clickable', value);
      }
    },
    local_cursor: {
      get(){
        return getLocalField(this, 'cursor');
      },
      set(value){
        setLocalField(this, 'cursor', value);
      }
    },
    local_draggable: {
      get(){
        return getLocalField(this, 'draggable');
      },
      set(value){
        setLocalField(this, 'draggable', value);
      }
    },
    local_icon: {
      get(){
        return getLocalField(this, 'icon');
      },
      set(value){
        setLocalField(this, 'icon', value);
      }
    },
    local_label: {
      get(){
        return getLocalField(this, 'label');
      },
      set(value){
        //setLocalField(this, 'label', value);
      }
    },
    local_opacity: {
      get(){
        return getLocalField(this, 'opacity');
      },
      set(value){
        //setLocalField(this, 'opacity', value);
      }
    },
    local_place: {
      get(){
        return getLocalField(this, 'place');
      },
      set(value){
        //setLocalField(this, 'place', value);
      }
    },
    local_position: {
      get(){
        return getLocalField(this, 'position');
      },
      set(value){
        setLocalField(this, 'position', value);
      }
    },
    local_shape: {
      get(){
        return getLocalField(this, 'shape');
      },
      set(value){
        setLocalField(this, 'shape', value);
      }
    },
    local_title: {
      get(){
        return getLocalField(this, 'title');
      },
      set(value){
        setLocalField(this, 'title', value);
      }
    },
    local_zIndex: {
      get(){
        return getLocalField(this, 'zIndex');
      },
      set(value){
        setLocalField(this, 'zIndex', value);
      }
    },
    local_visible: {
      get(){
        return getLocalField(this, 'visible');
      },
      set(value){
        setLocalField(this, 'visible', value);
      }
    },
  },
  created() {
    this._acceptInfoWindow = true;
    this.$on('register-info-window',this.registerInfoWindow);
    this.$on('cluster-ready',this.clusterReady);
    this.$on('cluster-destroyed',this.clusterDestroyed);
    this.markerObj.animation = this.animation;
    this.markerObj.attribution = this.attribution;
    this.markerObj.clickable = this.clickable;
    this.markerObj.cursor = this.cursor;
    this.markerObj.draggable = this.draggable;
    this.markerObj.icon = this.icon;
    this.markerObj.label = this.label;
    this.markerObj.opacity = this.opacity;
    this.markerObj.place = this.place;
    this.markerObj.position = this.position;
    this.markerObj.shape = this.shape;
    this.markerObj.title = this.title;
    this.markerObj.zIndex = this.zIndex;
    this.markerObj.visible = this.visible;
  },
  destroyed() {
    this.$off('register-info-window', this.registerInfoWindow);
    this.$off('cluster-ready', this.clusterReady);
    this.$off('cluster-destroyed',this.clusterDestroyed);
    if (!this.$markerObject)
      return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    }
    else {
      this.$markerObject.setMap(null);
    }
  },
  deferredReady() {
    /* Send an event to any <cluster> parent */
    //console.log('emit register-marker', this);
    var parent = this.getParentAcceptMarker(this);
    if (parent)
      parent.$emit('register-marker', this);

    const options = _.clone(this.getPropsValues());
    options.map = this.$map;
    this.createMarker(options, this.$map);
  },

  methods: {
    createMarker (options, map) {
      // FIXME: @Guillaumne do we need this?
      if (this.destroyed)
        return;

      this.$markerObject = this.createMarkerObject(options);
      propsBinder(this, this.$markerObject, markerProps);
      eventsBinder(this, this.$markerObject, events);

      if (this.$clusterObject) {
        this.$clusterObject.addMarker(this.$markerObject);
      }
    },
    createMarkerObject(options){
      return new google.maps.Marker(options);
    },
    registerInfoWindow(infoWindow) {
      infoWindow.$emit('marker-ready', this, this.$map);
    },
    clusterReady(cluster, map) {
      //console.log('treat cluster-ready', this, cluster, map);
      this.$clusterObject = cluster;
    },
    clusterDestroyed(cluster, map) {
      //console.log('treat cluster-Destroyed', this, cluster, map);
      this.$clusterObject = null;
    },
    getParentAcceptMarker(child){
      return getParentTest(child, function (component) {
        return component._acceptMarker==true;
      });
    }
  }
});
</script>
