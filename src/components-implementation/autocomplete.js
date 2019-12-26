import { bindProps, getPropsValues } from '../utils/bind-props'
import downArrowSimulator from '../utils/simulate-arrow-down'
import mappedPropsToVueProps from '../utils/mapped-props-to-vue-props'

const mappedProps = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true
  },
  types: {
    type: Array,
    default: function () {
      return []
    }
  }
}

const props = {
  selectFirstOnEnter: {
    required: false,
    type: Boolean,
    default: false
  },
  // the name of the ref to obtain the input (if its a child  of component in the slot)
  childRefName: {
    required: false,
    type: String,
    default: 'input'
  },
  options: {
    type: Object
  },
  fields: {
    required: false,
    type: Array,
    default: null
  }
}

export default {
  mounted () {
    this.$gmapApiPromiseLazy().then(() => {
      var scopedInput = null
      if (this.$scopedSlots.input) {
        scopedInput = this.$scopedSlots.input()[0].context.$refs.input
        if (scopedInput && scopedInput.$refs) {
          scopedInput = scopedInput.$refs[this.childRefName || 'input']
        }
        if (scopedInput) { this.$refs.input = scopedInput }
      }
      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input)
      }

      if (typeof (google.maps.places.Autocomplete) !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?')
      }

      /* eslint-disable no-unused-vars */
      const finalOptions = {
        ...getPropsValues(this, mappedProps),
        ...this.options
      }

      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input, finalOptions)
      bindProps(this, this.$autocomplete, mappedProps)

      this.$watch('componentRestrictions', v => {
        if (v !== undefined) {
          this.$autocomplete.setComponentRestrictions(v)
        }
      })
      
      // IMPORTANT: To avoid paying for data that you don't need,
      // be sure to use Autocomplete.setFields() to specify only the place data that you will use.
      if(_this.fields) {
        _this.$autocomplete.setFields(_this.fields);
      }

      // Not using `bindEvents` because we also want
      // to return the result of `getPlace()`
      this.$autocomplete.addListener('place_changed', () => {
        this.$emit('place_changed', this.$autocomplete.getPlace())
      })
    })
  },
  props: {
    ...mappedPropsToVueProps(mappedProps),
    ...props
  }
}
