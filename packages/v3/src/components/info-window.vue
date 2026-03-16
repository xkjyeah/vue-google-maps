<template>
  <div class="info-window-container">
    <div ref="gmvInfoWindowRef" class="info-window-content">
      <!-- so named because it will fly away to another component -->
      <!-- @slot Used to set your info window.  -->
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  findParentInstanceByName,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useMarkerPromise,
  usePluginOptions,
} from '@/composables';
import type { IInfoWindowVueComponentProps } from '@/interfaces';
import { $infoWindowPromise } from '@/keys';
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  useTemplateRef,
  watch,
} from 'vue';

/**
 * InfoWindow component
 * @displayName GmvInfoWindow
 * @see [source code](/guide/info-window.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/infowindows)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/info-window)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    content?: string | Element | Text;
    disableAutoPan?: boolean;
    maxWidth?: number;
    minWidth?: number;
    pixelOffset?: google.maps.Size;
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    zIndex?: number;
    opened?: boolean;
    marker?: google.maps.marker.AdvancedMarkerElement;
    infoWindowKey?: string;
    markerKey?: string;
    mapKey?: string;
    options?: Record<string | number | symbol, unknown>;
  }>(),
  {
    disableAutoPan: false,
    ariaLabel: undefined,
    content: undefined,
    maxWidth: undefined,
    minWidth: undefined,
    pixelOffset: undefined,
    position: undefined,
    zIndex: undefined,
    opened: undefined,
    marker: undefined,
    infoWindowKey: undefined,
    markerKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const gmvInfoWindow = useTemplateRef<HTMLElement | null>('gmvInfoWindowRef');
const emits = defineEmits<{
  close: [];
  closeclick: [];
  content_changed: [];
  domready: [];
  position_changed: [];
  visible: [];
  zindex_changed: [];
}>();

/*******************************************************************************
 * INJECT
 ******************************************************************************/
const mapPromise = props.mapKey
  ? inject<Promise<google.maps.Map | undefined>>(props.mapKey)
  : (findParentInstanceByName('map-layer')?.exposed?.mapPromise as Promise<
      google.maps.Map | undefined
    >);

if (!mapPromise) {
  throw new Error('The map promise was not built');
}

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: infoWindowPromiseDeferred, promise } =
  useComponentPromiseFactory(props.infoWindowKey ?? $infoWindowPromise);
provide(props.infoWindowKey ?? $infoWindowPromise, promise);

/*******************************************************************************
 * INFO WINDOW
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'info-window' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
let rawMap: google.maps.Map | undefined;
let rawMarkerOwner: google.maps.marker.AdvancedMarkerElement | undefined;
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    rawMap = mapInstance;

    const markerPromise = useMarkerPromise(props.markerKey);
    const infoWindowOptions: Partial<IInfoWindowVueComponentProps> & {
      map: google.maps.Map | undefined;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    markerPromise
      .then((markerInstance) => {
        rawMarkerOwner = markerInstance;
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    const { InfoWindow } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const infoWindow = new InfoWindow({
      ...infoWindowOptions,
      content: gmvInfoWindow.value,
    });

    const infoWindowPropsConfig = getComponentPropsConfig('GmvInfoWindow');
    const infoWindowEventsConfig = getComponentEventsConfig(
      'GmvInfoWindow',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      infoWindowPropsConfig,
      infoWindow,
      emits as (ev: string, value: unknown) => void,
      props,
    );

    bindGoogleMapsEventsToVueEventsOnSetup(
      infoWindowEventsConfig,
      infoWindow,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!infoWindowPromiseDeferred.resolve) {
      throw new Error('infoWindowPromiseDeferred.resolve is undefined');
    }

    infoWindowPromiseDeferred.resolve(infoWindow);
  })
  .then(() => openInfoWindow())
  .catch((error: unknown) => {
    throw error;
  });

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const map = computed(() => rawMap);
const markerOwner = computed(() => rawMarkerOwner);

/*******************************************************************************
 * METHODS
 ******************************************************************************/
const openInfoWindow = async (): Promise<void> => {
  const infoWindow = await promise;

  if (!infoWindow) {
    console.error('the info window instance is not defined');
    return;
  }

  if (props.opened) {
    if (markerOwner.value) {
      infoWindow.open(map.value, markerOwner.value);
    } else if (props.marker) {
      infoWindow.open(map.value, props.marker);
    } else {
      infoWindow.open(map.value);
    }
  } else {
    infoWindow.close();
  }
};

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.opened,
  async () => {
    await openInfoWindow();
  },
);

watch(
  () => props.position,
  async (value, oldValue) => {
    const infoWindow = await promise;

    if (!infoWindow) {
      console.error('the info window is not defined');
      return;
    }

    if (value && value !== oldValue) {
      infoWindow.setPosition(value);
    }
  },
);
watch(
  () => props.content,
  async (value, oldValue) => {
    const infoWindow = await promise;

    if (!infoWindow) {
      console.error('the info window is not defined');
      return;
    }

    if (value && value !== oldValue) {
      infoWindow.setContent(value);
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onMounted(() => {
  const el = gmvInfoWindow.value;

  if (el) {
    el.parentNode?.removeChild(el);
  }
});

onUnmounted(async () => {
  (await promise)?.close();
  useDestroyPromisesOnUnmounted(props.infoWindowKey ?? $infoWindowPromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ infoWindowPromise: promise });
</script>
