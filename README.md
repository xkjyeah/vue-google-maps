# CONTRIBUTORS NEEDED!

It's been increasingly difficult for me to make time to maintain this project.
My projects at work have also gradually migrated away from Google Maps (but still on Vue -- Vue's awesome!),
so there's less and less incentive to maintain.

If you have time to contribute to a rather frequently used library, feel free to make a PR!
For more background, please refer to [this issue](https://github.com/xkjyeah/vue-google-maps/issues/514).

What's urgently needed are:

1. Better automated tests
2. Better integration tests with the popular frameworks, especially Nuxt and Vue template
3. Better documentation (examples, recommendations)

The above three will go a long way to keeping the project maintainable and contributable, and will address many of the open issues.

# vue-google-maps

[![Build Status](https://travis-ci.org/xkjyeah/vue-google-maps.svg?branch=vue2)](https://travis-ci.org/xkjyeah/vue-google-maps)

## Vue-2 port of vue-google-maps

This is the Vue 2.x port of vue-google-maps!

## Installation

### With npm (Recommended)

```
npm install vue2-google-maps
```

### Manually

Just download `dist/vue-google-maps.js` file and include it from your HTML.

Be aware that if you use this method, you cannot use TitleCase for your components and your attributes.
That is, instead of writing `<GmapMap>`, you need to write `<gmap-map>`.

[Example](http://xkjyeah.github.io/vue-google-maps/overlay.html) ([Source code](https://github.com/xkjyeah/vue-google-maps/blob/no-deferred-ready/examples/overlay.html)).

## Basic usage / Documentation

### Get an API key from Google

[Generating an Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

### Quickstart (Webpack, Nuxt):

If you are using Webpack and Vue file components, just add the following to your code!

```vue
<GmapMap
  :center="{lat:10, lng:10}"
  :zoom="7"
  map-type-id="terrain"
  style="width: 500px; height: 300px"
>
  <GmapMarker
    :key="index"
    v-for="(m, index) in markers"
    :position="m.position"
    :clickable="true"
    :draggable="true"
    @click="center=m.position"
  />
</GmapMap>
```

In your `main.js` or inside a Nuxt plugin:

```js
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_API_TOKEN',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})
```

If you need to gain access to the `Map` instance (e.g. to call `panToBounds`, `panTo`):
```vue
<template>
<GmapMap ref="mapRef" ...>
</GmapMap>
</template>
<script>
export default {
  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)

    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({lat: 1.38, lng: 103.80})
    })
  }
}
```

If you need to gain access to the `google` object:
```vue
<template>
  <GmapMarker ref="myMarker"
    :position="google && new google.maps.LatLng(1.38, 103.8)" />
</template>
<script>
import {gmapApi} from 'vue2-google-maps'

export default {
  computed: {
    google: gmapApi
  }
}
</script>
```

Add options to you Map through the options property:
Exmaple of [MapOptions](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions):
 ```vue
 <GmapMap
  :options="{
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    disableDefaultUi: false
  }"
>
</GmapMap>
```

Add region and language localization:
Example for [Localization](https://developers.google.com/maps/documentation/javascript/localization):
```vue
Vue.use(VueGoogleMaps, {
  load: {
    region: 'VI',
    language: 'vi',
  },
})
```

### Nuxt.js config

Add the following to your `nuxt.config.js`'s `build.extend()`:
```js
transpile: [/^vue2-google-maps($|\/)/]
```

### Officially supported components:

The list of officially support components are:

- Rectangle, Circle
- Polygon, Polyline
- Marker
- InfoWindow
- Autocomplete
- Cluster* (via `marker-clusterer-plus`)

You can find examples of this [on the website](http://xkjyeah.github.io/vue-google-maps/).
Auto-generated API documentation for these components are [here](http://xkjyeah.github.io/vue-google-maps/autoapi.html).

For `Cluster`, you **must** import the class specifically, e.g.
```js
import GmapCluster from 'vue2-google-maps/dist/components/cluster' // replace src with dist if you have Babel issues

Vue.component('GmapCluster', GmapCluster)
```
Inconvenient, but this means all other users don't have to bundle the marker clusterer package
in their source code.

### Adding your own components

It should be relatively easy to add your own components (e.g. Heatmap, GroundOverlay). please refer to the
[source code for `MapElementFactory`](https://github.com/xkjyeah/vue-google-maps/blob/vue2/src/components/mapElementFactory.js).

Example for [DirectionsRenderer](https://developers.google.com/maps/documentation/javascript/reference/3/#DirectionsRenderer):
```js
// DirectionsRenderer.js
import {MapElementFactory} from 'vue2-google-maps'

export default MapElementFactory({
  name: 'directionsRenderer',
  ctr: () => google.maps.DirectionsRenderer,
  //// The following is optional, but necessary if the constructor takes multiple arguments
  //// e.g. for GroundOverlay
  // ctrArgs: (options, otherProps) => [options],
  events: ['directions_changed'],

  // Mapped Props will automatically set up
  //   this.$watch('propertyName', (v) => instance.setPropertyName(v))
  //
  // If you specify `twoWay`, then it also sets up:
  //   google.maps.event.addListener(instance, 'propertyName_changed', () => {
  //     this.$emit('propertyName_changed', instance.getPropertyName())
  //   })
  //
  // If you specify `noBind`, then neither will be set up. You should manually
  // create your watchers in `afterCreate()`.
  mappedProps: {
    routeIndex: { type: Number },
    options: { type: Object },
    panel: { },
    directions: { type: Object },
    //// If you have a property that comes with a `_changed` event,
    //// you can specify `twoWay` to automatically bind the event, e.g. Map's `zoom`:
    // zoom: {type: Number, twoWay: true}
  },
  // Any other properties you want to bind. Note: Must be in Object notation
  props: {},
  // Actions you want to perform before creating the object instance using the
  // provided constructor (for example, you can modify the `options` object).
  // If you return a promise, execution will suspend until the promise resolves
  beforeCreate (options) {},
  // Actions to perform after creating the object instance.
  afterCreate (directionsRendererInstance) {},
})
```

Thereafter, it's easy to use the newly-minted component!
```vue
<template>
  <GmapMap :zoom="..." :center="...">
    <DirectionsRenderer />
  </GmapMap>
</template>
<script>
import DirectionsRenderer from './DirectionsRenderer.js'

export default {
  components: {DirectionsRenderer}
}
</script>
```

## Testing

More automated tests should be written to help new contributors.

Meanwhile, please test your changes against the suite of [examples](examples).

Improvements to the tests are welcome :)