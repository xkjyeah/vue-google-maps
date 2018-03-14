import omit from 'lodash/omit'
import clone from 'lodash/clone'
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
    twoWay:true
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

  beforeCreate() {
    this.$markerObject = null
  },

  deferredReady () {
    this.$parent.$emit('register-info-window', this)
    this.createInfoWindow()
  },

  destroyed () {
    this.$parent.$emit('unregister-info-window', this);
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
    createInfoWindowObject(options){
      return new google.maps.InfoWindow(options)
    },
    createInfoWindow(map) {
      // setting options
      const options = clone(this.options)
      options.content = this.$refs.flyaway

      // only set the position if the info window is not bound to a marker
      if (this.$markerComponent === null) {
        options.position = this.position
      }

      this.$infoWindow = this.createInfoWindowObject(options)

      // Binding
      propsBinder(this, this.$infoWindow, omit(props, ['opened']))

      this.$on('position_changed', () => {
        this.$emit('update:position', this.$infoWindow.position)
      })
      this.$on('zindex_changed', () => {
        this.$emit('update:zIndex', this.$infoWindow.zIndex)
      })

      eventsBinder(this, this.$infoWindow, events)

      this.$on('closeclick', () => {
        this.$emit('update:opened', false)
      })

      this.openInfoWindow()
      this.$watch('opened', () => {
        this.openInfoWindow()
      })
    }
  }
}
