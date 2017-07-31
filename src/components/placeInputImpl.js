import {omit, clone} from 'lodash';
import propsBinder from '../utils/propsBinder.js';
import downArrowSimulator from '../utils/simulateArrowDown.js';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
import {
  loaded
} from '../manager.js';

const props = {
  bounds: {
    type: Object,
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
    default: function() {
      return [];
    }
  },
  placeholder: {
    required: false,
    type: String
  },
  className: {
    required: false,
    type: String
  },
  label: {
    required: false,
    type: String,
    default: null
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false
  }
};

export default {
  mixins: [getPropsValuesMixin],

  mounted() {
    const input = this.$refs.input;

    // Allow default place to be set
    input.value = this.defaultPlace;
    this.$watch('defaultPlace', () => {
      input.value = this.defaultPlace;
    });

    loaded.then(() => {
      const options = clone(this.getPropsValues());
      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input);
      }

      if(typeof(google.maps.places.Autocomplete) !== 'function'){
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?');
      }

      this.autoCompleter = new google.maps.places.Autocomplete(this.$refs.input, options);
      propsBinder(this, this.autoCompleter, omit(props, ['placeholder', 'place', 'selectFirstOnEnter',
        'defaultPlace', 'className', 'label']));

      this.autoCompleter.addListener('place_changed', () => {
        this.$emit('place_changed', this.autoCompleter.getPlace());
      });
    });
  },
  created() {
    console.warn('The PlaceInput class is deprecated! Please consider using the Autocomplete input instead'); //eslint-disable-line no-console
  },
  props: props,
};
