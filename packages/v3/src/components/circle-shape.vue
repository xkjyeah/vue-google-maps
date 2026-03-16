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
import type { ICircleShapeVueComponentProps } from '@/interfaces';
import { $circleShapePromise } from '@/keys';
import { inject, onUnmounted, provide } from 'vue';

/**
 * Circle component
 * @displayName GmvCircle
 * @see [source code](/guide/circle.html#source-code)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Circle)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    center?: google.maps.LatLng | google.maps.LatLngLiteral;
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    radius?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokePosition?: google.maps.StrokePosition;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
    circleKey?: string;
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
    center: undefined,
    fillColor: undefined,
    fillOpacity: undefined,
    radius: undefined,
    strokeColor: undefined,
    strokeOpacity: undefined,
    strokeWeight: undefined,
    zIndex: undefined,
    circleKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  center_changed: [];
  click: [value: google.maps.MapMouseEvent];
  dblclick: [value: google.maps.MapMouseEvent];
  drag: [value: google.maps.MapMouseEvent];
  dragend: [value: google.maps.MapMouseEvent];
  dragstart: [value: google.maps.MapMouseEvent];
  mousedown: [value: google.maps.MapMouseEvent];
  mousemove: [value: google.maps.MapMouseEvent];
  mouseout: [value: google.maps.MapMouseEvent];
  mouseover: [value: google.maps.MapMouseEvent];
  mouseup: [value: google.maps.MapMouseEvent];
  radius_changed: [value: undefined];
  rightclick: [value: google.maps.MapMouseEvent];
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
const { promiseDeferred: circlePromiseDeferred, promise } =
  useComponentPromiseFactory(props.circleKey ?? $circleShapePromise);
provide(props.circleKey ?? $circleShapePromise, promise);

/*******************************************************************************
 * CIRCLE SHAPE
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'circle-shape' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('The map instance is not defined');
    }

    const circleShapeOptions: ICircleShapeVueComponentProps & {
      map: google.maps.Map;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { Circle } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const circleShape = new Circle(circleShapeOptions);

    const circleShapePropsConfig = getComponentPropsConfig('GmvCircle');
    const circleShapeEventsConfig = getComponentEventsConfig(
      'GmvCircle',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      circleShapePropsConfig,
      circleShape,
      emits as (ev: string, value: unknown) => void,
      props,
    );
    bindGoogleMapsEventsToVueEventsOnSetup(
      circleShapeEventsConfig,
      circleShape,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!circlePromiseDeferred.resolve) {
      throw new Error('circlePromiseDeferred.resolve is undefined');
    }

    circlePromiseDeferred.resolve(circleShape);
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
  useDestroyPromisesOnUnmounted(props.circleKey ?? $circleShapePromise);
});
/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ circleShapePromise: promise });
</script>
