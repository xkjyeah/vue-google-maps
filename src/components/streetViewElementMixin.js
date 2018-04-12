/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import {DeferredReadyMixin} from '../utils/deferredReady'

/**
 * @class StreetViewElementMixin @mixins DeferredReadyMixin
 *
 * Extends components to include the following fields:
 *
 * @property $pano        The Google Streetview (valid only after the promise returns)
 *
 *
 * */
export default {

  mixins: [DeferredReadyMixin],

  created () {
    /* Search for the Map component in the parent */
    let search = this.$findAncestor(
      ans => ans.$panoCreated
    )

    if (!search) {
      throw new Error(`${this.constructor.name} component must be used within a <Streetview>`)
    }

    this.$panoPromise = search.$panoCreated.then((pano) => {
      this.$pano = pano
    })
    // FIXME: This is a hack to ensure correct loading
    // when the map has already be instantiated.
    if (search.$panoObject) {
      this.$pano = search.$mapObject
    }
    this.$StreetViewElementMixin = search
    this.$pano = null
  },

  beforeDeferredReady () {
    return this.$panoPromise
  },

  methods: {
    $findAncestor (condition) {
      let search = this.$parent

      while (search) {
        if (condition(search)) {
          return search
        }
        search = search.$parent
      }
      return null
    }
  }

}
