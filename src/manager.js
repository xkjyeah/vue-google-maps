let isApiSetUp = false

/**
 * @param apiKey    API Key, or object with the URL parameters. For example
 *                  to use Google Maps Premium API, pass
 *                    `{ client: <YOUR-CLIENT-ID> }`.
 *                  You may pass the libraries and/or version (as `v`) parameter into
 *                  this parameter and skip the next two parameters
 * @param version   Google Maps version
 * @param libraries Libraries to load (@see
 *                  https://developers.google.com/maps/documentation/javascript/libraries)
 * @param loadCn    Boolean. If set to true, the map will be loaded from google maps China
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
export const loadGmapApi = (options, loadCn) => {
  if (typeof document === 'undefined') {
    // Do nothing if run from server-side
    return
  }
  if (!isApiSetUp) {
    isApiSetUp = true

    const googleMapScript = document.createElement('SCRIPT')

    // Allow options to be an object.
    // This is to support more esoteric means of loading Google Maps,
    // such as Google for business
    // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
    if (typeof options !== 'object') {
      throw new Error('options should  be an object')
    }

    // libraries
    if (Array.prototype.isPrototypeOf(options.libraries)) {
      options.libraries = options.libraries.join(',')
    }
    options['callback'] = 'vueGoogleMapsInit'

    let baseUrl = '//maps.googleapis.com/'

    if (typeof loadCn === 'boolean' && loadCn === true) {
      baseUrl = '//maps.google.cn/'
    }

    let url = baseUrl + 'maps/api/js?' +
      Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&')

    googleMapScript.setAttribute('src', url)
    googleMapScript.setAttribute('async', '')
    googleMapScript.setAttribute('defer', '')
    document.head.appendChild(googleMapScript)
  } else {
    throw new Error('You already started the loading of google maps')
  }
}
