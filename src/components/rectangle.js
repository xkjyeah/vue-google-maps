import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const rectangleProps = {
    bounds: {
        type: Object,
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
};
const props = {
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
};

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
];

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  render() {
    return '';
  },
  computed:{
    local_bounds:{
      get(){
        return this.bounds;
      },
      set(value){
        this.$emit('bounds-changed', value);
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
  deferredReady() {
    const options = _.clone(this.getPropsValues());
    options.map = this.$map;
    this.createRectangle(options, this.$map);
  },
  methods: {
    createRectangleObject(options){
        return new google.maps.Rectangle(options);
    },
    createRectangle (options, map) {
        this.$rectangleObject = this.createRectangleObject(options);
        propsBinder(this, this.$rectangleObject, props);
        eventBinder(this, this.$rectangleObject, events);
    },
  },
  destroyed() {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null);
    }
  },
}