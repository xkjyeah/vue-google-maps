<template>
  <div class="gmv-street-view-panorama-container">
    <div ref="gmvStreetViewPanoramaRef" class="gmv-street-view-panorama" />
    <!-- @slot A default slot to render the street view panorama -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  twoWayBindingWrapper,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useGoogleMapsApiPromiseLazy,
  usePluginOptions,
  useResizeBus,
} from '@/composables';
import type { IStreetViewPanoramaVueComponentProps } from '@/interfaces';
import { $streetViewPanoramaPromise } from '@/keys';
import equal from 'fast-deep-equal';
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  useTemplateRef,
  watch,
} from 'vue';

/**
 * Street View Panorama component
 * @displayName GmvStreetViewPanorama
 * @see [source code](/guide/street-view-panorama.html#source-code)
 * @see [official guide](https://developers.google.com/maps/documentation/javascript/streetview?hl=es)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanorama)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    addressControl?: boolean;
    addressControlOptions?: google.maps.StreetViewAddressControlOptions;
    clickToGo?: boolean;
    controlSize?: number;
    disableDefaultUI?: boolean;
    disableDoubleClickZoom?: boolean;
    enableCloseButton?: boolean;
    fullscreenControl?: boolean;
    fullscreenControlOptions?: google.maps.FullscreenControlOptions;
    imageDateControl?: boolean;
    linksControl?: boolean;
    motionTracking?: boolean;
    motionTrackingControl?: boolean;
    motionTrackingControlOptions?: google.maps.MotionTrackingControlOptions;
    panControl?: boolean;
    panControlOptions?: google.maps.PanControlOptions;
    pano?: string;
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    pov?: google.maps.StreetViewPov;
    scrollwheel?: boolean;
    showRoadLabels?: boolean;
    visible?: boolean;
    zoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: google.maps.ZoomControlOptions;
    streetViewKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    clickToGo: true,
    disableDoubleClickZoom: true,
    enableCloseButton: false,
    scrollwheel: true,
    showRoadLabels: true,
    visible: true,
    addressControlOptions: undefined,
    controlSize: undefined,
    fullscreenControlOptions: undefined,
    motionTrackingControlOptions: undefined,
    panControlOptions: undefined,
    pano: undefined,
    position: undefined,
    pov: undefined,
    zoom: undefined,
    zoomControlOptions: undefined,
    streetViewKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const gmvStreetViewPanorama = useTemplateRef<HTMLDivElement | null>(
  'gmvStreetViewPanoramaRef',
);
const emits = defineEmits<{
  closeclick: [value: Event];
  pano_changed: [];
  position_changed: [value: google.maps.LatLng | null];
  pov_changed: [];
  resize: [];
  status_changed: [];
  visible_changed: [];
  zoom_changed: [];
}>();

/*******************************************************************************
 * STREET VIEW PANORAMA
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'street-view-panorama' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: streetViewPanoramaPromiseDeferred, promise } =
  useComponentPromiseFactory(props.streetViewKey ?? $streetViewPanoramaPromise);
provide(props.streetViewKey ?? $streetViewPanoramaPromise, promise);

/*******************************************************************************
 * RESIZE BUS
 ******************************************************************************/
const { currentResizeBus, _delayedResizeCallback } = useResizeBus();
const { _resizeCallback } = useResizeBus();

/**
 * This method trigger the resize event of Google Maps
 * @method resize
 * @returns {void}
 * @public
 */
async function resize(): Promise<void> {
  const streetViewPanorama = await promise;

  if (streetViewPanorama) {
    google.maps.event.trigger(streetViewPanorama, 'resize');
  }
}

/**
 * Preserve the previous center when resize the map
 * @method resizePreserveCenter
 * @returns {void}
 * @public
 */
async function resizePreserveCenter(): Promise<void> {
  const streetViewPanorama = await promise;

  if (!streetViewPanorama) {
    return;
  }

  const oldCenter = streetViewPanorama.getPosition();
  google.maps.event.trigger(streetViewPanorama, 'resize');

  if (oldCenter) {
    streetViewPanorama.setPosition(oldCenter);
  }
}

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const finalLat = computed(() => {
  if (!props.position) {
    console.warn('position is not defined');
    return;
  }

  return typeof props.position.lat === 'function'
    ? props.position.lat()
    : props.position.lat;
});
const finalLng = computed(() => {
  if (!props.position) {
    console.warn('position is not defined');
    return;
  }

  return typeof props.position.lng === 'function'
    ? props.position.lng()
    : props.position.lng;
});
const finalLatLng = computed(
  () =>
    ({ lat: finalLat.value, lng: finalLng.value }) as google.maps.LatLngLiteral,
);

/*******************************************************************************
 * METHODS
 ******************************************************************************/

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.zoom,
  async (newValue, oldValue) => {
    const streetViewPanorama = await promise;

    if (streetViewPanorama && newValue && !equal(newValue, oldValue)) {
      streetViewPanorama.setZoom(newValue);
    }
  },
);

watch(
  () => props.pov,
  async (newValue, oldValue) => {
    const streetViewPanorama = await promise;

    if (streetViewPanorama && newValue && !equal(newValue, oldValue)) {
      streetViewPanorama.setPov(newValue);
    }
  },
);

watch(
  () => props.pano,
  async (newValue, oldValue) => {
    const streetViewPanorama = await promise;

    if (streetViewPanorama && newValue && !equal(newValue, oldValue)) {
      streetViewPanorama.setPano(newValue);
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onMounted(() => {
  useGoogleMapsApiPromiseLazy()
    ?.then(async () => {
      if (!gmvStreetViewPanorama.value) {
        throw new Error(
          `we can find the template ref: 'gmvStreetViewPanorama'`,
        );
      }

      const streetViewOptions: Partial<IStreetViewPanoramaVueComponentProps> &
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Record<string, any> = {
        ...getPropsValuesWithoutOptionsProp(props),
        ...props.options,
      };

      const { StreetViewPanorama } = (await google.maps.importLibrary(
        'streetView',
      )) as google.maps.StreetViewLibrary;
      const streetViewPanorama = new StreetViewPanorama(
        gmvStreetViewPanorama.value,
        streetViewOptions,
      );

      const streetViewPanoramaPropsConfig = getComponentPropsConfig(
        'GmvStreetViewPanorama',
      );
      const streetViewPanoramaEventsConfig = getComponentEventsConfig(
        'GmvStreetViewPanorama',
        'auto',
      );

      bindPropsWithGoogleMapsSettersAndGettersOnSetup(
        streetViewPanoramaPropsConfig,
        streetViewPanorama,
        emits as (ev: string, value: unknown) => void,
        props,
      );
      bindGoogleMapsEventsToVueEventsOnSetup(
        streetViewPanoramaEventsConfig,
        streetViewPanorama,
        emits as (ev: string, value: unknown) => void,
        excludedEvents,
      );

      // manually trigger position
      twoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        // Panos take a while to load
        increment();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!streetViewPanorama) {
          throw new Error('the street view panorama instance was not created');
        }

        streetViewPanorama.addListener('position_changed', () => {
          if (shouldUpdate()) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!streetViewPanorama) {
              throw new Error(
                'the street view panorama instance was not created',
              );
            }

            emits('position_changed', streetViewPanorama.getPosition());
          }

          decrement();
        });

        const updateCenter = () => {
          increment();
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!streetViewPanorama) {
            throw new Error(
              'the street view panorama instance was not created',
            );
          }

          streetViewPanorama.setPosition(finalLatLng.value);
        };

        watch([finalLat, finalLng], ([newLat, newLng], [oldLat, oldLng]) => {
          if (
            (newLat != null || newLng != null) &&
            (!equal(newLat, oldLat) || !equal(newLng, oldLng))
          ) {
            updateCenter();
          }
        });
      });

      if (!streetViewPanoramaPromiseDeferred.resolve) {
        throw new Error(
          'streetViewPanoramaPromiseDeferred.resolve is undefined',
        );
      }

      streetViewPanoramaPromiseDeferred.resolve(streetViewPanorama);
    })
    .catch((error: unknown) => {
      throw error;
    });
});

onUnmounted(() => {
  useDestroyPromisesOnUnmounted(
    props.streetViewKey ?? $streetViewPanoramaPromise,
  );
});
/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({
  currentResizeBus,
  _resizeCallback,
  _delayedResizeCallback,
  resize,
  resizePreserveCenter,
  streetViewPanoramaPromise: promise,
  gmvStreetViewPanorama,
});
</script>

<style lang="css">
.gmv-street-view-panorama-container {
  position: relative;
}

.gmv-street-view-panorama-container .gmv-street-view-panorama {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}
</style>
