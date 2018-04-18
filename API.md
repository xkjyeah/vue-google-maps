# vue2-google-maps

Most of the properties and events here are not documented unless they do not
exist in the original [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference).
Otherwise they behave similarly to a direct call to the API so you are advised to read that
instead.

An exception is two-way bindings -- the `center_changed` event on Map instances
have no argument, but in vue2-google-maps they do in order to ease two-way updates.

## Getting Started (with Nuxt.js)

1. Create a plugin:

**plugins/maps.js**
```js
import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_API_KEY',
    v: 'GOOGLE_MAPS_VERSION',
    libraries: 'places' // Only if you need Autocomplete
  }
})
```
The reason you need `~/node_modules` is found [here](https://github.com/vuejs/vue/blob/fd68195/packages/vue-server-renderer/build.js#L7738).
This can be summarized as, _when rendering server-side, (1) if the `require()`-ed object is part of a
module (e.g. `require('vue2-google-maps')`), load it as a Javascript module.
(2) Otherwise (e.g. `require('./node_modules/vue2-google-maps')`) evaluate it as a webpack module_.
Because .vue files are syntactically invalid Javascript, they will break your server-side loader
if they are loaded as a Javascript module. However they work fine if we can somehow instruct
Webpack to compile it. Hence, we do (2).

2. Include your plugin in `nuxt.config.js`:

**nuxt.config.js**
```js
{
  plugins: [
    '~plugins/maps.js'
  ]
}
```

## Getting Started (with CDN)

TODO (this package has not yet been published to a CDN).

## Getting Started (with NPM)

Install your package via NPM:

```sh
$ npm install vue2-google-maps
```

Import the components you need:

```js
const VueGoogleMaps = require('vue2-google-maps');

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_API_KEY',
    v: 'GOOGLE_MAPS_VERSION',
    libraries: 'places'
  }
})
// The following components are automatically installed globally
// If you would like to define your own component names,
// see below
// GmapMap
// GmapMarker
// GmapCluster
// GmapInfoWindow
// GmapPolyline
// GmapPolygon
// GmapCircle
// GmapRectangle
// GmapPlaceInput
```

Write your Vue component
```html
<style>
  .map-container {
    width: 500px;
    height: 300px;
  }
</style>
<div id="app">
  <gmap-map class="map-container" :center="{lat:1.38, lng:103.8}" :zoom="12">
    <gmap-marker :position="{lat:1.38, lng:103.8}">
    </gmap-marker>
    <gmap-info-window :position="{lat:1.38, lng:103.8}">
      Hello world!
    </gmap-info-window>
  </gmap-map>
</div>
<script>
new Vue({
  el: '#app'
})
</script>
```

## Styling the Map
Use the `options` property in `gmap-map` compontent to add styles and options (see [Google Maps API](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions) for details on this).
```
<template>
  <gmap-map :options="{styles: styles}" ></gmap-map>
</template>
<script>
  export default {
    data () {
      return {
        styles: [ // styles here ]
      }
    }
  }
</script>
```

## Classes

Properties described here have a corresponding
`property_changed` event if they are marked with &dagger;.

They correspond to two-way properties in `vue-google-maps`, but allows you
two work around the lack of two-way bindings in Vue 2.

### `install(Vue: Vue, options: InstallOptions) : void`

```
interface InstallOptions {
  installComponents?: boolean = true,
  autobindAllEvents?: boolean = false,
  load?: LoadOptions
}
interface LoadOptions {
  key: string,
  v: string,
  libraries: string,
  [key: string]: string
}
```

Installs VueGoogleMaps on an instance of Vue.

#### `installComponents : boolean`
Automatically installs the available components
as `Gmap*`. If you would like to give the components your
own names, set this to false, then install the components manually,
e.g. `Vue.component('google-maps-circle', VueGoogleMaps.Circle)`.

#### `autobindAllEvents : boolean`
If `false` (default), then only event listeners that are declared in
the render function (i.e. available through $listeners) will be added to
the Google Maps objects.

The only difference this makes to your code is that the following
won't work, unless `autobindAllEvents: true`:
```js
// (1)
this.$refs.gmap.$on('rightclick', () => { /* do something */ })
```

Only this will work:
```vue
// (2)
<GmapMap @rightclick="/* do something */" />
```
The reason for this is to avoid creating unnecessary event handlers in 90% of
use cases.

If you need the event handlers, either enable the flag or try:
```js
this.$refs.gmap.$mapObject.addListener(
  'rightclick',
  () => { /* do something */ }
)
```

#### `load : LoadOptions`
Sets the API key etc. for the Google Maps JS API.
You may set additional options, e.g. for Google Maps Premium.
These will be passed as the query string to the Google Maps JS Library.

### `loaded : Promise`

Promise resolved once the Google Maps API is loaded.
```js
new google.maps.Point(100, 100) // `google` is not defined

loaded.then(() => {
  new google.maps.Point(100, 100) // Yay, success
})
```

### `Map` class

```js
Vue<MapObject> {
  $mapObject: google.maps.Map,
  $mapCreated: Promise<google.maps.Map>,

  methods: {
    // Proxies to $mapObject.{panTo, panToBounds, fitBounds}
    panBy,
    panTo,
    panToBounds,
    fitBounds,

    resize, // Proxy to google.maps.event.trigger($mapObject, 'resize')
    resizePreserveCenter, // For older versions of Google Maps API
  },

  props: {
    center,
    zoom,
    heading,
    mapTypeId,
    bounds,
    tilt,
    options
  },

  events: [
    center_changed,
    zoom_changed,
    bounds_changed,
    tilt_changed,

    click,
    dblclick,
    drag,
    dragend,
    dragstart,
    idle,
    mousemove,
    mouseout,
    mouseover,
    resize,
    rightclick,
    tilesloaded,
  ],

  slots: [
    default,
    visible,
  ]
}
```

#### `$mapObject : google.maps.Map`
The Google Maps instance. Example usage:
```js
google.maps.event.trigger(this.$refs.map.$mapObject, 'resize')
```
#### `$mapCreated` : Promise<google.maps.Map>`
Promise resolved when the map has been created

#### Methods
Methods can be executed on a map using the `ref` attribute supplied to your `gmap-map` element. For example, if you have an element of `<gmap-map ref="example" ...  > </gmap-map>`, you can pan this map by doing:

```js
this.$refs.example.panBy(10,10)
```

##### `resizePreserveCenter()`
The same as `resize()`, but keeps the center of the map.

#### Properties
##### `center : {lat: number, lng: number} | google.maps.LatLng`&dagger;

__Warning__: Do not do the following if you need two-way binding:
```html
<gmap-map :center="center" @center_changed="updateCenter"></gmap-map>
```
```js
methods: {
  updateCenter(center) {
    this.center = {
      lat: center.lat(),
      lng: center.lng()
    }
  }
}
```

The center reported by `center_changed` is not guaranteed to be the same
as the center you give to the maps. As a result, you are going to get an endless
loop:
`this.center = {...} --> center_changed --> this.center = {...} --> center_changed --> ...`

Instead, if you need two-way binding, save the center from `center_changed`
in a separate property, and synchronize it with the map center only when you
really need to. Refer to [app.vue](examples/src/app.vue#L426) in the examples.

__Can we get the old behaviour back?__ No. `vue-google-maps` v0.1.x was able
to prevent the infinite loop
because it handled two-way binding on its own, and therefore can set up the
event listeners to break the endless loop before it happens.
In `vue2-google-maps` the events are provided by the parent component.
The Map component is not able to tell which of the event listeners are listening
for all events, and which event listeners are listening only for UI-initiated
events for the purpose of two-way binding
(or maybe it could, with some extra attributes. Submit a PR ^.^). Therefore
the responsibility of breaking the infinite loop now lies with you, the user.

#### Slots

##### (default slot)

HTML elements in the default slot are invisible.
This is because some elements require auxiliary HTML elements,
and keeping the default slot invisible **should** (I haven't tested it) improve rendering speeds.

##### `visible` slot

The map container has CSS position `relative` by default.
This allows you to overlay regular HTML elements over
the map by placing them
in the `visible` slot.

For example, you can place position-selection crosshairs
in the centre of the map
(used in mobile apps like Uber) by specifying
`{left: 50%, top: 50%, position: absolute}`; you can
add a status bar to show information when hovering over
markers such as in the [Info Bar example](https://xkjyeah.github.io/vue-google-maps/examples/info-bar.html).

### `StreetViewPanorama` class (mixes in `DeferredReadyMixin`)

This class is experimental. (Note from author: I don't have a use case for
it yet, so I can't dogfood this implementation.)

#### Fields
##### `$panoObject : google.maps.StreetViewPanorama`
##### `$panoCreated : Promise<google.maps.StreetViewPanorama>`
Promise resolved when the map has been created

#### Methods
##### `resize()`

#### Properties
##### `position : {lat: number, lng: number} | google.maps.LatLng`&dagger;
##### `zoom : number`&dagger;
##### `pov : {pitch: number, heading: number}`&dagger;
##### `pano : string`&dagger;
##### `motionTracking : boolean`
##### `visible : boolean`&dagger;
##### `options : Object`

#### Events
##### `closeclick`
##### `status_changed`

### `Marker` class (mixes in `MapElementMixin`)
#### Fields
##### `$clusterAncestor : void | Vue`
The first `Cluster` instance (going up the hierarchy chain)
among this component's ancestors.
This marker will be clustered by this clusterer.

##### `$clusterObject : void | MarkerClusterer`
The clusterer this marker is part of, or `null` if
the marker is not part of a clusterer.

Set in `deferredReady`.

##### `$clusterObjectPromise : Promise<void | MarkerClusterer>`

#### Properties
##### `animation : number`
##### `attribution : object`
##### `clickable : boolean`
##### `cursor : string`
##### `draggable : boolean`
##### `icon : object`
##### `label : string`
##### `opacity : number`
##### `place : object`
##### `position : {lat: number, lng: number} | google.maps.LatLng`
##### `shape : object`
##### `title : string`
##### `zIndex : number`

#### Events
##### `click`
##### `rightclick`
##### `dblclick`
##### `drag`
##### `dragstart`
##### `dragend`
##### `mouseup`
##### `mousedown`
##### `mouseover`
##### `mouseout`

### `Cluster` class (mixes in `MapElementMixin`)

To use this class in standalone mode, you need to include the following:
```js
<script src="https://cdn.rawgit.com/mahnunchik/markerclustererplus/2.1.4/dist/markerclusterer.min.js"></script>
```

To use this class with NPM, you need to `npm install marker-clusterer-plus`.

Place `Marker` objects within `<gmap-cluster></gmap-cluster>`
in order to use marker clustering.

#### Properties
##### `maxZoom : number`
##### `calculator : function`
##### `gridSize : number`
##### `styles : object[]`

### `InfoWindow` class (mixes in `MapElementMixin`)
Example:
```js
<gmap-info-window>Hello world!</gmap-info-window>
```

[InfoWindow example](https://xkjyeah.github.io/vue-google-maps/examples/infowindow.html)

#### Properties
##### `options : object`
##### `opened : object`
##### `position : {lat: number, lng: number} | google.maps.LatLng`
##### `zIndex : number`
#### Events
##### `domready`
##### `closeclick`
##### `content_changed`


### `Polyline` class (mixes in `MapElementMixin`)
##### `$polylineObject : google.maps.Polyline`

#### Properties
##### `draggable : boolean`
##### `editable : boolean`
##### `options : object`
##### `path : ({lat: number, lng: number} | google.maps.LatLng)[]`&dagger;
##### `deepWatch : boolean = false`
Whether to perform a deep watch on the `path` property.
Set to `false` to improve performance.

#### Events
##### `click`
##### `dblclick`
##### `drag`
##### `dragend`
##### `dragstart`
##### `mousedown`
##### `mousemove`
##### `mouseout`
##### `mouseover`
##### `mouseup`
##### `rightclick`

### `Polygon` class (mixes in `MapElementMixin`)
#### Fields
##### `$polygonObject : google.maps.Polygon`
#### Properties
##### `draggable : boolean`
##### `editable : boolean`
##### `options : object`
##### `path : ({lat: number, lng: number} | google.maps.LatLng)[]`&dagger;
##### `paths : ({lat: number, lng: number} | google.maps.LatLng)[][]`&dagger;
##### `deepWatch : boolean = false`
Whether to perform a deep watch on the `path` property.
Set to `false` to improve performance.

#### Events
##### `click`
##### `dblclick`
##### `drag`
##### `dragend`
##### `dragstart`
##### `mousedown`
##### `mousemove`
##### `mouseout`
##### `mouseover`
##### `mouseup`
##### `rightclick`

### `Circle` class (mixes in `MapElementMixin`)
#### Fields
##### `$circleObject : google.maps.Circle`

#### Properties
##### `center : {lat: number, lng: number} | google.maps.LatLng`&dagger;
##### `radius : number`&dagger;
##### `draggable : boolean`
##### `editable : boolean`
##### `options : object`

#### Events
##### `bounds_changed`
##### `click`
##### `dblclick`
##### `drag`
##### `dragend`
##### `dragstart`
##### `mousedown`
##### `mousemove`
##### `mouseout`
##### `mouseover`
##### `mouseup`
##### `rightclick`


### `Rectangle` class (mixes in `MapElementMixin`)
#### Fields
##### `$rectangleObject : google.maps.Rectangle`

#### Properties
##### `bounds : {north: number, east: number, south: number, west: number} | google.maps.LatLngBounds`&dagger;
##### `draggable : boolean`
##### `editable : boolean`
##### `options : object`

#### Events
##### `click`
##### `dblclick`
##### `drag`
##### `dragend`
##### `dragstart`
##### `mousedown`
##### `mousemove`
##### `mouseout`
##### `mouseover`
##### `mouseup`
##### `rightclick`

### `Autocomplete` class (mixes in `MapElementMixin`)

The root element of this class is an `INPUT` element.
Therefore it is possible to set the `class`, `value`, `v-model` etc. and other
attributes on the element.

#### Fields
##### `$autocomplete : google.maps.Autocomplete`

#### Properties
##### `bounds : object`
##### `defaultPlace : string`
##### `componentRestrictions : object`
##### `placeholder : string`
##### `types : string[]`
##### `selectFirstOnEnter : boolean`
Simulates a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected, and then triggers the original listener.

#### Events
##### `place_changed`

### `PlaceInput` class (mixes in `MapElementMixin`) (deprecated)
#### Fields
##### `autoCompleter : google.maps.Autocomplete`

#### Properties
##### `bounds : object`
##### `defaultPlace : string`
##### `componentRestrictions : object`
##### `placeholder : string`
##### `types : string[]`
##### `className : string`
Sets the class on the `<input>` element, but we call it
`className` because `class` is disallowed by Vue 2.
##### `label : string`
##### `selectFirstOnEnter : boolean`
Simulates a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected, and then triggers the original listener.

#### Events
##### `place_changed`

### `DeferredReadyMixin`
#### Hooks
##### `beforeDeferredReady() : () => Promise`
Actions to be performed before `deferredReady()` is called.
These is executed **after** all ancestor components' `deferredReady()` have
been called.

##### `deferredReady() : () => Promise`
A hook that waits for ancestors' `deferredReady()` to complete (i.e. Promise resolved)
before it is itself called.

This Mixin is used in this package in order to initialize the Map component
only after the Maps API has been loaded, and to initialize map elements only after
the ancestor Map component has been initialized.

### `MapElementMixin` (mixes in `DeferredReadyMixin`)
This mixin adds a `beforeDeferredReady()` hook which initializes `this.$map`.

#### Fields
##### `$map : Map`
A reference to the ancestor Map component. This is available only after
`deferredReady()` has been called. You can access the map by:
`this.$map.$mapObject`.

### `MountableMixin`

***Props***: `resizeBus : Vue` (Default: `Vue.$gmapDefaultResizeBus`)

***Methods***: `_resizeCallback()`

Use this mixin to implement top-level components which mounts
over an existing element (e.g. maps, street view panoramas).

This mixin is intended to help manage the `resize()` calls.
Google Maps components need to know the size of the
element they are mounted on. If you have reactive styles and
classes (for example when you use `vue-router`) you need to
call `resize()` on every component used by the Maps API
whenever there are changes to the visibility / size of the
mounted element.

By using this mixin, components will listen on the bus
(an object with `$on`, `$off` and `$emit` such as `Vue`)
for the `resize` event, whereupon it will trigger a resize.
If a `resizeBus` is not specified, it will listen on the
default global bus, `Vue.$gmapDefaultResizeBus`.

If you are creating new components, override `_resizeCallback`
to define the desired behaviour when the resize is triggered.
For example, in a `GmapMap`, `_resizeCallback` calls `vm.resizePreserveCenter()`.

By default it will delay the resize by one tick.
If you need longer ticks in order for styles to be fully
applied, try delaying emitting the trigger.
