## Description

This component helps you to drawing shapes on over the map.

For more information read the Google Maps documentation
for [drawing manager](https://developers.google.com/maps/documentation/javascript/drawinglayer).

It is exported with the name `GmapDrawingManager`.

## Variables

This component save the original drawing manager object provided by Google Maps in a property
called `$drawingManagerObject`, as the example below.

```javascript
  this.$drawingManagerObject = new google.maps.drawing.DrawingManager(...);
```

## Source code

:::details Click to se the source code of <code>drawing-manager.vue</code> component

```vue
<template>
  <div>
    <slot
      v-bind:setDrawingMode="setDrawingMode"
      v-bind:deleteSelection="deleteSelection"
    />
  </div>
</template>

<script>
import MapElementMixin from '../mixins/map-element';
import { drawingManagerMappedProps } from '../utils/mapped-props-by-map-element';
import { bindProps, getPropsValues } from '../utils/helpers';

export default {
  mixins: [MapElementMixin],
  props: {
    circleOptions: {
      type: Object,
    },
    markerOptions: {
      type: Object,
    },
    polygonOptions: {
      type: Object,
    },
    polylineOptions: {
      type: Object,
    },
    rectangleOptions: {
      type: Object,
    },
    position: {
      type: String,
    },
    shapes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedShape: null,
      drawingModes: [],
      options: {
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {},
      },
    };
  },
  methods: {
    setDrawingMode(mode) {
      this.$drawingManagerObject.setDrawingMode(mode);
    },
    drawAll() {
      const shapeType = {
        circle: google.maps.Circle,
        marker: google.maps.Marker,
        polygon: google.maps.Polygon,
        polyline: google.maps.Polyline,
        rectangle: google.maps.Rectangle,
      };

      const self = this;
      this.shapes.forEach((shape) => {
        const shapeDrawing = new shapeType[shape.type](shape.overlay);
        shapeDrawing.setMap(this.$map);
        shape.overlay = shapeDrawing;
        google.maps.event.addListener(shapeDrawing, 'click', () => {
          self.setSelection(shape);
        });
      });
    },
    clearAll() {
      this.clearSelection();
      this.shapes.forEach((shape) => {
        shape.overlay.setMap(null);
      });
    },
    clearSelection() {
      if (this.selectedShape) {
        this.selectedShape.overlay.set('fillColor', '#777');
        this.selectedShape.overlay.set('strokeColor', '#999');
        this.selectedShape.overlay.setEditable(false);
        this.selectedShape.overlay.setDraggable(false);
        this.selectedShape = null;
      }
    },
    setSelection(shape) {
      this.clearSelection();
      this.selectedShape = shape;
      shape.overlay.setEditable(true);
      shape.overlay.setDraggable(true);
      this.selectedShape.overlay.set('fillColor', '#555');
      this.selectedShape.overlay.set('strokeColor', '#777');
    },
    deleteSelection() {
      if (this.selectedShape) {
        this.selectedShape.overlay.setMap(null);
        const index = this.shapes.indexOf(this.selectedShape);
        if (index > -1) {
          this.shapes.splice(index, 1);
        }
      }
    },
    addShape(shape) {
      this.setDrawingMode(null);
      this.shapes.push(shape);
      const self = this;
      google.maps.event.addListener(shape.overlay, 'click', () => {
        self.setSelection(shape);
      });
      google.maps.event.addListener(shape.overlay, 'rightclick', () => {
        self.deleteSelection();
      });
      this.setSelection(shape);
    },
  },
  watch: {
    position(position) {
      if (this.$drawingManagerObject) {
        const drawingControlOptions = {
          position:
            position && google.maps.ControlPosition[position]
              ? google.maps.ControlPosition[position]
              : google.maps.ControlPosition.TOP_LEFT,
          drawingModes: this.drawingModes,
        };
        this.$drawingManagerObject.setOptions({ drawingControlOptions });
      }
    },
    circleOptions(circleOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ circleOptions });
      }
    },
    markerOptions(markerOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ markerOptions });
      }
    },
    polygonOptions(polygonOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ polygonOptions });
      }
    },
    polylineOptions(polylineOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ polylineOptions });
      }
    },
    rectangleOptions(rectangleOptions) {
      if (this.$drawingManagerObject) {
        this.$drawingManagerObject.setOptions({ rectangleOptions });
      }
    },
  },
  provide() {
    // Infowindow needs this to be immediately available
    const promise = await this.$mapPromise
      .then((map) => {
        this.$map = map;

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...getPropsValues(this, drawingManagerMappedProps),
        };

        const { options: extraOptions, ...finalOptions } = initialOptions;

        this.drawingModes = Object.keys(finalOptions).reduce((modes, opt) => {
          const val = opt.split('Options');

          if (val.length > 1) {
            modes.push(val[0]);
          }

          return modes;
        }, []);

        const position =
          this.position && google.maps.ControlPosition[this.position]
            ? google.maps.ControlPosition[this.position]
            : google.maps.ControlPosition.TOP_LEFT;

        finalOptions.drawingMode = null;
        finalOptions.drawingControl = !this.$scopedSlots.default;
        finalOptions.drawingControlOptions = {
          drawingModes: this.drawingModes,
          position,
        };

        // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        this.$drawingManagerObject = new google.maps.drawing.DrawingManager(
          finalOptions
        );

        bindProps(this, this.$drawingManagerObject, drawingManagerMappedProps);

        this.$drawingManagerObject.addListener('overlaycomplete', (e) =>
          this.addShape(e)
        );

        this.$map.addListener('click', this.clearSelection);

        if (this.shapes.length) {
          this.drawAll();
        }

        return this.$drawingManagerObject;
      })
      .catch((error) => {
        throw error;
      });

    this.$drawingManagerPromise = promise;
    return { $drawingManagerPromise: promise };
  },
  destroyed() {
    this.clearAll();

    // Note: not all Google Maps components support maps
    if (this.$drawingManagerObject && this.$drawingManagerObject.setMap) {
      this.$drawingManagerObject.setMap(null);
    }
  },
};
</script>

```

:::

If you need to know what are `mappedProps` please read the general concepts of this
application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

:::details Mapped Props of <code>GmapDrawingManager</code> component

```javascript

export const drawingManagerMappedProps = {
  circleOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  markerOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  polygonOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  polylineOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
  rectangleOptions: {
    type: Object,
    twoWay: false,
    noBind: true,
  },
};

```

:::

## How to use it

```vue
<template>
  <gmap-map
    ref="mapRef"
    :center="mapCenter"
    :zoom="7"
    map-type-id="roadmap"
    style="width: 100%; height: 800px"
    :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: mapDraggable,
        draggableCursor: mapCursor
      }"
  >
    <!-- use the default slot to pass markers to it -->
    <gmap-drawing-manager></gmap-drawing-manager>
  </gmap-map>
</template>
```

```vue
<template>
  <gmap-map
    ref="mapRef"
    :center="mapCenter"
    :zoom="7"
    map-type-id="roadmap"
    style="width: 100%; height: 800px"
    :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: mapDraggable,
        draggableCursor: mapCursor
      }"
  >
    <!-- or with an slot -->
    <gmap-drawing-manager>
      <template v-slot="on">
        <your-toolbar-component
          @drawingmode_changed="on.setDrawingMode($event)"
          @delete_selection="on.deleteSelection()"
          @save="mapMode='ready'"
        />
      </template>
    </gmap-drawing-manager>
  </gmap-map>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/drawing-manager.html).

## HTML examples

:::details HTML example

```html
<body>
  <div id="root">
    <h1>Drawing Manager Example</h1>
    <div style="width:100%; display: flex; justify-content: center;">
      <span style="width:auto" />
      {{ mapMode }} - {{ toolbarPosition }}
      <span style="width:auto" />
      <button @click="setPos">Position</button>
      <button @click="mapMode='edit'">Edit</button>
    </div>
    <br />
    <gmap-map
      ref="mapRef"
      :center="mapCenter"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 800px"
      :options="{
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: false,
          draggable: mapDraggable,
          draggableCursor: mapCursor
        }"
    >
      <template #visible>
        <gmap-drawing-manager
          v-if="mapMode==='edit'"
          :position="toolbarPosition"
          :rectangle-options="rectangleOptions"
          :circle-options="circleOptions"
          :polyline-options="polylineOptions"
          :shapes="shapes"
        />
      </template>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places,drawing'
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          mapCenter: { lat: 4.5, lng: 99 },
          mapMode: null,
          toolbarPosition: 'TOP_CENTER',
          mapDraggable: true,
          mapCursor: null,
          shapes: [],
          rectangleOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          },
          circleOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          },
          polylineOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          }
        },
        watch: {
          mapMode(newMode, oldMode) {
            if (newMode === 'ready') {
              if (oldMode === 'edit') {
                this.mapDraggable = true;
                this.mapCursor = null;
                return;
              }
            }

            if (newMode === 'edit') {
              this.mapDraggable = false;
              this.mapCursor = 'default';
            }
          }
        },
        mounted() {
          this.mapMode = 'ready';
        },
        methods: {
          setPos() {
            const posTypes = [
              'TOP_CENTER',
              'TOP_LEFT',
              'TOP_RIGHT',
              'LEFT_TOP',
              'RIGHT_TOP',
              'LEFT_CENTER',
              'RIGHT_CENTER',
              'LEFT_BOTTOM',
              'RIGHT_BOTTOM',
              'BOTTOM_CENTER',
              'BOTTOM_LEFT',
              'BOTTOM_RIGHT'
            ];

            this.toolbarPosition =
              posTypes[Math.floor(Math.random() * posTypes.length)];
          }
        }
      });
    });
  </script>
</body>
```

:::

:::details HML examples with slot

```html
<body>
  <div id="root">
    <h1>Drawing Manager Example</h1>
    <div style="width:100%; display: flex; justify-content: center;">
      <span style="width: auto;" />
      {{ mapMode }}
      <span style="width: auto;" />
      <button @click="mapMode='edit'">Edit</button>
    </div>
    <br />
    <gmap-map
      ref="mapRef"
      :center="mapCenter"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 800px; display:flex; justify-content: center; align-items: flex-start;"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: mapDraggable,
        draggableCursor: mapCursor
      }"
    >
      <template #visible>
        <gmap-drawing-manager
          v-if="mapMode==='edit'"
          :rectangle-options="rectangleOptions"
          :circle-options="circleOptions"
          :polyline-options="polylineOptions"
          :polygon-options="polygonOptions"
          :shapes="shapes"
        >
          <template v-slot="on">
            <drawing-toolbar
              @drawingmode_changed="on.setDrawingMode($event)"
              @delete_selection="on.deleteSelection()"
              @save="mapMode='ready'"
            />
          </template>
        </gmap-drawing-manager>
      </template>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    // Only for example purposes
    // In a real application you would simply create a separate component
    const toolbarTemplate =
      '<div style="background-color: #040404; display: flex; position: absolute; padding: 8px">' +
      "  <div><button @click=\"$emit('drawingmode_changed', 'rectangle')\">Rectangle</button></div>" +
      "  <div><button @click=\"$emit('drawingmode_changed', 'circle')\">Circle</button></div>" +
      "  <div><button @click=\"$emit('drawingmode_changed', 'polyline')\">Line</button></div>" +
      "  <div><button @click=\"$emit('drawingmode_changed', 'polygon')\">Polygon</button></div>" +
      "  <div><button @click=\"$emit('delete_selection')\">Delete</button></div>" +
      "  <div><button @click=\"$emit('save')\">Save</button></div>" +
      "</div>";

    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places,drawing'
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        components: {
          drawingToolbar: {
            template: toolbarTemplate
          }
        },
        data: {
          mapCenter: { lat: 4.5, lng: 99 },
          mapMode: null,
          mapDraggable: true,
          mapCursor: null,
          shapes: [],
          rectangleOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          },
          circleOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          },
          polylineOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          },
          polygonOptions: {
            fillColor: '#777',
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: '#999',
            draggable: false,
            editable: false,
            clickable: true
          }
        },
        watch: {
          mapMode(newMode, oldMode) {
            if (newMode === 'ready') {
              if (oldMode === 'edit') {
                this.mapDraggable = true;
                this.mapCursor = null;
                return;
              }
            }

            if (newMode === 'edit') {
              this.mapDraggable = false;
              this.mapCursor = 'default';
            }
          }
        },
        mounted() {
          this.mapMode = 'ready';
        }
      });
    });
  </script>
</body>
```

:::

::: warning
If you are using the runtime-only build the template on `toolbarTemplate` will not work, instead of that
you need to pre-compile the templates into render functions, or use the compiler-included build.
:::

## Test the component

:::details Click to see the HTML example in action

<eg-base libraries="places,drawing">
  <eg-drawing-manager />
</eg-base>

:::

:::details Click to see the HTML example with slot in action

<eg-base libraries="places,drawing">
  <eg-drawing-manager-with-slot />
</eg-base>

:::
