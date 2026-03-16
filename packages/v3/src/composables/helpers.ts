/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IGmapVuePluginOptions,
  IVueProp,
  PromiseDeferred,
} from '@/interfaces';
import type {
  ISinglePluginComponentConfig,
  TGmapVuePluginProps,
  TGoogleMapsInstances,
  TLazyValueGetterFn,
  TOldHtmlInputElement,
} from '@/types';
import equal from 'fast-deep-equal';
import {
  getCurrentInstance,
  nextTick,
  reactive,
  watch,
  type ComponentInternalInstance,
  type ComponentPublicInstance,
} from 'vue';

/**
 * Function that helps you to capitalize the first letter on a word
 *
 * @param  {string} text the text that you want to capitalize
 * @returns {string}
 *
 * @internal
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Function that helps you to get all non-nullable props from a component
 *
 * @param  {Object} vueInst the Vue component instance
 * @param  {Object} props the props object
 * @returns {Object}
 *
 * @internal
 */
export function getPropsValuesWithoutOptionsProp(
  props: Record<string | number | symbol, unknown>,
  vueInst?: ComponentPublicInstance,
): Omit<Record<string | number | symbol, IVueProp | undefined>, 'options'> {
  if (vueInst) {
    return Object.keys(props).reduce<
      Record<string | number | symbol, IVueProp | undefined>
    >((acc, propKey) => {
      if (
        propKey !== 'options' &&
        !/^(\w+)(key)$/gim.test(propKey) &&
        (vueInst.$props as Record<string, IVueProp>)[propKey] != null
      ) {
        acc[propKey] = (vueInst.$props as Record<string, IVueProp>)[propKey];
      }

      return acc;
    }, {});
  }

  return Object.keys(props).reduce<
    Record<string | number | symbol, IVueProp | undefined>
  >((acc, propKey) => {
    if (
      propKey !== 'options' &&
      !/^(\w+)(key)$/gim.test(propKey) &&
      props[propKey] != null
    ) {
      acc[propKey] = (props as Record<string, IVueProp>)[propKey];
    }

    return acc;
  }, {});
}

/**
 * This function is a helper for return to the user the internal Google Maps promise
 * and can wait until it is ready.
 * This piece of code was orignally written by sindresorhus and can be seen here
 * @see https://github.com/sindresorhus/lazy-value/blob/master/index.js
 *
 * @param  {Function} fn a function that actually return the promise or async value
 * @returns {Function} anonymous function that returns the value returned by the fn parameter
 *
 * @internal
 */
export function getLazyValue<T>(
  fn: TLazyValueGetterFn<T>,
): TLazyValueGetterFn<T> {
  let called = false;
  let ret: Promise<T>;

  return (): Promise<T> => {
    if (!called) {
      called = true;
      ret = fn();
    }

    return ret;
  };
}

/**
 * Strips out the extraneous properties we have in our
 * mapped props definitions
 *
 * @param {Object} mappedProps the mapped props object
 * @returns {Object}
 *
 * @internal
 */
export function filterVuePropsOptions<T extends TGmapVuePluginProps>(
  mappedProps: T,
): Record<keyof T, IVueProp> {
  return Object.entries(mappedProps).reduce<Record<string, IVueProp>>(
    (acc, [key, prop]) => {
      const value: IVueProp = {};

      if ('type' in prop) value.type = prop.type;
      if ('default' in prop) value.default = prop.default;
      if ('required' in prop) value.required = prop.required;

      acc[key] = value;
      return acc;
    },
    {},
  ) as Record<keyof T, IVueProp>;
}

/**
 * This function simulates a down arrow key event when user
 * hits return (enter) on the autocomplete component selection
 * the first occurrence in the list.
 *
 * This piece of code was orignally written by amirnissim
 * and has been ported to Vanilla.js by GuillaumeLeclerc
 * @see http://stackoverflow.com/a/11703018/2694653
 *
 * @param  {Object} input the HTML input node element reference
 * @returns {void}
 *
 * @internal
 */
export function downArrowSimulator(input: HTMLInputElement | null): void {
  if (!input) {
    throw new Error(`The input for downArrowSimulator should be defined`);
  }

  const _addEventListener = isOldHtmlInputElementGuard(input)
    ? input.attachEvent.bind(input)
    : input.addEventListener.bind(input);

  /**
   * Add event listener wrapper that will replace to default addEventListener or attachEvent function
   *
   * @param  {string} type the event type
   * @param  {Function} listener function should be executed when the event is fired
   * @returns {void}
   */
  function addEventListenerWrapper(
    type: string,

    listener: (...args: any[]) => any,
  ): void {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type === 'keydown') {
      const origListener = listener;

      listener = (event: KeyboardEvent) => {
        const suggestionSelected =
          document.getElementsByClassName('pac-item-selected').length > 0;
        if (
          event.key === 'Enter' &&
          event.code === 'Enter' &&
          !suggestionSelected
        ) {
          const simulatedArrowDownKeyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
          });
          origListener.apply(input, [simulatedArrowDownKeyDownEvent]);
        }

        origListener.apply(input, [event]);
      };
    }

    _addEventListener.apply(input, [type, listener]);
  }

  input.addEventListener = addEventListenerWrapper;

  if (isOldHtmlInputElementGuard(input)) {
    input.attachEvent = addEventListenerWrapper;
  }
}

/**
 * When you have two-way bindings, but the actual bound value will not equal
 * the value you initially passed in, then to avoid an infinite loop you
 * need to increment a counter every time you pass in a value, decrement the
 * same counter every time the bound value changed, but only bubble up
 * the event when the counter is zero.
 *
 * @param  {Function} fn Function to be executed to determine if the event was executed
 *
 Example:

 Let's say DrawingRecognitionCanvas is a deep-learning backed canvas
 that, when given the name of an object (e.g. 'dog'), draws a dog.
 But whenever the drawing on it changes, it also sends back its interpretation
 of the image by way of the @newObjectRecognized event.

 <input
 type="text"
 placeholder="an object, e.g. Dog, Cat, Frog"
 v-model="identifiedObject" />
 <DrawingRecognitionCanvas
 :object="identifiedObject"
 @newObjectRecognized="identifiedObject = $event"
 />

 new TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
      this.$watch('identifiedObject', () => {
        // new object passed in
        increment()
      })
      this.$deepLearningBackend.on('drawingChanged', () => {
        recognizeObject(this.$deepLearningBackend)
          .then((object) => {
            decrement()
            if (shouldUpdate()) {
              this.$emit('newObjectRecognized', object.name)
            }
          })
      })
    })
 */
/** @internal */
export function twoWayBindingWrapper(
  fn: (
    increment: () => void,
    decrement: () => void,
    shouldUpdate: () => boolean,
  ) => void,
): void {
  let counter = 0;

  fn(
    () => {
      counter += 1;
    },
    () => {
      counter = Math.max(0, counter - 1);
    },
    () => counter === 0,
  );
}

/**
 * This function should be used on normal options API but never inside setup function.
 *
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 *
 * @param  {string[]} propertiesToTrack string array with all properties that you want to track
 * @param  {Function} handler function to be fired when the prop change
 * @param  {boolean} immediate=false
 * @param  {Object} vueInst the component instance
 * @returns {void}
 *
 * @internal
 */
export function watchPrimitiveProperties(
  propertiesToTrack: string[],
  handler: () => any,
  vueInst: ComponentPublicInstance,
  immediate = false,
): void {
  let isHandled = false;

  /**
   * Function in charge to execute the handler function if it was not fired
   *
   * @returns void
   */
  function requestHandle(): void {
    if (!isHandled) {
      isHandled = true;
      void vueInst.$nextTick(() => {
        isHandled = false;
        handler();
      });
    }
  }

  propertiesToTrack.forEach((prop) => {
    vueInst.$watch(prop, requestHandle, { immediate });
  });
}

/**
 * This function should be used inside setup function or script.
 *
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 *
 * @param  {string[]} propertiesToTrack string array with all properties that you want to track
 * @param  {Function} handler function to be fired when the prop change
 * @param  {boolean} immediate=false
 * @param  {Object} props the props object that is set on setup script
 * @returns {void}
 *
 * @internal
 */
export function watchPrimitivePropertiesOnSetup(
  propertiesToTrack: string[],
  handler: () => any,
  props: Record<string, any>,
  immediate = false,
): void {
  let isHandled = false;

  /**
   * Function in charge to execute the handler function if it was not fired
   *
   * @returns void
   */
  function requestHandle(value: any, oldValue: any): void {
    if (!isHandled) {
      isHandled = true;

      void nextTick(() => {
        isHandled = false;
        if (value && !equal(value, oldValue)) {
          handler();
        }
      });
    }
  }

  propertiesToTrack.forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    watch(() => props[prop], requestHandle, { immediate });
  });
}

/**
 * This function helps you to bind events from Google Maps API to Vue events
 *
 * Note: For options API. This function should not be used on setup script.
 *
 * @param  {string[]} eventsConfig an array of string with all events that you want to bind
 * @param  {Object} googleMapsInst the Google Maps instance
 * @param  {Object} vueInst the Vue instance
 * @param {string[]} [excludedEvents=[]] - List of events that shouldn't be bind
 * @returns {void}
 *
 * @internal
 */
export function bindEvents(
  eventsConfig: string[],
  googleMapsInst: Record<string, any>,
  vueInst: ComponentPublicInstance & { $gmapOptions: IGmapVuePluginOptions },
  excludedEvents: string[] = [],
): void {
  eventsConfig.forEach((eventName) => {
    if (
      !excludedEvents.includes(eventName) &&
      !eventName.includes('_changed')
    ) {
      (
        googleMapsInst.addListener as (
          e: string,
          cbk: (ev: any) => void,
        ) => void
      )(eventName, (ev: any) => {
        vueInst.$emit(eventName, ev);
      });
    }
  });
}

/**
 * Binds the properties defined in props to the google maps instance.
 * If the prop is an Object type, and we wish to track the properties
 * of the object (e.g. the lat and lng of a LatLng), then we do a deep
 * watch. For deep watch, we also prevent the _changed event from being
 * emitted if the data source was external.
 *
 * Note: For options API. This function should not be used on setup script.
 *
 * @param  {Object} propsComponentConfig object with the component props tha should be synched with the Google Maps instances props
 * @param  {Object} AnyGoogleMapsClassInstance the Maps, Marker, Circle or any Google Maps class instance
 * @param  {Object} vueInst the component instance
 * @returns {void}
 *
 * @internal
 */
export function bindProps(
  propsComponentConfig: Omit<ISinglePluginComponentConfig, 'events'>,
  AnyGoogleMapsClassInstance: TGoogleMapsInstances,
  vueInst: ComponentPublicInstance & { $gmapOptions: IGmapVuePluginOptions },
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const instance = AnyGoogleMapsClassInstance as any;
  Object.entries(vueInst.$props).forEach(([propKey, propValue]) => {
    if (!propsComponentConfig.noBind.includes(propKey)) {
      const setMethodName = `set${capitalizeFirstLetter(propKey)}`;
      const getMethodName = `get${capitalizeFirstLetter(propKey)}`;
      const eventName = `${propKey.toLowerCase()}_changed`;

      if (
        instance[setMethodName] &&
        typeof instance[setMethodName] === 'function'
      ) {
        // We need to avoid an endless
        // propChanged -> event emitted -> propChanged -> event emitted loop
        // although this may really be the user's responsibility
        if (
          (typeof propValue !== 'object' && !Array.isArray(propValue)) ||
          !propsComponentConfig.trackProperties[propKey]?.length
        ) {
          // Track the object deeply
          watch(
            // TODO: confirm this watch works, because I think it needs the variable not only the name of the variable
            () => propKey,
            () => {
              (instance[setMethodName] as (p: unknown) => void)(propValue);
            },
            {
              immediate: propValue != undefined,
              deep: typeof propValue !== 'object' && !Array.isArray(propValue),
            },
          );
        } else {
          watchPrimitivePropertiesOnSetup(
            propsComponentConfig.trackProperties[propKey].map(
              (prop) => `${propKey}.${prop}`,
            ),
            () => {
              (instance[setMethodName] as (p: unknown) => void)(propValue);
            },
            vueInst.$props,
            propValue != undefined,
          );
        }
      }

      if (propsComponentConfig.twoWay.includes(propKey)) {
        if (
          instance[getMethodName] &&
          typeof instance[getMethodName] === 'function'
        ) {
          (
            AnyGoogleMapsClassInstance.addListener as (
              p: string,
              cbk: () => void,
            ) => void
          )(eventName, () => {
            const value = (instance[getMethodName] as () => unknown)();

            if (
              value &&
              !equal(value, (vueInst.$props as Record<string, any>)[propKey])
            ) {
              vueInst.$emit(
                eventName,
                (instance[getMethodName] as () => unknown)(),
              );
            }
          });
        }
      }
    }
  });
}

/**
 * This function helps you to bind events from Google Maps API to Vue events on setup
 *
 * Note: For composition API. This function should be used on setup script.
 *
 * @param  {string[]} eventsComponentConfig - An array of string with all events that you want to bind
 * @param  {Object} AnyGoogleMapsClassInstance - Any Google Maps instance
 * @param {() => void} emits - The Vue emit object built with defineEmits function
 * @param {string[]} [excludedEvents=[]] - List of events that shouldn't be bind
 * @returns {void}
 *
 * @internal
 */
export function bindGoogleMapsEventsToVueEventsOnSetup(
  eventsComponentConfig: string[],
  AnyGoogleMapsClassInstance: TGoogleMapsInstances,
  emits: (ev: string, value: any) => void,
  excludedEvents: string[] = [],
): void {
  eventsComponentConfig.forEach((eventName) => {
    if (
      !excludedEvents.includes(eventName) &&
      !eventName.includes('_changed')
    ) {
      (
        AnyGoogleMapsClassInstance.addListener as (
          e: string,
          cbk: (ev: any) => void,
        ) => void
      )(eventName, (ev: any) => {
        emits(eventName, ev);
      });
    }
  });
}

/**
 * Binds the properties defined in props to the google maps instance.
 * If the prop is an Object type, and we wish to track the properties
 * of the object (e.g. the lat and lng of a LatLng), then we do a deep
 * watch. For deep watch, we also prevent the _changed event from being
 * emitted if the data source was external.
 *
 * Note: For composition API. This function should be used on setup script.
 *
 * @param {ISinglePluginComponentConfig} propsComponentConfig - The plugin component configuration for this Google Maps instance
 * @param  {Object} AnyGoogleMapsClassInstance the Maps, Marker, Circle or any Google Maps class instance
 * @param {() => void} emits - The Vue emit object built with defineEmits function
 * @param  {Object} props - Vue component props  of the component that should be synced with the Google Maps instances props
 * @returns {void} The object which contain all event names to and params that should be used to add listener to the Google Maps instance
 *
 * @internal
 */
export function bindPropsWithGoogleMapsSettersAndGettersOnSetup(
  propsComponentConfig: Omit<ISinglePluginComponentConfig, 'events'>,
  AnyGoogleMapsClassInstance: TGoogleMapsInstances,
  emits: (ev: string, value: unknown) => void,
  props: Record<string, unknown>,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const instance = AnyGoogleMapsClassInstance as any;

  Object.keys(props).forEach((propKey) => {
    if (!propsComponentConfig.noBind.includes(propKey)) {
      const { eventName, getMethodName } =
        bindVuePropsWithGoogleMapsPropsSetters(
          propKey,
          props,
          propsComponentConfig.trackProperties[propKey] ?? [],
          AnyGoogleMapsClassInstance,
        );

      if (propsComponentConfig.twoWay.includes(propKey)) {
        const hasGetter =
          !!instance[getMethodName] &&
          typeof instance[getMethodName] === 'function';
        // Fall back to direct property read for APIs that don't expose getX() methods
        // (e.g. AdvancedMarkerElement uses `marker.position` instead of `getPosition()`)
        const canGetDirectly = !hasGetter && propKey in instance;

        if (hasGetter || canGetDirectly) {
          const getValue = hasGetter
            ? () => (instance[getMethodName] as () => unknown).call(instance)
            : () => instance[propKey] as unknown;

          (
            AnyGoogleMapsClassInstance.addListener as (
              e: string,
              cbk: () => void,
            ) => void
          )(eventName, () => {
            const value = getValue();

            if (value && !equal(value, props[propKey])) {
              emits(eventName, value);
            }
          });
        }
      }
    }
  });
}

/** @internal */
export function deferredPromiseFactory<T>(): PromiseDeferred<T> {
  return reactive({
    resolve: undefined,
    reject: undefined,
  });
}

/** @internal */
export function componentPromiseFactory<T>(
  deferredPromise: PromiseDeferred<T>,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    deferredPromise.resolve = resolve;
    deferredPromise.reject = reject;
  });
}

/** @internal */
export function findParentInstanceByName(
  componentName: string,
): ComponentInternalInstance | null | undefined {
  let ancestor: ComponentInternalInstance | null | undefined; // = currentInstance?.parent;
  let name: string | undefined; // = ancestor?.type.name || ancestor?.type.__name;

  function updateAncestor(instance: ComponentInternalInstance | null) {
    const ancestor = instance?.parent;
    const name = ancestor?.type.name ?? ancestor?.type.__name;

    return { ancestor, name };
  }

  const currentInstance = getCurrentInstance();
  ({ ancestor, name } = updateAncestor(currentInstance));

  while (ancestor && name !== componentName) {
    ({ ancestor, name } = updateAncestor(ancestor));
  }

  return ancestor;
}

/** @internal */
function bindVuePropsWithGoogleMapsPropsSetters(
  propKey: string,
  props: Record<string, unknown>,
  trackProperties: string[],
  AnyGoogleMapsClassInstance: TGoogleMapsInstances,
): { eventName: string; getMethodName: string } {
  const setMethodName = `set${capitalizeFirstLetter(propKey)}`;
  const getMethodName = `get${capitalizeFirstLetter(propKey)}`;
  const eventName = `${propKey.toLowerCase()}_changed`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const instanceAny = AnyGoogleMapsClassInstance as any;

  const hasSetter =
    !!instanceAny?.[setMethodName] &&
    typeof instanceAny?.[setMethodName] === 'function';
  // Fall back to direct property assignment for APIs that don't expose setX() methods
  // (e.g. AdvancedMarkerElement uses `marker.position = value` instead of `setPosition()`)
  const canSetDirectly = !hasSetter && propKey in instanceAny;

  if (hasSetter || canSetDirectly) {
    const applyValue = hasSetter
      ? (value: unknown) => {
          (instanceAny[setMethodName] as (value: unknown) => void).call(
            AnyGoogleMapsClassInstance,
            value,
          );
        }
      : (value: unknown) => {
          instanceAny[propKey] = value;
        };

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    if (
      (typeof props[propKey] !== 'object' && !Array.isArray(props[propKey])) ||
      !trackProperties.length
    ) {
      // Track the object deeply
      watch(
        () => props[propKey],
        (value, oldValue) => {
          if (value != null && !equal(value, oldValue)) {
            applyValue(value);
          }
        },
        {
          immediate: props[propKey] != undefined,
          deep:
            typeof props[propKey] !== 'object' &&
            !Array.isArray(props[propKey]),
        },
      );
    } else {
      watchPrimitivePropertiesOnSetup(
        trackProperties.map((prop) => `${propKey}.${prop}`),
        () => {
          applyValue(props[propKey]);
        },
        props,
        props[propKey] != undefined,
      );
    }
  }

  return { eventName, getMethodName };
}

/** @internal */
function isOldHtmlInputElementGuard(
  input: HTMLInputElement | TOldHtmlInputElement,
): input is TOldHtmlInputElement {
  return !!(input as TOldHtmlInputElement).attachEvent;
}
