import { getLazyValue } from '../helpers';

/**
 * This function allow to auto detect an external load of the Google Maps API
 * or load it dynamically from our component.
 *
 * @param  {Function} resolveFn the function that indicates to the plugin that Google Maps is loaded
 * @param  {Function} customCallback the custom callback to execute when the plugin load. This option will be removed on the next major release
 */
function createCallbackAndChecksIfMapIsLoaded(resolveFn, customCallback) {
  let callbackExecuted = false;

  window.GoogleMapsCallback = () => {
    try {
      resolveFn();
      callbackExecuted = true;
      // TODO: this should be removed on the next major release
      if (customCallback) {
        customCallback();
      }
    } catch (error) {
      window.console.error('Error executing the GoogleMapsCallback', error);
    }
  };

  let timeoutId = setTimeout(() => {
    let intervalId = setInterval(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      if (
        (window && window.google && window.google.maps) != null &&
        !callbackExecuted
      ) {
        window.GoogleMapsCallback();
        callbackExecuted = true;
      }

      if (callbackExecuted) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    }, 500);
  }, 1000);
}

/**
 * This function is a factory of the promise lazy creator
 * it helps you creating the function that will call the
 * Google Maps API in an async way
 *
 * @param  {Function} googleMapsApiInitializer function that initialize the Google Maps API
 * @param  {Object} GoogleMapsApi Vue instance that will help to know if the google API object is ready
 * @returns {Function}
 */
function getPromiseLazyCreatorFn(googleMapsApiInitializer, GoogleMapsApi) {
  /**
   * The creator of the lazy promise
   *
   * @param  {Object|undefined} options=undefined configuration object to initialize the GmapVue plugin
   * @param  {boolean} options.dynamicLoad=false load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
   * @param  {boolean} options.installComponents=true install all components
   * @param  {boolean} options.autoBindAllEvents=false auto bind all Google Maps API events
   * @param  {Object|undefined} options.load=undefined options to configure the Google Maps API
   * @param  {string} options.load.key your Google Maps API key
   * @param  {string} options.load.libraries=places the Google Maps libraries that you will use eg: 'places,drawing,visualization'
   * @param  {string|undefined} options.load.v=undefined the Google Maps API version, default latest
   * @param  {string|undefined} options.load.callback=GoogleMapsCallback This must be ignored if have another callback that you need to run when Google Maps API is ready please use the `customCallback` option.
   * @param  {string|undefined} options.load.customCallback=undefined This option was added on v3.0.0 but will be removed in the next major release. If you already have an script tag that loads Google Maps API and you want to use it set you callback in the `customCallback` option and our `GoogleMapsCallback` callback will execute your custom callback at the end; it must attached to the `window` object, is the only requirement.
   */
  const promiseLazyCreator = (options) => {
    /**
     * Things to do once the API is loaded
     *
     * @returns {Object} the Google Maps API object
     */
    function onMapsReady() {
      GoogleMapsApi.isReady = true;
      return window.google;
    }

    // If library should load the API
    if ((options && options.load && options.load.key) || options.dynamicLoad) {
      return getLazyValue(() => {
        // This will only be evaluated once
        if (typeof window === 'undefined') {
          // server side -- never resolve this promise
          return new Promise(() => {}).then(onMapsReady);
        }

        return new Promise((resolve, reject) => {
          try {
            createCallbackAndChecksIfMapIsLoaded(
              resolve,
              window[options && options.load && options.load.customCallback]
            );

            if (!options.dynamicLoad) {
              googleMapsApiInitializer(options.load, options.loadCn);
            }
          } catch (err) {
            reject(err);
          }
        }).then(onMapsReady);
      });
    }

    // If library should not handle API, provide
    // end-users with the global `GoogleMapsCallback: () => undefined`
    // when the Google Maps API has been loaded
    const promise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        // Do nothing if run from server-side
        return;
      }

      createCallbackAndChecksIfMapIsLoaded(
        resolve,
        window[options && options.load && options.load.customCallback]
      );
    }).then(onMapsReady);

    return getLazyValue(() => promise);
  };

  return promiseLazyCreator;
}

export default getPromiseLazyCreatorFn;
