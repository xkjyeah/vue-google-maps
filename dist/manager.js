'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = exports.loaded = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

var setUp = false;

var loaded = exports.loaded = new _promise2.default(function (resolve, reject) {
  // eslint-disable-line no-unused-vars
  if (typeof window === 'undefined') {
    // Do nothing if run from server-side
    return;
  }
  window['vueGoogleMapsInit'] = resolve;
});

/**
 * @param apiKey    API Key, or object with the URL parameters. For example
 *                  to use Google Maps Premium API, pass
 *                    `{ client: <YOUR-CLIENT-ID> }`.
 *                  You may pass the libraries and/or version (as `v`) parameter into
 *                  this parameter and skip the next two parameters
 * @param version   Google for Maps version
 * @param libraries Libraries to load (@see
 *                  https://developers.google.com/maps/documentation/javascript/libraries)
 * @param loadCn    Boolean. If set to true, the map will be loaded form goole maps China
 *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
 *
 * Example:
 * ```
 *      import {load} from 'vue-google-maps'
 *
 *      load(<YOUR-API-KEY>)
 *
 *      load({
 *              key: <YOUR-API-KEY>,
 *      })
 *
 *      load({
 *              client: <YOUR-CLIENT-ID>,
 *              channel: <YOUR CHANNEL>
 *      })
 * ```
 */
var load = exports.load = function load(apiKey, version, libraries, loadCn) {
  if (typeof document === 'undefined') {
    // Do nothing if run from server-side
    return;
  }
  if (!setUp) {
    var googleMapScript = document.createElement('SCRIPT');

    // Allow apiKey to be an object.
    // This is to support more esoteric means of loading Google Maps,
    // such as Google for business
    // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
    var options = {};
    if (typeof apiKey == 'string') {
      options.key = apiKey;
    } else if ((typeof apiKey === 'undefined' ? 'undefined' : (0, _typeof3.default)(apiKey)) == 'object') {
      for (var k in apiKey) {
        // transfer values in apiKey to options
        options[k] = apiKey[k];
      }
    } else {
      throw new Error('apiKey should either be a string or an object');
    }

    // libraries
    var librariesPath = '';
    if (libraries && libraries.length > 0) {
      librariesPath = libraries.join(',');
      options['libraries'] = librariesPath;
    } else if (Array.prototype.isPrototypeOf(options.libraries)) {
      options.libraries = options.libraries.join(',');
    }
    options['callback'] = 'vueGoogleMapsInit';

    var baseUrl = 'https://maps.googleapis.com/';

    if (typeof loadCn == 'boolean' && loadCn === true) {
      baseUrl = 'http://maps.google.cn/';
    }

    var url = baseUrl + 'maps/api/js?' + (0, _keys2.default)(options).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
    }).join('&');

    if (version) {
      url = url + '&v=' + version;
    }

    googleMapScript.setAttribute('src', url);
    googleMapScript.setAttribute('async', '');
    googleMapScript.setAttribute('defer', '');
    document.body.appendChild(googleMapScript);
  } else {
    throw new Error('You already started the loading of google maps');
  }
};