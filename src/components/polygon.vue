/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
</template>

<script>

import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';

const polygonProps = {
  path: {
    type: Array,
    twoWay: true
  },
  paths: {
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
  },
}

const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean,
  },
  options: {
    type: Object
  },
  path: {
    type: Array
  },
  paths: {
    type: Array
  },
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
const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.polygonObj[field];
};
const setLocalField = function (self, field, value){
  self.polygonObj[field] = value;
  self.$emit(field+'_changed', value);
  self.$nextTick(function (){
    self.polygonObj[field] = getLocalField(self, field);
  });
};
export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  data(){
    return {
      polygonObj:{
        path:[],
        paths:[[]],
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
    local_paths:{
        get(){
            return getLocalField(this, 'paths');
        },
        set(value){
            setLocalField(this, 'paths', value);
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
    this.polygonObj.path = this.path;
    this.polygonObj.paths = this.paths;
    this.polygonObj.draggable = this.draggable;
    this.polygonObj.editable = this.editable;
    this.polygonObj.options = this.options;
  },
  mounted () {
    if (this.$map && this.$polygonObject.getMap() === null) {
      this.$polygonObject.setMap(this.$map);
    }
  },

  deferredReady() {
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.local_options);
    if (!options.path) {
      delete options.path;
    }
    if (!options.paths) {
      delete options.paths;
    }
    this.$polygonObject = this.createPolygonObject(options);

    const localProps = _.clone(polygonProps);
    //we don't want the propBinder to handle this one because it is specific
    delete localProps.path;
    delete localProps.paths;

    propsBinder(this, this.$polygonObject, localProps);
    eventBinder(this, this.$polygonObject, events);

    const eventCancelers = [];

    const convertToLatLng = (arr) => {
      return _.map((arr), (v) => {
        return {
          lat: v.lat(),
          lng: v.lng()
        }
      });
    }

    let stable = 0;

    const editHandler = () => {
      stable -= 2;
      if (stable < 0) {
        this.local_path = convertToLatLng(this.$polygonObject.getPath().getArray());
        this.local_paths = _.map(this.$polygonObject.getPaths().getArray(), (pArray) => {
          return convertToLatLng(pArray.getArray());
        });
      }
    }


    const setupBind = () => {
      const mvcoPaths = this.$polygonObject.getPaths();
      eventCancelers.push(mvcoPaths.addListener('insert_at', editHandler));
      eventCancelers.push(mvcoPaths.addListener('remove_at', editHandler));
      eventCancelers.push(mvcoPaths.addListener('set_at', editHandler));
      _.each(mvcoPaths.getArray(), (mvcoPath) => {
        eventCancelers.push(mvcoPath.addListener('insert_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('remove_at', editHandler));
        eventCancelers.push(mvcoPath.addListener('set_at', editHandler));
      });
    }

    const setPath = (paths) => {
      // TODO Optimize this to avoid resetting events
      _.each(eventCancelers, (id) => {
        google.maps.event.removeListener(id);
      });
      eventCancelers.length = 0;
      this.$polygonObject.setPaths(paths);
      setupBind();
    }

    this.$watch('local_paths', () => {
      stable++;
      if (stable > -1) {
        setPath(this.local_paths);
      }
    }, {
      deep: true
    });

    this.$watch('local_path', () => {
      stable++;
      if (stable > -1) {
        setPath([this.local_path]);
      }
    }, {
      deep: true
    });

    setupBind();

    // Display the map
    this.$polygonObject.setMap(this.$map);
  },

  destroyed () {
    if (this.$polygonObject) {
      this.$polygonObject.setMap(null);
    }
  },
  methods:{
    createPolygonObject(options){
        return new google.maps.Polygon(options);
    }
  }
});
</script>

