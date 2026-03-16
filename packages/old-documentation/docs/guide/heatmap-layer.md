## Description

This components helps you to set a heat zone over the map.

For more information read the Google Maps documentation
for [heatmaplayer](https://developers.google.com/maps/documentation/javascript/heatmaplayer)

It is exported with the name `GmapHeatmapLayer`.

## Variables

This component save the original heat map layer object provided by Google Maps in a property
called `$heatmapLayerObject`, as the example below.

```javascript
  this.$heatmapLayerObject = new google.maps.visualization.HeatmapLayer(...);
```

## Source code

:::details Click to se the source code of <code>heatmap-layer.vue</code> component

```vue
<script>
import MapElementMixin from '../mixins/map-element';
import { heatMapLayerMappedProps } from '../utils/mapped-props-by-map-element';
import { bindProps, getPropsValues, bindEvents } from '../utils/helpers';

export default {
  mixins: [MapElementMixin],
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Array,
    },
  },
  provide() {
    const events = [];

    // Infowindow needs this to be immediately available
    const promise = await this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map: this.$map,
          ...getPropsValues(this, heatMapLayerMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$heatmapLayerObject = new google.maps.visualization.HeatmapLayer(
          finalOptions
        );

        bindProps(this, this.$heatmapLayerObject, heatMapLayerMappedProps);
        bindEvents(this, this.$heatmapLayerObject, events);

        return this.$heatmapLayerObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$heatmapLayerPromise = promise;
    return { $heatmapLayerPromise: promise };
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$heatmapLayerObject && this.$heatmapLayerObject.setMap) {
      this.$heatmapLayerObject.setMap(null);
    }
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

:::details Mapped Props of <code>GmapHeatmapLayer</code> component

```javascript

export const heatMapLayerMappedProps = {
  options: {
    type: Object,
    twoWay: false,
    default: () => {},
  },
  data: {
    type: Array,
    twoWay: true,
  },
};

```

:::

## How to use it

```vue
<template>
  <gmap-map
    ref="mapRef"
    :zoom="7"
    :center="center"
    map-type-id="roadmap"
    style="width: 100%; height: 500px;"
  >
    <gmap-heatmap-layer
      :data="[new google.maps.LatLng(37.782, -122.447)]"
      :options="{maxIntensity: 120, dissipating: false}"
    />
  </gmap-map>
</template>
```

You also can use a computed property like below

```vue
<template>
  <gmap-map
    ref="mapRef"
    :zoom="7"
    :center="center"
    map-type-id="roadmap"
    style="width: 100%; height: 500px;"
  >
    <gmap-marker
      v-for="(m, index) in markers"
      :key="index"
      :position="m.location"
      :clickable="true"
      :draggable="true"
      @click="center=m.location"
    />
    <gmap-heatmap-layer
      :data="markers"
      :options="{maxIntensity: 120, dissipating: false}"
    />
  </gmap-map>
</template>
<script>
  import { gmapApi } from 'gmap-vue';

  export default {
    computed: {
      google: gmapApi,
      markers() {
        if (this.google) {
          return [
            { location: new google.maps.LatLng({ lat: 3, lng: 101 }), weight: 100 },
            { location: new google.maps.LatLng({ lat: 5, lng: 99 }), weight: 50  },
            { location: new google.maps.LatLng({ lat: 6, lng: 97 }), weight: 80 }
          ];
        }
        return [];
      },
    },
  };
</script>
```

::: warning
This component is one of the few components where you must use the Google `LatLng` object to create the markers, you
can't use a generic object like `{ lat: 0, lng: 0 }` to generate them.
:::

If you need to know the **API of this component** please read it [here](/code/components/heatmap-layer.html).

## HTML examples

:::details HTML example

```html
<body>
  <div id="root">
    <gmap-map
      ref="mapRef"
      :zoom="7"
      :center="center"
      map-type-id="roadmap"
      style="width: 100%; height: 500px;"
    >
      <gmap-marker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.location"
        :clickable="true"
        :draggable="true"
        @click="center=m.location"
      />
      <gmap-heatmap-layer
        :data="markers"
        :options="{maxIntensity: 120, dissipating: false}"
      />
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'visualization'
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          center: { lat: 4.5, lng: 99 },
          markers: [],
        },
        async mounted() {
          await this.$gmapApiPromiseLazy();
          this.markers = [
            {
              location: new google.maps.LatLng({ lat: 3, lng: 101 }),
              weight: 100
            },
            {
              location: new google.maps.LatLng({ lat: 5, lng: 99 }),
              weight: 50
            },
            {
              location: new google.maps.LatLng({ lat: 6, lng: 97 }),
              weight: 80
            }
          ];
        }
      });
    });
  </script>
</body>
```

:::

## Test the component

:::details Click to see the HTML example in action

<eg-base libraries="visualization">
  <eg-heat-map-layer />
</eg-base>

:::
