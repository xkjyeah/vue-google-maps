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
  polygonObj:{
    type: Object,
    required: true,
    validator: function (value) {
      return (
        (typeof value.paths[0] !== 'undefined' && typeof value.paths[0][0] !== 'undefined')
        ||(typeof value.path[0] !== 'undefined')
      );
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
        return this.polygonObj.path;
      },
      set(value){
        this.polygonObj.path = value;
      }
    },
    paths:{
      get(){
        return this.polygonObj.paths;
      },
      set(value){
        this.polygonObj.paths = value;
      }
    },
    draggable:{
      get(){
        return this.polygonObj.draggable;
      },
      set(value){
        this.polygonObj.draggable = value;
      }
    },
    editable:{
      get(){
        return this.polygonObj.editable;
      },
      set(value){
        this.polygonObj.editable = value;
      }
    },
    options:{
      get(){
        return this.polygonObj.options;
      },
      set(value){
        this.polygonObj.options = value;
      }
    }
  },
  created(){
    this.destroyed = false;
    this.polygonObj.path = (typeof this.polygonObj.path === 'undefined')?null:this.polygonObj.path;
    this.polygonObj.paths = (typeof this.polygonObj.paths === 'undefined')?null:this.polygonObj.paths;
    this.polygonObj.draggable = (typeof this.polygonObj.draggable === 'undefined')?false:this.polygonObj.draggable;
    this.polygonObj.editable = (typeof this.polygonObj.editable === 'undefined')?false:this.polygonObj.editable;
    this.polygonObj.options = (typeof this.polygonObj.options === 'undefined')?{}:this.polygonObj.options;
  },
  mounted () {
    if (this.$map && this.$polygonObject.getMap() === null) {
      this.$polygonObject.setMap(this.$map);
    }
  },

  deferredReady() {
    if (this.destroyed) return;
    const options = _.clone(this.polygonObj);
    delete options.options;
    _.assign(options, this.options);
    if (!options.path) {
      delete options.path;
    }
    if (!options.paths) {
      delete options.paths;
    }
    this.$polygonObject = new google.maps.Polygon(options);

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
        this.path = convertToLatLng(this.$polygonObject.getPath().getArray());
        this.paths = _.map(this.$polygonObject.getPaths().getArray(), (pArray) => {
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

    this.$watch('paths', () => {
      stable++;
      if (stable > -1) {
        setPath(this.paths);
      }
    }, {
      deep: true
    });

    this.$watch('path', () => {
      stable++;
      if (stable > -1) {
        setPath([this.path]);
      }
    }, {
      deep: true
    });

    setupBind();

    // Display the map
    this.$polygonObject.setMap(this.$map);
  },

  destroyed () {
    this.destroyed = true;
    if (this.$polygonObject) {
      this.$polygonObject.setMap(null);
    }
  },
});
</script>

