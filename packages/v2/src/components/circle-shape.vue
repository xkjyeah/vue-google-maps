<script>
import mapElementMixin from '../mixins/map-element';
import { circleMappedProps } from '../utils/mapped-props-by-map-element';
import { bindEvents, getPropsValues, bindProps } from '../utils/helpers';

/**
 * Circle component
 * @displayName GmapCircle
 * @see [source code](/guide/circle.html#source-code)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Circle)
 */
export default {
  name: 'CircleShape',
  mixins: [mapElementMixin],
  render() {
    return '';
  },
  provide() {
    // events to bind with toWay
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

    // Infowindow needs this to be immediately available
    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, circleMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$circleObject = new google.maps.Circle(finalOptions);

        bindProps(this, this.$circleObject, circleMappedProps);
        bindEvents(this, this.$circleObject, events);

        return this.$circleObject;
      })
      .catch((error) => {
        throw error;
      });

    // TODO: analyze the efects of only returns the instance and remove completely the promise
    this.$circlePromise = promise;
    return { $circlePromise: promise };
  },
  props: {
    /**
     * The center of the Circle.
     * @value { lat: 41.878, lng: -87.629 }
     * @see [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.center)
     */
    center: {
      type: Object,
      required: true,
    },
    /**
     * The radius in meters on the Earth's surface.
     * @value 10
     * @see [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.radius)
     */
    radius: {
      type: Number,
      default: 10,
    },
    /**
     * Indicates whether this Polygon handles mouse events. Defaults to true.
     * @value true, false
     * @see [Circle draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.clickable)
     */
    clickable: {
      type: Boolean,
      default: false,
    },
    /**
     * If set to true, the user can drag this circle over the map. Defaults to false.
     * @value true, false
     * @see [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.draggable)
     */
    draggable: {
      type: Boolean,
      default: false,
    },
    /**
     * If set to true, the user can edit this circle by dragging the control points shown at the center and around the circumference of the circle. Defaults to false.
     * @value true, false
     * @see [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.editable)
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * The fill color. All CSS3 colors are supported except for extended named colors.
     * @value '#000'
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillColor)
     */
    fillColor: {
      type: String,
      default: '',
    },
    /**
     * The fill opacity between 0.0 and 1.0
     * @value 1
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillOpacity)
     */
    fillOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * The stroke color. All CSS3 colors are supported except for extended named colors.
     * @value '#000'
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeColor)
     */
    strokeColor: {
      type: String,
      default: '',
    },
    /**
     * The stroke opacity between 0.0 and 1.0.
     * @value 1
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeOpacity)
     */
    strokeOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * The stroke position. Defaults to CENTER.
     * @value 1
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokePosition)
     * @see [StrokePosition constant](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#StrokePosition)
     */
    strokePosition: {
      type: Number,
      default: 0,
    },
    /**
     * The stroke width in pixels.
     * @value 1
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeWeight)
     */
    strokeWeight: {
      type: Number,
      default: 1,
    },
    /**
     * Whether this polyline is visible on the map. Defaults to true.
     * @value 1
     * @see [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.visible)
     */
    visible: {
      type: Boolean,
      default: true,
    },
    /**
     * The Google Maps circle options
     * @value {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: citymap[city].center,
        radius: Math.sqrt(citymap[city].population) * 100,
      }
     * @see [Circle simple](https://developers.google.com/maps/documentation/javascript/examples/circle-simple)
     */
    options: {
      type: Object,
      default: undefined,
    },
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$circleObject && this.$circleObject.setMap) {
      this.$circleObject.setMap(null);
    }
  },
};
</script>
