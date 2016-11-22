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
  path: {
    type: Array
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
];
const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.polylineObj[field];
};
const setLocalField = function (self, field, value){
  self.polylineObj[field] = value;
  self.$emit(field+'_changed', value);
  self.$nextTick(function (){
    self.polylineObj[field] = getLocalField(self, field);
  });
};
export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  data(){
    return {
      polylineObj:{
        path:[],
        draggable:null,
        editable:null,
        options:{},
      }
    };
  },
  computed:{
    local_path:{
        get(){
            return getLocalField(this, 'path');
        },
        set(value){
            setLocalField(this, 'path', value);
        }
    },
    local_draggable:{
        get(){
            return getLocalField(this, 'draggable');
        },
        set(value){
            setLocalField(this, 'draggable', value);
        }
    },
    local_editable:{
        get(){
            return getLocalField(this, 'editable');
        },
        set(value){
            setLocalField(this, 'editable', value);
        }
    },
    local_options:{
        get(){
            return getLocalField(this, 'options');
        },
        set(value){
            setLocalField(this, 'options', value);
        }
    }
  },
  created(){
    this.polylineObj.path = this.path;
    this.polylineObj.draggable = this.draggable;
    this.polylineObj.editable = this.editable;
    this.polylineObj.options = this.options;
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
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.local_options);
    this.$polyLineObject = this.createPolylineObject(options);

    this.$polyLineObject.setMap(this.$map);

    const localProps = _.clone(polylineProps);
    //we don't want the propBinder to handle this one because it is specific
    delete localProps.path;

    propsBinder(this, this.$polyLineObject, localProps);
    eventBinder(this, this.$polyLineObject, events);

    const eventCancelers = [];

     
    const editHandler = () => {
      this.local_path = _.map(this.$polyLineObject.getPath().getArray(), (v) => {
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

    this.$watch('local_path', () => {
      _.each(eventCancelers, (id) => {
        google.maps.event.removeListener(id);
      });
      eventCancelers.length = 0;
      this.$polyLineObject.setPath(this.local_path);
      setupBind();
    }, {
      deep: true
    });

    setupBind();

    // Display the map
    this.$polyLineObject.setMap(this.$map);
  },
  methods:{
    createPolylineObject(options){
      return new google.maps.Polyline(options);
    }
  }
});
</script>

