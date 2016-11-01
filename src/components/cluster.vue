/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>

import Q from 'q';
import _ from 'lodash';
import eventHub from '../utils/eventHub';
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
  created(){
    eventHub.$on('register-marker', this.clusterReady);
  },
  deferredReady () {
    if (this.destroyed)
        return;
    const options = _.clone(this.getPropsValues());
    this.$clusterObject = new MarkerClusterer(this.$map, [], options);

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
    eventHub.$off('register-marker', this.clusterReady);
    this.$emit('cluster-destroyed', this.$clusterObject, this.$map);
  },
  methods: {
    clusterReady(element) {
      //console.log('emit cluster-ready', this, element);
      if (this.destroyed)
        return;
      element.$emit('cluster-ready', this.$clusterObject, this.$map);
    }
  }
});
</script>
