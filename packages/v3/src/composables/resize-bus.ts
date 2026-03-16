import type { Emitter, EventType } from 'mitt';
import mitt from 'mitt';
import { nextTick, ref, watch } from 'vue';

const defaultResizeBus = mitt();
const currentResizeBus = ref<Emitter<Record<EventType, unknown>> | undefined>();
let _resizeCallback: () => void;
let _delayedResizeCallback: () => void;

/**
 * This function should be used to set and use the defined resize bus function
 * the default one or a custom one
 *
 * @param {google.maps.Map} map - The Google Maps instance
 * @param {Object} props - The Vue props of MapLayer component
 * @param {() => void} resizeFn - The resize function that _resizeCallback function should use
 *
 * @internal
 */
export function onMountedResizeBusHook(
  props: { resizeBus?: Emitter<Record<EventType, unknown>> },
  resizeFn: () => void,
) {
  if (!props.resizeBus) {
    currentResizeBus.value = defaultResizeBus;
  }

  if (props.resizeBus) {
    currentResizeBus.value = props.resizeBus;
  }

  _resizeCallback = (): void => {
    resizeFn();
  };

  _delayedResizeCallback = (): void => {
    nextTick()
      .then(() => {
        _resizeCallback();
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  };

  watch(
    () => props.resizeBus,
    (newVal) => {
      currentResizeBus.value = newVal;
    },
  );

  watch(
    () => currentResizeBus,
    (newVal, oldVal) => {
      if (oldVal.value) {
        oldVal.value.off('resize', _delayedResizeCallback);
      }

      if (newVal.value) {
        newVal.value.on('resize', _delayedResizeCallback);
      }
    },
  );
}

/**
 * Function that should be used on MapLayer component on unmount hook
 *
 * @returns void
 *
 * @internal
 */
export function onUnmountedResizeBusHook() {
  if (currentResizeBus.value) {
    currentResizeBus.value.off('resize', _delayedResizeCallback);
  }
}

/**
 * This function return the defaultResizeBus function
 *
 * @returns {() => void}
 *
 * @internal
 */
export function useDefaultResizeBus() {
  return defaultResizeBus;
}

/**
 * @typedef ResizeBus
 * @property {() => void} currentResizeBus
 * @property {() => void} _resizeCallback
 * @property {() => void} _delayedResizeCallback
 */
/**
 * this function returns the rezise bus functions
 *
 * @public
 * @returns {ResizeBus}
 */
export function useResizeBus() {
  return {
    currentResizeBus,
    _resizeCallback,
    _delayedResizeCallback,
  };
}
