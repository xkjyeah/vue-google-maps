import {bindProps, getPropsValues} from '../utils/bindProps.js'
import downArrowSimulator from '../utils/simulateArrowDown.js'

const props = {
  bounds: {
    type: Object
  },
  defaultPlace: {
    type: String,
    default: ''
  },
  componentRestrictions: {
    type: Object,
    default: null
  },
  types: {
    type: Array,
    default: function () {
      return []
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
}

export default {
  mounted () {
    const input = this.$refs.input

    // Allow default place to be set
    input.value = this.defaultPlace
    this.$watch('defaultPlace', () => {
      input.value = this.defaultPlace
    })

    this.$gmapApiPromiseLazy().then(() => {
      const options = getPropsValues(this, props)
      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input)
      }

      if (typeof (google.maps.places.Autocomplete) !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?')
      }

      this.autoCompleter = new google.maps.places.Autocomplete(this.$refs.input, options)
      const {placeholder, place, defaultPlace, className, label, selectFirstOnEnter, ...rest} = props // eslint-disable-line
      bindProps(this, this.autoCompleter, rest)

      this.autoCompleter.addListener('place_changed', () => {
        this.$emit('place_changed', this.autoCompleter.getPlace())
      })
    })
  },
  created () {
    console.warn('The PlaceInput class is deprecated! Please consider using the Autocomplete input instead') // eslint-disable-line no-console
  },
  props: props
}
