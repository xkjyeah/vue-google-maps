## Description

This component helps you to create a circle on Google Maps API.

For more information read the Google Maps documentation
for [circles](https://developers.google.com/maps/documentation/javascript/examples/circle-simple#maps_circle_simple-javascript)
.

It is exported with the name `GmapCircle`.

## Variables

This component save the original circle object provided by Google Maps in a property called `$circleObject`, as the
example below.

```javascript
this.$circleObject = new google.maps.Circle(...);
```

## Source code

:::details Click to se the source code of <code>circle.vue</code> component

```vue
<script>
import mapElementMixin from '../mixins/map-element';
import { circleMappedProps } from '../utils/mapped-props-by-map-element';
import { bindEvents, getPropsValues, bindProps } from '../utils/helpers';

export default {
  mixins: [mapElementMixin],
  props: {
    center: {
      type: Object,
      required: true,
    },
    radius: {
      type: Number,
      default: 10,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    fillColor: {
      type: String,
      default: '',
    },
    fillOpacity: {
      type: Number,
      default: 1,
    },
    strokeColor: {
      type: String,
      default: '',
    },
    strokeOpacity: {
      type: Number,
      default: 1,
    },
    strokePosition: {
      type: Number,
      default: 0,
    },
    strokeWeight: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
    },
  },
  render() {
    return '';
  },
  async provide() {
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

    this.$circlePromise = promise;
    return { $circlePromise: promise };
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$circleObject && this.$circleObject.setMap) {
      this.$circleObject.setMap(null);
    }
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

::: details Mapped Props of <code>GmapCircle</code> component

```javascript
export const circleMappedProps = {
  center: {
    type: Object,
    twoWay: true,
    required: true,
  },
  radius: {
    type: Number,
    twoWay: true,
  },
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  fillColor: {
    type: String,
    noBind: true,
  },
  fillOpacity: {
    type: Number,
    noBind: true,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
    type: Number,
    noBind: true,
  },
  strokePosition: {
    type: Number,
    noBind: true,
  },
  strokeWeight: {
    type: Number,
    noBind: true,
  },
  visible: {
    type: Boolean,
  },
  options: {
    type: Object,
    twoWay: false,
  },
};
```

:::

:::details Events bound with to way on <code>GmapCircle</code>

```javascript
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
```

:::

## How to use it

```vue
<template>
  <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
    <!-- you can use the auto close form if you want -->
    <gmap-circle />
  </gmap-map>
</template>
```

```vue
<template>
  <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
    <!-- or -->
    <gmap-circle></gmap-circle>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/circle-shape.html).

## HTML examples

:::details Simple circle example

We use the following [example](https://developers.google.com/maps/documentation/javascript/examples/circle-simple?hl=en)
of the google documentation.

```html
<body>
  <div id="root">
    <gmap-map
      :center="center"
      :zoom="4"
      style="width: 100%; height: 500px"
      ref="map"
    >
      <gmap-circle
        v-if="radius"
        :editable="editable"
        :draggable="draggable"
        :radius="radius"
        :center="circleCenter"
        :options="options"
        ref="circle"
      >
      </gmap-circle>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places',
      },
    });

    document.addEventListener('DOMContentLoaded', function() {
      window.rectangleExample = new Vue({
        el: '#root',
        data: {
          center: { lat: 40.714, lng: -74.005 },
          editable: true,
          draggable: true,
          population: 8405837,
          circleCenter: { lat: 40.714, lng: -74.005 },
          options: {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          },
        },
        computed: {
          radius() {
            return Math.sqrt(this.population) * 100;
          },
        },
      });
    });
  </script>
</body>
```

:::

## Test the component

<eg-base>
  <eg-circle />
</eg-base>
