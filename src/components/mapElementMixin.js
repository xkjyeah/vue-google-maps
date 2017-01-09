/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
import {DeferredReadyMixin} from "../utils/deferredReady";

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
  
  data() {
    return {
      _changeIndicators: {} // For propsBinder trackProperties
    }
  },

  beforeCreate(){
    //components what can be user inside and outside of a map
    this.$hybridComponent = false;
  },
  beforeMount() {
    if (this.$hybridComponent) {
      return;
    }
    /* Search for the Map component in the parent */
    let search = this.$findAncestor(
      ans => ans.$mapCreated
    );

    if (!search) {
      throw new Error(`${this.constructor.name} component must be used within a <Map>`)
    }

    this.$mapPromise = search.$mapCreated.then((map) => {
      this.$map = map
    })
    // FIXME: This is a hack to ensure correct loading
    // when the map has already be instantiated.
    if (search.$mapObject) {
      this.$map = search.$mapObject;
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
