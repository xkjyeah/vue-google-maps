import _ from 'lodash';
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const circleProps = {
  center: {
    type: Object,
    twoWay: true
  },
  radius: {
    type: Number,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  }
}

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
  computed: {
    local_center: {
      get(){
        return this.center;
      },
      set(value){
        this.$emit('center_changed', value);
      }
    },
    local_radius: {
      get(){
        return this.radius;
      },
      set(value){
        this.$emit('radius_changed', value);
      }
    },
    local_bounds: {
      get(){
        return this.bounds;
      },
      set(value){
        this.$emit('bounds_changed', value);
      }
    },
    local_draggable(){
      return this.draggable;
    },
    local_editable(){
      return this.editable;
    },
    local_options(){
      return this.options;
    }
  },
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

      propsBinder(this, this.$circleObject, circleProps);
      eventBinder(this, this.$circleObject, events);

      const updateBounds = () => {
        this.local_bounds = this.$circleObject.getBounds();
      };

      this.$watch('local_radius', updateBounds);
      // because center is an object and we need to be warned even if only the lat or lng change. not the whole reference
      this.$watch('local_center', updateBounds, {deep: true});
      updateBounds();
    },
    registerInfoWindow(infoWindow) {
      this.infoWindowClickEvent = () => {
        infoWindow.local_opened = !infoWindow.local_opened;
      };
      this.$on('g-click', this.infoWindowClickEvent);
      this.infoWindowCenterChangeWatch = this.$watch('local_center', (newValue) => {
        infoWindow.local_position = newValue
      }, {deep: true});
    },
    unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('g-click', this.infoWindowClickEvent);
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