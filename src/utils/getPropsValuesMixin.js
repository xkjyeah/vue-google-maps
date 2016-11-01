import _ from 'lodash';

export default {
  methods: {
    getPropsValues () {
      return _.mapValues(this.$options.props, (v, k) => this[k]);
    }
  }
};
