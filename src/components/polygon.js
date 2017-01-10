import _ from 'lodash';

import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import generatePropsToBind from "../utils/generatePropsToBind";

const twoWayProps = ["path","paths"];
const excludedProps = ["path","paths","deepWatch"];
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
    type: Array
  },
  paths: {
    type: Array
  },
  deepWatch: {
    type: Boolean,
    default: false
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

  render() { return '' },

  destroyed () {
    if (this.$polygonObject) {
      this.$polygonObject.setMap(null);
    }
  },

  deferredReady() {
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.options);
    if (!options.path) {
      delete options.path;
    }
    if (!options.paths) {
      delete options.paths;
    }
    this.$polygonObject = this.createPolygonObject(options);

    propsBinder(this, this.$polygonObject, generatePropsToBind(props,twoWayProps,excludedProps));
    eventBinder(this, this.$polygonObject, events);

    let clearEvents = () => {};

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    let pathsChange = (paths) => {
      if (paths) {
        clearEvents();
        if (typeof paths[0][0] == 'undefined') {
          this.$polygonObject.setPaths([paths]);
        }else{
          this.$polygonObject.setPaths(paths);
        }

        const updatePaths = () => {
          this.$emit('paths_changed', this.$polygonObject.getPaths())
        };
        const eventListeners = [];

        const mvcArray = this.$polygonObject.getPaths();
        for (let mvcPath of mvcArray.getArray()) {
          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])
        }
        eventListeners.push([mvcArray, mvcArray.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) =>
            google.maps.event.removeListener(listenerHandle))
        }
      }
    };
    if (this.paths){
      pathsChange(this.paths);
    }
    this.$watch('paths', pathsChange, {
      deep: this.deepWatch
    });

    let pathChange = (path) => {
      if (path) {
        clearEvents();

        this.$polygonObject.setPath(path);

        const mvcPath = this.$polygonObject.getPath();
        const eventListeners = [];

        const updatePaths = () => {
          this.$emit('path_changed', this.$polygonObject.getPath())
        };

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) =>
            google.maps.event.removeListener(listenerHandle))
        }
      }
    };
    if (this.path){
      pathChange(this.path);
    }
    this.$watch('path', pathChange, {
      deep: this.deepWatch
    });

    // Display the map
    this.$polygonObject.setMap(this.$map);
  },
  methods:{
    createPolygonObject(options){
      return new google.maps.Polygon(options);
    }
  }
}