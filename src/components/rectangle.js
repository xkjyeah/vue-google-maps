import clone from 'lodash/clone'
import isFunction from 'lodash/isFunction'
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
    createRectangleObject (options) {
      return new google.maps.Rectangle(options)
    },
    createRectangle (options) {
      this.$rectangleObject = this.createRectangleObject(options)
      propsBinder(this, this.$rectangleObject, props)

      this.bounds && this.$rectangleObject.setBounds(this.bounds)

      this.$on('bounds_changed', () => {
        this.$emit('update:bounds',
          (!this.bounds || (this.bounds && isFunction(this.bounds.getNorthEast))) ? this.$rectangleObject.bounds : {
            north: this.$rectangleObject.bounds.getNorthEast().lat(),
            east: this.$rectangleObject.bounds.getNorthEast().lng(),
            south: this.$rectangleObject.bounds.getSouthWest().lat(),
            west: this.$rectangleObject.bounds.getSouthWest().lng(),
          })
      })

      eventBinder(this, this.$rectangleObject, events)
    }
  },

  destroyed () {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null)
    }
  },
}
