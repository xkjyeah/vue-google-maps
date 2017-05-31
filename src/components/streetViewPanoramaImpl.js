import _ from 'lodash';

import {loaded} from '../manager.js';
import {DeferredReadyMixin} from '../utils/deferredReady.js';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import getPropsMixin from '../utils/getPropsValuesMixin.js';
import mountableMixin from '../utils/mountableMixin.js';

const props = {
  zoom: {
    twoWay: true,
    type: Number
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading']
  },
  position: {
    twoWay: true,
    type: Object,
  },
  pano: {
    twoWay: true,
    type: String
  },
  motionTracking: {
    twoWay: false,
    type: Boolean
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true,
  },
  options: {
    twoWay: false,
    type: Object,
    default () {return {};}
  }
};

const events = [
  'closeclick',
  'status_changed',
];

// Other convenience methods exposed by Vue Google Maps
const customMethods = {
  resize() {
    if (this.$panoObject) {
      google.maps.event.trigger(this.$panoObject, 'resize');
    }
  },
};

// Methods is a combination of customMethods and linkedMethods
const methods = _.assign({}, customMethods);

export default {
  mixins: [getPropsMixin, DeferredReadyMixin, mountableMixin],
  props: props,
  replace: false, // necessary for css styles
  methods,

  created() {
    this.$panoCreated = new Promise((resolve, reject) => {
      this.$panoCreatedDeferred = {resolve, reject};
    });
  },

  watch: {
    position: {
      deep: true,
      handler: function(val, oldVal) { // eslint-disable-line no-unused-vars
        if (this.$panoObject) {
          this.$panoObject.setPosition(val);
        }
      },
    },
    zoom(zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(zoom);
      }
    }
  },

  deferredReady() {
    return loaded.then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-street-view-pano'];

      // creating the map
      const options = _.defaults({},
          _.omit(this.getPropsValues(), ['options']),
          this.options
        );

      this.$panoObject = new google.maps.StreetViewPanorama(element, options);

      // binding properties (two and one way)
      propsBinder(this, this.$panoObject,
          _.omit(props, ['position', 'zoom']));

      //binding events
      eventsBinder(this, this.$panoObject, events);

      this.$panoCreatedDeferred.resolve(this.$panoObject);

      return this.$panoCreated;
    })
    .catch((error) => {
      throw error;
    });
  },
};
