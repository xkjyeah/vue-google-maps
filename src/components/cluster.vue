/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js';
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
var MarkerClusterer = require('marker-clusterer-plus');

const props = {
  maxZoom: {
    type: Number
  },
  calculor: {
    type: Function
  },
  gridSize: {
    type: Number
  },
  styles: {
    type: Array
  }
};

export default MapComponent.extend({
  mixins: [getPropsValuesMixin],
  props: props,
  computed:{
    local_maxZoom(){
      return this.maxZoom;
    },
    local_calculor(){
      return this.calculor;
    },
    local_gridSize(){
      return this.gridSize;
    },
    local_styles(){
      return this.styles;
    },
  },
  created(){
    this._acceptMarker = true;
    this.$on('register-marker', this.clusterReady);
  },
  deferredReady () {
    const options = _.clone(this.getPropsValues());
    this.$clusterObject = this.createMarkerClusterObject(this.$map, [], options);

    propsBinder(this, this.$clusterObject, props, {
      afterModelChanged: (a, v) => {
        const oldMarkers = this.$clusterObject.getMarkers();
        this.$clusterObject.clearMarkers();
        this.$clusterObject.addMarkers(oldMarkers);
      }
    });
  },
  destroyed() {
    this.$clusterObject.clearMarkers();
    this.$off('register-marker', this.clusterReady);
    this.$emit('cluster-destroyed', this.$clusterObject, this.$map);
  },
  methods: {
    createMarkerClusterObject(map, opt_markers, opt_options){
        return new MarkerClusterer(map, opt_markers, opt_options)
    },
    clusterReady(element) {
      //console.log('emit cluster-ready', this, element);
      element.$emit('cluster-ready', this.$clusterObject, this.$map);
    }
  }
});
</script>
