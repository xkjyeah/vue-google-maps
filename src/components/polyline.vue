/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
</template>

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';

const polylineProps = {
  path: {
    type: Array,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean,
  },
  options: {
    type: Object
  }
}

const props = {
  polylineObj:{
    type: Object,
    required: true,
    validator: function (value) {
      return (typeof value.path[0] !== 'undefined');
    }
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  computed:{
    path:{
      get(){
        return this.polylineObj.path;
      },
      set(value){
        this.polylineObj.path = value;
      }
    },
    draggable:{
      get(){
        return this.polylineObj.draggable;
      },
      set(value){
        this.polylineObj.draggable = value;
      }
    },
    editable:{
      get(){
        return this.polylineObj.editable;
      },
      set(value){
        this.polylineObj.editable = value;
      }
    },
    options:{
      get(){
        return this.polylineObj.options;
      },
      set(value){
        this.polylineObj.options = value;
      }
    }
  },
  created(){
    this.polylineObj.path = (typeof this.polylineObj.path === 'undefined')?null:this.polylineObj.path;
    this.polylineObj.draggable = (typeof this.polylineObj.draggable === 'undefined')?false:this.polylineObj.draggable;
    this.polylineObj.editable = (typeof this.polylineObj.editable === 'undefined')?false:this.polylineObj.editable;
    this.polylineObj.options = (typeof this.polylineObj.options === 'undefined')?{}:this.polylineObj.options;
  },
  mounted () {
    if (this.$map && this.$polyLineObject.getMap() === null) {
      this.$polyLineObject.setMap(this.$map);
    }
  },

  destroyed () {
    if (this.$polyLineObject) {
      this.$polyLineObject.setMap(null);
    }
  },
  
  deferredReady() {
    if (this.destroyed)
      return;
    const options = _.clone(this.polylineObj);
    delete options.options;
    _.assign(options, this.options);
    this.$polyLineObject = new google.maps.Polyline(options);

    this.$polyLineObject.setMap(this.$map);

    const localProps = _.clone(polylineProps);
    //we don't want the propBinder to handle this one because it is specific
    delete localProps.path;

    propsBinder(this, this.$polyLineObject, localProps);
    eventBinder(this, this.$polyLineObject, events);

    const eventCancelers = [];

     
    const editHandler = () => {
      this.path = _.map(this.$polyLineObject.getPath().getArray(), (v) => {
        return {
          lat: v.lat(),
          lng: v.lng()
        }
      });
    }

    const setupBind = () => {
      const mvcoPath = this.$polyLineObject.getPath();
      eventCancelers.push(mvcoPath.addListener('insert_at', editHandler));
      eventCancelers.push(mvcoPath.addListener('remove_at', editHandler));
      eventCancelers.push(mvcoPath.addListener('set_at', editHandler));
    }

    this.$watch('path', () => {
      _.each(eventCancelers, (id) => {
        google.maps.event.removeListener(id);
      });
      eventCancelers.length = 0;
      this.$polyLineObject.setPath(this.path);
      setupBind();
    }, {
      deep: true
    });

    setupBind();

    // Display the map
    this.$polyLineObject.setMap(this.$map);
  },

});
</script>

