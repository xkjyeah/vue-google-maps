import type { IGmapVuePluginOptions, IGoogleMapsApiObject } from '@/interfaces';
import type {
  TGlobalGoogleObject,
  TGoogleMapsAPIInitializerFn,
  TLazyValueGetterFn,
  TPromiseLazyCreatorFn,
} from '@/types';
import { getLazyValue } from './helpers';

let $finalOptions: IGmapVuePluginOptions | undefined;
let $googleMapsApiPromiseLazy:
  | TLazyValueGetterFn<TGlobalGoogleObject>
  | undefined;

/**
 * This function is a factory of the promise lazy creator
 * it helps you to create the function that will call the
 * Google Maps API in an async way
 *
 * @param  {Function} googleMapsApiInitializer function that initialize the Google Maps API
 * @param  {Object} GoogleMapsApi Vue app instance that will help to know if the Google API object is ready
 * @returns {(options: IGmapVuePluginOptions) => TLazyValueGetterFn}
 *
 * @internal
 */
export function usePromiseLazyBuilderFn(
  googleMapsApiInitializer: TGoogleMapsAPIInitializerFn,
  GoogleMapsApi: IGoogleMapsApiObject,
): TPromiseLazyCreatorFn {
  return (
    options: IGmapVuePluginOptions,
  ): TLazyValueGetterFn<TGlobalGoogleObject> => {
    /**
     * Things to do once the API is loaded
     *
     * @returns {Object} the Google Maps API object
     */
    function onMapsReady(): TGlobalGoogleObject {
      GoogleMapsApi.isReady = true;
      return globalThis.google;
    }

    return getLazyValue(() =>
      createFinalPromise(options, googleMapsApiInitializer, onMapsReady),
    );
  };
}

/**
 * This function allow to autodetect an external load of the Google Maps API
 * or load it dynamically from our component.
 *
 * @param  {Function} resolveFn the function that indicates to the plugin that Google Maps is loaded
 *
 * @internal
 */
function createCallbackAndChecksIfMapIsLoaded(
  resolveFn: (value?: unknown) => void,
): void {
  let callbackExecuted = false;

  globalThis.GoogleMapsCallback = (): void => {
    try {
      resolveFn();
    } catch (error) {
      globalThis.console.error('Error executing the GoogleMapsCallback', error);
    } finally {
      callbackExecuted = true;
    }
  };

  let timeoutId: number | undefined = window.setTimeout(() => {
    let intervalId: number | undefined = window.setInterval(() => {
      if (timeoutId) {
        globalThis.clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (window.google.maps != null && !callbackExecuted) {
        globalThis.GoogleMapsCallback();
      }

      if (callbackExecuted) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    }, 500);
  }, 1000);
}

/**
 * This function creates the final promise
 * and helps to define if the plugin should load
 * the Google Maps API or not
 *
 * @param  {IGmapVuePluginOptions} options
 * @param  {TGoogleMapsAPIInitializerFn} googleMapsApiInitializer
 * @param  {()=>TGlobalGoogleObject} onMapsReady
 *
 * @internal
 */
function createFinalPromise(
  options: IGmapVuePluginOptions,
  googleMapsApiInitializer: TGoogleMapsAPIInitializerFn,
  onMapsReady: () => TGlobalGoogleObject,
): Promise<TGlobalGoogleObject> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      // Do nothing if run from server-side
      return undefined;
    }

    try {
      createCallbackAndChecksIfMapIsLoaded(resolve);

      if (!options.dynamicLoad && options.load) {
        googleMapsApiInitializer(options.load);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        reject(err);
      } else {
        global.console.error(JSON.stringify(err, null, 2));
        const error = new Error(
          'unknown error - check the console to see the original error',
        );
        reject(error);
      }
    }
  }).then(onMapsReady);
}

/**
 * This function helps to save the final options passed to the plugin and
 * the function to get the promise useful to wait until the Google Maps API
 * is loaded and ready to use it
 *
 * @param  {IGmapVuePluginOptions} finalOptions
 * @param  {TLazyValueGetterFn} googleMapsApiPromiseLazy
 * @returns void
 *
 * @internal
 */
export function saveLazyPromiseAndFinalOptions(
  finalOptions: IGmapVuePluginOptions,
  googleMapsApiPromiseLazy: TLazyValueGetterFn<TGlobalGoogleObject>,
): void {
  if (!$finalOptions) {
    $finalOptions = finalOptions;
  }

  if (!$googleMapsApiPromiseLazy) {
    $googleMapsApiPromiseLazy = googleMapsApiPromiseLazy;
  }
}

/**
 * This function returns a promise when is resolved returns the original Google
 * Maps API. With this promise you can wait until the Google Maps API is fully
 * loaded.
 *
 * @public
 * @returns {Promise<any>}
 */
export function useGoogleMapsApiPromiseLazy():
  | Promise<TGlobalGoogleObject | undefined>
  | undefined {
  if (!$googleMapsApiPromiseLazy) {
    globalThis.console.warn('$googleMapsApiPromiseLazy was not created yet...');
  }

  return $googleMapsApiPromiseLazy?.();
}

/**
 * This function returns the configuration passed to the plugin
 *
 * @public
 * @returns IPluginOptions
 */
export function usePluginOptions(): IGmapVuePluginOptions | undefined {
  if (!$finalOptions) {
    globalThis.console.warn('$finalOptions was not defined yet...');
  }

  return $finalOptions;
}
