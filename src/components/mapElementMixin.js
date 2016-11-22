/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import Vue from 'vue';
import {DeferredReadyMixin} from '../deferredReady'
import {DeferredReady} from '../deferredReady.js'
import Map from './map.vue'

Vue.use(DeferredReady);

/**
 * @class MapElementMixin @mixins DeferredReadyMixin
 *
 * Extends components to include the following fields:
 *
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
export default {

  mixins: [DeferredReadyMixin],

  created() {
    /* Search for the Map component in the parent */
    let search = this.$findAncestor(ans => ans instanceof Map);

    if (!search) {
      throw new Error(`${this.constructor.name} component must be used within a <Map>`)
    }

    this.$mapPromise = search.mapCreated.then((map) => {
      this.$map = map
    })
    // This is a hack. FIXME
    if (search.mapObject) {
      this.$map = search.mapObject;
    }
    this.$MapElementMixin = search;
    this.$map = null;
  },

  beforeDeferredReady () {
    return this.$mapPromise;
  },

  methods: {
    $findAncestor(condition) {
      let search = this.$parent;

      while (search) {
        if (condition(search)) {
          return search;
        }
        search = search.$parent;
      }
      return null;
    }
  }

};
