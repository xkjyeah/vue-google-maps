import clone from 'lodash/clone'

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const props = {
  bounds: {
    type: Object,
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

  render () {
    return ''
  },

  deferredReady () {
    const options = clone(this.getPropsValues())
    options.map = this.$map
    this.createRectangle(options)
  },

  methods: {
    createRectangle (options) {
      this.$rectangleObject = new google.maps.Rectangle(options)
      propsBinder(this, this.$rectangleObject, props)

      this.$on('bounds_changed', () => {
        this.$emit('update:bounds', this.$rectangleObject.bounds)
      })

      eventBinder(this, this.$rectangleObject, events)
    },

  },

  destroyed () {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null)
    }
  },
}
