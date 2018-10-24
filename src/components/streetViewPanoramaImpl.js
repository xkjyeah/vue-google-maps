import bindEvents from '../utils/bindEvents.js'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import mountableMixin from '../utils/mountableMixin.js'

import TwoWayBindingWrapper from '../utils/TwoWayBindingWrapper.js'
import WatchPrimitiveProperties from '../utils/WatchPrimitiveProperties.js'
import { mappedPropsToVueProps } from './mapElementFactory.js'

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
    noBind: true,
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

export default {
  mixins: [mountableMixin],
  props: mappedPropsToVueProps(props),
  replace: false, // necessary for css styles
  methods: {
    resize () {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize')
      }
    },
  },

  provide () {
    const promise = new Promise((resolve, reject) => {
      this.$panoPromiseDeferred = {resolve, reject}
    })
    return {
      '$panoPromise': promise,
      '$mapPromise': promise, // so that we can use it with markers
    }
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

  mounted () {
    return this.$gmapApiPromiseLazy().then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-street-view-pano']

      // creating the map
      const options = {
        ...this.options,
        ...getPropsValues(this, props),
      }
      delete options.options

      this.$panoObject = new google.maps.StreetViewPanorama(element, options)

      // binding properties (two and one way)
      bindProps(this, this.$panoObject, props)
      // binding events
      bindEvents(this, this.$panoObject, events)

      // manually trigger position
      TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        // Panos take a while to load
        increment()

        this.$panoObject.addListener('position_changed', () => {
          if (this.$listeners && this.$listeners.position_changed && shouldUpdate()) {
            this.$emit('position_changed', this.$panoObject.getPosition())
          }
          decrement()
        })

        const updateCenter = () => {
          increment()
          this.$panoObject.setPosition(this.finalLatLng)
        }

        WatchPrimitiveProperties(
          this,
          ['finalLat', 'finalLng'],
          updateCenter
        )
      })

      this.$panoPromiseDeferred.resolve(this.$panoObject)

      return this.$panoPromise
    })
    .catch((error) => {
      throw error
    })
  },
}
