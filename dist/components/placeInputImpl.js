'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _simulateArrowDown = require('../utils/simulateArrowDown.js');

var _simulateArrowDown2 = _interopRequireDefault(_simulateArrowDown);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _manager = require('../manager.js');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var placeInputProps = {
  bounds: {
    type: Object,
    twoWay: true
  },
  componentRestrictions: {
    type: Object
  },
  types: {
    type: Array
  },
  className: {
    type: String
  },
  label: {
    type: String
  }
};
var props = {
  bounds: {
    type: Object
  },
  place: {
    type: Object,
    default: function _default() {
      return {
        name: ''
      };
    }
  },
  defaultPlace: {
    type: String,
    default: ''
  },
  componentRestrictions: {
    type: Object,
    default: null
  },
  types: {
    type: Array,
    default: function _default() {
      return [];
    }
  },
  placeholder: {
    type: String
  },
  className: {
    type: String
  },
  label: {
    type: String,
    default: null
  },
  selectFirstOnEnter: {
    type: Boolean,
    default: false
  },
  autoFitOnUpdatePlace: {
    type: Boolean,
    default: false
  },
  mapEmbedded: {
    type: Boolean,
    default: false
  }
};

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,
  data: function data() {
    return {
      placeInputObj: {
        place: {
          name: ''
        }
      }
    };
  },

  computed: {
    local_bounds: {
      get: function get() {
        return this.bounds;
      },
      set: function set(value) {
        this.$emit('bounds-changed', value);
      }
    },
    local_place: {
      get: function get() {
        return typeof this.$options.propsData['place'] !== 'undefined' ? this.place : this.placeInputObj.place;
      },
      set: function set(value) {
        this.placeInputObj.place = value;
        this.$emit('place-changed', value);
      }
    },
    local_defaultPlace: function local_defaultPlace() {
      return typeof this.$options.propsData['defaultPlace'] !== 'undefined' ? this.defaultPlace : this.local_place.name;
    },
    local_componentRestrictions: function local_componentRestrictions() {
      return this.componentRestrictions;
    },
    local_types: function local_types() {
      return this.types;
    },
    local_placeholder: function local_placeholder() {
      return this.placeholder;
    },
    local_className: function local_className() {
      return this.className;
    },
    local_label: function local_label() {
      return this.label;
    },
    local_selectFirstOnEnter: function local_selectFirstOnEnter() {
      return this.selectFirstOnEnter;
    },
    local_autoFitOnUpdatePlace: function local_autoFitOnUpdatePlace() {
      return this.autoFitOnUpdatePlace;
    },
    local_mapEmbedded: function local_mapEmbedded() {
      return this.mapEmbedded;
    }
  },
  created: function created() {
    this.$hybridComponent = !this.local_mapEmbedded;
    this.placeInputObj.place.name = this.local_defaultPlace;
    this.autoCompleter = null;
  },
  mounted: function mounted() {
    var _this = this;

    var input = this.$refs.input;

    // Allow default place to be set
    input.value = this.local_defaultPlace;
    this.local_place.name = this.local_defaultPlace;
    this.$watch('local_defaultPlace', function () {
      input.value = _this.local_defaultPlace;
    });
    _manager.loaded.then(function () {
      window.i = input;
      var options = _lodash2.default.clone(_this.getPropsValues());
      if (_this.local_selectFirstOnEnter) {
        (0, _simulateArrowDown2.default)(_this.$refs.input);
      }

      (0, _assert2.default)(typeof google.maps.places.Autocomplete === 'function', "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?");

      _this.autoCompleter = new google.maps.places.Autocomplete(_this.$refs.input, options);
      (0, _propsBinder2.default)(_this, _this.autoCompleter, placeInputProps);
      _this.autoCompleter.addListener('place_changed', _this.placeChanged);
    });
  },
  deferredReady: function deferredReady() {
    if (this.local_mapEmbedded) {
      if (this.$map) {
        this.$map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.$refs.input);
      }
    }
  },

  methods: {
    autoFitPlace: function autoFitPlace(place) {
      if (typeof this.$map === 'undefined' || typeof place.geometry === 'undefined') return;
      this.$map.fitBounds(place.geometry.viewport);
    },
    placeChanged: function placeChanged() {
      this.local_place = this.autoCompleter.getPlace();
      if (this.local_autoFitOnUpdatePlace) this.autoFitPlace(this.local_place);
    }
  }
};