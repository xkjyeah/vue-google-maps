import {mapValues} from 'lodash';

export default {
  methods: {
    getPropsValues () {
      return mapValues(this.$options.props, (v, k) => this[k]);
    }
  }
};
