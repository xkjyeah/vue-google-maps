"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _propsBinder = require("../utils/propsBinder.js");

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _simulateArrowDown = require("../utils/simulateArrowDown.js");

var _simulateArrowDown2 = _interopRequireDefault(_simulateArrowDown);

var _mapElementMixin = require("./mapElementMixin");

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require("../utils/getPropsValuesMixin.js");

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _manager = require("../manager.js");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _generatePropsToBind = require("../utils/generatePropsToBind");

var _generatePropsToBind2 = _interopRequireDefault(_generatePropsToBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var twoWayProps = ["bounds"];
var excludedProps = ["value", "placeholder", "selectFirstOnEnter", "componentRestrictions", "autoFitOnUpdatePlace", "mapEmbedded"];
var props = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object
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
  selectFirstOnEnter: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: ''
  },
  options: {
    type: Object
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
  computed: {
    placeName: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        this.$emit("input", value);
      }
    }
  },
  created: function created() {
    this.$hybridComponent = !this.mapEmbedded;
    this.$autocomplete = null;
  },
  mounted: function mounted() {
    var _this = this;

    var input = this.$refs.input;
    _manager.loaded.then(function () {
      var options = _lodash2.default.clone(_this.getPropsValues());
      if (_this.selectFirstOnEnter) {
        (0, _simulateArrowDown2.default)(_this.$refs.input);
      }

      (0, _assert2.default)(typeof google.maps.places.Autocomplete === 'function', "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?");

      var finalOptions = _lodash2.default.omitBy(_lodash2.default.defaults({}, options.options, _lodash2.default.omit(options, ['options', 'selectFirstOnEnter', 'value', 'place', 'placeholder', "autoFitOnUpdatePlace", "mapEmbedded"])), _lodash2.default.isUndefined);

      // Component restrictions is rather particular. Undefined not allowed
      _this.$watch('componentRestrictions', function (v) {
        if (v !== undefined) {
          _this.$autocomplete.setComponentRestrictions(v);
        }
      });

      _this.$autocomplete = new google.maps.places.Autocomplete(_this.$refs.input, finalOptions);
      (0, _propsBinder2.default)(_this, _this.$autocomplete, (0, _generatePropsToBind2.default)(props, twoWayProps, excludedProps));
      _this.$autocomplete.addListener('place_changed', _this.placeChanged);
    });
  },
  deferredReady: function deferredReady() {
    if (this.mapEmbedded) {
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
      this.$emit('place_changed', this.$autocomplete.getPlace());
      if (this.autoFitOnUpdatePlace) this.autoFitPlace(this.$autocomplete.getPlace());
    }
  }
};