## Description

This component helps you to create a Kml layer.

For more information read the Google Maps documentation
for [kml layers](https://developers.google.com/maps/documentation/javascript/kmllayer).

It is exported with the name `GmapKmlLayer`.

## Variables

This component save the original Kml-layer object provided by Google Maps in a property called `$kmlLayerObject`, as the
example below.

```javascript
  this.$kmlLayerObject = new google.maps.KmlLayer(...);
```

## Source code

:::details Click to se the source code of <code>info-window.vue</code> component

```vue
<script>
import MapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { kmlLayerMappedProps } from '../utils/mapped-props-by-map-element';

export default {
  mixins: [MapElementMixin],
  props: {
    clickable: {
      type: Boolean,
      default: true,
    },
    map: {
      type: Object,
      default: undefined,
    },
    preserveViewport: {
      type: Boolean,
      default: false,
    },
    screenOverlays: {
      type: Boolean,
      default: false,
    },
    suppressInfoWindows: {
      type: Boolean,
      default: undefined,
    },
    url: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: undefined,
    },
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
    const promise = await this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
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
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$kmlLayerObject && this.$kmlLayerObject.setMap) {
      this.$kmlLayerObject.setMap(null);
    }
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

:::details Mapped Props of <code>GmapKmlLayer</code> component

```javascript
export const kmlLayerMappedProps = {
  clickable: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  map: {
    type: Object,
    twoWay: true,
  },
  preserveViewport: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  screenOverlays: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  suppressInfoWindows: {
    type: Boolean,
    twoWay: true,
    noBind: true,
  },
  url: {
    type: String,
    twoWay: false,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
  options: {
    type: Object,
    default() {
      return {};
    },
  },
};
```

:::

:::details Events bound with to way on <code>GmapKmlLayer</code>

```javascript
const events = [
  'click',
  'rightclick',
  'dblclick',
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
  <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
    <google-kml-layer
      v-for="l in kmlLayers"
      :url="l.url"
      :clickable="true"
      :preserveViewport="true"
    >
    </google-kml-layer>
  </gmap-map>
</template>

<script>
export default {
  data() {
    return {
      kmlLayers = [
        {
          url:
            'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml',
        },
      ],
    }
  }
}
</script>
```

If you need to know the **API of this component** please read it [here](/code/components/kml-layer.html).

## HTML examples

:::details HTML example

```html
<body>
  <div id="root">
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <google-kml-layer v-for="l in kmlLayers" :url="l.url" :clickable="true" :preserveViewport="true"></google-kml-layer>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc'
      },
      // Demonstrating how we can customize the name of the components
      installComponents: false,
    });

    document.addEventListener('DOMContentLoaded', function () {
      Vue.component('google-map', GmapVue.Map);
      Vue.component('google-kml-layer', GmapVue.KmlLayer);

      new Vue({
        el: '#root',
        data: {
          center: {
            lat: -19.257753,
            lng: 146.823688
          },
          kmlLayers: [{
            url: 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml'
          }]
        },
      });
    });
  </script>
</body>
```

:::

## Test the component

:::details Click to see the HTML example in action

<eg-base>
  <eg-kml-layer />
</eg-base>

:::
