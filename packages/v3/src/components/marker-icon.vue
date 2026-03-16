<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  findParentInstanceByName,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  useClusterPromise,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  usePluginOptions,
} from '@/composables';
import type { IMarkerIconVueComponentProps } from '@/interfaces';
import { $markerPromise } from '@/keys';
import type { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  computed,
  h,
  inject,
  onUnmounted,
  provide,
  useSlots,
  type RendererElement,
  type RendererNode,
  type VNode,
} from 'vue';

/**
 * Marker component
 * @displayName GmvMarker
 * @see [source code](/guide/marker.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/markers)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/marker)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    collisionBehavior?: google.maps.CollisionBehavior;
    content?: HTMLElement;
    gmpClickable?: boolean; // Notice: Available only in the v=beta channel.
    gmpDraggable?: boolean;
    position?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral;
    title?: string;
    zIndex?: number;
    markerKey?: string;
    clusterKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    gmpClickable: true,
    gmpDraggable: false,
    collisionBehavior: undefined,
    content: undefined,
    position: undefined,
    title: undefined,
    zIndex: undefined,
    markerKey: undefined,
    clusterKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  click: [value: google.maps.MapMouseEvent];
  drag: [value: google.maps.MapMouseEvent];
  dragend: [value: google.maps.MapMouseEvent];
  dragstart: [value: google.maps.MapMouseEvent];
  'gmp-click': [value: google.maps.marker.AdvancedMarkerClickEvent];
  'update:position': [value: { lat?: number; lng?: number }];
}>();
const slots = useSlots();

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

const clusterPromise = props.clusterKey
  ? useClusterPromise(props.clusterKey)
  : (findParentInstanceByName('cluster-icon')?.exposed?.clusterPromise as
      | Promise<MarkerClusterer | undefined>
      | undefined);

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
let rawClusterOwner: MarkerClusterer | undefined;
const { promiseDeferred: markerPromiseDeferred, promise } =
  useComponentPromiseFactory(props.markerKey ?? $markerPromise);
provide(props.markerKey ?? $markerPromise, promise);

/*******************************************************************************
 * MARKER
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'marker-icon' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    // Initialize the maps with the given options
    const markerIconOptions: Partial<IMarkerIconVueComponentProps> & {
      map: google.maps.Map | undefined;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    if (clusterPromise) {
      markerIconOptions.map = undefined;
    }

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker',
    )) as google.maps.MarkerLibrary;
    const marker = new AdvancedMarkerElement(markerIconOptions);

    const markerIconPropsConfig = getComponentPropsConfig('GmvMarker');
    const markerIconEventsConfig = getComponentEventsConfig(
      'GmvMarker',
      'auto',
    );

    // bind prop events of google maps
    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      markerIconPropsConfig,
      marker,
      emits as (ev: string, value: unknown) => void,
      props,
    );

    // binding events
    bindGoogleMapsEventsToVueEventsOnSetup(
      markerIconEventsConfig,
      marker,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    marker.addListener('dragend', () => {
      const newPosition = marker.position;
      /**
       * An event to detect when a position changes
       * @property {Object} position Object with lat and lng values, eg: { lat: 10.0, lng: 10.0 }
       */
      emits('update:position', {
        lat:
          typeof newPosition?.lat === 'number'
            ? newPosition.lat
            : newPosition?.lat(),
        lng:
          typeof newPosition?.lng === 'number'
            ? newPosition.lng
            : newPosition?.lng(),
      });
    });

    if (clusterPromise) {
      clusterPromise
        .then((clusterInstance) => {
          clusterInstance?.addMarker(marker);
          rawClusterOwner = clusterInstance;
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    }

    if (!markerPromiseDeferred.resolve) {
      throw new Error('markerPromiseDeferred.resolve is undefined');
    }

    markerPromiseDeferred.resolve(marker);
  })
  .catch((reason: unknown) => {
    throw reason;
  });

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const clusterOwner = computed({
  get: () => rawClusterOwner,
  set: (val) => {
    rawClusterOwner = val;
  },
});

/*******************************************************************************
 * METHODS
 ******************************************************************************/

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onUnmounted(async () => {
  const marker = await promise;

  if (!marker) {
    console.error('the marker instance is not defined');
    return;
  }

  if (clusterOwner.value) {
    // Repaint will be performed in `updated()` of cluster
    clusterOwner.value.removeMarker(marker, true);
    /* Performance optimization when destroying a large number of markers */
    clusterOwner.value = undefined;
  }

  marker.map = null;

  useDestroyPromisesOnUnmounted(props.markerKey ?? $markerPromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/
/**
 * @slot Default slot of the component.
 */
let VNodeMarkerIcon: // eslint-disable-next-line @typescript-eslint/no-explicit-any
VNode<RendererNode, RendererElement, Record<string, any>> | undefined = h(
  'div',
  null,
  slots.default?.(),
);

if (
  slots.default &&
  typeof slots.default === 'function' &&
  slots.default().length
) {
  if (slots.default().length === 1) {
    // So that InfoWindows can have a marker parent
    VNodeMarkerIcon = slots.default()[0];
  }
}

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ VNodeMarkerIcon, markerPromise: promise });
</script>
