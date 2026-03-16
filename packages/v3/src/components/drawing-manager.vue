<template>
  <div>
    <!-- @slot Used to set your drawing manager -->
    <slot
      :delete-selection="deleteSelection"
      :set-drawing-mode="setDrawingMode"
    />
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
  usePluginOptions,
} from '@/composables';
import type { IDrawingManagerVueComponentProps } from '@/interfaces';
import { $drawingManagerPromise } from '@/keys';
import { computed, inject, onUnmounted, provide, useSlots, watch } from 'vue';

/**
 * DrawingManager component
 * @displayName GmvDrawingManager
 * @see [source code](/guide/drawing-manager.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/drawinglayer)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/drawing)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    circleOptions?: google.maps.CircleOptions;
    drawingControl?: boolean;
    drawingControlOptions?: google.maps.drawing.DrawingControlOptions;
    drawingMode?: google.maps.drawing.OverlayType | null;
    markerOptions?: google.maps.marker.AdvancedMarkerElementOptions;
    polygonOptions?: google.maps.PolygonOptions;
    polylineOptions?: google.maps.PolylineOptions;
    rectangleOptions?: google.maps.RectangleOptions;
    position?:
      | 'TOP_CENTER'
      | 'TOP_LEFT'
      | 'TOP_RIGHT'
      | 'LEFT_TOP'
      | 'RIGHT_TOP'
      | 'LEFT_CENTER'
      | 'RIGHT_CENTER'
      | 'LEFT_BOTTOM'
      | 'RIGHT_BOTTOM'
      | 'BOTTOM_CENTER'
      | 'BOTTOM_LEFT'
      | 'BOTTOM_RIGHT';
    drawingModes?: google.maps.drawing.OverlayType[];
    shapes?: google.maps.drawing.OverlayCompleteEvent[];
    drawingKey?: string;
    mapKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    drawingControl: true,
    drawingMode: null,
    circleOptions: undefined,
    drawingControlOptions: undefined,
    markerOptions: undefined,
    polygonOptions: undefined,
    polylineOptions: undefined,
    rectangleOptions: undefined,
    position: undefined,
    drawingModes: undefined,
    shapes: undefined,
    drawingKey: undefined,
    mapKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const emits = defineEmits<{
  circlecomplete: [value: google.maps.Circle];
  markercomplete: [value: google.maps.marker.AdvancedMarkerElement];
  polygoncomplete: [value: google.maps.Polygon];
  polylinecomplete: [value: google.maps.Polyline];
  rectanglecomplete: [value: google.maps.Rectangle];
  overlaycomplete: [value: google.maps.drawing.OverlayCompleteEvent];
  'update:shapes': [value: google.maps.drawing.OverlayCompleteEvent[]];
  'added:shape': [value: google.maps.drawing.OverlayCompleteEvent];
  'removed:shape': [value: google.maps.drawing.OverlayCompleteEvent];
}>();
const $slots = useSlots();

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
const { promiseDeferred: drawingPromiseDeferred, promise } =
  useComponentPromiseFactory(props.drawingKey ?? $drawingManagerPromise);
provide(props.drawingKey ?? $drawingManagerPromise, promise);

/*******************************************************************************
 * DRAWING MANAGER
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ name: 'drawing-manager' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();
let map: google.maps.Map | undefined;
let selectedShape: google.maps.drawing.OverlayCompleteEvent | undefined;
mapPromise
  .then(async (mapInstance) => {
    if (!mapInstance) {
      throw new Error('the map instance is not defined');
    }

    map = mapInstance;

    const defaultDrawingControlOptions = {
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE,
      ],
      position: google.maps.ControlPosition.TOP_CENTER,
    };

    const drawingManagerOptions: IDrawingManagerVueComponentProps & {
      map: google.maps.Map;
      [key: string]: unknown;
    } = {
      map: mapInstance,
      ...getPropsValuesWithoutOptionsProp(props),
      ...props.options,
    };

    const { DrawingManager } = (await google.maps.importLibrary(
      'drawing',
    )) as google.maps.DrawingLibrary;
    const drawingManager = new DrawingManager({
      ...drawingManagerOptions,
      drawingControlOptions: {
        ...defaultDrawingControlOptions,
        ...drawingManagerOptions.drawingControlOptions,
      },
      drawingControl: $slots.default ? !$slots.default : props.drawingControl,
    });

    const drawingManagerPropsConfig =
      getComponentPropsConfig('GmvDrawingManager');
    const drawingManagerEventsConfig = getComponentEventsConfig(
      'GmvDrawingManager',
      'auto',
    );

    bindPropsWithGoogleMapsSettersAndGettersOnSetup(
      drawingManagerPropsConfig,
      drawingManager,
      emits as (ev: string, value: unknown) => void,
      props,
    );
    bindGoogleMapsEventsToVueEventsOnSetup(
      drawingManagerEventsConfig,
      drawingManager,
      emits as (ev: string, value: unknown) => void,
      excludedEvents,
    );

    drawingManager.addListener(
      'overlaycomplete',
      async (event: google.maps.drawing.OverlayCompleteEvent) => {
        await addShape(event);
      },
    );

    // TODO: check this event if it is needed or is the expected or best behaviour for all common cases
    mapInstance.addListener('click', clearSelection);

    if (props.shapes?.length) {
      drawAll();
    }

    if (!drawingPromiseDeferred.resolve) {
      throw new Error('drawingPromiseDeferred.resolve is undefined');
    }

    drawingPromiseDeferred.resolve(drawingManager);
  })
  .catch((error: unknown) => {
    throw error;
  });

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const evaluatedPosition = computed(() => {
  switch (props.position) {
    case 'TOP_CENTER':
      return google.maps.ControlPosition.TOP_CENTER;
    case 'TOP_LEFT':
      return google.maps.ControlPosition.TOP_LEFT;
    case 'TOP_RIGHT':
      return google.maps.ControlPosition.TOP_RIGHT;
    case 'BOTTOM_CENTER':
      return google.maps.ControlPosition.BOTTOM_CENTER;
    case 'BOTTOM_LEFT':
      return google.maps.ControlPosition.BOTTOM_LEFT;
    case 'BOTTOM_RIGHT':
      return google.maps.ControlPosition.BOTTOM_RIGHT;
    case 'LEFT_BOTTOM':
      return google.maps.ControlPosition.LEFT_BOTTOM;
    case 'LEFT_CENTER':
      return google.maps.ControlPosition.LEFT_CENTER;
    case 'LEFT_TOP':
      return google.maps.ControlPosition.LEFT_TOP;
    case 'RIGHT_BOTTOM':
      return google.maps.ControlPosition.RIGHT_BOTTOM;
    case 'RIGHT_CENTER':
      return google.maps.ControlPosition.RIGHT_CENTER;
    case 'RIGHT_TOP':
      return google.maps.ControlPosition.RIGHT_TOP;
    default:
      return google.maps.ControlPosition.TOP_CENTER;
  }
});

/*******************************************************************************
 * METHODS
 ******************************************************************************/
const drawAll = () => {
  props.shapes?.forEach((shape: google.maps.drawing.OverlayCompleteEvent) => {
    if (!map) {
      throw new Error('the map instance is not defined');
    }

    shape.overlay.setMap(map);
    google.maps.event.addListener(shape.overlay, 'click', () => {
      setSelection(shape);
    });
  });
};

const clearSelection = () => {
  if (selectedShape?.overlay) {
    selectedShape.overlay.set('fillColor', '#777');
    selectedShape.overlay.set('strokeColor', '#999');
    selectedShape.overlay.setOptions({ editable: false });
    selectedShape.overlay.setDraggable(false);
    selectedShape = undefined;
  }
};

const setSelection = (shape: google.maps.drawing.OverlayCompleteEvent) => {
  clearSelection();

  shape.overlay.setOptions({ editable: true });
  shape.overlay.setDraggable(true);
  selectedShape = shape;

  selectedShape.overlay.set('fillColor', '#555');
  selectedShape.overlay.set('strokeColor', '#777');
};

const addShape = async (shape: google.maps.drawing.OverlayCompleteEvent) => {
  await setDrawingMode(null);
  emits('added:shape', shape);
  emits('update:shapes', [
    ...(props.shapes?.length ? props.shapes : []),
    shape,
  ]);

  google.maps.event.addListener(shape.overlay, 'click', () => {
    setSelection(shape);
  });
  google.maps.event.addListener(shape.overlay, 'rightclick', () => {
    deleteSelection();
  });

  setSelection(shape);
};

/**
 * The setDrawingMode method is binded into the default component slot
 *
 * @method setDrawingMode
 * @param {string} mode - mode - Possible values 'marker', 'circle', 'polygon', 'polyline', 'rectangle', null
 * @returns {void}
 * @public
 */
const setDrawingMode = async (mode: google.maps.drawing.OverlayType | null) => {
  const drawingManager = await promise;

  if (!drawingManager) {
    console.error('the drawing manager is not defined');
    return;
  }

  drawingManager.setDrawingMode(mode);
};

/**
 * The deleteSelection method is bound into the default component slot
 *
 * @method deleteSelection
 * @returns {void}
 * @public
 */
const deleteSelection = () => {
  if (selectedShape?.overlay) {
    selectedShape.overlay.setMap(null);
    const index = props.shapes?.indexOf(selectedShape);
    if (index && index >= 0) {
      const oldShapes = [...(props.shapes?.length ? props.shapes : [])];
      const [shape] = oldShapes.splice(index, 1);

      if (shape) {
        emits('removed:shape', shape);
      }

      emits('update:shapes', oldShapes);
    }
  }
};

/**
 * The clearAll method set map to null in all shapes inside shapes prop
 *
 * @method clearAll
 * @returns {void}
 * @public
 */
const clearAll = () => {
  clearSelection();

  props.shapes?.forEach((shape: google.maps.drawing.OverlayCompleteEvent) => {
    shape.overlay.setMap(null);
  });
};

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.drawingControlOptions,
  async (value, oldValue) => {
    const drawingManager = await promise;

    if (drawingManager) {
      if (value && value !== oldValue) {
        drawingManager.setOptions({
          drawingControlOptions: { ...oldValue, ...value },
        });
      }
    }
  },
);

watch(
  () => props.position,
  async (value, oldValue) => {
    const drawingManager = await promise;

    if (drawingManager) {
      if (value && value !== oldValue) {
        drawingManager.setOptions({
          drawingControlOptions: { position: evaluatedPosition.value },
        });
      }
    }
  },
);

watch(
  () => props.drawingModes,
  async (value, oldValue) => {
    const drawingManager = await promise;

    if (drawingManager) {
      if (value && value !== oldValue) {
        drawingManager.setOptions({
          drawingControlOptions: { drawingModes: value },
        });
      }
    }
  },
);

watch(
  () => props.drawingControlOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ drawingControlOptions: value });
    }
  },
);
watch(
  () => props.circleOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ circleOptions: value });
    }
  },
);
watch(
  () => props.markerOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ markerOptions: value });
    }
  },
);
watch(
  () => props.polygonOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ polygonOptions: value });
    }
  },
);
watch(
  () => props.polylineOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ polylineOptions: value });
    }
  },
);
watch(
  () => props.rectangleOptions,
  async (value) => {
    const drawingManager = await promise;

    if (drawingManager && value) {
      drawingManager.setOptions({ rectangleOptions: value });
    }
  },
);
/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onUnmounted(async () => {
  (await promise)?.setMap(null);
  useDestroyPromisesOnUnmounted(props.drawingKey ?? $drawingManagerPromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({
  setDrawingMode,
  deleteSelection,
  clearAll,
  drawingManagerPromise: promise,
});
</script>
