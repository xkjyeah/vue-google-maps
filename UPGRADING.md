By and large, unless you are using two-way binding,
you should be able to re-use the code you wrote for Vue 1.x.
The main exceptions is markers' click events triggering info windows.

In general,
the move away from two-way bindings is a good thing, as Google Maps is usually
unable to fully honour your positioning / centering / bounds requests. This means that
usually, `mapInstance.center` (vue-google-maps property) and
`mapInstance.$mapObject.getCenter()`
(Google Maps API method) were be returning different values, and some
hackery was needed to avoid endless update loops.

# Important changes

1. (v0.4.0) The installation method for vue2-google-maps has changed.
You use the library by calling:

```js
// If you use Webpack + vue-loader
var VueGoogleMaps = require('vue2-google-maps')
// If you are not using Webpack
var VueGoogleMaps = require('vue2-google-maps/dist/vue-google-maps')

Vue.use(VueGoogleMaps, {
  load: { /* load options */ }
})
```

The reason for this is to allow developers to choose between
[different versions of the Vue library](https://vuejs.org/v2/guide/installation.html#Standalone).

2. You might have noticed that there are two ways to include
the library. However there is be no functional difference
between the two include syntaxes if you are using Webpack:
```js
// Option A: If you use Webpack + vue-loader
var VueGoogleMaps = require('vue2-google-maps')
// Option B: If you are not using Webpack
var VueGoogleMaps = require('vue2-google-maps/dist/vue2-google-maps')
```

The only difference is that Option A probably saves you a several
lines of code because your project will not have to load multiple
versions of packages like `style-loader` and the babel runtime.

3. Clicking on a marker will no longer trigger its associated InfoWindow. This
  is necessary since two-way binding is not allowed, the marker is
  unable to modify the InfoWindow's opened property.

4. Two-way binding is no longer supported in Vue 2.x. If you need to listen on
    changes, e.g. `zoom_changed`, use the `zoom_changed` event. Contrary
    to the Google Maps reference, for `*_changed` events with obvious `get*`/
    `set*` counterparts, the event handler will automatically fetch the new
    data for you.

For example, using the Maps API:
```js
gmap.addListener('zoom', (value) => {
  console.log(value === undefined); // true. Value is not available from argument
  var zoom = gmap.getZoom();
})
```

However, in `vue-google-maps` we provide the zoom value in the argument for
convenience:
```js
gmap.$on('zoom_changed', (zoom) => {
  console.log(zoom === gmap.$mapObject.getZoom()); // true
})
```

Thus if you really need two-way binding, you could write:
```html
<gmap-map :zoom="zoom" @zoom_changed="updateZoom($event)"></gmap-map>
```

5. Map elements no longer have to descend from MapComponent. Instead they only
need to mix in MapElementMixin. Thus you are free to use your own component hierarchy.
6. vue-google-maps for Vue 1.x automatically converted between google.maps.LatLng and
  plain-old-data (POD) {lat, lng} objects for two-way binding. In this version, the conversion does
  not take place. You will get a `google.maps.LatLng` object, e.g. in `center_changed`
  events.
