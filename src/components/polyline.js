import _ from 'lodash';
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const polylineProps = {
  path: {
    type: Array,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean,
  },
  deepWatch: {
    type: Boolean,
  },
  options: {
    type: Object
  }
}

const props = {
  path: {
    type: Array
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  deepWatch: {
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
  props: props,
  render() { return '' },
  computed:{
    local_path:{
      get(){
        return this.path;
      },
      set(value){
        this.$emit('path-changed', value);
      }
    },
    local_draggable(){
      return this.draggable;
    },
    local_editable(){
      return this.editable;
    },
    local_deepWatch(){
      return this.deepWatch;
    },
    local_options(){
      return this.options;
    }
  },
  destroyed () {
    if (this.$polylineObject) {
      this.$polylineObject.setMap(null);
    }
  },
  deferredReady() {
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.local_options);
    this.$polylineObject = this.createPolylineObject(options);
    this.$polylineObject.setMap(this.$map);

    propsBinder(this, this.$polylineObject, _.omit(polylineProps, ['deepWatch', 'path']));
    eventBinder(this, this.$polylineObject, events);

    var clearEvents = () => {}

    this.$watch('local_path', (path) => {
      if (path) {
        clearEvents();

        this.$polylineObject.setPath(path);

        const mvcPath = this.$polylineObject.getPath();
        const eventListeners = [];

        const updatePaths = () => {
          this.local_path = _.map(this.$polylineObject.getPath().getArray(), (v) => {
            return {
              lat: v.lat(),
              lng: v.lng()
            }
          });
        };

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) =>
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.local_deepWatch
    });

    // Display the map
    this.$polylineObject.setMap(this.$map);
  },
  methods:{
    createPolylineObject(options){
      return new google.maps.Polyline(options);
    }
  }
}

