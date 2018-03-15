import omit from 'lodash/omit'

import { loaded } from '../manager.js'
import { DeferredReadyMixin } from '../utils/deferredReady.js'
import eventsBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import getPropsMixin from '../utils/getPropsValuesMixin.js'
import mountableMixin from '../utils/mountableMixin.js'

import TwoWayBindingWrapper from '../utils/TwoWayBindingWrapper.js'

const props = {
  zoom: {
    twoWay: true,
    type: Number
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading']
  },
  position: {
    twoWay: true,
    type: Object,
  },
  pano: {
    twoWay: true,
    type: String
  },
  motionTracking: {
    twoWay: false,
    type: Boolean
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true,
  },
  options: {
    twoWay: false,
    type: Object,
    default () { return {} }
  }
}

const events = [
  'closeclick',
  'status_changed',
]

// Other convenience methods exposed by Vue Google Maps
const customMethods = {
  resize () {
    if (this.$panoObject) {
      google.maps.event.trigger(this.$panoObject, 'resize')
    }
  },
}

// Methods is a combination of customMethods and linkedMethods
const methods = Object.assign({}, customMethods)

export default {
  mixins: [getPropsMixin, DeferredReadyMixin, mountableMixin],
  props: props,
  replace: false, // necessary for css styles
  methods,

  created () {
    this.$panoCreated = new Promise((resolve, reject) => {
      this.$panoCreatedDeferred = {resolve, reject}
    })

    const updateCenter = () => {
      if (!this.panoObject) return

      this.$panoObject.setPosition({
        lat: this.finalLat,
        lng: this.finalLng,
      })
    }
    this.$watch('finalLat', updateCenter)
    this.$watch('finalLng', updateCenter)
  },

  computed: {
    finalLat () {
      return this.position &&
      (typeof this.position.lat === 'function') ? this.position.lat() : this.position.lat
    },
    finalLng () {
      return this.position &&
      (typeof this.position.lng === 'function') ? this.position.lng() : this.position.lng
    },
    finalLatLng () {
      return {
        lat: this.finalLat,
        lng: this.finalLng,
      }
    }
  },

  watch: {
    zoom (zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(zoom)
      }
    }
  },

  deferredReady () {
    return loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-street-view-pano']

      // creating the map
      const options = Object.assign({},
        this.options,
        omit(this.getPropsValues(), ['options'])
      )

      this.$panoObject = new google.maps.StreetViewPanorama(element, options)

      // binding properties (two and one way)
      propsBinder(this, this.$panoObject,
        omit(props, ['position']))

      this.$on('pano_changed', () => {
        this.$emit('update:pano', this.$panoObject.pano)
      })
      this.$on('pov_changed', () => {
        this.$emit('update:pov', this.$panoObject.pov)
      })
      this.$on('visible_changed', () => {
        this.$emit('update:visible', this.$panoObject.visible)
      })
      this.$on('zoom_changed', () => {
        this.$emit('update:zoom', this.$panoObject.zoom)
      })

      // manually trigger position
      TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        // Panos take a while to load
        increment()

        this.$panoObject.addListener('position_changed', () => {
          if (shouldUpdate()) {
            this.$emit('position_changed', this.$panoObject.getPosition())
            this.$emit('update:position',
              (this.position && isFunction(this.position.lat)) ? this.$panoObject.getPosition() : {
                lat: this.$panoObject.getPosition().lat(),
                lng: this.$panoObject.getPosition().lng()
              })
          }
          decrement()
        })

        this.$watch('finalLatLng', () => {
          increment()
          this.$panoObject.setPosition(this.finalLatLng)
        })
      })

      // binding events
      eventsBinder(this, this.$panoObject, events)

      this.$panoCreatedDeferred.resolve(this.$panoObject)

      return this.$panoCreated
    })
      .catch((error) => {
        throw error
      })
  },
}
