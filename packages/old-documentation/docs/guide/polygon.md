## Description

This component helps you to create a polygon on Google Maps API.

For more information read the Google Maps documentation
for [polygons](https://developers.google.com/maps/documentation/javascript/examples/polygon-simple).

It is exported with the name `GmapPolygon`.

## Variables

This component save the original polygon object provided by Google Maps in a property called `$polygonObject`, as the
example below.

```javascript
this.$polygonObject = new google.maps.Polygon(...);
```

## Source code

:::details Click to se the source code of <code>polygon.vue</code> component

```vue
<script>
import MapElementMixin from '../mixins/map-element';
import { getPropsValues, bindEvents, bindProps } from '../utils/helpers';
import { polygonMappedProps } from '../utils/mapped-props-by-map-element';

export default {
  mixins: [MapElementMixin],
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
    path: {
      type: Array,
      noBind: true,
    },
    paths: {
      type: Array,
      noBind: true,
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
          ...getPropsValues(this, polygonMappedProps),
        };
        const {
          options: extraOptions,
          path: optionPath,
          paths: optionPaths,
          ...finalOptions
        } = initialOptions;

        this.$polygonObject = new google.maps.Polygon(finalOptions);

        bindProps(this, this.$polygonObject, polygonMappedProps);
        bindEvents(this, this.$polygonObject, events);

        let clearEvents = () => {};

        this.$watch(
          'paths',
          (paths) => {
            if (paths) {
              clearEvents();

              this.$polygonObject.setPaths(paths);

              const updatePaths = () => {
                this.$emit('paths_changed', this.$polygonObject.getPaths());
              };
              const eventListeners = [];

              const mvcArray = this.$polygonObject.getPaths();
              for (let i = 0; i < mvcArray.getLength(); i += 1) {
                const mvcPath = mvcArray.getAt(i);
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
              }
              eventListeners.push([
                mvcArray,
                mvcArray.addListener('insert_at', updatePaths),
              ]);
              eventListeners.push([
                mvcArray,
                mvcArray.addListener('remove_at', updatePaths),
              ]);
              eventListeners.push([
                mvcArray,
                mvcArray.addListener('set_at', updatePaths),
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

        this.$watch(
          'path',
          (path) => {
            if (path) {
              clearEvents();

              this.$polygonObject.setPaths(path);

              const mvcPath = this.$polygonObject.getPath();
              const eventListeners = [];

              const updatePaths = () => {
                this.$emit('path_changed', this.$polygonObject.getPath());
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

        return this.$polygonObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$polygonPromise = promise;
    return { $polygonPromise: promise };
  },
};
</script>
```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

::: details Mapped Props of <code>GmapPolygon</code> component

```javascript
export const polygonMappedProps = {
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
  },
  path: {
    type: Array,
    twoWay: true,
    noBind: true,
  },
  paths: {
    type: Array,
    twoWay: true,
    noBind: true,
  },
};
```

:::

:::details Events bound with to way on <code>GmapPolygon</code>

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
    :center="{lat: 1.38, lng: 103.8}"
    :zoom="12"
    style="width: 100%; height: 500px">
    <gmap-polygon
      :paths="paths"
      :editable="true"
      @paths_changed="updateEdited($event)">
    </gmap-polygon>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/polygon-shape.html).

## HTML examples

:::details Simple polygon example

```html
<body>
  <div id="root">
    <gmap-map :center="{lat: 1.38, lng: 103.8}" :zoom="12" style="width: 100%; height: 500px">
      <gmap-polygon :paths="paths" :editable="true" @paths_changed="updateEdited($event)">
      </gmap-polygon>
    </gmap-map>

    <ul v-if="edited" @click="edited = null">
      <li v-for="path in edited">
        <ol>
          <li v-for="point in path">
            {{point.lat}}, {{point.lng}}
          </li>
        </ol>
      </li>
    </ul>
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
      window.XXX = new Vue({
        el: '#root',
        data: {
          edited: null,
          paths: [
            [ {lat: 1.380, lng: 103.800}, {lat:1.380, lng: 103.810}, {lat: 1.390, lng: 103.810}, {lat: 1.390, lng: 103.800} ],
            [ {lat: 1.382, lng: 103.802}, {lat:1.382, lng: 103.808}, {lat: 1.388, lng: 103.808}, {lat: 1.388, lng: 103.802} ],
          ]
        },
        methods: {
          updateEdited(mvcArray) {
            let paths = [];
            for (let i=0; i<mvcArray.getLength(); i++) {
              let path = [];
              for (let j=0; j<mvcArray.getAt(i).getLength(); j++) {
                let point = mvcArray.getAt(i).getAt(j);
                path.push({lat: point.lat(), lng: point.lng()});
              }
              paths.push(path);
            }
            this.edited = paths;
          }
        }
      });
    });
  </script>
</body>
```

:::

:::details Advanced polygon example

```html
<body>
  <div id="root">
    <label>
      <strong>Start at:</strong>
      <gmap-autocomplete @place_changed="updateCenter($event)" />
    </label>

    <br>
    <br>

    <gmap-map :center="center" :zoom="12" style="width: 100%; height: 500px" ref="map">
      <gmap-polygon v-if="paths.length > 0" :paths="paths" :editable="true" @paths_changed="updateEdited($event)"
          @rightclick="handleClickForDelete"
          ref="polygon">
      </gmap-polygon>
    </gmap-map>

    <div>
      <button @click="addPath()">Add Path</button>
      <button @click="removePath()">Remove Path</button>
    </div>

    <br>

    <div>
      <label for="geojson">
        <strong>Paste your geojson here:</strong>
      </label>
      <textarea id="geojson" :value="polygonGeojson" style="width: 100%; height: 100px"
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

    function closeLoop (path) {
      return path.concat(path.slice(0, 1))
    }

    document.addEventListener('DOMContentLoaded', function() {
      window.XXX = new Vue({
        el: '#root',
        data: {
          center: {lat: 1.38, lng: 103.8},
          edited: null,
          paths: [
          ],
          mvcPaths: null,
          errorMessage: null,
          polygonGeojson: '',
        },
        watch: {
          polygonPaths: _.throttle(function (paths) {
            if (paths) {
              this.paths = paths
              this.polygonGeojson = JSON.stringify({
                type: 'Polygon',
                coordinates: this.paths.map(path => closeLoop(path.map(({lat, lng}) => [lng, lat])))
              }, null, 2)
            }
          }, 1000)
        },
        computed: {
          polygonPaths: function () {
            if (!this.mvcPaths) return null

            let paths = [];
            for (let i=0; i < this.mvcPaths.getLength(); i++) {
              let path = [];
              for (let j=0; j<this.mvcPaths.getAt(i).getLength(); j++) {
                let point = this.mvcPaths.getAt(i).getAt(j);
                path.push({lat: point.lat(), lng: point.lng()});
              }
              paths.push(path);
            }
            return paths
          },
        },
        methods: {
          updateCenter: function (place) {
            this.center = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          },
          updateEdited: function (mvcPaths) {
            this.mvcPaths = mvcPaths
          },
          addPath: function () {
            // obtain the bounds, so we can guess how big the polygon should be
            var bounds = this.$refs.map.$mapObject.getBounds()
            var northEast = bounds.getNorthEast()
            var southWest = bounds.getSouthWest()
            var center = bounds.getCenter()
            var degree = this.paths.length + 1;
            var f = Math.pow(0.66, degree)

            // Draw a triangle. Use f to control the size of the triangle.
            // i.e., every time we add a path, we reduce the size of the triangle
            var path = [
              { lng: center.lng(), lat: (1-f) * center.lat() + (f) * northEast.lat() },
              { lng: (1-f) * center.lng() + (f) * southWest.lng(), lat: (1-f) * center.lat() + (f) * southWest.lat() },
              { lng: (1-f) * center.lng() + (f) * northEast.lng(), lat: (1-f) * center.lat() + (f) * southWest.lat() },
            ]

            this.paths.push(path)
          },
          removePath: function () {
            this.paths.splice(this.paths.length - 1, 1)
          },
          handleClickForDelete($event) {
            if ($event.vertex) {
              this.$refs.polygon.$polygonObject.getPaths()
                .getAt($event.path)
                .removeAt($event.vertex)
            }
          },
          readGeojson: function ($event) {
            try {
              this.polygonGeojson = $event.target.value

              var v = JSON.parse($event.target.value);

              this.paths = v.coordinates.map(linearRing =>
                linearRing.slice(0, linearRing.length - 1)
                .map(([lng, lat]) => ({lat, lng}))
              )

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

:::details Simple polygon

<eg-base>
  <eg-polygon-simple />
</eg-base>

:::

:::details Advanced polygon

<eg-base>
  <eg-polygon-advanced />
</eg-base>

:::
