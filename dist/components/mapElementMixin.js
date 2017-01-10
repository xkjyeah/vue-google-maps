'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deferredReady = require('../utils/deferredReady');

var _deferredReady2 = require('../utils/deferredReady.js');

var _map = require('./map.vue');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class MapElementMixin @mixins DeferredReadyMixin
 *
 * Extends components to include the following fields:
 *
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
exports.default = {

  mixins: [_deferredReady.DeferredReadyMixin],

  created: function created() {
    var _this = this;

    /* Search for the Map component in the parent */
    var search = this.$findAncestor(function (ans) {
      return ans.$mapCreated;
    });

    if (!search) {
      throw new Error(this.constructor.name + ' component must be used within a <Map>');
    }

    this.$mapPromise = search.$mapCreated.then(function (map) {
      _this.$map = map;
    });
    // FIXME: This is a hack to ensure correct loading
    // when the map has already be instantiated.
    if (search.$mapObject) {
      this.$map = search.$mapObject;
    }
    this.$MapElementMixin = search;
    this.$map = null;
  },
  beforeDeferredReady: function beforeDeferredReady() {
    return this.$mapPromise;
  },


  methods: {
    $findAncestor: function $findAncestor(condition) {
      var search = this.$parent;

      while (search) {
        if (condition(search)) {
          return search;
        }
        search = search.$parent;
      }
      return null;
    }
  }

}; /* vim: set softtabstop=2 shiftwidth=2 expandtab : */