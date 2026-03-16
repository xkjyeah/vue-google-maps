<script>
import MapElementMixin from '../mixins/map-element';
import { bindProps, bindEvents, getPropsValues } from '../utils/helpers';
import { rectangleMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * Rectangle component
 * @displayName GmapRectangle
 * @see [source code](/guide/rectangle.html#source-code)
 * @see [official docs](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Rectangle)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Rectangle)
 */
export default {
  name: 'RectangleShape',
  mixins: [MapElementMixin],
  render() {
    return '';
  },
  provide() {
    const events = [
      'click',
      'dblclick',
      'drag',
      'dragend',
      'dragstart',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'rightclick',
    ];

    const $rectanglePromise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, rectangleMappedProps),
        };
        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$rectangleObject = new google.maps.Rectangle(finalOptions);

        bindProps(this, this.$rectangleObject, rectangleMappedProps);
        bindEvents(this, this.$rectangleObject, events);

        return this.$rectangleObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$rectanglePromise = $rectanglePromise;
    return { $rectanglePromise };
  },
  props: {
    /**
     * The bounds.
     * @value object
     * @type LatLngBounds|LatLngBoundsLiteral
     * @see [Rectangle bounds](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.bounds)
     */
    bounds: {
      type: Object,
      default: undefined,
    },
    /**
     * Indicates whether this Polygon handles mouse events. Defaults to true.
     * @value true, false
     * @see [Rectangle draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.clickable)
     */
    clickable: {
      type: Boolean,
      default: false,
    },
    /**
     * If set to true, the user can drag this rectangle over the map. Defaults to false.
     * @value boolean
     * @see [Rectangle draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.draggable)
     */
    draggable: {
      type: Boolean,
      default: false,
    },
    /**
     * If set to true, the user can edit this rectangle by dragging the control points shown at the corners and on each edge. Defaults to false.
     * @value boolean
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.editable)
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * The fill color. All CSS3 colors are supported except for extended named colors.
     * @value '#000'
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.fillColor)
     */
    fillColor: {
      type: String,
      default: '',
    },
    /**
     * The fill opacity between 0.0 and 1.0
     * @value 1
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.fillOpacity)
     */
    fillOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * The stroke color. All CSS3 colors are supported except for extended named colors.
     * @value '#000'
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeColor)
     */
    strokeColor: {
      type: String,
      default: '',
    },
    /**
     * The stroke opacity between 0.0 and 1.0.
     * @value 1
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeOpacity)
     */
    strokeOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * The stroke position. Defaults to CENTER.
     * @value 1
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokePosition)
     * @see [StrokePosition constant](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#StrokePosition)
     */
    strokePosition: {
      type: Number,
      default: 0,
    },
    /**
     * The stroke width in pixels.
     * @value 1
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.strokeWeight)
     */
    strokeWeight: {
      type: Number,
      default: 1,
    },
    /**
     * Whether this polyline is visible on the map. Defaults to true.
     * @value 1
     * @see [Rectangle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#RectangleOptions.visible)
     */
    visible: {
      type: Boolean,
      default: true,
    },
    /**
     * More options that you can pass to the component
     * @value boolean
     */
    options: {
      type: Object,
      default: undefined,
    },
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$rectangleObject && this.$rectangleObject.setMap) {
      this.$rectangleObject.setMap(null);
    }
  },
};
</script>
