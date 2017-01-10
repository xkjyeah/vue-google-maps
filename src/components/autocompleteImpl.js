import _ from "lodash"
import propsBinder from "../utils/propsBinder.js"
import downArrowSimulator from "../utils/simulateArrowDown.js"
import MapElementMixin from "./mapElementMixin"
import getPropsValuesMixin from "../utils/getPropsValuesMixin.js"
import {loaded} from "../manager.js"
import assert from "assert"
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = ["bounds"];
const excludedProps = ["value","placeholder","selectFirstOnEnter","componentRestrictions","autoFitOnUpdatePlace","mapEmbedded"];
const props = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
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
  value: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
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
  },
  created(){
    this.$hybridComponent = !this.mapEmbedded;
    this.autocompleter = null;
  },
  mounted () {
    const input = this.$refs.input;
    loaded.then(() => {
      const options = _.clone(this.getPropsValues());
      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input);
      }

      assert(typeof(google.maps.places.Autocomplete) === 'function',
        "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?")

      const finalOptions = _.defaults(
        {},
        options.options,
        _.omit(options, ['options', 'selectFirstOnEnter', 'value', 'place', 'placeholder',"autoFitOnUpdatePlace","mapEmbedded"])
      ).omitBy(_.isUndefined);

      // Component restrictions is rather particular. Undefined not allowed
      this.$watch('componentRestrictions', v => {
        if (v !== undefined) {
          this.$autocomplete.setComponentRestrictions(v);
        }
      })

      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input, finalOptions);
      propsBinder(this, this.autocompleter, generatePropsToBind(props,twoWayProps,excludedProps));
      this.autocompleter.addListener('place_changed', this.placeChanged);
    })
  },
  deferredReady() {
    if (this.mapEmbedded) {
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
      if (this.autoFitOnUpdatePlace)
        this.autoFitPlace(this.autocompleter.getPlace());
    }
  }
}
