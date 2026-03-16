---
id: install-function
sidebar_position: 2
sidebar_label: Install function
---

# The install function

The install function get the options passed to the plugin and process it to initialize the plugin.

The install function loads the Google Maps API using a promise. This promise is returned by the `googleMapsApiPromiseLazy` function. This function is saved in a global property inside the `app` called `$gmapApiPromiseLazy` and you can use it to access it in the options API.

The install function also saved the options passed to the plugin in a global property of the app called `$gmapOptions` that you can use to access the plugin options in the Vue options API. The install function also use `provide` with a key called `$gmapOptions` to provide it to all child components in the application.

These two options also have its own composables functions that you can use to get their respective values using the Vue composition API. For more details go to the [next section](/docs/vue-3-version/guide/global-properties).

```ts title="plugin main.ts" showLineNumbers
// ...
app.config.globalProperties.$gmapApiPromiseLazy = googleMapsApiPromiseLazy;
app.config.globalProperties.$gmapOptions = finalOptions;
app.provide($gmapOptions, finalOptions);
// ...
```

Finally, by default the install function initialize and install all components in the plugin.

```ts title="plugin main.ts" showLineNumbers
// ...
app
  .component(
    'GmvMap',
    defineAsyncComponent(() => import('./components/map-layer.vue'))
  )
  .component(
    'GmvMarker',
    defineAsyncComponent(() => import('./components/marker-icon.vue'))
  )
  .component(
    'GmvInfoWindow',
    defineAsyncComponent(() => import('./components/info-window.vue'))
  )
  .component(
    'GmvKmlLayer',
    defineAsyncComponent(() => import('./components/kml-layer.vue'))
  )
  .component(
    'GmvAutocomplete',
    defineAsyncComponent(() => import('./components/autocomplete-input.vue'))
  )
  .component(
    'GmvStreetViewPanorama',
    defineAsyncComponent(() => import('./components/street-view-panorama.vue'))
  )
  .component(
    'GmvHeatmapLayer',
    defineAsyncComponent(() => import('./components/heatmap-layer.vue'))
  )
  .component(
    'GmvCircle',
    defineAsyncComponent(() => import('./components/circle-shape.vue'))
  )
  .component(
    'GmvPolygon',
    defineAsyncComponent(() => import('./components/polygon-shape.vue'))
  )
  .component(
    'GmvPolyline',
    defineAsyncComponent(() => import('./components/polyline-shape.vue'))
  )
  .component(
    'GmvRectangle',
    defineAsyncComponent(() => import('./components/rectangle-shape.vue'))
  )
  .component(
    'GmvDrawingManager',
    defineAsyncComponent(() => import('./components/drawing-manager.vue'))
  )
  .component(
    'GmvCluster',
    defineAsyncComponent(() => import('./components/cluster-icon.vue'))
  );

// ...
```

:::note

- As you can see above all components are **lazy loaded**
- Now the **`GmvCluster`** component is **registered by default**, remember to install the `"@googlemaps/markerclusterer": "^2.5.3"` package

:::

:::info

- Check the install function API [here](/docs/vue-3-version/api/gmap-vue-plugin)
- Check the resize bus API [here](/wip)

:::
