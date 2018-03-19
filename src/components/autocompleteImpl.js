import clone from 'lodash/clone'
import pickBy from 'lodash/pickBy'
import omit from 'lodash/omit'
import propsBinder from '../utils/propsBinder.js'
import downArrowSimulator from '../utils/simulateArrowDown.js'
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import {
  loaded
} from '../manager.js'

const props = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object
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
  mixins: [getPropsValuesMixin],

  mounted () {
    loaded.then(() => {
      const options = clone(this.getPropsValues())
      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input)
      }

      if (typeof (google.maps.places.Autocomplete) !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?')
      }

      /* eslint-disable no-unused-vars */
      const finalOptions = pickBy(Object.assign(
        {},
        omit(options, ['options', 'selectFirstOnEnter', 'value', 'place', 'placeholder']),
        options.options
      ), (v, k) => v !== undefined)

      // Component restrictions is rather particular. Undefined not allowed
      this.$watch('componentRestrictions', v => {
        if (v !== undefined) {
          this.$autocomplete.setComponentRestrictions(v)
        }
      })

      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input, finalOptions)
      propsBinder(this, this.$autocomplete, omit(props, ['placeholder', 'place', 'selectFirstOnEnter', 'value', 'componentRestrictions']))

      this.$autocomplete.addListener('place_changed', () => {
        this.$emit('place_changed', this.$autocomplete.getPlace())
      })
    })
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  },
  props: props
}
