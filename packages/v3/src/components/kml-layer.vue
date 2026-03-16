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
import type { IKmlLayerVueComponentProps } from '@/interfaces';
import { $kmlLayerPromise } from '@/keys';
import { inject, onUnmounted, provide } from 'vue';

/**
 * KmlLayer component
 * @displayName GmvKmlLayer
 * @see [source code](/guide/kml-layer.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/kmllayer)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/kml)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    clickable?: boolean;
    preserveViewport?: boolean;
    screenOverlays?: boolean;
    suppressInfoWindows?: boolean;
    url?: string;
    zIndex?: number;
    kmlKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    clickable: true,
    preserveViewport: false,
    screenOverlays: true,
    url: undefined,
    zIndex: undefined,
    kmlKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  click: [value: google.maps.KmlMouseEvent];
  defaultviewport_changed: [];
  status_changed: [];
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
const { promiseDeferred: kmlPromiseDeferred, promise } =
  useComponentPromiseFactory(props.kmlKey ?? $kmlLayerPromise);
provide(props.kmlKey ?? $kmlLayerPromise, promise);

/*******************************************************************************
 * KML LAYER
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'kml-layer' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    const kmlLayerOptions: IKmlLayerVueComponentProps & {
      map: google.maps.Map;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { KmlLayer } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const kmlLayer = new KmlLayer(kmlLayerOptions);

    const kmlLayerPropsConfig = getComponentPropsConfig('GmvKmlLayer');
    const kmlLayerEventsConig = getComponentEventsConfig('GmvKmlLayer', 'auto');

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      kmlLayerPropsConfig,
      kmlLayer,
      emits as (ev: string, value: unknown) => void,
      props,
    );
    bindGoogleMapsEventsToVueEventsOnSetup(
      kmlLayerEventsConig,
      kmlLayer,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!kmlPromiseDeferred.resolve) {
      throw new Error('kmlPromiseDeferred.resolve is undefined');
    }

    kmlPromiseDeferred.resolve(kmlLayer);
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
  useDestroyPromisesOnUnmounted(props.kmlKey ?? $kmlLayerPromise);
});
/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ kmlLayerPromise: promise });
</script>
