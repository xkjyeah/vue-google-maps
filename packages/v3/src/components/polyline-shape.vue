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
  usePluginOptions,
  useShapesHelpers,
} from '@/composables';
import type { IPolylineShapeVueComponentProps } from '@/interfaces';
import { $polylineShapePromise } from '@/keys';
import { inject, onUnmounted, provide, watch } from 'vue';

/**
 * PolyLine component
 * @displayName GmvPolyline
 * @see [source code](/guide/polyline.html#source-code)
 * @see [official docs](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Polyline)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Polyline)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    geodesic?: boolean;
    icons?: google.maps.IconSequence[];
    path?:
      | google.maps.MVCArray<google.maps.LatLng>
      | (google.maps.LatLng | google.maps.LatLngLiteral)[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
    deepWatch?: boolean;
    polylineKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    clickable: true,
    draggable: false,
    editable: false,
    geodesic: false,
    visible: true,
    deepWatch: false,
    icons: undefined,
    path: undefined,
    strokeColor: undefined,
    strokeOpacity: undefined,
    strokeWeight: undefined,
    zIndex: undefined,
    polylineKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  click: [value: google.maps.PolyMouseEvent];
  contextmenu: [value: google.maps.PolyMouseEvent];
  dblclick: [value: google.maps.PolyMouseEvent];
  drag: [value: google.maps.MapMouseEvent];
  dragend: [value: google.maps.MapMouseEvent];
  dragstart: [value: google.maps.MapMouseEvent];
  mousedown: [value: google.maps.PolyMouseEvent];
  mousemove: [value: google.maps.PolyMouseEvent];
  mouseout: [value: google.maps.PolyMouseEvent];
  mouseover: [value: google.maps.PolyMouseEvent];
  mouseup: [value: google.maps.PolyMouseEvent];
  path_changed: [value: google.maps.MVCArray<google.maps.LatLng>];
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
const { promiseDeferred: polylinePromiseDeferred, promise } =
  useComponentPromiseFactory(props.polylineKey ?? $polylineShapePromise);
provide(props.polylineKey ?? $polylineShapePromise, promise);

/*******************************************************************************
 * POLYLINE SHAPE
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'polyline-shape' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    const polylineOptions: IPolylineShapeVueComponentProps & {
      map: google.maps.Map | undefined;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { Polyline } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const polylineShape = new Polyline(polylineOptions);

    const polylineShapePropsConfig = getComponentPropsConfig('GmvPolyline');
    const polylineShapeEventsConfig = getComponentEventsConfig(
      'GmvPolyline',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      polylineShapePropsConfig,
      polylineShape,
      emits as (ev: string, value: unknown) => void,
      props,
    );
    bindGoogleMapsEventsToVueEventsOnSetup(
      polylineShapeEventsConfig,
      polylineShape,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!polylinePromiseDeferred.resolve) {
      throw new Error('polylinePromiseDeferred.resolve is undefined');
    }

    polylinePromiseDeferred.resolve(polylineShape);
  })
  .catch((error: unknown) => {
    throw error;
  });

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/

/*******************************************************************************
 * METHODS
 ******************************************************************************/
const { clearEvents, updatePathOrPaths } = useShapesHelpers();

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
const pathEventListeners: [
  google.maps.MVCArray<google.maps.LatLng>,
  google.maps.MapsEventListener,
][] = [];

watch(
  () => props.path,
  async (newValue, oldValue) => {
    const polylineShape = await promise;

    if (!polylineShape) {
      console.error('polyline was not defined');
      return;
    }

    if (props.path && newValue && newValue !== oldValue) {
      clearEvents(pathEventListeners);

      polylineShape.setPath(newValue);

      const mvcPath = polylineShape.getPath();

      pathEventListeners.push([
        mvcPath,
        mvcPath.addListener(
          'insert_at',
          updatePathOrPaths(
            'path_changed',
            polylineShape.getPath.bind(polylineShape),
            emits,
          ),
        ),
      ]);
      pathEventListeners.push([
        mvcPath,
        mvcPath.addListener(
          'remove_at',
          updatePathOrPaths(
            'path_changed',
            polylineShape.getPath.bind(polylineShape),
            emits,
          ),
        ),
      ]);
      pathEventListeners.push([
        mvcPath,
        mvcPath.addListener(
          'set_at',
          updatePathOrPaths(
            'path_changed',
            polylineShape.getPath.bind(polylineShape),
            emits,
          ),
        ),
      ]);
    }
  },
  { deep: props.deepWatch, immediate: true },
);
/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onUnmounted(async () => {
  (await promise)?.setMap(null);
  useDestroyPromisesOnUnmounted(props.polylineKey ?? $polylineShapePromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ polylineShapePromise: promise });
</script>
