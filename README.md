# vue-google-maps

## Vue-2 port of vue-google-maps

This is the Vue 2.x port of vue-google-maps!

If you have used vue-google-maps with Vue 1.x before, refer to [Upgrading](UPGRADING.md).

## Installation

### With npm (Recommended)

```
npm install vue2-google-maps
```

### Manually

Just download `dist/vue-google-maps.js` file and include it from your HTML.
[Example](http://xkjyeah.github.io/vue-google-maps/overlay.html).

### Basic usage / Documentation

See [API](API.md).

## Demo:

[Showcase with a lot of features](http://xkjyeah.github.io/vue-google-maps/)

## Presentation

If you want to write google map this way :

```html
<gmap-map
  :center="{lat:10, lng:10}"
  map-type-id="terrain"
  :zoom="7"
></gmap-map>
```

Or use the power of Vue.js within a google map like this:
```html
<template>
  <gmap-map
    :center="center"
    @center-changed="center=$event"
    :zoom="7"
  >
    <gmap-marker
      v-for="m in markers"
      :position="m.position"
      @position-changed="m.position=$event"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    ></gmap-marker>
  </gmap-map>
</template>

<script>
  /////////////////////////////////////////
  // New in 0.4.0
  import * as VueGoogleMaps from 'vue2-google-maps';
  import Vue from 'vue';

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'YOUR_API_TOKEN',
      v: 'OPTIONAL VERSION NUMBER',
      // libraries: 'places', //// If you need to use place input
    }
  });

  export default {
    components: {
      gmapMap: Map,
      gmapMarker: Marker
    }
    data () {
      return {
        center: {lat: 10.0, lng: 10.0},
        markers: [{
          position: {lat: 10.0, lng: 10.0}
        }, {
          position: {lat: 11.0, lng: 11.0}
        }]
      }
    }
  }
</script>
```

## Testing

There is a non-comprehensive test for the DeferredReady mixin. More tests
should be written to help contributors.

Improvements to the tests are welcome :)

## Example Project

Refer to the [examples](examples).

#### Standalone / CDN

If you are not using any bundler, include `vue-google-maps/dist/vue-google-maps.js`
instead.
The library will be available in a global object called `VueGoogleMap`.
However you will need to include Vue and Lodash beforehand:

```html
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.3/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
  <script src="dist/vue-google-maps.js"></script>
</head>
<body>

  <div id="root">
    <gmap-map style="width: 100%; height: 100%; position: absolute; left:0; top:0"
        :center="{lat: 1.38, lng: 103.8}"
        :zoom="12"
    >

    </gmap-map>
  </div>

  <script>
    Vue.use(VueGoogleMaps, {
      load: {
        key: 'YOUR_API_TOKEN',
        v: 'OPTIONAL VERSION NUMBER',
        // libraries: 'places', //// If you need to use place input
      }
    })

    new Vue({
        el: '#root',
    });

  </script>

</body>
```

#### Set your api key

To enable any `vue-google-maps` components you need to set your api token:

```javascript
Vue.use(VueGoogleMap, {
  load: {
    key: 'YOUR_API_TOKEN',
    v: '3.26',                // Google Maps API version
    // libraries: 'places',   // If you want to use places input
  }
})
```

The parameters are passed in the query string to the Google Maps API, e.g. to set the [version](https://developers.google.com/maps/documentation/javascript/versions#version-rollover-and-version-types),
[libraries](https://developers.google.com/maps/documentation/javascript/libraries),
or for [localisation](https://developers.google.com/maps/documentation/javascript/basics).
