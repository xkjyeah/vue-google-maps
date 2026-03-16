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
import type { IHeatmapLayerVueComponentProps } from '@/interfaces';
import { $heatmapLayerPromise } from '@/keys';
import { inject, onUnmounted, provide, watch } from 'vue';

/**
 * HeatmapLayer component
 * @displayName GmvHeatmapLayer
 * @see [source code](/guide/heatmap-layer.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/heatmaplayer)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    data?:
      | (google.maps.LatLng | google.maps.visualization.WeightedLocation)[]
      | google.maps.MVCArray<
          google.maps.LatLng | google.maps.visualization.WeightedLocation
        >;
    dissipating?: boolean;
    gradient?: string[];
    maxIntensity?: number;
    opacity?: number;
    number?: number;
    heatmapKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    opacity: 0.6,
    data: undefined,
    dissipating: undefined,
    gradient: undefined,
    maxIntensity: undefined,
    number: undefined,
    heatmapKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  data_changed: [
    value:
      | google.maps.MVCArray<
          google.maps.LatLng | google.maps.visualization.WeightedLocation
        >
      | (google.maps.LatLng | google.maps.visualization.WeightedLocation)[],
  ];
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
const { promiseDeferred: heatmapLayerPromiseDeferred, promise } =
  useComponentPromiseFactory(props.heatmapKey ?? $heatmapLayerPromise);
provide(props.heatmapKey ?? $heatmapLayerPromise, promise);

/*******************************************************************************
 * HEATMAP
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'heatmap-layer' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    const heatmapLayerOptions: IHeatmapLayerVueComponentProps & {
      map: google.maps.Map;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { HeatmapLayer } = (await google.maps.importLibrary(
      'visualization',
    )) as google.maps.VisualizationLibrary;
    const heatMapLayer = new HeatmapLayer(heatmapLayerOptions);

    const heatmapLayerPropsConfig = getComponentPropsConfig('GmvHeatmapLayer');
    const heatmapLayerEventsConfig = getComponentEventsConfig(
      'GmvHeatmapLayer',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      heatmapLayerPropsConfig,
      heatMapLayer,
      emits as (ev: string, value: unknown) => void,
      props,
    );

    bindGoogleMapsEventsToVueEventsOnSetup(
      heatmapLayerEventsConfig,
      heatMapLayer,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    if (!heatmapLayerPromiseDeferred.resolve) {
      throw new Error('heatmapLayerPromiseDeferred.resolve is undefined');
    }

    heatmapLayerPromiseDeferred.resolve(heatMapLayer);
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
watch(
  () => props.data,
  async (value, oldValue) => {
    const heatMapLayer = await promise;

    if (heatMapLayer) {
      if (value && value !== oldValue) {
        heatMapLayer.setData(value);
        emits('data_changed', value);
      }
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onUnmounted(async () => {
  (await promise)?.setMap(null);
  useDestroyPromisesOnUnmounted(props.heatmapKey ?? $heatmapLayerPromise);
});
/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({ heatmapLayerPromise: promise });
</script>
