import omit from 'lodash/omit'
import clone from 'lodash/clone'

import { loaded } from '../manager.js'
import { DeferredReadyMixin } from '../utils/deferredReady.js'
import eventsBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import getPropsMixin from '../utils/getPropsValuesMixin.js'
import mountableMixin from '../utils/mountableMixin.js'

import TwoWayBindingWrapper from '../utils/TwoWayBindingWrapper.js'

const props = {
  center: {
    required: true,
    twoWay: true,
    type: Object
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number
  },
  heading: {
    type: Number,
    twoWay: true,
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  bounds: {
    twoWay: true,
    type: Object,
  },
  tilt: {
    twoWay: true,
    type: Number,
  },
  options: {
    type: Object,
    default () { return {} }
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'mousemove',
  'mouseout',
  'mouseover',
  'resize',
  'rightclick',
  'tilesloaded',
]

// Plain Google Maps methods exposed here for convenience
const linkedMethods = [
  'panBy',
  'panTo',
  'panToBounds',
  'fitBounds'
].reduce((all, methodName) => {
  all[methodName] = function () {
    if (this.$mapObject) { this.$mapObject[methodName].apply(this.$mapObject, arguments) }
  }
  return all
}, {})

// Other convenience methods exposed by Vue Google Maps
const customMethods = {
  resize () {
    if (this.$mapObject) {
      google.maps.event.trigger(this.$mapObject, 'resize')
    }
  },
  resizePreserveCenter () {
    if (!this.$mapObject) { return }

    const oldCenter = this.$mapObject.getCenter()
    google.maps.event.trigger(this.$mapObject, 'resize')
    this.$mapObject.setCenter(oldCenter)
  },

  /// Override mountableMixin::_resizeCallback
  /// because resizePreserveCenter is usually the
  /// expected behaviour
  _resizeCallback () {
    this.resizePreserveCenter()
  }
}

// Methods is a combination of customMethods and linkedMethods
const methods = Object.assign({}, customMethods, linkedMethods)

export default {
  mixins: [getPropsMixin, DeferredReadyMixin, mountableMixin],
  props: props,
  replace: false, // necessary for css styles

  created () {
    this.$mapCreated = new Promise((resolve, reject) => {
      this.$mapCreatedDeferred = { resolve, reject }
    })
  },

  computed: {
    finalLat () {
      return this.center &&
        (typeof this.center.lat === 'function') ? this.center.lat() : this.center.lat
    },
    finalLng () {
      return this.center &&
        (typeof this.center.lng === 'function') ? this.center.lng() : this.center.lng
    },
    finalLatLng () {
      return {lat: this.finalLat, lng: this.finalLng}
    }
  },

  watch: {
    zoom (zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(zoom)
      }
    }
  },

  deferredReady () {
    return loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-map']

      // creating the map
      const copiedData = clone(this.getPropsValues())
      delete copiedData.options
      const options = clone(this.options)
      Object.assign(options, copiedData)
      this.$mapObject = new google.maps.Map(element, options)

      // binding properties (two and one way)
      propsBinder(this, this.$mapObject, omit(props, ['center', 'zoom', 'bounds']))

      // manually trigger center and zoom
      TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        this.$mapObject.addListener('center_changed', () => {
          if (shouldUpdate()) {
            this.$emit('center_changed', this.$mapObject.getCenter())
          }
          decrement()
        })

        const updateCenter = () => {
          increment()
          this.$mapObject.setCenter(this.finalLatLng)
        }
        this.$watch('finalLatLng', updateCenter)
      })
      this.$mapObject.addListener('zoom_changed', () => {
        this.$emit('zoom_changed', this.$mapObject.getZoom())
      })
      this.$mapObject.addListener('bounds_changed', () => {
        this.$emit('bounds_changed', this.$mapObject.getBounds())
      })

      // binding events
      eventsBinder(this, this.$mapObject, events)

      this.$mapCreatedDeferred.resolve(this.$mapObject)

      return this.$mapCreated
    })
      .catch((error) => {
        throw error
      })
  },
  methods: methods
}
