import {bindProps, getPropsValues} from '../utils/bindProps.js'
import downArrowSimulator from '../utils/simulateArrowDown.js'
import {loaded} from '../manager.js'
import {mappedPropsToVueProps} from './mapElementFactory'

const mappedProps = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true,
  },
  types: {
    type: Array,
    default: function () {
      return []
    }
  },
}

const props = {
  placeholder: {
    required: false,
    type: String
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: ''
  },
  options: {
    type: Object
  }
}

export default {
  mounted () {
    loaded.then(() => {
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
