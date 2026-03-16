<template>
  <div class="gmv-map-container">
    <div ref="gmvMapRef" class="gmv-map" />
    <div class="gmv-map-hidden">
      <!-- @slot The default slot is wrapped in a class that sets display: none; so by default any component you add to your map will be invisible. This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if you want to bring up things like toolboxes, etc. -->
      <slot />
    </div>
    <!-- @slot This slot must be used if you want to display content within the responsive wrapper for the map.  -->
    <slot name="visible" />
  </div>
</template>

<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  onMountedResizeBusHook,
  onUnmountedResizeBusHook,
  twoWayBindingWrapper,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useGoogleMapsApiPromiseLazy,
  usePluginOptions,
  useResizeBus,
} from '@/composables';
import type { IMapLayerVueComponentProps } from '@/interfaces';
import { $mapPromise, $recyclePrefix } from '@/keys';
import type { IGoogleRecycleObject } from '@/types';
import type { Emitter, EventType } from 'mitt';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  provide,
  useTemplateRef,
  watch,
} from 'vue';

/**
 * Map component
 * @displayName GmvMap
 * @see [source code](/guide/map.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/basics)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/map)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    backgroundColor?: string;
    center: google.maps.LatLng | google.maps.LatLngLiteral;
    clickableIcons?: boolean;
    controlSize?: number;
    disableDefaultUI?: boolean;
    disableDoubleClickZoom?: boolean;
    draggableCursor?: string;
    draggingCursor?: string;
    fullscreenControl?: boolean;
    fullscreenControlOptions?: google.maps.FullscreenControlOptions;
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
    heading?: number;
    isFractionalZoomEnabled?: boolean;
    keyboardShortcuts?: boolean;
    mapId?: string;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: google.maps.MapTypeControlOptions;
    mapTypeId?: google.maps.MapTypeId;
    maxZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    restriction?: google.maps.MapRestriction;
    rotateControl?: boolean;
    rotateControlOptions?: google.maps.RotateControlOptions;
    scaleControl?: boolean;
    scaleControlOptions?: google.maps.ScaleControlOptions;
    scrollwheel?: boolean;
    streetView?: google.maps.StreetViewPanorama;
    streetViewControl?: boolean;
    streetViewControlOptions?: google.maps.StreetViewControlOptions;
    styles?: google.maps.MapTypeStyle[];
    tilt?: number;
    zoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: google.maps.ZoomControlOptions;
    mapKey?: string;
    resizeBus?: Emitter<Record<EventType, unknown>>;
    options?: Record<string, unknown>;
  }>(),
  {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    mapTypeId: globalThis?.google?.maps?.MapTypeId?.ROADMAP || 'roadmap',
    clickableIcons: true,
    disableDefaultUI: false,
    fullscreenControl: true,
    gestureHandling: 'auto',
    keyboardShortcuts: true,
    mapTypeControl: true,
    panControl: true,
    rotateControl: true,
    scaleControl: true,
    streetViewControl: true,
    zoomControl: true,
    backgroundColor: undefined,
    controlSize: undefined,
    disableDoubleClickZoom: undefined,
    draggableCursor: undefined,
    draggingCursor: undefined,
    fullscreenControlOptions: undefined,
    heading: undefined,
    isFractionalZoomEnabled: undefined,
    mapId: undefined,
    mapTypeControlOptions: undefined,
    maxZoom: undefined,
    minZoom: undefined,
    noClear: undefined,
    restriction: undefined,
    rotateControlOptions: undefined,
    scaleControlOptions: undefined,
    scrollwheel: undefined,
    streetView: undefined,
    streetViewControlOptions: undefined,
    styles: undefined,
    tilt: undefined,
    zoom: undefined,
    zoomControlOptions: undefined,
    mapKey: undefined,
    resizeBus: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES AND EMITTERS
 ******************************************************************************/
const gmvMap = useTemplateRef<HTMLElement | null>('gmvMapRef');
const emits = defineEmits<{
  bounds_changed: [value: google.maps.LatLngBounds | undefined];
  center_changed: [value: google.maps.LatLng | undefined];
  click: [value: google.maps.MapMouseEvent | google.maps.IconMouseEvent];
  contextmenu: [value: google.maps.MapMouseEvent];
  dblclick: [value: google.maps.MapMouseEvent];
  drag: [];
  dragend: [];
  dragstart: [];
  heading_changed: [];
  idle: [];
  isfractionalzoomenabled_changed: [];
  mapcapabilities_changed: [];
  maptypeid_changed: [];
  mousemove: [value: google.maps.MapMouseEvent];
  mouseout: [value: google.maps.MapMouseEvent];
  mouseover: [value: google.maps.MapMouseEvent];
  projection_changed: [];
  renderingtype_changed: [];
  tilesloaded: [];
  tilt_changed: [];
  zoom_changed: [value: number | undefined];
  resize: [];
}>();

/*******************************************************************************
 * RECYCLE KEY
 ******************************************************************************/
/**
 * Define de final mapKey.
 * This method is a legacy method to maintain compatibility with the old recycle key and should be removed in the next major release.
 *
 * @method defineMapKey
 * @returns {string}
 * @internal
 */
function defineMapKey(): string {
  return props.mapKey
    ? props.mapKey
    : props.options?.recycle
      ? (props.options.recycle as string)
      : '';
}

/**
 * Get the recycle key of the map
 * @method getRecycleKey
 * @returns {void}
 * @public
 */
function getRecycleKey(): string {
  return `${$recyclePrefix}${defineMapKey()}`;
}

/*******************************************************************************
 * MAP
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'map-layer' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: mapPromiseDeferred, promise } =
  useComponentPromiseFactory(defineMapKey() || $mapPromise);
provide(defineMapKey() || $mapPromise, promise);

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
  const mapInstance = await promise;

  if (mapInstance) {
    google.maps.event.trigger(mapInstance, 'resize');
  }
}

/**
 * Preserve the previous center when resize the map
 * @method resizePreserveCenter
 * @returns {void}
 * @public
 */
function resizePreserveCenter(): void {
  promise
    .then((mapInstance) => {
      if (!mapInstance) {
        return;
      }

      const oldCenter = mapInstance.getCenter();
      google.maps.event.trigger(mapInstance, 'resize');

      if (oldCenter) {
        mapInstance.setCenter(oldCenter);
      }
    })
    .catch((error: unknown) => {
      console.error(error);
    });
}

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const finalLat = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.center) {
    console.warn('center is not defined');
    return;
  }

  return typeof props.center.lat === 'function'
    ? props.center.lat()
    : props.center.lat;
});
const finalLng = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.center) {
    console.warn('center is not defined');
    return;
  }

  return typeof props.center.lng === 'function'
    ? props.center.lng()
    : props.center.lng;
});
const finalLatLng = computed(
  () =>
    ({ lat: finalLat.value, lng: finalLng.value }) as google.maps.LatLngLiteral,
);

/*******************************************************************************
 * METHODS
 ******************************************************************************/
/**
 * Changes the center of the map by the given distance in pixels. If the distance is less than both the width and height of the map, the transition will be smoothly animated. Note that the map coordinate system increases from west to east (for x values) and north to south (for y values).
 * @method panBy
 * @param {number} x - Number of pixels to move the map in the x direction.
 * @param {number} y - Number of pixels to move the map in the y direction.
 * @returns {void}
 * @public
 */
async function panBy(x: number, y: number): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panBy(x, y);
  }
}

/**
 * Changes the center of the map to the given LatLng. If the change is less than both the width and height of the map, the transition will be smoothly animated.
 * @method panTo
 * @param {(LatLng|LatLngLiteral)} latLng - The new center latitude/longitude of the map. (types `LatLng|LatLngLiteral`)
 * @returns {void}
 * @public
 */
async function panTo(
  latLng: google.maps.LatLng | google.maps.LatLngLiteral,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panTo(latLng);
  }
}

/**
 * Pans the map by the minimum amount necessary to contain the given LatLngBounds. It makes no guarantee where on the map the bounds will be, except that the map will be panned to show as much of the bounds as possible inside {currentMapSizeInPx} - {padding}. For both raster and vector maps, the map's zoom, tilt, and heading will not be changed.
 * @method panToBounds
 * @param {(LatLngBounds|LatLngBoundsLiteral)} latLngBounds - The bounds to pan the map to. (types: `LatLngBounds|LatLngBoundsLiteral`)
 * @param {(number|Padding)} [padding] - optional Padding in pixels. A number value will yield the same padding on all 4 sides. The default value is 0. (types: `number|Padding`)
 * @returns {void}
 * @public
 */
async function panToBounds(
  latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  padding: number | google.maps.Padding,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panToBounds(latLngBounds, padding);
  }
}

/**
 * Sets the viewport to contain the given bounds.
 Note: When the map is set to display: none, the fitBounds function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to visibility: hidden, thereby ensuring the map div has an actual size. For vector maps, this method sets the map's tilt and heading to their default zero values.
 * @method fitBounds
 * @param {(LatLngBounds|LatLngBoundsLiteral)} bounds - Bounds to show. (types: `LatLngBounds|LatLngBoundsLiteral`)
 * @param {(number|Padding)} [padding] - optional Padding in pixels. The bounds will be fit in the part of the map that remains after padding is removed. A number value will yield the same padding on all 4 sides. Supply 0 here to make a fitBounds idempotent on the result of getBounds. (types: `number|Padding`)
 * @returns {void}
 * @public
 */
async function fitBounds(
  bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  padding: number | google.maps.Padding,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.fitBounds(bounds, padding);
  }
}

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.zoom,
  async (newVal, oldValue) => {
    const mapInstance = await promise;

    if (mapInstance && newVal && newVal !== oldValue) {
      mapInstance.setZoom(newVal);
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onMounted(() => {
  useGoogleMapsApiPromiseLazy()
    ?.then(async () => {
      if (!gmvMap.value) {
        throw new Error(`we can find the template ref: 'gmvMap'`);
      }

      const mapLayerOptions: Partial<IMapLayerVueComponentProps> = {
        ...getPropsValuesWithoutOptionsProp(props),
        ...props.options,
      };

      const recycleKey = getRecycleKey();
      let mapInstance: google.maps.Map | undefined;

      if (window[recycleKey]) {
        gmvMap.value.appendChild(
          (window[recycleKey] as IGoogleRecycleObject).div,
        );
        mapInstance = (window[recycleKey] as IGoogleRecycleObject).map;
        mapInstance.setOptions(mapLayerOptions);
      } else {
        const { Map } = (await google.maps.importLibrary(
          'maps',
        )) as google.maps.MapsLibrary;
        mapInstance = new Map(gmvMap.value, mapLayerOptions);
        window[recycleKey] = { map: mapInstance };
      }

      onMountedResizeBusHook(props, resizePreserveCenter);

      const mapLayerPropsConfig = getComponentPropsConfig('GmvMap');
      const mapLayerEventsConfig = getComponentEventsConfig('GmvMap', 'auto');

      // binding properties (two and one way)
      bindPropsWithGoogleMapsSettersAndGettersOnSetup(
        mapLayerPropsConfig,
        mapInstance,
        emits as (ev: string, value: unknown) => void,
        props,
      );

      // Auto bind all events by default
      bindGoogleMapsEventsToVueEventsOnSetup(
        mapLayerEventsConfig,
        mapInstance,
        emits as (ev: string, value: unknown) => void,
        excludedEvents,
      );

      // manually trigger center and zoom
      twoWayBindingWrapper(
        (
          increment: () => void,
          decrement: () => void,
          shouldUpdate: () => boolean,
        ) => {
          mapInstance.addListener('center_changed', () => {
            if (shouldUpdate()) {
              /**
               * This event is fired when the map center property changes. It sends the position displayed at the center of the map. If the center or bounds have not been set then the result is undefined. (types: `LatLng|undefined`)
               *
               * @event center_changed
               * @type {(LatLng|undefined)}
               */
              emits('center_changed', mapInstance.getCenter());
            }

            decrement();
          });

          const updateCenter = () => {
            increment();

            mapInstance.setCenter(finalLatLng.value);
          };

          watch([finalLat, finalLng], updateCenter);
        },
      );

      mapInstance.addListener('zoom_changed', () => {
        /**
         * This event is fired when the map zoom property changes. It sends the zoom of the map. If the zoom has not been set then the result is undefined. (types: `number|undefined`)
         *
         * @event zoom_changed
         * @type {(number|undefined)}
         */
        emits('zoom_changed', mapInstance.getZoom());
      });
      mapInstance.addListener('bounds_changed', () => {
        /**
         * This event is fired when the viewport bounds have changed. It sends The lat/lng bounds of the current viewport.
         *
         * @event bounds_changed
         * @type {LatLngBounds}
         */
        emits('bounds_changed', mapInstance.getBounds());
      });

      if (!mapPromiseDeferred.resolve) {
        throw new Error('mapPromiseDeferred.resolve is undefined');
      }

      mapPromiseDeferred.resolve(mapInstance);
    })
    .catch((error: unknown) => {
      throw error;
    });
});

onBeforeUnmount(async () => {
  const mapInstance = await promise;

  if (mapInstance) {
    const recycleKey = getRecycleKey();

    if (window[recycleKey]) {
      (window[recycleKey] as IGoogleRecycleObject).div = mapInstance.getDiv();
    }
  }
});

onUnmounted(() => {
  onUnmountedResizeBusHook();
  useDestroyPromisesOnUnmounted(defineMapKey() || $mapPromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({
  mapPromise: promise,
  panBy,
  panTo,
  panToBounds,
  fitBounds,
  currentResizeBus,
  _resizeCallback,
  _delayedResizeCallback,
  resize,
  resizePreserveCenter,
  getRecycleKey,
});
</script>

<style lang="stylus" scoped>
.gmv-map-container {
  position: relative;

  .gmv-map {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
  }

  .gmv-map-hidden {
    display: none;
  }
}
</style>
