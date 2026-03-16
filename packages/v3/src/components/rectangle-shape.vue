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
} from '@/composables';
import type { IRectangleShapeVueComponentProps } from '@/interfaces';
import { $rectangleShapePromise } from '@/keys';
import { inject, onUnmounted, provide } from 'vue';

/**
 * Rectangle component
 * @displayName GmvRectangle
 * @see [source code](/guide/rectangle.html#source-code)
 * @see [official docs](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Rectangle)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Rectangle)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokePosition?: google.maps.StrokePosition;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
    rectangleKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    clickable: true,
    draggable: false,
    editable: false,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    strokePosition: globalThis?.google?.maps?.StrokePosition?.CENTER || 0,
    visible: true,
    bounds: undefined,
    fillColor: undefined,
    fillOpacity: undefined,
    strokeColor: undefined,
    strokeOpacity: undefined,
    strokeWeight: undefined,
    zIndex: undefined,
    rectangleKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  bounds_changed: [];
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
const { promiseDeferred: rectanglePromiseDeferred, promise } =
  useComponentPromiseFactory(props.rectangleKey ?? $rectangleShapePromise);
provide(props.rectangleKey ?? $rectangleShapePromise, promise);

/*******************************************************************************
 * RECTANGLE SHAPE
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'rectangle-shape' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    const rectangleOptions: IRectangleShapeVueComponentProps & {
      map: google.maps.Map | undefined;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { Rectangle } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const rectangleShapeInstance = new Rectangle(rectangleOptions);

    const rectangleShapePropsConfig = getComponentPropsConfig('GmvRectangle');
    const rectangleShapeEventsConfig = getComponentEventsConfig(
      'GmvRectangle',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      rectangleShapePropsConfig,
      rectangleShapeInstance,
      emits as (ev: string, value: unknown) => void,
      props,
    );
    bindGoogleMapsEventsToVueEventsOnSetup(
      rectangleShapeEventsConfig,
      rectangleShapeInstance,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!rectanglePromiseDeferred.resolve) {
      throw new Error('rectanglePromiseDeferred.resolve is undefined');
    }

    rectanglePromiseDeferred.resolve(rectangleShapeInstance);
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

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onUnmounted(async () => {
  (await promise)?.setMap(null);
  useDestroyPromisesOnUnmounted(props.rectangleKey ?? $rectangleShapePromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ rectangleShapePromise: promise });
</script>
