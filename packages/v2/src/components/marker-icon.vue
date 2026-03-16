<script>
import MapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { markerMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * Marker component
 * @displayName Marker
 * @see [source code](/guide/marker.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/markers)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/marker)
 */
export default {
  name: 'MarkerIcon',
  mixins: [MapElementMixin],
  inject: {
    $clusterPromise: {
      default: null,
    },
  },
  provide() {
    const events = [
      'click',
      'rightclick',
      'dblclick',
      'drag',
      'dragstart',
      'dragend',
      'mouseup',
      'mousedown',
      'mouseover',
      'mouseout',
    ];

    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          // TODO: analyze the below line because I think it can be removed
          ...this.options,
          map,
          ...getPropsValues(this, markerMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        if (this.$clusterPromise) {
          finalOptions.map = null;
        }

        this.$markerObject = new google.maps.Marker(finalOptions);

        bindProps(this, this.$markerObject, markerMappedProps);
        bindEvents(this, this.$markerObject, events);

        this.$markerObject.addListener('dragend', () => {
          const newPosition = this.$markerObject.getPosition();
          /**
           * An event to detect when a position changes
           * @property {Object} position Object with lat and lng values, eg: { lat: 10.0, lng: 10.0 }
           */
          this.$emit('update:position', {
            lat: newPosition.lat(),
            lng: newPosition.lng(),
          });
        });

        if (this.$clusterPromise) {
          this.$clusterPromise.then((clusterObject) => {
            clusterObject.addMarker(this.$markerObject);
            this.$clusterObject = clusterObject;
          });
        }

        return this.$markerObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$markerPromise = promise;
    return { $markerPromise: promise };
  },
  props: {
    /**
     * Which animation to play when marker is added to a map.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    animation: {
      type: Number,
      default: undefined,
    },
    /**
     * This property was not found on the Googole Maps documentation, but it was defined in the previous version of this component.
     * Any suggestion is welcome here.
     */
    attribution: {
      type: Object,
      default: undefined,
    },
    /**
     * If true, the marker receives mouse and touch events. Default value is true.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    clickable: {
      type: Boolean,
      default: true,
    },
    /**
     * Mouse cursor type to show on hover.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    cursor: {
      type: String,
      default: undefined,
    },
    /**
     * If true, the marker can be dragged. Default value is false.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    draggable: {
      type: Boolean,
      default: false,
    },
    /**
     * Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url.
     * Its type can be string|Icon|Symbol optional
     * @see [Icon type](https://developers.google.com/maps/documentation/javascript/reference/marker#Icon)
     * @see [Symbol type](https://developers.google.com/maps/documentation/javascript/reference/marker#Symbol)
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    icon: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * Adds a label to the marker. A marker label is a letter or number that appears inside a marker. The label can either be a string, or a MarkerLabel object. If provided and MarkerOptions.title is not provided, an accessibility text (e.g. for use with screen readers) will be added to the marker with the provided label's text. Please note that the label is currently only used for accessibility text for non-optimized markers.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    label: {
      type: [String, Object],
      default: undefined,
    },
    /**
     * A number between 0.0, transparent, and 1.0, opaque.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    opacity: {
      type: Number,
      default: 1,
    },
    /**
     * Extra options passed to this component.
     */
    options: {
      type: Object,
      default: undefined,
    },
    /**
     * This property was not found on the Googole Maps documentation, but it was defined in the previous version of this component.
     * Any suggestion is welcome here.
     */
    place: {
      type: Object,
      default: undefined,
    },
    /**
     * Marker position. The position is required to display the marker and can be provided with Marker.setPosition if not provided at marker construction.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    position: {
      type: Object,
      default: undefined,
    },
    /**
     * Image map region definition used for drag/click.
     * @see [MarkerShape type](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerShape)
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    shape: {
      type: Object,
      default: undefined,
    },
    /**
     * Rollover text. If provided, an accessibility text (e.g. for use with screen readers) will be added to the marker with the provided value. Please note that the title is currently only used for accessibility text for non-optimized markers.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    title: {
      type: String,
      default: undefined,
    },
    /**
     * If true, the marker is visible.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    visible: {
      type: Boolean,
      default: true,
    },
    /**
     * All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen.
     * @see https://developers.google.com/maps/documentation/javascript/reference/marker
     */
    zIndex: {
      type: Number,
      default: undefined,
    },
  },
  destroyed() {
    if (!this.$markerObject) {
      return;
    }

    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      this.$clusterObject.removeMarker(this.$markerObject, true);
    } else if (this.$markerObject && this.$markerObject.setMap) {
      this.$markerObject.setMap(null);
    }
  },
  render(h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return '';
    }
    if (this.$slots.default.length === 1) {
      // So that infowindows can have a marker parent
      return this.$slots.default[0];
    }

    /**
     * @slot Default slot of the component.
     */
    return h('div', this.$slots.default);
  },
};
</script>
