# The promizeLazy factory

The current code of the `promizeLazy` factory function.

You can find the API documentation [here](/code/utils/factories/promise-lazy.html).

```js
import { getLazyValue } from '../helpers';

function getPromiseLazyCreatorFn(googleMapsApiInitializer, GoogleMapsApi) {
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
    if (options.load) {
      return getLazyValue(() => {
        // This will only be evaluated once
        if (typeof window === 'undefined') {
          // server side -- never resolve this promise
          return new Promise(() => {}).then(onMapsReady);
        }

        return new Promise((resolve, reject) => {
          try {
            window.GoogleMapsCallback = resolve;
            googleMapsApiInitializer(options.load, options.loadCn);
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
      window.GoogleMapsCallback = resolve;
    }).then(onMapsReady);

    return getLazyValue(() => promise);
  };

  return promiseLazyCreator;
}

export default getPromiseLazyCreatorFn;
```
