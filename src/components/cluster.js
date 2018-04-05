/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
 * @class Cluster
 * @prop $clusterObject -- Exposes the marker clusterer to
 descendent Marker classes. Override this if you area
 extending the class
 **/

import clone from 'lodash/clone'
import eventsBinder from '../utils/eventsBinder.js'
import isObject from 'lodash/isObject'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import MarkerClusterer from 'marker-clusterer-plus'

const props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
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
]

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  render (h) {
    // <div><slot></slot></div>
    return h(
      'div',
      this.$slots.default
    )
  },

  created () {
    this.$on('register-marker', this.registerMarker)
    this.$on('unregister-marker', this.unregisterMarker)
  },

  deferredReady () {
    const options = clone(this.getPropsValues())
    this.$clusterObject = this.createMarkerClusterObject(this.$map, [], options)

    propsBinder(this, this.$clusterObject, props, {
      afterModelChanged: (a, v) => { // eslint-disable-line no-unused-vars
        const oldMarkers = this.$clusterObject.getMarkers()
        this.$clusterObject.clearMarkers()
        this.$clusterObject.addMarkers(oldMarkers)
      }
    })
    eventsBinder(this, this.$clusterObject, events)
  },

  beforeDestroy () {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(marker => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null
      }
    })
    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers()
    }
  },
  methods: {
    createMarkerClusterObject (map, optMarkers, optOptions) {
      if (typeof MarkerClusterer === 'undefined') {
        let errorMessage = 'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js'
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
      return new MarkerClusterer(map, optMarkers, optOptions)
    },
    repaint () {
      this.$clusterObject.repaint()
    },
    registerMarker ({object: marker}) {
      if (!this.$clusterObject || !isObject(marker)) { return }
      this.$clusterObject.addMarker(marker)
      marker.addListener('position_changed', this.repaint)
    },
    unregisterMarker ({object: marker}) {
      if (!this.$clusterObject || !isObject(marker)) { return }
      this.$clusterObject.removeMarker(marker)
    }
  }
}
