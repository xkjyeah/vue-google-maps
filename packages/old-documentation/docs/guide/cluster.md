## Description

This component helps you to create a cluster of markers on Google Maps API.

For more information read the Google Maps documentation
for [clustering](https://developers.google.com/maps/documentation/javascript/marker-clustering).

::: warning

To use this component you need to have installed `@googlemaps/markerclusterer`

```bash

npm install --save @googlemaps/markerclusterer

```

:::

::: warning

This component **must be manually imported**

```javascript
// import globally use the Vue instance
import { components } from 'gmap-vue';

Vue.component('gmap-cluster', components.Cluster);
```

```javascript
// import locally inside your component
import { components } from "gmap-vue";

export default {
  name: "MyCoolComponent",
  data() {
    return {
      center: {
        lat: 10.0,
        lng: 10.0
      },
      markers: [
        {
          position: {
            lat: 10.0,
            lng: 10.0
          }
        },
        {
          position: {
            lat: 11.0,
            lng: 11.0
          }
        }
      ]
    };
  },
  components: {
    "gmap-cluster": components.Cluster
  }
};
```

:::

::: tip

This component is exported in the `components` object with the name `Cluster`

```js
import { components } from "gmap-vue";

export default {
  ...
  components: {
    "gmap-cluster": components.Cluster
  }
};
```

:::

## Variables

This component save the original cluster object provided by Google Maps in a property called `$clusterObject`, as the
example below.

```javascript
this.$clusterObject = new MarkerClusterer(...);
```

## Source code

:::details Click to se the source code of <code>cluster.vue</code> component

```vue
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import MapElementMixin from '../mixins/map-element';
import { clusterIconMappedProps } from '../utils/mapped-props-by-map-element';
import { bindEvents, getPropsValues, bindProps } from '../utils/helpers';

export default {
  name: 'ClusterIcon',
  mixins: [MapElementMixin],
  provide() {
    // events to bind with toWay
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

    // Infowindow needs this to be immediately available
    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, clusterIconMappedProps),
        };
        const { options: extraOptions, ...finalOptions } = initialOptions;

        if (typeof MarkerClusterer === 'undefined') {
          throw new Error(
            'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js'
          );
        }

        const {
          map: mapInstance,
          markers,
          algorithm,
          onClusterClick,
          renderer,
        } = finalOptions;

        this.$clusterObject = new MarkerClusterer({
          map: mapInstance,
          markers,
          algorithm,
          onClusterClick,
          renderer,
        });

        bindProps(this, this.$clusterObject, {});
        bindEvents(this, this.$clusterObject, events);

        Object.keys({}).forEach((prop) => {
          if ({}[prop].twoWay) {
            this.$on(`${prop.toLowerCase()}_changed`, this.reinsertMarkers);
          }
        });

        return this.$clusterObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$clusterPromise = promise;
    return { $clusterPromise: promise };
  },
  props: {
    algorithm: {
      type: Object,
      default: undefined,
    },
    onClusterClick: {
      type: Function,
      default: undefined,
    },
    renderer: {
      type: Object,
      default: undefined,
    },
    options: {
      type: Object,
      default: undefined,
    },
  },
  beforeDestroy() {
    this.$children.forEach((marker) => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null;
      }
    });

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  },
  destroyed() {
    if (this.$clusterObject && this.$clusterObject.setMap) {
      this.$clusterObject.setMap(null);
    }
  },
  updated() {
    if (this.$clusterObject) {
      this.$clusterObject.repaint();
    }
  },
  methods: {
    reinsertMarkers() {
      const oldMarkers = this.$clusterObject.getMarkers();
      this.$clusterObject.clearMarkers();
      this.$clusterObject.addMarkers(oldMarkers);
    },
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

::: details Mapped Props of <code>GmapCluster</code> component

```javascript
export const clusterIconMappedProps = {
  algorithm: {
    type: Object,
  },
  onClusterClick: {
    type: Function,
  },
  renderer: {
    type: Object,
  },
  options: {
    type: Object,
  },
};
```

:::

:::details Events bound with to way on <code>GmapCircle</code>

```javascript
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
```

:::

## How to use it

```vue
<template>
  <gmap-map
    :center="center"
    :zoom="7"
    style="width: 100%; height: 500px"
  >
    <!-- use the default slot to pass markers to it -->
    <gmap-cluster></gmap-cluster>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/cluster-icon.html).

## HTML examples

```html
<body>
  <div id="root">
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <gmap-cluster>
        <gmap-marker v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true" :draggable="true"
          @click="center=m.position"
          :key="index"
          ></gmap-marker>
      </gmap-cluster>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://unpkg.com/@googlemaps/markerclusterer@1.0.13/dist/index.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc'
      },
    });

    Vue.component('gmap-cluster', GmapVue.components.Cluster);

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          center: {
            lat: 10.0,
            lng: 10.0
          },
          markers: [{
            position: {
              lat: 10.0,
              lng: 10.0
            }
          }, {
            position: {
              lat: 11.0,
              lng: 11.0
            }
          }]
        },
      });
    });
  </script>
</body>
```

## Test the component

:::details Click to see the html example in action

<eg-base>
  <eg-basic-marker-cluster />
</eg-base>

:::
