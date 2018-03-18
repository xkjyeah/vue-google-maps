import clone from 'lodash/clone'
import isFunction from 'lodash/isFunction'
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const props = {
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  radius: {
    type: Number,
    default: 1000,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    twoWay: false
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  render () { return '' },

  deferredReady () {
    const options = clone(this.getPropsValues())
    options.map = this.$map
    delete options.bounds
    this.createCircle(options)
  },

  methods: {
    createCircleObject (options) {
      return new google.maps.Circle(options)
    },
    createCircle (options) {
      this.$circleObject = this.createCircleObject(options)
      // we cant bind bounds because there is no `setBounds` method
      // on the Circle object
      const boundProps = clone(props)
      delete boundProps.bounds
      propsBinder(this, this.$circleObject, boundProps)

      const updateBounds = () => {
        this.$emit('bounds_changed', this.$circleObject.getBounds())
      }
      const radiusChange = () => {
        this.$emit('update:radius', this.$circleObject.radius)
        updateBounds()
      }
      const centerChange = () => {
        this.$emit('update:center',
          (this.center && isFunction(this.center.lat)) ? this.$circleObject.center : {
            lat: this.$circleObject.center.lat(),
            lng: this.$circleObject.center.lng()
          })
        updateBounds()
      }
      this.$on('radius_changed', radiusChange)
      this.$on('center_changed', centerChange)

      eventBinder(this, this.$circleObject, events)
    }
  },
  destroyed () {
    if (this.$circleObject) {
      this.$circleObject.setMap(null)
    }
  },
}
