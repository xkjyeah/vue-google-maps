## Status Bar

You can add a status bar with a description when the moues is over the marker.

## HTML status bar example

:::note Click to see the example

```html
<body>
  <div id="root">
    You should see a blue status bar with a description of the place at the
    position of the marker when you move your mouse over the markers.

    <gmap-map
      :center="center"
      :zoom="15"
      style="width: 100%; height: 500px"
    >
      <gmap-marker
        v-for="m in markers"
        :position="{lat: m.position[0], lng: m.position[1]}"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
        @mouseover="statusText = m.text"
        @mouseout="statusText = null"
      ></gmap-marker>

      <div slot="visible">
        <div style="bottom: 0; left: 0; background-color: #0000FF; color: white; position: absolute; z-index: 100">
          {{statusText}}
        </div>
      </div>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
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
          center: {lat: 47.376332, lng: 8.547511},
          statusText: '',
          markers: [{
            position: [47.376332, 8.547511],
            text: 'Hauptgebäude der ETH Zürich'
          }, {
            position: [47.374592, 8.548867],
            text: 'Hauptgebäude der Universität Zürich'
          }]
        },
      });
    });
  </script>
</body>
```

:::

## Test the status bar example

<eg-base>
  <eg-status-bar-information />
</eg-base>

## Overlay

You can add add an overlay image over the map to mark a zone.

## HTML overlay example

:::note Click to see the example

```html
<body>
  <div id="root">
    <p>Please move the map in order to see the limits of the overlay image</p>
    <gmap-map :center="{lat: 1.38, lng: 103.8}" :zoom="12" style="width: 100%; height: 500px">
      <ground-overlay source="./overlay.png" :bounds="{
            north: 1.502,
            south: 1.185,
            east: 104.0262,
            west: 103.5998,
        }" :opacity="0.5">
      </ground-overlay>
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        v: '3.26',
      },
      // Demonstrating how we can customize the name of the components
      installComponents: false,
    });

    document.addEventListener('DOMContentLoaded', function() {
      Vue.component('gmap-map', GmapVue.Map);
      Vue.component('ground-overlay', GmapVue.MapElementFactory({
        mappedProps: {
          'opacity': {}
        },
        props: {
          'source': {type: String},
          'bounds': {type: Object},
        },
        events: ['click', 'dblclick'],
        name: 'groundOverlay',
        ctr: () => google.maps.GroundOverlay,
        ctrArgs: (options, {source, bounds}) => [source, bounds, options],
      }));

      new Vue({
        el: '#root',
        data: {
          place: '',
        },
      });
    });
  </script>
</body>
```

:::

## Test the overlay example

<eg-base>
  <eg-overlay />
</eg-base>

## Resize Bus

:::danger

This functionality is no longer supported by Google Maps, please read the following answers in StackOverflow:

- [answer 1](https://stackoverflow.com/a/743280/5302733)
- [answer 2](https://stackoverflow.com/a/2590049/5302733)

and also check the [official documentation of the Map class](https://developers.google.com/maps/documentation/javascript/reference/map?hl=en) and you will note that this property is no longer
supported as a property of the Map class.

:::

You can modify the size of the bus if want check the above example to see it in action

## HTML resize bus example

:::note Click to see the example

```html
<body>
  <div id="root">
    <h1>Resize Bus</h1>

    <p>
      The first map is displayed correctly after clicking
      the button.

      The second and third are not (not bound to default resize bus).
      <button @click=updateStyle>
        Click me first
      </button>
    </p>
    <p>
      However, the third map responds to the second button
      (custom resize bus)

      <button @click=updateBus>
        Click me second
      </button>
    </p>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12>
    </gmap-map>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12
      :resize-bus="null">
    </gmap-map>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12
      :resize-bus="customBus">
    </gmap-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
      },
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          currentStyle: {
            display: 'none'
          },
          customBus: new Vue(),
        },
        methods: {
          updateStyle() {
            this.currentStyle = {
              display: 'inline-block',
              width: '200px',
              height: '200px',
            };
            Vue.$gmapDefaultResizeBus.$emit('resize');
          },
          updateBus() {
            this.customBus.$emit('resize');
          }
        }
      });
    });
  </script>
</body>
```

:::

## Test the resize bus example

<eg-base>
  <eg-resize-bus />
</eg-base>
