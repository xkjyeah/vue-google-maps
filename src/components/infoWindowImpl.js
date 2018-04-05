import omit from 'lodash/omit'
import clone from 'lodash/clone'
import isFunction from 'lodash/isFunction'
import propsBinder from '../utils/propsBinder.js'
import eventsBinder from '../utils/eventsBinder.js'
import MapElementMixin from './mapElementMixin'

const props = {
  options: {
    type: Object,
    required: false,
    default () {
      return {}
    }
  },
  opened: {
    type: Boolean,
    default: true,
    twoWay: true
  },
  position: {
    type: Object,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  }
}

const events = [
  'domready',
  'closeclick',
  'content_changed'
]

export default {
  mixins: [MapElementMixin],
  props: props,

  mounted () {
    const el = this.$refs.flyaway
    el.parentNode.removeChild(el)
  },

  beforeCreate () {
    this.$markerObject = null
  },

  deferredReady () {
    this.createInfoWindow()
  },

  destroyed () {
    this.$parent && this.$parent.$emit('unregister-info-window', {component: this, object: this.$infoWindow})
    if (this.disconnect) {
      this.disconnect()
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null)
    }
  },

  methods: {
    openInfoWindow () {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindow.open(this.$map, this.$markerObject)
        } else {
          this.$infoWindow.open(this.$map)
        }
      } else {
        this.$infoWindow.close()
      }
    },
    createInfoWindowObject (options) {
      return new google.maps.InfoWindow(options)
    },
    createInfoWindow (map) {
      // setting options
      const options = clone(this.options)
      options.content = this.$refs.flyaway

      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.position
      }

      this.$infoWindow = this.createInfoWindowObject(options)

      // Binding
      propsBinder(this, this.$infoWindow, omit(props, ['opened']))

      this.$on('position_changed', () => {
        this.$emit('update:position',
          (!this.position || (this.position && isFunction(this.position.lat))) ? this.$infoWindow.position : {
            lat: this.$infoWindow.position.lat(),
            lng: this.$infoWindow.position.lng()
          })
      })
      this.$on('zindex_changed', () => {
        this.$emit('update:zIndex', this.$infoWindow.zIndex)
      })

      eventsBinder(this, this.$infoWindow, events)

      this.$on('closeclick', () => {
        this.$emit('update:opened', false)
      })

      this.$parent && this.$parent.$emit('register-info-window', {component: this, object: this.$infoWindow})

      this.openInfoWindow()
      this.$watch('opened', () => {
        this.openInfoWindow()
      })
    }
  }
}
