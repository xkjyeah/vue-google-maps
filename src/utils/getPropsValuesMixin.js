import mapValues from 'lodash/mapValues'

export default {
  methods: {
    getPropsValues () {
      return mapValues(this.$options.props, (v, k) => this[k])
    }
  }
}
