<script>
import MapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { kmlLayerMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * KmlLayer component
 * @displayName Kml-Layer
 * @see [source code](/guide/kml-layer.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/kmllayer)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/kml)
 */
export default {
  name: 'KmlLayer',
  mixins: [MapElementMixin],
  render() {
    return '';
  },
  provide() {
    const events = [
      'click',
      'rightclick',
      'dblclick',
      'mouseup',
      'mousedown',
      'mouseover',
      'mouseout',
    ];

    // Infowindow needs this to be immediately available
    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          // TODO: analyze the below line because I think it can be removed
          ...this.options,
          map,
          ...getPropsValues(this, kmlLayerMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$kmlLayerObject = new google.maps.KmlLayer(finalOptions);

        bindProps(this, this.$kmlLayerObject, kmlLayerMappedProps);
        bindEvents(this, this.$kmlLayerObject, events);

        return this.$kmlLayerObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$kmlLayerPromise = promise;
    return { $kmlLayerPromise: promise };
  },
  props: {
    /**
     * If true, the layer receives mouse events. Default value is true.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.clickable)
     */
    clickable: {
      type: Boolean,
      default: true,
    },
    /**
     * Specifies the Map on which to render the KmlLayer. You can hide a KmlLayer by setting this value to null within the setMap() method
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.map)
     */
    map: {
      type: Object,
      default: undefined,
    },
    /**
     * By default, the input map is centered and zoomed to the bounding box of the contents of the layer. If this option is set to true, the viewport is
     * left unchanged, unless the map's center and zoom were never set.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.preserveViewport)
     */
    preserveViewport: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to render the screen overlays. Default true.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.screenOverlays)
     */
    screenOverlays: {
      type: Boolean,
      default: false,
    },
    /**
     * Suppress the rendering of info windows when layer features are clicked.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.suppressInfoWindows)
     */
    suppressInfoWindows: {
      type: Boolean,
      default: undefined,
    },
    /**
     * The URL of the KML document to display.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.url)
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * The z-index of the layer.
     * @see [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.zIndex)
     */
    zIndex: {
      type: Number,
      default: undefined,
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
    if (this.$kmlLayerObject && this.$kmlLayerObject.setMap) {
      this.$kmlLayerObject.setMap(null);
    }
  },
};
</script>
