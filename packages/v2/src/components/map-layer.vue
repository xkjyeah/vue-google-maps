<template>
  <div class="vue-map-container">
    <div ref="vue-map" class="vue-map"></div>
    <div class="vue-map-hidden">
      <!-- @slot The default slot is wrapped in a class that sets display: none; so by default any component you add to your map will be invisible. This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if you want to bring up things like toolboxes, etc. -->
      <slot></slot>
    </div>
    <!-- @slot This slot must be used if you want to display content within the responsive wrapper for the map.  -->
    <slot name="visible"></slot>
  </div>
</template>

<script>
import mountableMixin from '../mixins/mountable';
import {
  bindEvents,
  bindProps,
  getPropsValues,
  twoWayBindingWrapper,
  watchPrimitiveProperties,
} from '../utils/helpers';
import { mapMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * Map component
 * @displayName Map
 * @see [source code](/guide/map.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/basics)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/map)
 */
export default {
  name: 'MapLayer',
  mixins: [mountableMixin],
  provide() {
    this.$mapPromise = new Promise((resolve, reject) => {
      this.$mapPromiseDeferred = { resolve, reject };
    });

    return {
      $mapPromise: this.$mapPromise,
    };
  },
  props: {
    /**
     * The initial Map center.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    center: {
      type: Object,
      required: true,
    },
    /**
     * The initial Map zoom level. Valid values: Integers between zero, and up to the supported maximum zoom level.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    zoom: {
      type: Number,
      required: false,
      default: undefined,
    },
    /**
     * The heading for aerial imagery in degrees measured clockwise from cardinal direction North. Headings are snapped to the nearest available angle for which imagery is available.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    heading: {
      type: Number,
      default: undefined,
    },
    /**
     * The initial Map mapTypeId. Defaults to ROADMAP.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    mapTypeId: {
      type: String,
      default: 'roadmap',
    },
    /**
     * For vector maps, sets the angle of incidence of the map. The allowed values are restricted depending on the zoom level of the map. For raster maps, controls the automatic switching behavior for the angle of incidence of the map. The only allowed values are 0 and 45. The value 0 causes the map to always use a 0° overhead view regardless of the zoom level and viewport. The value 45 causes the tilt angle to automatically switch to 45 whenever 45° imagery is available for the current zoom level and viewport, and switch back to 0 whenever 45° imagery is not available (this is the default behavior). 45° imagery is only available for satellite and hybrid map types, within some locations, and at some zoom levels. Note: getTilt returns the current tilt angle, not the value specified by this option. Because getTilt and this option refer to different things, do not bind() the tilt property; doing so may yield unpredictable effects.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    tilt: {
      type: Number,
      default: undefined,
    },
    /**
     * Extra options that you want pass to the component
     */
    options: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      recyclePrefix: '__gmc__',
    };
  },
  computed: {
    finalLat() {
      return this.center && typeof this.center.lat === 'function'
        ? this.center.lat()
        : this.center.lat;
    },
    finalLng() {
      return this.center && typeof this.center.lng === 'function'
        ? this.center.lng()
        : this.center.lng;
    },
    finalLatLng() {
      return { lat: this.finalLat, lng: this.finalLng };
    },
  },
  watch: {
    zoom(zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(zoom);
      }
    },
  },
  beforeDestroy() {
    const recycleKey = this.getRecycleKey();
    if (window[recycleKey]) {
      window[recycleKey].div = this.$mapObject.getDiv();
    }
  },
  mounted() {
    return this.$gmapApiPromiseLazy()
      .then(() => {
        const events = [
          'bounds_changed',
          'click',
          'dblclick',
          'drag',
          'dragend',
          'dragstart',
          'idle',
          'mousemove',
          'mouseout',
          'mouseover',
          'resize',
          'rightclick',
          'tilesloaded',
        ];

        // getting the DOM element where to create the map
        const element = this.$refs['vue-map'];

        // creating the map
        const initialOptions = {
          ...this.options,
          ...getPropsValues(this, mapMappedProps),
        };

        // don't use delete keyword in order to create a more predictable code for the engine
        const { options: extraOptions, ...finalOptions } = initialOptions;
        const options = finalOptions;

        const recycleKey = this.getRecycleKey();
        if (
          this &&
          this.options &&
          this.options.recycle &&
          window[recycleKey]
        ) {
          element.appendChild(window[recycleKey].div);
          this.$mapObject = window[recycleKey].map;
          this.$mapObject.setOptions(options);
        } else {
          // console.warn('[gmap-vue] New google map created')
          this.$mapObject = new google.maps.Map(element, options);
          window[recycleKey] = { map: this.$mapObject };
        }

        // binding properties (two and one way)
        bindProps(this, this.$mapObject, mapMappedProps);
        // binding events
        bindEvents(this, this.$mapObject, events);

        // manually trigger center and zoom
        twoWayBindingWrapper((increment, decrement, shouldUpdate) => {
          this.$mapObject.addListener('center_changed', () => {
            if (shouldUpdate()) {
              /**
               * This event is fired when the map center property changes. It sends the position displayed at the center of the map. If the center or bounds have not been set then the result is undefined. (types: `LatLng|undefined`)
               *
               * @event center_changed
               * @type {(LatLng|undefined)}
               */
              this.$emit('center_changed', this.$mapObject.getCenter());
            }
            decrement();
          });

          const updateCenter = () => {
            increment();
            this.$mapObject.setCenter(this.finalLatLng);
          };

          watchPrimitiveProperties(
            this,
            ['finalLat', 'finalLng'],
            updateCenter
          );
        });
        this.$mapObject.addListener('zoom_changed', () => {
          /**
           * This event is fired when the map zoom property changes. It sends the zoom of the map. If the zoom has not been set then the result is undefined. (types: `number|undefined`)
           *
           * @event zoom_changed
           * @type {(number|undefined)}
           */
          this.$emit('zoom_changed', this.$mapObject.getZoom());
        });
        this.$mapObject.addListener('bounds_changed', () => {
          /**
           * This event is fired when the viewport bounds have changed. It sends The lat/lng bounds of the current viewport.
           *
           * @event bounds_changed
           * @type {LatLngBounds}
           */
          this.$emit('bounds_changed', this.$mapObject.getBounds());
        });

        this.$mapPromiseDeferred.resolve(this.$mapObject);

        return this.$mapObject;
      })
      .catch((error) => {
        throw error;
      });
  },
  methods: {
    /**
     * This method trigger the resize event of Google Maps
     * @method resize
     * @param {undefined}
     * @returns {void}
     * @public
     */
    resize() {
      if (this.$mapObject) {
        google.maps.event.trigger(this.$mapObject, 'resize');
      }
    },
    /**
     * Preserve the previous center when resize the map
     * @method resizePreserveCenter
     * @param {undefined}
     * @returns {void}
     * @public
     */
    resizePreserveCenter() {
      if (!this.$mapObject) {
        return;
      }

      const oldCenter = this.$mapObject.getCenter();
      google.maps.event.trigger(this.$mapObject, 'resize');
      this.$mapObject.setCenter(oldCenter);
    },

    // Override mountableMixin::_resizeCallback
    // because resizePreserveCenter is usually the
    // expected behaviour
    // TODO: analyze the following disabled rule
    // eslint-disable-next-line no-underscore-dangle -- old code
    _resizeCallback() {
      this.resizePreserveCenter();
    },
    /**
     * Changes the center of the map by the given distance in pixels. If the distance is less than both the width and height of the map, the transition will be smoothly animated. Note that the map coordinate system increases from west to east (for x values) and north to south (for y values).
     * @method panBy
     * @param {number} x - Number of pixels to move the map in the x direction.
     * @param {number} y - Number of pixels to move the map in the y direction.
     * @returns {void}
     * @public
     */
    panBy(...args) {
      if (this.$mapObject) {
        this.$mapObject.panBy(...args);
      }
    },
    /**
     * Changes the center of the map to the given LatLng. If the change is less than both the width and height of the map, the transition will be smoothly animated.
     * @method panTo
     * @param {(LatLng|LatLngLiteral)} latLng - The new center latitude/longitude of the map. (types `LatLng|LatLngLiteral`)
     * @returns {void}
     * @public
     */
    panTo(...args) {
      if (this.$mapObject) {
        this.$mapObject.panTo(...args);
      }
    },
    /**
     * Pans the map by the minimum amount necessary to contain the given LatLngBounds. It makes no guarantee where on the map the bounds will be, except that the map will be panned to show as much of the bounds as possible inside {currentMapSizeInPx} - {padding}. For both raster and vector maps, the map's zoom, tilt, and heading will not be changed.
     * @method panToBounds
     * @param {(LatLngBounds|LatLngBoundsLiteral)} latLngBounds - The bounds to pan the map to. (types: `LatLngBounds|LatLngBoundsLiteral`)
     * @param {(number|Padding)} [padding] - optional Padding in pixels. A number value will yield the same padding on all 4 sides. The default value is 0. (types: `number|Padding`)
     * @returns {void}
     * @public
     */
    panToBounds(...args) {
      if (this.$mapObject) {
        this.$mapObject.panToBounds(...args);
      }
    },
    /**
     * Sets the viewport to contain the given bounds.
Note: When the map is set to display: none, the fitBounds function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to visibility: hidden, thereby ensuring the map div has an actual size. For vector maps, this method sets the map's tilt and heading to their default zero values.
     * @method fitBounds
     * @param {(LatLngBounds|LatLngBoundsLiteral)} bounds - Bounds to show. (types: `LatLngBounds|LatLngBoundsLiteral`)
     * @param {(number|Padding)} [padding] - optional Padding in pixels. The bounds will be fit in the part of the map that remains after padding is removed. A number value will yield the same padding on all 4 sides. Supply 0 here to make a fitBounds idempotent on the result of getBounds. (types: `number|Padding`)
     * @returns {void}
     * @public
     */
    fitBounds(...args) {
      if (this.$mapObject) {
        this.$mapObject.fitBounds(...args);
      }
    },
    /**
     * Get the recycle key of the map
     * @method getRecycleKey
     * @param {undefined}
     * @returns {void}
     * @public
     */
    getRecycleKey() {
      return this && this.options && this.options.recycle
        ? this.recyclePrefix + this.options.recycle
        : this.recyclePrefix;
    },
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$mapObject && this.$mapObject.setMap) {
      this.$mapObject.setMap(null);
    }
  },
};
</script>

<style lang="css">
.vue-map-container {
  position: relative;
}

.vue-map-container .vue-map {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}
.vue-map-hidden {
  display: none;
}
</style>
