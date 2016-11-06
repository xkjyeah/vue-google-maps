/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
    <div class="vue-map-container">
        <div class="vue-map"></div>
        <slot></slot>
    </div>
</template>

<script>
import Q from 'q';
import _ from 'lodash';
import eventHub from '../utils/eventHub';
import {loaded} from '../manager.js';
import {DeferredReadyMixin} from '../deferredReady.js';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import Vue from 'vue';
import {DeferredReady} from '../deferredReady.js';
import getPropsMixin from '../utils/getPropsValuesMixin.js';
import {getParentTest} from '../utils/getParentTest';

Vue.use(DeferredReady);

const mapsProps = {
  center: {
    twoWay: true,
    type: Object
  },
  zoom: {
    twoWay: true,
    type: Number
  },
  heading: {
    twoWay: true,
    type: Number
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  bounds: {
    twoWay: true,
    type: Object,
  },
  options: {
    twoWay: false,
    type: Object,
  }
};

const props = {
  center: {
    type: Object,
    required: true
  },
  zoom: {
    type: Number,
    default () {return 8;}
  },
  heading: {
    type: Number
  },
  mapTypeId: {
    type: String
  },
  bounds: {
    type: Object,
  },
  options: {
    type: Object,
    default () {return {}}
  }
};

const events = [
  'click',
  'dblclick',
  'rightclick',
  'mousemove',
  'mouseout',
  'mouseover',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'resize',
  'tilesloaded',
  'bounds_changed'
];

const callableMethods = [
  'panBy',
  'panTo',
  'panToBounds',
  'fitBounds'
];

/**
  Implementation note: this signal should only be
  called after the map has been initialized

**/
const registerChild = function (child, type) {
  //console.log('registerChild', this, child);
  if (!this.mapObject)
    throw new Error("Map not initialized");
    child.$emit('map-ready', this.mapObject);
  // Simpler: child.$map = mapObject but not so
  // modular
}

const methods = {registerChild:registerChild};

const eventListeners = {
  'g-bounds_changed' () {
    this.local_bounds=this.mapObject.getBounds();
  },
  'g-fitBounds' (bounds) {
    if (this.mapObject && bounds) {
      this.mapObject.fitBounds
    }
  },
  'g-resize-map' () {
    var center = this.mapObject.getCenter();
    google.maps.event.trigger(this.mapObject, 'resize');
    this.mapObject.setCenter(center);
  }
}

_.each(callableMethods, function (methodName) {
   const applier= function() {
    if(this.mapObject) {
      this.mapObject[methodName].apply(this.mapObject, arguments);
    }
  }
  eventListeners['g-' + methodName] = applier;
  methods[methodName] = applier;
});
const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.mapObj[field];
};
const setLocalField = function (self, field, value){
  self.mapObj[field] = value;
  self.$emit(field+'_changed', value);
  self.$nextTick(function (){
    self.mapObj[field] = getLocalField(self, field);
  });
};
export default {
  mixins: [getPropsMixin, DeferredReadyMixin],
  props: props,
  //replace:false, // necessary for css styles
  data(){
    return {
      mapObj: {
        center: {},
        zoom: null,
        heading: null,
        mapTypeId: null,
        bounds: {},
        options: {}
      }
    };
  },
  computed:{
    local_center:{
      get(){
        return getLocalField(this, 'center');
      },
      set(value){
        setLocalField(this, 'center', value);
      }
    },
    local_zoom:{
      get(){
        return getLocalField(this, 'zoom');
      },
      set(value){
        setLocalField(this, 'zoom', value);
      }
    },
    local_heading:{
      get(){
        return getLocalField(this, 'heading');
      },
      set(value){
        setLocalField(this, 'heading', value);
      }
    },
    local_mapTypeId:{
      get(){
        return getLocalField(this, 'mapTypeId');
      },
      set(value){
        setLocalField(this, 'mapTypeId', value);
      }
    },
    local_bounds:{
      get(){
        return getLocalField(this, 'bounds');
      },
      set(value){
        setLocalField(this, 'bounds', value);
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
  beforeCreate(){
    this._isMap = true;
  },
  created() {
    //console.log('created Map', this);
    this.$on('register-component', this.registerChild);
    var self = this;
    _.forEach(eventListeners, function(event, index){
      self.$on(index, event);
    });
    this.mapCreatedDefered = new Q.defer();
    this.mapCreated = this.mapCreatedDefered.promise;

    this.mapObj.center = this.center;
    this.mapObj.zoom = this.zoom;
    this.mapObj.heading = this.heading;
    this.mapObj.mapTypeId = this.mapTypeId;
    this.mapObj.bounds = this.bounds;
    this.mapObj.options = this.options;
  },
  destroyed(){
    //console.log('destroy Map', this);
    var self = this;
    _.forEach(eventListeners, function(event, index){
      self.$off(index, event);
    });
    this.$off('register-component', this.registerChild);
  },
  deferredReady() {
    return loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$el.getElementsByClassName('vue-map')[0];

      // creating the map
      const copiedData = _.clone(this.getPropsValues());
      delete copiedData.options;
      const options = _.clone(this.options);
      _.assign(options, copiedData);
      this.mapObject = new google.maps.Map(element, options);

      // we con't want to bind props because it's a kind of "computed" property
      const boundProps = _.clone(mapsProps);
      delete boundProps.bounds;
      //binding properties (two and one way)
      propsBinder(this, this.mapObject, boundProps);

      //binding events
      eventsBinder(this, this.mapObject, events);

      // update the bounds
      this.$emit('g-bounds_changed');

      // wait before google maps has loaded the map to avoid bug with info windows
      this.$once('g-bounds_changed', () => {
        // The map is now created
        this.mapCreatedDefered.resolve(this.mapObject);
      });
    }, (error) => {
      throw error;
    });
  },
  methods: methods
};
</script>

<style lang="less">

    .full() {
        width: 100%;
        height: 100%;
    }

    .vue-map-container {
        .full();
        .vue-map {
            .full();
        }
    }

</style>
