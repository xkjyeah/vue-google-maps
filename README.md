# vue-google-maps

## Demo:

[Demo in production](http://en.papayapods.com/?utm_source=GtHub&utm_medium=LnK&utm_campaign=V.JS%20Map%20Cmpnt.#!/search/map?city=Lausanne)

[Showcase with a lot of features](http://guillaumeleclerc.github.io/vue-google-maps-example/)

## Presentation

If you want to write google map this way : 

```html
<map
  :map-obj="{
    center: {lat: 10, lng: 10},
    mapTypeId: 'terrain',
    zoom:7
  }"
></map>
```

Or use the power of Vue.js within a google map like this:
```html
<template>
  <map
    :map-obj="mapObj"
  >
    <marker 
      v-for="m in markers"
      :marker-obj="m"
      @g-click="mapObj.center=m.position"
    ></marker>
  </map>
</template>

<script>
  import {load, Map, Marker} from 'vue-google-maps'
  
  load('YOUR_API_TOKEN','OPTIONAL VERSION NUMBER')
  
  export default {
    data () {
      return {
        mapObj: new VueGoogleMap.VueMapObject({
          center: {lat: 10, lng: 10},
          mapTypeId: "terrain",
          zoom: 7
        }),
        markers: [ new VueGoogleMap.VueMarkerObject({
          position: {lat: 10.0, lng: 10.0},
          draggable:true
        }), new VueGoogleMap.VueMarkerObject({
          position: {lat: 11.0, lng: 11.0},
          draggable:true
        })]     
      }
    }
  }
</script>
```

## Example Project 

You can see an project example [here](https://github.com/GuillaumeLeclerc/vue-google-maps-example).

It uses webpack and vue-loader and was "forked" from the vue-loader-example project

## Installation

### With npm (Recommended)

```
npm install vue-google-maps
```

You can append `--save` or `--save-dev` to add it to your depency (if yor project also uses npm)

### Manually

Just download the `index.js` file on the root directory of this repository

### Basic usage

#### Reference `vue-google-maps` into your project

If you are using a cool bundler (recommended) you can just do : 

```javascript
import {load, Map, Marker} from 'vue-google-maps'
```

Or if you prefer the older ES5 syntax:

```javascript
const VueGoogleMap = require('vue-google-maps')
```

#### Standalone / CDN

If you are not using any bundler (and you should feel bad). You can just reference the file in a script tag.
The library will be available in a global object called `VueGoogleMap`.
However you will need to include Vue and Lodash beforehand:

```html
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.3/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.min.js"></script>
<script src="dist/vue-google-maps.js"></script>

</head>
<body>

<google-map style="width: 100%; height: 100%; position: absolute; left:0; top:0"
    :map-obj="mapObj"
>

</google-map>

<script>
VueGoogleMap.load({
    'key': 'YOUR_API_KEY',
})
Vue.component('google-map', VueGoogleMap.Map);
new Vue({
    el: 'body',
    data:{
         mapObj: {
             center: {lat: 1.38, lng: 103.8},
             zoom: 12
         }
     }
</script>

</body>
```

#### Set your api key

To enable any `vue-google-maps` components you need to set your api token:

```javascript
load({
  key: 'YOUR_API_TOKEN',
  v: '3.26',                // Google Maps API version
  // libraries: 'places',   // If you want to use places input
})
// OR (depending on how you refereced it)
VueGoogleMap.load({ ... })
```

The parameters are passed in the query string to the Google Maps API, e.g. to set the [version](https://developers.google.com/maps/documentation/javascript/versions#version-rollover-and-version-types),
[libraries](https://developers.google.com/maps/documentation/javascript/libraries),
or for [localisation](https://developers.google.com/maps/documentation/javascript/basics).

## Full documentation

### Note on events

__All events are prefixed with `g-`. Example : `g-click` so it does not interfere with DOM events.__

__Documentation is up to date__: take a look at the wiki

## Sponsor

This component is sponsored by [PapayaPods](http://en.papayapods.com). Feel free to check out `vue-google-maps` in production !!
