import _ from 'lodash'
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import downArrowSimulator from '../utils/simulateArrowDown.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import {loaded} from '../manager.js'
import assert from 'assert';

const placeInputProps = {
  bounds: {
    type: Object,
    twoWay: true
  },
  componentRestrictions: {
    type: Object
  },
  types: {
    type: Array
  },
  className: {
    type: String
  },
  label: {
    type: String
  }
}
const props = {
  bounds: {
    type: Object
  },
  place: {
    type: Object,
    default: function () {
      return {
        name: ''
      };
    }
  },
  defaultPlace: {
    type: String,
    default: '',
  },
  componentRestrictions: {
    type: Object,
    default: null,
  },
  types: {
    type: Array,
    default() {
      return [];
    }
  },
  placeholder: {
    type: String
  },
  className: {
    type: String
  },
  label: {
    type: String,
    default: null
  },
  selectFirstOnEnter: {
    type: Boolean,
    default: false
  },
  autoFitOnUpdatePlace: {
    type: Boolean,
    default: false
  },
  mapEmbedded: {
    type: Boolean,
    default: false
  }
}
const events = [
  'place_changed'
];

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,
  data(){
    return {
      placeInputObj:{
        place:{
          name: ''
        }
      }
    }
  },
  computed: {
    local_bounds: {
      get(){
        return this.bounds;
      },
      set(value){
        this.$emit('bounds-changed', value);
      }
    },
    local_place: {
      get(){
        return (typeof this.$options.propsData['place'] !== 'undefined') ? this.place : this.placeInputObj.place;
      },
      set(value){
        this.placeInputObj.place = value;
        this.$emit('place-changed', value);
      }
    },
    local_defaultPlace(){
      return (typeof this.$options.propsData['defaultPlace'] !== 'undefined') ? this.defaultPlace : this.local_place.name;
    },
    local_componentRestrictions(){
      return this.componentRestrictions;
    },
    local_types(){
      return this.types;
    },
    local_placeholder(){
      return this.placeholder;
    },
    local_className(){
      return this.className;
    },
    local_label(){
      return this.label;
    },
    local_selectFirstOnEnter(){
      return this.selectFirstOnEnter;
    },
    local_autoFitOnUpdatePlace(){
      return this.autoFitOnUpdatePlace;
    },
    local_mapEmbedded(){
      return this.mapEmbedded;
    }
  },
  created(){
    this.$hybridComponent = !this.local_mapEmbedded;
    this.$on('place_changed', this.placeChanged);
    this.autoCompleter = null;
  },
  mounted () {
    const input = this.$refs.input;

    // Allow default place to be set
    input.value = this.local_defaultPlace ;
    this.local_place.name = this.local_defaultPlace;
    this.$watch('local_defaultPlace', () => {
      input.value = this.local_defaultPlace;
    })
    loaded.then(() => {
      window.i = input;
      const options = _.clone(this.getPropsValues());
      if (this.local_selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input);
      }

      assert(typeof(google.maps.places.Autocomplete) === 'function',
        "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?")

      this.autoCompleter = new google.maps.places.Autocomplete(this.$refs.input, options);
      propsBinder(this, this.autoCompleter, placeInputProps);
      eventBinder(this, this.autoCompleter, events);
    })
  },
  deferredReady() {
    if (this.local_mapEmbedded) {
      if (this.$map) {
        this.$map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.$refs.input);
      }
    }
  },
  methods: {
    autoFitPlace(place){
      if (typeof this.$map === 'undefined' || typeof place.geometry === 'undefined')
        return;
      this.$map.fitBounds(place.geometry.viewport);
    },
    placeChanged() {
      this.local_place = this.autoCompleter.getPlace();
      if (this.local_autoFitOnUpdatePlace)
        this.autoFitPlace(this.local_place);
    }
  }
}