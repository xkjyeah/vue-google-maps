import _ from 'lodash';
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const polygonProps = {
  path: {
    type: Array,
    twoWay: true
  },
  paths: {
    type: Array,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  deepWatch: {
    type: Boolean
  },
  options: {
    type: Object
  },
}

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
        this.$emit('path_changed', value);
      }
    },
    local_paths:{
      get(){
        return this.paths;
      },
      set(value){
        this.$emit('paths_changed', value);
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
    if (this.$polygonObject) {
      this.$polygonObject.setMap(null);
    }
  },

  deferredReady() {
    const options = _.clone(this.getPropsValues());
    delete options.options;
    _.assign(options, this.local_options);
    if (!options.path) {
      delete options.path;
    }
    if (!options.paths) {
      delete options.paths;
    }
    this.$polygonObject = this.createPolygonObject(options);

    propsBinder(this, this.$polygonObject, _.omit(polygonProps, ['path', 'paths']));
    eventBinder(this, this.$polygonObject, events);

    let clearEvents = () => {};

    const convertToLatLng = (arr) => {
      return _.map((arr), (v) => {
        return {
          lat: v.lat(),
          lng: v.lng()
        }
      });
    }

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    this.$watch('local_paths', (paths) => {
      if (paths) {
        clearEvents();
        if (typeof paths[0][0] == 'undefined') {
          this.$polygonObject.setPaths([paths]);
        }else{
          this.$polygonObject.setPaths(paths);
        }

        const updatePaths = () => {
          this.local_paths = _.map(this.$polygonObject.getPaths().getArray(), (pArray) => {
            return convertToLatLng(pArray.getArray());
          });
        }
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
    }, {
      deep: this.local_deepWatch
    });

    this.$watch('local_path', (path) => {
      if (path) {
        clearEvents();

        this.$polygonObject.setPath(path);

        const mvcPath = this.$polygonObject.getPath();
        const eventListeners = [];

        const updatePaths = () => {
          this.local_path = convertToLatLng(this.$polygonObject.getPath().getArray());
        }

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
    this.$polygonObject.setMap(this.$map);
  },
  methods:{
    createPolygonObject(options){
      return new google.maps.Polygon(options);
    }
  }
}