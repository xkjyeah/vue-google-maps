import _ from "lodash"
import propsBinder from "../utils/propsBinder.js"
import downArrowSimulator from "../utils/simulateArrowDown.js"
import MapElementMixin from "./mapElementMixin"
import getPropsValuesMixin from "../utils/getPropsValuesMixin.js"
import {loaded} from "../manager.js"
import assert from "assert"

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
  }
}
const props = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    default: null,
  },
  value: {
    type: String
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

export default {
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,
  computed: {
    placeName: {
      get(){
        return this.value;
      },
      set(value){
        this.$emit("input", value);
      }
    },
    local_bounds: {
      get(){
        return this.bounds;
      },
      set(value){
        this.$emit('bounds-changed', value);
      }
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
    this.autocompleter = null;
  },
  mounted () {
    const input = this.$refs.input;
    loaded.then(() => {
      window.i = input;
      const options = _.clone(this.getPropsValues());
      if (this.local_selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input);
      }

      assert(typeof(google.maps.places.Autocomplete) === 'function',
        "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?")

      this.autocompleter = new google.maps.places.Autocomplete(this.$refs.input, options);
      propsBinder(this, this.autocompleter, placeInputProps);
      this.autocompleter.addListener('place_changed', this.placeChanged);
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
      this.$emit('place_changed', this.autocompleter.getPlace());
      if (this.local_autoFitOnUpdatePlace)
        this.autoFitPlace(this.autocompleter.getPlace());
    }
  }
}
