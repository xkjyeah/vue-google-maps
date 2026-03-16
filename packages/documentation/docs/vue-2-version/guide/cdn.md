### CDN example

If you want to use a CDN it is available on unpkg and jsdelivr, the above is an example using unpkg CDN

```html
<body>
  <div id="root">
    <google-map :center="{lat: 1.38, lng: 103.8}" :zoom="12" style="width: 100%; height: 500px">
      <ground-overlay source="./overlay.png" :bounds="{
            north: 1.502,
            south: 1.185,
            east: 104.0262,
            west: 103.5998,
        }" :opacity="0.5">
      </ground-overlay>
    </google-map>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://unpkg.com/gmap-vue@1.2.2/dist/gmap-vue.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc', // use a valid key
        v: '3.26',
      },
      // Demonstrating how we can customize the name of the components
      installComponents: false,
    });

    document.addEventListener('DOMContentLoaded', function() {
      Vue.component('google-map', GmapVue.Map);
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

:::tip
You can copy and paste this example in a html file and run it, but you shouldn't forget to provide a valid Google Map key
:::
