---
id: utilities
sidebar_position: 3
sidebar_label: utilities
---
# Utilities

We have three main utilities `googleMapsApiInitializer`, `pluginComponentBuilder`, and `getGoogleMapsAPI`.

## `googleMapsApiInitializer`

This function load the Google Maps API into your page creating the `<script></script>` tag in the head of your page to load the Maps script from `https://maps.google.cn` or `https://maps.googleapis.com` depending on your preference and the options you passed into the plugin.

### `googleMapsApiInitializer` API

```ts showLineNumbers
(options: ILoadPluginOptions): void => {
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
```

## `pluginComponentBuilder`

This function helps you to build your own components if it does not exist in the plugin, you can pass a set of options and the function will return a new vue component to be used in your application.

### `pluginComponentBuilder` API

```ts showLineNumbers
/**
 * A helper to build your own component for the plugin
 *
 * @param {Object} providedOptions
 * @param {Object} providedOptions.mappedProps - Definitions of props
 * @param {Object} providedOptions.mappedProps.PROP.type - Value type
 * @param {Boolean} providedOptions.mappedProps.PROP.twoWay
 *  - Whether the prop has a corresponding PROP_changed
 *   event
 * @param {Boolean} providedOptions.mappedProps.PROP.noBind
 *  - If true, do not apply the default bindProps / bindEvents.
 * However it will still be added to the list of component props
 * @param {Object} providedOptions.props - Regular Vue-style props.
 *  Note: must be in the Object form because it will be
 *  merged with the `mappedProps`
 *
 * @param {Object} providedOptions.events - Google Maps API events
 *  that are not bound to a corresponding prop
 * @param {String} providedOptions.name - e.g. `polyline`
 * @param {Function} providedOptions.ctr - constructor, e.g.
 *  `google.maps.Polyline`. However, since this is not
 *  generally available during library load, this becomes
 *  a function instead, e.g. () => google.maps.Polyline
 *  which will be called only after the API has been loaded
 *
 *  default: () => String
 *
 * @param {Function} providedOptions.ctrArgs -
 *   If the constructor in `ctr` needs to be called with
 *   arguments other than a single `options` object, e.g. for
 *   GroundOverlay, we call `new GroundOverlay(url, bounds, options)`
 *   then pass in a function that returns the argument list as an array
 *
 *   default: (MappedProps, OtherVueProps) => Array
 *
 * Otherwise, the constructor will be called with an `options` object,
 *   with property and values merged from:
 *
 *   1. the `options` property, if any
 *   2. a `map` property with the Google Maps
 *   3. all the properties passed to the component in `mappedProps`
 * @param {Function} providedOptions.beforeCreate -
 *  Hook to modify the options passed to the initializer
 *
 *  default: (Object) => Any
 *
 * @param {Function} providedOptions.afterCreate -
 *  Hook called when
 *
 *  default: (options.ctr, Object) => Any
 *
 * @returns {Object} A component object that should be exported by default from a Vue component
 */
export function pluginComponentBuilder(
  providedOptions: IGmapVueElementOptions
): ComponentOptions {
  const {
    mappedProps,
    name,
    ctr,
    ctrArgs,
    events,
    beforeCreate,
    afterCreate,
    props,
    ...rest
  } = providedOptions;

  const promiseName = `$${name}Promise`;
  const instanceName = `$${name}Object`;

  _assert(!(props instanceof Array), '`props` should be an object, not Array');

  return {
    props: {
      ...props,
    },
    async setup() {},
    render() {
      return '';
    },
    provide() {
      const promise = useMapPromise()
        ?.then((map) => {
          if (!map) {
            throw new Error('the map instance was not created');
          }

          // Infowindow needs this to be immediately available
          this.$map = map;

          // Initialize the maps with the given options
          const options = {
            map,
            ...getPropsValuesWithoutOptionsProp(props, this),
            ...this.options,
          };
          // don't use delete keyword in order to create a more predictable code for the engine

          if (beforeCreate) {
            const result = beforeCreate.bind(this)(options);

            if (result instanceof Promise) {
              return result.then(() => ({ options }));
            }
          }
          return { options };
        })
        .then(({ options }: { options: { [key: string]: any } }) => {
          const ConstructorObject = ctr();
          // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
          this[instanceName] = ctrArgs
            ? new (Function.prototype.bind.call(
                ConstructorObject,
                null,
                ...ctrArgs(
                  options,
                  getPropsValuesWithoutOptionsProp(props || {}, this)
                )
              ))()
            : new ConstructorObject(options);

          bindProps(mappedProps, this[instanceName], this);
          bindEvents(events, this[instanceName], this);

          if (afterCreate) {
            afterCreate.bind(this)(this[instanceName]);
          }
          return this[instanceName];
        });

      this[promiseName] = promise;
      return { [promiseName]: promise };
    },
    destroyed() {
      // Note: not all Google Maps components support maps
      if (this[instanceName] && this[instanceName].setMap) {
        this[instanceName].setMap(null);
      }
    },
    ...rest,
  };
}
```

Below you can see the interface of the options object that it receives

```ts showLineNumbers
export interface IVueProp {
  type?:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor
    | FunctionConstructor
    | SymbolConstructor;
  required?: boolean;
  default?: () => undefined;
  validator?: () => boolean;
}

export interface IGmapVueElementOptions {
  mappedProps: Omit<SinglePluginComponentConfig, 'events'>;
  props: { [key: string]: IVueProp };
  events: string[];
  name: string;
  ctr: () => any;
  ctrArgs: (
    options: { [key: string]: any },
    props: { [key: string]: IVueProp }
  ) => any[];
  beforeCreate: (options: { [key: string]: any }) => any;
  afterCreate: (mapElementInstance: { [key: string]: any }) => any;
}
```

:::info
You can check the `SinglePluginComponentConfig` type [here](/docs/vue-3-version/api/types#singleplugincomponentconfig)
:::

## `getGoogleMapsAPI`

This functions helps you to get the global `google` object if it is available on your page.

### `getGoogleMapsAPI` API

```ts showLineNumbers
/**
 * This function helps you to get the Google Maps API
 * when its ready on the window object
 * @function
 */
function getGoogleMapsAPI(): false | GlobalGoogleObject {
  return globalThis.GoogleMapsApi.isReady && globalThis.google;
}
```

:::info
Check the `GlobalGoogleObject` type [here](/docs/vue-3-version/api/types)
:::
