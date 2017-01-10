import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = ["center","radius"]
const excludedProps = ["bounds"]
const props = {
  center: {
    type: Object,
    required: true
  },
  radius: {
    type: Number,
    default: 1000,
  },
  bounds: {
    type: Object
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
    type: Object
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
  render(h) {
    return h( // So that infowindows can have a marker parent
      'div',
      this.$slots.default
    )
  },
  props: props,
  created(){
    this.$acceptInfoWindow = true;
    this.$on('register-info-window', this.registerInfoWindow);
    this.$on('unregister-info-window', this.unregisterInfoWindow);
  },
  deferredReady() {
    const options = _.clone(this.getPropsValues());
    options.map = this.$map;
    delete options.bounds;
    this.createCircle(options, this.$map);
  },

  methods: {
    createCircleObject(options){
      return new google.maps.Circle(options)
    },
    createCircle (options, map) {
      this.$circleObject = this.createCircleObject(options);

      propsBinder(this, this.$circleObject, generatePropsToBind(props,twoWayProps,excludedProps));
      eventBinder(this, this.$circleObject, events);

      const updateBounds = () => {
        this.$emit('bounds_changed', this.$circleObject.getBounds())
      };
      this.$on('radius_changed', updateBounds);
      this.$on('center_changed', updateBounds);
      updateBounds();
    },
    registerInfoWindow(infoWindow) {
      this.infoWindowClickEvent = () => {
        infoWindow.local_opened = !infoWindow.local_opened;
      };
      this.$on('click', this.infoWindowClickEvent);
      this.infoWindowCenterChangeWatch = this.$watch('center', (newValue) => {
        infoWindow.local_position = newValue
      }, {deep: true});
    },
    unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('click', this.infoWindowClickEvent);
      }
      this.infoWindowClickEvent = null;
      if (this.infoWindowCenterChangeWatch) {
        this.infoWindowCenterChangeWatch();
      }
      this.infoWindowCenterChangeWatch = null;
    }
  },
  destroyed () {
    if (this.$circleObject) {
      this.$circleObject.setMap(null);
    }
  },
}