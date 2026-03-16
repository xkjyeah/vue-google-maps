## Description

This component helps you to create a polyline on Google Maps API.

For more information read the Google Maps documentation
for [polyline](https://developers.google.com/maps/documentation/javascript/examples/polyline-simple).

It is exported with the name `GmapPolyline`.

## Variables

This component save the original polygon object provided by Google Maps in a property called `$polylineObject`, as the
example below.

```javascript
this.$polylineObject = new google.maps.Polyline(...);
```

## Source code

:::details Click to se the source code of <code>polyline.vue</code> component

```vue
<script>
import mapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { polylineMappedProps } from '../utils/mapped-props-by-map-element';

export default {
  mixins: [mapElementMixin],
  props: {
    deepWatch: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
    },
    editable: {
      type: Boolean,
    },
    strokeColor: {
      type: String,
      default: '',
    },
    strokeOpacity: {
      type: Number,
      default: 1,
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
    path: {
      type: Array,
    },
  },
  provide() {
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

    const promise = this.$mapPromise
      .then((map) => {
        this.$map = map;

        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, polylineMappedProps),
        };
        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.$polylineObject = new google.maps.Polyline(finalOptions);

        bindProps(this, this.$polylineObject, polylineMappedProps);
        bindEvents(this, this.$polylineObject, events);

        let clearEvents = () => {};

        this.$watch(
          'path',
          (path) => {
            if (path) {
              clearEvents();

              this.$polylineObject.setPath(path);

              const mvcPath = this.$polylineObject.getPath();
              const eventListeners = [];

              const updatePaths = () => {
                this.$emit('path_changed', this.$polylineObject.getPath());
              };

              eventListeners.push([
                mvcPath,
                mvcPath.addListener('insert_at', updatePaths),
              ]);
              eventListeners.push([
                mvcPath,
                mvcPath.addListener('remove_at', updatePaths),
              ]);
              eventListeners.push([
                mvcPath,
                mvcPath.addListener('set_at', updatePaths),
              ]);

              clearEvents = () => {
                eventListeners.forEach(([, listenerHandle]) => {
                  google.maps.event.removeListener(listenerHandle);
                });
              };
            }
          },
          {
            deep: this.deepWatch,
            immediate: true,
          }
        );

        return this.$polylineObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$polylinePromise = promise;
    return { $polylinePromise: promise };
  },
};
</script>
```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

::: details Mapped Props of <code>GmapPolyline</code> component

```javascript
export const polylineMappedProps = {
  clickable: {
    type: Boolean,
    noBind: true,
  },
  draggable: {
    type: Boolean,
  },
  editable: {
    type: Boolean,
  },
  strokeColor: {
    type: String,
    noBind: true,
  },
  strokeOpacity: {
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
    twoWay: false,
    type: Object,
  },
  path: {
    type: Array,
    twoWay: true,
  },
};
```

:::

:::details Events bound with to way on <code>GmapPolyline</code>

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
  <gmap-map
    :center="center"
    :zoom="12"
    style="width: 100%; height: 500px"
    ref="map">
    <gmap-polyline
      v-if="path.length > 0"
      :path="path"
      :editable="true"
      @path_changed="updateEdited($event)"
      @rightclick="handleClickForDelete"
      ref="polyline">
    </gmap-polyline>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/polyline-shape.html).

## HTML examples

:::details Simple polyline example

```html
<body>
  <div id="root">
    <label>
      Start at:
      <gmap-autocomplete @place_changed="updateCenter($event)" />
    </label>

    <gmap-map :center="center" :zoom="12" style="width: 100%; height: 500px" ref="map">
      <gmap-polyline v-if="path.length > 0" :path="path" :editable="true" @path_changed="updateEdited($event)"
          @rightclick="handleClickForDelete"
          ref="polyline">
      </gmap-polyline>
    </gmap-map>

    <div>
      <textarea :value="polylineGeojson" style="width: 100%; height: 200px"
        @input="readGeojson">
      </textarea>
      <div v-if="errorMessage">{{errorMessage}}</div>
    </div>
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
      window.XXX = new Vue({
        el: '#root',
        data: {
          center: {lat: 1.38, lng: 103.8},
          edited: null,
          path: [
            {lat: 1.33, lng: 103.75},
            {lat: 1.43, lng: 103.85},
          ],
          mvcPath: null,
          errorMessage: null,
          polylineGeojson: '',
        },
        watch: {
          polylinePath: _.throttle(function (path) {
            if (path) {
              this.path = path
              this.polylineGeojson = JSON.stringify({
                type: 'Polyline',
                coordinates: this.path.map(({lat, lng}) => [lng, lat])
              }, null, 2)
            }
          }, 1000)
        },
        computed: {
          polylinePath: function () {
            if (!this.mvcPath) return null

            let path = [];
            for (let j=0; j<this.mvcPath.getLength(); j++) {
              let point = this.mvcPath.getAt(j);
              path.push({lat: point.lat(), lng: point.lng()});
            }
            return path
          },
        },
        methods: {
          updateCenter: function (place) {
            this.center = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          },
          updateEdited: function (mvcPath) {
            this.mvcPath = mvcPath
          },
          handleClickForDelete($event) {
            if ($event.vertex) {
              this.$refs.polyline.$polylineObject.getPaths()
                .getAt($event.path)
                .removeAt($event.vertex)
            }
          },
          readGeojson: function ($event) {
            try {
              this.polylineGeojson = $event.target.value

              var v = JSON.parse($event.target.value);

              this.path = v.coordinates
                .map(([lng, lat]) => ({lat, lng}))

              this.errorMessage = null
            } catch (err) {
              this.errorMessage = err.message
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

<eg-base>
  <eg-polyline />
</eg-base>
