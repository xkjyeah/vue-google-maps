import _ from "lodash";
import {loaded} from "../manager.js";
import eventsBinder from "../utils/eventsBinder.js";
import propsBinder from "../utils/propsBinder.js";
import {DeferredReadyMixin} from "../utils/deferredReady.js";
import getPropsMixin from "../utils/getPropsValuesMixin.js";

const mapsProps = {
  center: {
    twoWay: true,
    type: Object
  },
  zoom: {
    twoWay: true,
    type: Number
  },
  heading: {
    twoWay: true,
    type: Number
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  projection: {
    twoWay: true,
    type: Object,
  },
  tilt: {
    twoWay: true,
    type: Number,
  },
  options: {
    twoWay: false,
    type: Object,
  }
};

const props = {
  center: {
    type: Object,
    required: true
  },
  zoom: {
    type: Number,
    default: 8
  },
  heading: {
    type: Number
  },
  mapTypeId: {
    type: String
  },
  bounds: {
    type: Object,
  },
  projection: {
    type: Object
  },
  tilt: {
    type: Number
  },
  options: {
    type: Object,
    default () {
      return {}
    }
  }
};

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'mousemove',
  'mouseout',
  'mouseover',
  'resize',
  'rightclick',
  'tilesloaded',
];

// Plain Google Maps methods exposed here for convenience
const linkedMethods = _([
    'panBy',
    'panTo',
    'panToBounds',
    'fitBounds'
  ])
    .map(methodName => [methodName, function () {
      if (this.$mapObject)
        this.$mapObject[methodName].apply(this.$mapObject, arguments);
    }])
    .toPairs()
    .value()
  ;

// Other convenience methods exposed by Vue Google Maps
const customMethods = {
  resize() {
    if (this.$mapObject) {
      google.maps.event.trigger(this.$mapObject, 'resize');
    }
  },
  resizePreserveCenter() {
    if (!this.$mapObject)
      return;

    const oldCenter = this.$mapObject.getCenter();
    google.maps.event.trigger(this.$mapObject, 'resize');
    this.$mapObject.setCenter(oldCenter);
  }
};

// Methods is a combination of customMethods and linkedMethods
const methods = _.assign({}, customMethods, linkedMethods);

export default {
  mixins: [getPropsMixin, DeferredReadyMixin],
  props: props,
  //replace: false, // necessary for css styles
  computed: {
    local_center: {
      get(){
        return this.center;
      },
      set(value){
        this.$emit('center_changed', value);
      }
    },
    local_zoom: {
      get(){
        return this.zoom;
      },
      set(value){
        this.$emit('zoom_changed', value);
      }
    },
    local_heading: {
      get(){
        return this.heading;
      },
      set(value){
        this.$emit('heading_changed', value);
      }
    },
    local_mapTypeId: {
      get(){
        return this.mapTypeId;
      },
      set(value){
        this.$emit('mapTypeId_changed', value);
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
    local_projection: {
      get(){
        return this.projection;
      },
      set(value){
        this.$emit('projection_changed', value);
      }
    },
    local_tilt: {
      get(){
        return this.tilt;
      },
      set(value){
        this.$emit('tilt_changed', value);
      }
    },
    local_options(){
      return this.options;
    }
  },
  created() {
    this.$mapCreated = new Promise((resolve, reject) => {
      this.$mapCreatedDeferred = {resolve, reject}
    });
  },

  deferredReady() {
    return loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-map'];

      // creating the map
      const copiedData = _.clone(this.getPropsValues());
      delete copiedData.options;
      const options = _.clone(this.local_options);
      _.assign(options, copiedData);
      this.$mapObject = new google.maps.Map(element, options);

      //binding properties (two and one way)
      propsBinder(this, this.$mapObject, mapsProps);

      //binding events
      eventsBinder(this, this.$mapObject, events);

      let updateBounds = () => {
        this.local_bounds = this.$mapObject.getBounds();
      };

      this.$watch('local_center', updateBounds);
      this.$watch('local_zoom', updateBounds);

      this.$mapCreatedDeferred.resolve(this.$mapObject);

      return this.$mapCreated;
    })
      .catch((error) => {
        throw error;
      });
  },
  methods: methods
}
