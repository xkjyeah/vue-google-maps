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

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _manager = require('../manager.js');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  bounds: {
    type: Object
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
    required: false,
    type: String
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: ''
  }
};

exports.default = {
  mixins: [_getPropsValuesMixin2.default],

  mounted: function mounted() {
    var _this = this;

    var input = this.$refs.input;

    _manager.loaded.then(function () {
      var options = _lodash2.default.clone(_this.getPropsValues());
      if (_this.selectFirstOnEnter) {
        (0, _simulateArrowDown2.default)(_this.$refs.input);
      }

      (0, _assert2.default)(typeof google.maps.places.Autocomplete === 'function', "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?");

      _this.$autocomplete = new google.maps.places.Autocomplete(_this.$refs.input, options);
      (0, _propsBinder2.default)(_this, _this.autoCompleter, _lodash2.default.omit(props, ['placeholder', 'place', 'selectFirstOnEnter', 'value']));

      _this.$autocomplete.addListener('place_changed', function () {
        _this.$emit('place_changed', _this.$autocomplete.getPlace());
      });
    });
  },

  props: props
};