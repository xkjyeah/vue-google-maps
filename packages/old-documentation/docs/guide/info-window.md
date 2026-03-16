## Description

This component helps you to create a info window in a marker.

For more information read the Google Maps documentation
for [info window](https://developers.google.com/maps/documentation/javascript/infowindows).

It is exported with the name `GmapInfoWindow`.

## Variables

This component save the original Info-Window object provided by Google Maps in a property called `$infoWindowObject`, as
the example below.

```javascript
  this.$infoWindowObject = new google.maps.InfoWindow(...);
```

## Source code

:::details Click to se the source code of <code>info-window.vue</code> component

```vue
<template>
  <div>
    <div ref="flyaway">
      <!-- so named because it will fly away to another component -->
      <!-- @slot Used to set your info window.  -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import MapElementMixin from '../mixins/map-element';
import { infoWindowMappedProps } from '../utils/mapped-props-by-map-element';
import { bindEvents, bindProps, getPropsValues } from '../utils/helpers';

export default {
  mixins: [MapElementMixin],
  props: {
    content: {
      type: [String, Object],
      default: undefined,
    },
    opened: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      required: false,
      default: undefined,
    },
    position: {
      type: Object,
    },
    zIndex: {
      type: Number,
    },
  },
  methods: {
    _openInfoWindow() {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindowObject.open(this.$map, this.$markerObject);
        } else {
          this.$infoWindowObject.open(this.$map);
        }
      } else {
        this.$infoWindowObject.close();
      }
    },
  },
  inject: {
    $markerPromise: {
      default: null,
    },
  },
  provide() {
    const events = ['domready', 'closeclick', 'content_changed'];

    // Infowindow needs this to be immediately available
    const promise = await this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, infoWindowMappedProps),
        };

        const {
          options: extraOptions,
          position,
          ...finalOptions
        } = initialOptions;

        this.beforeCreate(finalOptions);

        this.$infoWindowObject = new google.maps.InfoWindow(finalOptions);

        bindProps(this, this.$infoWindowObject, infoWindowMappedProps);
        bindEvents(this, this.$infoWindowObject, events);

        return this.$infoWindowObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$infoWindowPromise = promise;
    return { $infoWindowPromise: promise };
  },
  beforeCreate(options) {
    options.content = this.$refs.flyaway;

    if (this.$markerPromise) {
      return this.$markerPromise.then((mo) => {
        this.$markerObject = mo;
        return mo;
      });
    }

    // this return is to follow the consistent-return rule of eslint, https://eslint.org/docs/rules/consistent-return
    return undefined;
  },
  afterCreate() {
    this._openInfoWindow();
    this.$watch('opened', () => {
      this._openInfoWindow();
    });
  },
  mounted() {
    const el = this.$refs.flyaway;
    el.parentNode.removeChild(el);
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$infoWindowObject && this.$infoWindowObject.setMap) {
      this.$infoWindowObject.setMap(null);
    }
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

:::details Mapped Props of <code>GmapInfoWindow</code> component

```javascript
export const infoWindowMappedProps = {
  content: {
    type: Object,
    twoWay: true,
  },
  options: {
    type: Object,
    required: false,
    default() {
      return {};
    },
  },
  position: {
    type: Object,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
};
```

:::

:::details Events bound with to way on <code>GmapInfoWindow</code>

```javascript
const events = ['domready', 'closeclick', 'content_changed'];
```

:::

## How to use it

::: warn

If you only need to display a simple text, from **v3.4.3**, we added a new prop called `content` and you can use it to
pass data to the `InfoWindow` component, it accepts HTML too but take care about it because **it has precedence** over
the slot **use only one of both options**.

If you need to pass an entire block of HTML is better and simplest to use the default slot for it and leave the content
prop empty. Doing that you have more flexibility and control over your HTML content.

:::

From v3.4.3

```vue
<template>
  <gmap-map :center="center" :zoom="15" style="width: 100%; height: 500px">
    <gmap-info-window
      content="This is my info window content"
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @closeclick="infoWinOpen=false"
    />

    <gmap-marker
      :key="i"
      v-for="(m,i) in markers"
      :position="m.position"
      :clickable="true"
      @click="toggleInfoWindow(m,i)"
    >
    </gmap-marker>
  </gmap-map>
</template>
```

or use the default slot as below

```vue
<template>
  <gmap-map :center="center" :zoom="15" style="width: 100%; height: 500px">
    <gmap-info-window
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @closeclick="infoWinOpen=false"
    >
    </gmap-info-window>

    <gmap-marker
      :key="i"
      v-for="(m,i) in markers"
      :position="m.position"
      :clickable="true"
      @click="toggleInfoWindow(m,i)"
    >
    </gmap-marker>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/info-window.html).

## HTML examples

:::details HTML example

```html
<body>
  <div id="root">
    A basic example of using a single infowindow for 3 markers.

    <gmap-map :center="center" :zoom="15" style="width: 100%; height: 500px">
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
      </gmap-info-window>

      <gmap-marker :key="i" v-for="(m,i) in markers" :position="m.position" :clickable="true" @click="toggleInfoWindow(m,i)"></gmap-marker>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc'
      },
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          center: {
            lat: 47.376332,
            lng: 8.547511
          },
          infoWindowPos: null,
          infoWinOpen: false,
          currentMidx: null,

          infoOptions: {
          content: '',
            //optional: offset infowindow so it visually sits nicely on top of our marker
            pixelOffset: {
              width: 0,
              height: -35
            }
          },
          markers: [{
            position: {
              lat: 47.376332,
              lng: 8.547511
            },
            infoText: '<strong>Marker 1</strong>'
          }, {
            position: {
              lat: 47.374592,
              lng: 8.548867
            },
            infoText: '<strong>Marker 2</strong>'
          }, {
            position: {
              lat: 47.379592,
              lng: 8.549867
            },
            infoText: '<strong>Marker 3</strong>'
          }]
        },
        methods: {
          toggleInfoWindow: function(marker, idx) {
            this.infoWindowPos = marker.position;
            this.infoOptions.content = marker.infoText;

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }

            //if different marker set infowindow to open and reset current marker index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;
            }
          }
        }
      });
    });
  </script>
</body>
```

:::

## Test the component

:::details Click to see the HTML example in action

<eg-base>
  <eg-info-window />
</eg-base>

:::
