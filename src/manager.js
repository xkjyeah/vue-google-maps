/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

const Q = require("q");

var setUp = false;
const loadingDefered = Q.defer();

export const loaded = loadingDefered.promise;

window['vueGoogleMapsInit'] = () => {
  loadingDefered.resolve();
};

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
export const load = (apiKey, version, libraries, loadCn) => {
  if (!setUp) {
    const googleMapScript = document.createElement('SCRIPT');

    // Allow apiKey to be an object.
    // This is to support more esoteric means of loading Google Maps,
    // such as Google for business
    // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
    var options = {};
    if (typeof apiKey == 'string') {
      options.key = apiKey;
    }
    else if (typeof apiKey == 'object') {
      for (let k in apiKey) { // transfer values in apiKey to options
         options[k] = apiKey[k];
      }
    }
    else {
      throw new Error('apiKey should either be a string or an object');
    }

    // libraries
    let librariesPath = "";
    if (libraries && libraries.length > 0) {
      librariesPath = libraries.join(',');
      options['libraries'] = librariesPath;
    }
    else if (Array.prototype.isPrototypeOf(options.libraries)) {
      options.libraries = options.libraries.join(',');
    }
    options['callback'] = 'vueGoogleMapsInit';
    
    let baseUrl = 'https://maps.googleapis.com/';

    if (typeof loadCn == 'boolean' && loadCn === true) {
      baseUrl = 'http://maps.google.cn/';
    } 

    let url = baseUrl + 'maps/api/js?' + 
      Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&');
        
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

