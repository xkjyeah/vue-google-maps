import _ from 'lodash';

import {loaded} from '../manager.js';
import {DeferredReadyMixin} from '../utils/deferredReady.js';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import {DeferredReady} from '../utils/deferredReady.js'
import getPropsMixin from '../utils/getPropsValuesMixin.js'
import mountableMixin from '../utils/mountableMixin.js'
import latlngChangedHandler from '../utils/latlngChangedHandler.js';
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = ["zoom","pov","position","pano","visible"]
const excludedProps = ["zoom","position"]
const trackProps = {"pov":['pitch', 'heading']}
const props = {
  zoom: {
    type: Number
  },
  pov: {
    type: Object
  },
  position: {
    type: Object
  },
  pano: {
    type: String
  },
  motionTracking: {
    type: Boolean
  },
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object,
    default () {return {}}
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
  createStreetViewPanoramaObject(element, options) {
    return new google.maps.StreetViewPanorama(element, options)
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
      this.$panoCreatedDeferred = {resolve, reject}
    });
  },

  watch: {
    position: {
      deep: true,
      handler: latlngChangedHandler((val, oldVal) => {
        if (this.$panoObject) {
          this.$panoObject.setPosition(val);
        }
      }),
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
      console.log(options);

      this.$panoObject = this.createStreetViewPanoramaObject(element, options);

      // binding properties (two and one way)
      propsBinder(this, this.$panoObject,generatePropsToBind(props,twoWayProps,excludedProps,trackProps));

      //binding events
      eventsBinder(this, this.$panoObject, events);

      this.$panoCreatedDeferred.resolve(this.$panoObject);

      return this.$panoCreated;
    })
    .catch((error) => {
      throw error;
    });
  },
}
