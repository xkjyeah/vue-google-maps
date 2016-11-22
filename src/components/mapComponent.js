/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import Vue from 'vue';
import {DeferredReadyMixin} from '../deferredReady';
import {DeferredReady} from '../deferredReady.js';
import {getParentTest} from '../utils/getParentTest';

Vue.use(DeferredReady);

/**
 * @class MapComponent
 *
 * Extends components to include the following fields:
 *
 * @property $mapPromise A Promise returning the google map
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
export default Vue.extend({

  mixins: [DeferredReadyMixin],
  beforeCreate(){
    this.$registerComponent = true;
    this.destroyed = false;
  },
  created() {
    //console.log('create MapComponent', this);
    this.$on('map-ready',this.mapReady);
    this.$map = null;
  },
  destroyed(){
    this.destroyed = true;
    this.$off('map-ready',this.mapReady);
  },
  deferredReady () {
    if (this.destroyed)
      return;
    //console.log('emit register-component', this);
    if (this.$registerComponent) {
      var parent = this.getParentMap(this);
      parent.$emit('register-component', this);
    }
  },
  methods: {
    mapReady(map) {
      //console.log('map-ready', map, this);
      //set Map Object
      this.$map = map;
    },
    getParentMap(child){
      var parentTest = getParentTest(child, function (component) {
        return component._isMap;
      });
      if (parentTest === null){
        throw new Error("This component must be a child of a map!");
      }
      return parentTest;
    }
  },
});