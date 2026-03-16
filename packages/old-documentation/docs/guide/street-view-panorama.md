## Description

This component helps you to create a street view panorama on Google Maps API.

For more information read the Google Maps documentation
for [street view panorama](https://developers.google.com/maps/documentation/javascript/streetview).

It is exported with the name `GmapStreetViewPanorama`.

## Variables

This component save the original street view panorama object provided by Google Maps in a property called `$panoObject`,
as the example below.

```javascript
this.$panoObject = new google.maps.StreetViewPanorama(element, options);
```

## Source code

:::details Click to se the source code of <code>street-view-panorama.vue</code> component

```vue
<template>
  <div class="vue-street-view-pano-container">
    <div ref="vue-street-view-pano" class="vue-street-view-pano"></div>
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

export default {
  mixins: [MountableMixin],
  props: {
    zoom: {
      type: Number,
    },
    pov: {
      type: Object,
    },
    position: {
      type: Object,
    },
    pano: {
      type: String,
    },
    motionTracking: {
      type: Boolean,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: undefined,
    },
  },
  replace: false,
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
  methods: {
    resize() {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize');
      }
    },
  },
  mounted() {
    const events = ['closeclick', 'status_changed'];

    return this.$gmapApiPromiseLazy()
      .then(() => {
        const element = this.$refs['vue-street-view-pano'];

        const options = {
          ...this.options,
          ...getPropsValues(this, streetViewPanoramaMappedProps),
        };
        delete options.options;

        this.$panoObject = new google.maps.StreetViewPanorama(element, options);

        bindProps(this, this.$panoObject, streetViewPanoramaMappedProps);
        bindEvents(this, this.$panoObject, events);

        twoWayBindingWrapper((increment, decrement, shouldUpdate) => {
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
  provide() {
    const promise = new Promise((resolve, reject) => {
      this.$panoPromiseDeferred = { resolve, reject };
    });
    return {
      $panoPromise: promise,
      $mapPromise: promise,
    };
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
```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

:::details Events bound with to way on <code>GmapPolyline</code>

```javascript
const events = ['closeclick', 'status_changed'];
```

:::

## How to use it

```vue
<template>
  <div class="flex-container">
    <div>
      <gmap-map :center="mapCenter" :zoom="12"
        ref="map"
        @center_changed="updateCenter"
        @idle="sync"
        class="map-container">
      </gmap-map>
    </div>
    <div>
      <gmap-street-view-panorama
        ref="pano"
        :position="mapCenter"
        :pov="pov"
        :zoom="1"
        class="map-container"
        @position_changed="updateCenter"
        @pano_changed="updatePano"
        @pov_changed="updatePov">
      </gmap-street-view-panorama>
    </div>
  </div>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/street-view-panorama.html).

## HTML examples

:::details Street view panorama

```html
<head>
  <style>
    .map-container {
      width: 400px;
      height: 400px;
      display: inline-block;
    }
    .flex-container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  </style>
</head>
<body>
  <div id="root">
    <h3>Panorama at Pembroke College, Cambridge, facing North, looking slightly upwards (10 degrees)</h3>
    <p>Point-of-view updates when you pan around</p>
    <ul>
      <li><strong>Heading:</strong> <i>{{pov && pov.heading}}</i> <button @click="pov.heading = Math.random() * 360">Change</button></li>
      <li><strong>Pitch:</strong> <i>{{pov && pov.pitch}}</i> <button @click="pov.pitch = Math.random() * 180 - 90">Change</button></li>
      <li> <strong>Change booth:</strong> <button @click="pov.pitch = Math.random() * 180 - 90, pov.heading = Math.random() * 360">Change Both</button></li>
      <li><strong>Pano ID:</strong> <i>{{pano}}</i></li>
    </ul>
    <br><br>
    <div class="flex-container">
      <div>
        <gmap-map :center="mapCenter" :zoom="12"
          ref="map"
          @center_changed="updateCenter"
          @idle="sync"
          class="map-container">
        </gmap-map>
      </div>
      <div>
        <gmap-street-view-panorama
          ref="pano"
          :position="mapCenter"
          :pov="pov"
          :zoom="1"
          class="map-container"
          @position_changed="updateCenter"
          @pano_changed="updatePano"
          @pov_changed="updatePov">
        </gmap-street-view-panorama>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places'
      },
      // Demonstrating how we can customize the name of the components
      installComponents: true,
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          reportedMapCenter: {
            lat: 52.201272,
            lng: 0.118720
          },
          mapCenter: null,
          pov: {
            heading: 0,
            pitch: 0,
          },
          pano: 0,
        },
        methods: {
          updatePov(pov) {
            this.pov = pov;
          },
          updatePano(pano) {
            this.pano = pano;
          },
          updateCenter(latLng) {
            this.reportedMapCenter = {
              lat: latLng.lat(),
              lng: latLng.lng(),
            }
          },
          sync () {
            this.mapCenter = this.reportedMapCenter
          }
        },
        created() {
          this.sync()
        },
      });
    });
  </script>
</body>
```

:::

## Test the component

:::warning
Experimental
:::

<eg-base>
  <eg-street-view-panorama />
</eg-base>
