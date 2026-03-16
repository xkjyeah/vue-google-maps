<template>
  <div>
    <!-- @slot Used to set your drawing manager -->
    <slot
      :set-drawing-mode="setDrawingMode"
      :delete-selection="deleteSelection"
    />
  </div>
</template>

<script>
import MapElementMixin from '../mixins/map-element';
import { drawingManagerMappedProps } from '../utils/mapped-props-by-map-element';
import { bindProps, getPropsValues } from '../utils/helpers';

/**
 * DrawingManager component
 * @displayName GmapDrawingManager
 * @see [source code](/guide/drawing-manager.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/drawinglayer)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/drawing)
 */
export default {
  name: 'DrawingManager',
  mixins: [MapElementMixin],
  provide() {
    // Infowindow needs this to be immediately available
    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          // TODO: analyze the below line because I think it can be removed
          ...this.options,
          map,
          ...getPropsValues(this, drawingManagerMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.drawingModes = Object.keys(finalOptions).reduce((modes, opt) => {
          const val = opt.split('Options');

          if (val.length > 1) {
            modes.push(val[0]);
          }

          return modes;
        }, []);

        const position =
          this.position && google.maps.ControlPosition[this.position]
            ? google.maps.ControlPosition[this.position]
            : google.maps.ControlPosition.TOP_LEFT;

        finalOptions.drawingMode = null;
        finalOptions.drawingControl = !this.$scopedSlots.default;
        finalOptions.drawingControlOptions = {
          drawingModes: this.drawingModes,
          position,
        };

        // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        this.$drawingManagerObject = new google.maps.drawing.DrawingManager(
          finalOptions
        );

        bindProps(this, this.$drawingManagerObject, drawingManagerMappedProps);

        this.$drawingManagerObject.addListener('overlaycomplete', (e) =>
          this.addShape(e)
        );

        this.$map.addListener('click', this.clearSelection);

        if (this && this.finalShapes && this.finalShapes.length) {
          this.drawAll();
        }

        return this.$drawingManagerObject;
      })
      .catch((error) => {
        throw error;
      });

    // TODO: analyze the efects of only returns the instance and remove completely the promise
    this.$drawingManagerPromise = promise;
    return { $drawingManagerPromise: promise };
  },
  props: {
    /**
     * The circle options
     * @see [circleOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#CircleOptions)
     */
    circleOptions: {
      type: Object,
      default: undefined,
    },
    /**
     * The marker options
     * @see [markerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions)
     */
    markerOptions: {
      type: Object,
      default: undefined,
    },
    /**
     * The polygon options
     * @see [polygonOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolygonOptions)
     */
    polygonOptions: {
      type: Object,
      default: undefined,
    },
    /**
     * The polyline options
     * @see [polylineOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolylineOptions)
     */
    polylineOptions: {
      type: Object,
      default: undefined,
    },
    /**
     * The rectangle options
     * @see [rectangleOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#RectangleOptions)
     */
    rectangleOptions: {
      type: Object,
      default: undefined,
    },
    /**
     * The position of the toolbar
     * **Possible values**: `'TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT', 'LEFT_TOP', 'RIGHT_TOP', 'LEFT_CENTER',
     * 'RIGHT_CENTER', 'LEFT_BOTTOM', 'RIGHT_BOTTOM', 'BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'`
     */
    position: {
      type: String,
      default: '',
    },
    /**
     * An array of shapes that you can set to render in the map and saves on it the new shapes that you add.
     */
    shapes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedShape: null,
      drawingModes: [],
      options: {
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {},
      },
      finalShapes: [],
    };
  },
  watch: {
    position(position) {
      if (this.$drawingManagerObject) {
        const drawingControlOptions = {
          position:
            position && google.maps.ControlPosition[position]
              ? google.maps.ControlPosition[position]
              : google.maps.ControlPosition.TOP_LEFT,
          drawingModes: this.drawingModes,
        };
        this.$drawingManagerObject.setOptions({ drawingControlOptions });
      }
    },
    circleOptions(circleOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ circleOptions });
      }
    },
    markerOptions(markerOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ markerOptions });
      }
    },
    polygonOptions(polygonOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ polygonOptions });
      }
    },
    polylineOptions(polylineOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ polylineOptions });
      }
    },
    rectangleOptions(rectangleOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ rectangleOptions });
      }
    },
  },
  mounted() {
    this.finalShapes = [...this.shapes];
  },
  destroyed() {
    this.clearAll();

    // Note: not all Google Maps components support maps
    if (this.$drawingManagerObject && this.$drawingManagerObject.setMap) {
      this.$drawingManagerObject.setMap(null);
    }
  },
  methods: {
    /**
     * The setDrawingMode method is binded into the default component slot
     *
     * @method setDrawingMode
     * @param {string} mode - mode - Possible values 'marker', 'circle', 'polygon', 'polyline', 'rectangle', null
     * @returns {void}
     * @public
     */
    setDrawingMode(mode) {
      this.$drawingManagerObject.setDrawingMode(mode);
    },
    drawAll() {
      const shapeType = {
        circle: google.maps.Circle,
        marker: google.maps.Marker,
        polygon: google.maps.Polygon,
        polyline: google.maps.Polyline,
        rectangle: google.maps.Rectangle,
      };

      const self = this;
      this.finalShapes.forEach((shape) => {
        const shapeDrawing = new shapeType[shape.type](shape.overlay);
        shapeDrawing.setMap(this.$map);
        shape.overlay = shapeDrawing;
        google.maps.event.addListener(shapeDrawing, 'click', () => {
          self.setSelection(shape);
        });
      });
    },
    clearAll() {
      this.clearSelection();
      this.finalShapes.forEach((shape) => {
        shape.overlay.setMap(null);
      });
    },
    clearSelection() {
      if (this.selectedShape) {
        this.selectedShape.overlay.set('fillColor', '#777');
        this.selectedShape.overlay.set('strokeColor', '#999');
        this.selectedShape.overlay.setEditable(false);
        this.selectedShape.overlay.setDraggable(false);
        this.selectedShape = null;
      }
    },
    setSelection(shape) {
      this.clearSelection();
      this.selectedShape = shape;
      shape.overlay.setEditable(true);
      shape.overlay.setDraggable(true);
      this.selectedShape.overlay.set('fillColor', '#555');
      this.selectedShape.overlay.set('strokeColor', '#777');
    },
    /**
     * The deleteSelection method is binded into the default component slot
     *
     * @method deleteSelection
     * @param - It doesn't requires any parameter
     * @returns {void}
     * @public
     */
    deleteSelection() {
      if (this.selectedShape) {
        this.selectedShape.overlay.setMap(null);
        const index = this.finalShapes.indexOf(this.selectedShape);
        if (index > -1) {
          this.finalShapes.splice(index, 1);
        }
      }
    },
    addShape(shape) {
      this.setDrawingMode(null);
      this.finalShapes.push(shape);

      /**
       * update:shapes event
       * @event update:shapes
       * @property {array} place `this.finalShapes`
       */
      this.$emit('update:shapes', [...this.finalShapes]);

      const self = this;
      google.maps.event.addListener(shape.overlay, 'click', () => {
        self.setSelection(shape);
      });
      google.maps.event.addListener(shape.overlay, 'rightclick', () => {
        self.deleteSelection();
      });
      google.maps.event.addListener(shape.overlay, 'dragend', () => {
        this.$emit('update:shapes', [...this.finalShapes]);
      });
      this.setSelection(shape);
    },
  },
};
</script>
