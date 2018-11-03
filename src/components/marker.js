import mapElementFactory from './mapElementFactory.js'

const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
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
    twoWay: true,
    default: true
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
export default mapElementFactory({
  mappedProps: props,
  events,
  name: 'marker',
  ctr: () => google.maps.Marker,

  inject: {
    '$clusterPromise': {
      default: null
    }
  },

  render (h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
        'div',
        this.$slots.default
      )
    }
  },

  destroyed () {
    if (!this.$markerObject) { return }

    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      this.$clusterObject.removeMarker(this.$markerObject, true)
    } else {
      this.$markerObject.setMap(null)
    }
  },

  beforeCreate (options) {
    if (this.$clusterPromise) {
      options.map = null
    }

    return this.$clusterPromise
  },

  afterCreate (inst) {
    if (this.$clusterPromise) {
      this.$clusterPromise.then((co) => {
        co.addMarker(inst)
        this.$clusterObject = co
      })
    }
  }
})
