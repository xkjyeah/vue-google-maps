import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import eventsBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import MapElementMixin from './mapElementMixin'

const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object,
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
  label: {},
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
    twoWay: true,
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
    default: true,
  },
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
export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

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

  created () {
    this.$on('register-info-window', this.registerInfoWindow)
    this.$on('unregister-info-window', this.unregisterInfoWindow)
  },

  destroyed () {
    if (this.$markerObject) {
      this.$parent.$emit('unregister-marker', {component: this, object: this.$markerObject})
    }
    this.$markerObject.setMap(null)
  },

  deferredReady () {
    const options = mapValues(props, (value, prop) => this[prop])
    options.map = this.$map
    delete options.options
    Object.assign(options, this.options)
    this.createMarker(options)
  },

  methods: {
    createMarkerObject (options) {
      return new google.maps.Marker(options)
    },
    createMarker (options) {
      this.$markerObject = this.createMarkerObject(options)
      propsBinder(this, this.$markerObject, props)

      this.$on('animation_changed', () => {
        this.$emit('update:animation', this.$markerObject.animation)
      })
      this.$on('clickable_changed', () => {
        this.$emit('update:clickable', this.$markerObject.clickable)
      })
      this.$on('cursor_changed', () => {
        this.$emit('update:cursor', this.$markerObject.cursor)
      })
      this.$on('draggable_changed', () => {
        this.$emit('update:draggable', this.$markerObject.draggable)
      })
      this.$on('icon_changed', () => {
        this.$emit('update:icon', this.$markerObject.icon)
      })
      this.$on('position_changed', () => {
        this.$emit('update:position',
          (this.position && isFunction(this.position.lat)) ? this.$markerObject.position : {
            lat: this.$markerObject.position.lat(),
            lng: this.$markerObject.position.lng()
          })
      })
      this.$on('shape_changed', () => {
        this.$emit('update:shape', this.$markerObject.shape)
      })
      this.$on('visible_changed', () => {
        this.$emit('update:visible', this.$markerObject.visible)
      })
      this.$on('zindex_changed', () => {
        this.$emit('update:zIndex', this.$markerObject.zIndex)
      })

      eventsBinder(this, this.$markerObject, events)

      this.$parent.$emit('register-marker', {component: this, object: this.$markerObject})
    },
    registerInfoWindow ({component: instance}) {
      if (!instance) { return }
      instance.$markerObject = this.$markerObject
    },
    unregisterInfoWindow ({component: instance}) {
      if (!instance) { return }
      instance.$markerObject = null
    },

  },
}
