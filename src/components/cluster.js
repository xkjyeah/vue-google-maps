/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

import _ from 'lodash';
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import MarkerClusterer from 'marker-clusterer-plus'

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

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,
  render(h) {
    // <div><slot></slot></div>
    return h(
      'div',
      this.$slots.default
    )
  },
  created(){
    this.$acceptMarker = true;
    this.$on('register-marker', this.addMarker);
    this.$on('unregister-marker', this.removeMarker);
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
  },
  methods: {
    createMarkerClusterObject(map, opt_markers, opt_options){
      if (typeof MarkerClusterer === 'undefined') {
        let errorMessage = "MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js"
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
      return new MarkerClusterer(map, opt_markers, opt_options)
    },
    addMarker(element, marker) {
      this.$clusterObject.addMarker(marker);
    },
    removeMarker(element, marker) {
      this.$clusterObject.removeMarker(marker);
    }
  }
}