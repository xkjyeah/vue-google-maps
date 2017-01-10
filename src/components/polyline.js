import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = ["path"]
const excludedProps = ["path","deepWatch"]
const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean,
  },
  options: {
    type: Object
  },
  path: {
    type: Array,
  },
  deepWatch: {
    type: Boolean,
    default: false,
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
  destroyed () {
    if (this.$polylineObject) {
      this.$polylineObject.setMap(null);
    }
  },
  deferredReady() {
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.options);
    this.$polylineObject = this.createPolylineObject(options);
    this.$polylineObject.setMap(this.$map);

    propsBinder(this, this.$polylineObject, generatePropsToBind(props,twoWayProps,excludedProps));
    eventBinder(this, this.$polylineObject, events);

    let clearEvents = () => {}

    let pathChange = (path) => {
      if (path) {
        clearEvents();

        this.$polylineObject.setPath(path);

        const mvcPath = this.$polylineObject.getPath();
        const eventListeners = [];

        const updatePaths = () => {
          this.$emit('path_changed', this.$polylineObject.getPath())
        }

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) =>
            google.maps.event.removeListener(listenerHandle))
        }
      }
    };
    pathChange(this.path);
    this.$watch('path', pathChange, {
      deep: this.deepWatch
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
