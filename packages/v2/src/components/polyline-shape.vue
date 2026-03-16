<script>
import mapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { polylineMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * PolyLine component
 * @displayName GmapPolyline
 * @see [source code](/guide/polyline.html#source-code)
 * @see [official docs](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Polyline)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Polyline)
 */
export default {
  name: 'PolylineShape',
  mixins: [mapElementMixin],
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

    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, polylineMappedProps),
        };
        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$polylineObject = new google.maps.Polyline(finalOptions);

        bindProps(this, this.$polylineObject, polylineMappedProps);
        bindEvents(this, this.$polylineObject, events);

        let clearEvents = () => {};

        this.$watch(
          'path',
          (path) => {
            if (path) {
              clearEvents();

              this.$polylineObject.setPath(path);

              const mvcPath = this.$polylineObject.getPath();
              const eventListeners = [];

              const updatePaths = () => {
                /**
                 * An event to detect when a path change
                 * @property {array} path `this.$polygonObject.getPath()`
                 */
                this.$emit('path_changed', this.$polylineObject.getPath());
              };

              eventListeners.push([
                mvcPath,
                mvcPath.addListener('insert_at', updatePaths),
              ]);
              eventListeners.push([
                mvcPath,
                mvcPath.addListener('remove_at', updatePaths),
              ]);
              eventListeners.push([
                mvcPath,
                mvcPath.addListener('set_at', updatePaths),
              ]);

              clearEvents = () => {
                // TODO: analyze, we change map to forEach because clearEvents is a void function and the returned array is not used
                eventListeners.forEach(([, listenerHandle]) => {
                  google.maps.event.removeListener(listenerHandle);
                });
              };
            }
          },
          {
            deep: this.deepWatch,
            immediate: true,
          }
        );

        return this.$polylineObject;
      })
      .catch((error) => {
        throw error;
      });

    // TODO: analyze the efects of only returns the instance and remove completely the promise
    this.$polylinePromise = promise;
    return { $polylinePromise: promise };
  },
  props: {
    /**
     * If set true the object will be deep watched
     * @value boolean
     */
    deepWatch: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates whether this Polygon handles mouse events. Defaults to true.
     * @value true, false
     * @see [Polyline draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.clickable)
     */
    clickable: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the polyline is draggable
     * @value true, false
     * @see [Polyline draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.draggable)
     */
    draggable: {
      type: Boolean,
    },
    /**
     * Indicates if the polygon is editable
     * @value true, false
     * @see [Polyline editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.editable)
     */
    editable: {
      type: Boolean,
    },
    /**
     * The stroke color. All CSS3 colors are supported except for extended named colors.
     * @value '#000'
     * @see [Polyline editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeColor)
     */
    strokeColor: {
      type: String,
      default: '',
    },
    /**
     * The stroke opacity between 0.0 and 1.0.
     * @value 1
     * @see [Polyline editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeOpacity)
     */
    strokeOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * The stroke width in pixels.
     * @value 1
     * @see [Polyline editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.strokeWeight)
     */
    strokeWeight: {
      type: Number,
      default: 1,
    },
    /**
     * Whether this polyline is visible on the map. Defaults to true.
     * @value 1
     * @see [Polyline editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.visible)
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
    /**
     * Indicates if the polygon is editable
     * @value Array
     * @see [Polyline path](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#PolylineOptions.path)
     */
    path: {
      type: Array,
      default: undefined,
    },
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$polylineObject && this.$polylineObject.setMap) {
      this.$polylineObject.setMap(null);
    }
  },
};
</script>
