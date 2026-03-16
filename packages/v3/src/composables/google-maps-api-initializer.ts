import type { ILoadPluginOptions } from '@/interfaces';
import type { TGoogleMapsAPIInitializerFn } from '@/types';

/**
 * This function returns the initializer function, it is exported
 * in that way because we need to generate a closure to define a
 * private property called `isApiSetUp` to detect if the Google Maps
 * API was initializer in a previous execution.
 * The function that it exports is the function that we use inside
 * promise-lazy file to initialize the Google Maps API if it is required.
 *
 * @returns {(options: ILoadPluginOptions, loadCn?: boolean) => void} The initializer function
 *
 * @internal
 */
function googleMapsAPIInitializerFactory(): TGoogleMapsAPIInitializerFn {
  let isApiSetUp = false;

  return (options: ILoadPluginOptions): void => {
    /**
     * Allow options to be an object.
     * This is to support more esoteric means of loading Google Maps,
     * such as Google for business
     * https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
     */
    if (Array.isArray(options) || typeof options !== 'object') {
      throw new Error('options should  be an object');
    }

    // Do nothing if run from server-side
    if (typeof document === 'undefined') {
      return;
    }

    const finalOptions = { ...options };
    const { libraries } = finalOptions;
    finalOptions.callback = 'GoogleMapsCallback';

    // libraries
    if (Array.isArray(libraries)) {
      finalOptions.libraries = libraries.join(',');
    }

    if (!isApiSetUp) {
      isApiSetUp = true;

      const googleMapScript = document.createElement('script');
      googleMapScript.setAttribute('type', 'text/javascript');
      googleMapScript.innerHTML = `
      ((g) => {
        var h,
          a,
          k,
          p = 'The Google Maps JavaScript API',
          c = 'google',
          l = 'importLibrary',
          q = '__ib__',
          m = document,
          b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            h ||
            (h = new Promise(async (f, n) => {
              await (a = m.createElement('script'));
              e.set('libraries', [...r] + '');
              for (k in g)
                e.set(
                  k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                  g[k]
                );
              e.set('callback', c + '.maps.' + q);
              a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
              d[q] = f;
              a.onerror = () => (h = n(Error(p + ' could not load.')));
              a.nonce = m.querySelector('script[nonce]')?.nonce || '';
              m.head.append(a);
            }));
        d[l]
          ? console.warn(p + ' only loads once. Ignoring:', g)
          : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
      })(${JSON.stringify(finalOptions)});`;
      document.head.appendChild(googleMapScript);
    } else {
      window.console.info('You already started the loading of google maps');
    }
  };
}

/** @internal */
const googleMapsApiInitializer = googleMapsAPIInitializerFactory();

export { googleMapsApiInitializer };
