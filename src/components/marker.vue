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
import {hasChildInVueComponent} from '../utils/hasChildInVueComponent';
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
  markerObj: {
    required: true,
    type: Object,
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
  computed:{
    animation: {
      get(){
        return this.markerObj.animation;
      },
      set(value){
        this.markerObj.animation = value;
      }
    },
    attribution: {
      get(){
        return this.markerObj.attribution;
      },
      set(value){
        this.markerObj.attribution = value;
      }
    },
    clickable: {
      get(){
        return this.markerObj.clickable;
      },
      set(value){
        this.markerObj.clickable = value;
      }
    },
    cursor: {
      get(){
        return this.markerObj.cursor;
      },
      set(value){
        this.markerObj.cursor = value;
      }
    },
    draggable: {
      get(){
        return this.markerObj.draggable;
      },
      set(value){
        this.markerObj.draggable = value;
      }
    },
    icon: {
      get(){
        return this.markerObj.icon;
      },
      set(value){
        this.markerObj.icon = value;
      }
    },
    label: {
      get(){
        return this.markerObj.label;
      },
      set(value){
        this.markerObj.label = value;
      }
    },
    opacity: {
      get(){
        return this.markerObj.opacity;
      },
      set(value){
        this.markerObj.opacity = value;
      }
    },
    place: {
      get(){
        return this.markerObj.place;
      },
      set(value){
        this.markerObj.place = value;
      }
    },
    position: {
      get(){
        return this.markerObj.position;
      },
      set(value){
        this.markerObj.position = value;
      }
    },
    shape: {
      get(){
        return this.markerObj.shape;
      },
      set(value){
        this.markerObj.shape = value;
      }
    },
    title: {
      get(){
        return this.markerObj.title;
      },
      set(value){
        this.markerObj.title = value;
      }
    },
    zIndex: {
      get(){
        return this.markerObj.zIndex;
      },
      set(value){
        this.markerObj.zIndex = value;
      }
    },
    visible: {
      get(){
        return this.markerObj.visible;
      },
      set(value){
        this.markerObj.visible = value;
      }
    },
  },
  created() {
    eventHub.$on('register-info-window',this.registerInfoWindow);
    this.$on('cluster-ready',this.clusterReady);
    this.$on('cluster-destroyed',this.clusterDestroyed);
    this.markerObj.animation = (typeof this.markerObj.animation  === 'undefined')?null:this.markerObj.animation;
    this.markerObj.attribution = (typeof this.markerObj.attribution  === 'undefined')?null:this.markerObj.attribution;
    this.markerObj.clickable = (typeof this.markerObj.clickable  === 'undefined')?true:this.markerObj.clickable;
    this.markerObj.cursor = (typeof this.markerObj.cursor  === 'undefined')?null:this.markerObj.cursor;
    this.markerObj.draggable = (typeof this.markerObj.draggable  === 'undefined')?false:this.markerObj.draggable;
    this.markerObj.icon = (typeof this.markerObj.icon  === 'undefined')?null:this.markerObj.icon;
    this.markerObj.label = (typeof this.markerObj.label  === 'undefined')?null:this.markerObj.label;
    this.markerObj.opacity = (typeof this.markerObj.opacity  === 'undefined')?1:this.markerObj.opacity;
    this.markerObj.place = (typeof this.markerObj.place  === 'undefined')?null:this.markerObj.place;
    this.markerObj.position = (typeof this.markerObj.position  === 'undefined')?null:this.markerObj.position;
    this.markerObj.shape = (typeof this.markerObj.shape  === 'undefined')?null:this.markerObj.shape;
    this.markerObj.title = (typeof this.markerObj.title  === 'undefined')?null:this.markerObj.title;
    this.markerObj.zIndex = (typeof this.markerObj.zIndex  === 'undefined')?null:this.markerObj.zIndex;
    this.markerObj.visible = (typeof this.markerObj.visible  === 'undefined')?'auto':this.markerObj.visible;
  },

  mounted() {
    if (this.visible === 'auto') {
      this.visible = true;
    }
  },
  beforeDestroy(){
    if (this.visible === 'auto') {
      this.visible = false;
    }
  },
  destroyed() {
    eventHub.$off('register-info-window', this.registerInfoWindow);
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
    if (this.destroyed)
      return;
    /* Send an event to any <cluster> parent */
    //console.log('emit register-marker', this);
    eventHub.$emit('register-marker', this);

    const options = _.clone(this.markerObj);
    options.map = this.$map;
    this.createMarker(options, this.$map);
  },

  methods: {
    createMarker (options, map) {
      // FIXME: @Guillaumne do we need this?
      if (this.destroyed)
        return;

      this.$markerObject = new google.maps.Marker(options);
      propsBinder(this, this.$markerObject, markerProps);
      eventsBinder(this, this.$markerObject, events);

      if (this.$clusterObject) {
        this.$clusterObject.addMarker(this.$markerObject);
      }
    },
    registerInfoWindow(infoWindow) {
      if (this.destroyed || !hasChildInVueComponent(this,infoWindow))
        return;
      infoWindow.$emit('marker-ready', this, this.$map);
    },
    clusterReady(cluster, map) {
      //console.log('treat cluster-ready', this, cluster, map);
      if (this.destroyed)
        return;
      this.$clusterObject = cluster;
    },
    clusterDestroyed(cluster, map) {
      console.log('treat cluster-Destroyed', this, cluster, map);
      this.$clusterObject = null;
    }
  }
});
</script>
