/*
Mixin for objects that are mounted by Google Maps
Javascript API.

These are objects that are sensitive to element resize
operations so it exposes a property which accepts a bus

*/

export default {
  props: ['resizeBus'],

  data () {
    return {
      _actualResizeBus: null
    }
  },

  created () {
    if (typeof this.resizeBus === 'undefined') {
      this.$data._actualResizeBus = this.$gmapDefaultResizeBus
    } else {
      this.$data._actualResizeBus = this.resizeBus
    }
  },

  methods: {
    _resizeCallback () {
      this.resize()
    },
    _delayedResizeCallback () {
      this.$nextTick(() => this._resizeCallback())
    }
  },

  watch: {
    resizeBus (newVal, oldVal) { // eslint-disable-line no-unused-vars
      this.$data._actualResizeBus = newVal
    },
    '$data._actualResizeBus' (newVal, oldVal) {
      if (oldVal) {
        oldVal.$off('resize', this._delayedResizeCallback)
      }
      if (newVal) {
        newVal.$on('resize', this._delayedResizeCallback)
      }
    }
  },

  destroyed () {
    if (this.$data._actualResizeBus) {
      this.$data._actualResizeBus.$off('resize', this._delayedResizeCallback)
    }
  }
}
