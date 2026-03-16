<template>
  <div class="vue-street-view-pano-container">
    <div ref="vue-street-view-pano" class="vue-street-view-pano"></div>
    <!-- @slot A default slot to render the street view panorama -->
    <slot></slot>
  </div>
</template>

<script>
import MountableMixin from '../mixins/mountable';
import {
  bindEvents,
  bindProps,
  getPropsValues,
  twoWayBindingWrapper,
  watchPrimitiveProperties,
} from '../utils/helpers';
import { streetViewPanoramaMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * Street View Panorama component
 * @displayName GmapStreetViewPanorama
 * @see [source code](/guide/street-view-panorama.html#source-code)
 * @see [official docs](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanorama)
 */
export default {
  name: 'StreetViewPanorama',
  mixins: [MountableMixin],
  provide() {
    this.$panoPromise = new Promise((resolve, reject) => {
      this.$panoPromiseDeferred = { resolve, reject };
    });
    return {
      $panoPromise: this.$panoPromise,
      $mapPromise: this.$panoPromise, // so that we can use it with markers
    };
  },
  props: {
    /**
     * The zoom of the panorama, specified as a number. A zoom of 0 gives a 180 degrees Field of View.
     * @value number
     * @see [StreetViewPanorama zoom](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.zoom)
     */
    zoom: {
      type: Number,
      default: undefined,
    },
    /**
     * The camera orientation, specified as heading and pitch, for the panorama.
     * @value object
     * @type StreetViewPov
     * @see [StreetViewPanorama pov](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pov)
     */
    pov: {
      type: Object,
      default: undefined,
    },
    /**
     * The LatLng position of the Street View panorama.
     * @value object
     * @type LatLng|LatLngLiteral
     * @see [StreetViewPanorama position](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.position)
     */
    position: {
      type: Object,
      default: undefined,
    },
    /**
     * The panorama ID, which should be set when specifying a custom panorama.
     * @value string
     * @see [StreetViewPanorama pano](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pano)
     */
    pano: {
      type: String,
      default: undefined,
    },
    /**
     * Whether motion tracking is on or off. Enabled by default when the motion tracking control is present, so that the POV (point of view) follows the orientation of the device. This is primarily applicable to mobile devices. If motionTracking is set to false while motionTrackingControl is enabled, the motion tracking control appears but tracking is off. The user can tap the motion tracking control to toggle this option.
     * @value boolean
     * @see [StreetViewPanorama motionTracking](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.motionTracking)
     */
    motionTracking: {
      type: Boolean,
    },
    /**
     * If true, the Street View panorama is visible on load.
     * @value boolean
     * @see [StreetViewPanorama visible](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.visible)
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
  replace: false, // necessary for css styles
  computed: {
    finalLat() {
      return this.position && typeof this.position.lat === 'function'
        ? this.position.lat()
        : this.position.lat;
    },
    finalLng() {
      return this.position && typeof this.position.lng === 'function'
        ? this.position.lng()
        : this.position.lng;
    },
    finalLatLng() {
      return {
        lat: this.finalLat,
        lng: this.finalLng,
      };
    },
  },
  watch: {
    zoom(zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(zoom);
      }
    },
  },
  mounted() {
    const events = ['closeclick', 'status_changed'];

    return this.$gmapApiPromiseLazy()
      .then(() => {
        // getting the DOM element where to create the map
        const element = this.$refs['vue-street-view-pano'];

        // creating the map
        const options = {
          ...this.options,
          ...getPropsValues(this, streetViewPanoramaMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = options;

        this.$panoObject = new google.maps.StreetViewPanorama(
          element,
          finalOptions
        );

        // binding properties (two and one way)
        bindProps(this, this.$panoObject, streetViewPanoramaMappedProps);
        // binding events
        bindEvents(this, this.$panoObject, events);

        // manually trigger position
        twoWayBindingWrapper((increment, decrement, shouldUpdate) => {
          // Panos take a while to load
          increment();

          this.$panoObject.addListener('position_changed', () => {
            if (shouldUpdate()) {
              this.$emit('position_changed', this.$panoObject.getPosition());
            }
            decrement();
          });

          const updateCenter = () => {
            increment();
            this.$panoObject.setPosition(this.finalLatLng);
          };

          watchPrimitiveProperties(
            this,
            ['finalLat', 'finalLng'],
            updateCenter
          );
        });

        this.$panoPromiseDeferred.resolve(this.$panoObject);

        return this.$panoPromise;
      })
      .catch((error) => {
        throw error;
      });
  },
  methods: {
    resize() {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize');
      }
    },
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$panoObject && this.$panoObject.setMap) {
      this.$panoObject.setMap(null);
    }
  },
};
</script>

<style lang="css">
.vue-street-view-pano-container {
  position: relative;
}

.vue-street-view-pano-container .vue-street-view-pano {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}
</style>
