/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMapPromise } from '@/composables';
import type { IGmapVueElementOptions } from '@/interfaces';
import { $mapPromise } from '@/keys';
import type { ComponentOptions, ComponentPublicInstance } from 'vue';
import {
  bindEvents,
  bindProps,
  getPropsValuesWithoutOptionsProp,
} from './helpers';

/**
 * Custom assert for local validation
 * @internal
 *
 * @param  {boolean} v The expression that should return a boolean value, if false the assertion fails
 * @param  {string} message Error message to be displayed
 */
function _assert(v: boolean, message: string): void {
  if (!v) throw new Error(message);
}

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
  providedOptions: IGmapVueElementOptions,
): ComponentOptions {
  const {
    mappedProps,
    name,
    ctr,
    ctrArgs,
    events,
    beforeCreate,
    afterCreate,
    props = {},
    ...rest
  } = providedOptions;

  const promiseName = `$${name}Promise`;
  const instanceName = `$${name}Object`;

  _assert(!(props instanceof Array), '`props` should be an object, not Array');

  return {
    props: {
      ...props,
    },
    setup() {
      return undefined;
    },
    render() {
      return '';
    },
    provide() {
      const thisInstance = this as ComponentPublicInstance & {
        $map: google.maps.Map;
        options: Record<string, any>;
        [key: string]: any;
      };

      const promise = useMapPromise($mapPromise)
        .then((map) => {
          if (!map) {
            throw new Error('the map instance is not defined');
          }

          // InfoWindow needs this to be immediately available
          thisInstance.$map = map;

          // Initialize the maps with the given options
          const options = {
            map,
            ...getPropsValuesWithoutOptionsProp(props, thisInstance),
            ...thisInstance.options,
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
        .then(({ options }: { options: Record<string, any> }) => {
          const ConstructorObject = ctr();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          thisInstance[instanceName] = ctrArgs
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              new (Function.prototype.bind.call(
                ConstructorObject,
                null,
                ...ctrArgs(
                  options,
                  getPropsValuesWithoutOptionsProp(props, thisInstance),
                ),
              ))()
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              new (ConstructorObject as any)(options);

          bindProps(
            mappedProps,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion
            thisInstance[instanceName] as any,
            thisInstance,
          );
          bindEvents(
            events,
            thisInstance[instanceName] as Record<string, any>,
            thisInstance,
          );

          if (afterCreate) {
            afterCreate.bind(thisInstance)(
              thisInstance[instanceName] as Record<string, any>,
            );
          }
          return thisInstance[instanceName] as Record<string, any>;
        });

      thisInstance[promiseName] = promise;
      return { [promiseName]: promise };
    },
    destroyed() {
      const thisInstance = this as ComponentPublicInstance & {
        options: Record<string, any>;
        [key: string]: {
          setMap?: (value: google.maps.Map | null) => void;
        };
      };

      // Note: not all Google Maps components support maps
      if (thisInstance[instanceName]?.setMap) {
        (
          thisInstance[instanceName] as {
            setMap: (value: google.maps.Map | null) => void;
          }
        ).setMap(null);
      }
    },
    ...rest,
  };
}
