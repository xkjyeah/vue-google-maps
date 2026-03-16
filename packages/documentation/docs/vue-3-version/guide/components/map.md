---
id: map
sidebar_position: 2
sidebar_label: Map
---

# Map

This component helps you to create a Map with the Google Maps API. For more information read the Google Maps documentation for the [map](https://developers.google.com/maps/documentation/javascript/basics).

It is exported with the name `MapLayer`, it is registered as `GmvMap`.

## Map instance

This component save the original map object provided by Google Maps in a property called `mapInstance`, as the example below.

```ts
// ...
const { Map } = (await google.maps.importLibrary(
  'maps',
)) as google.maps.MapsLibrary;
mapInstance = new Map(gmvMap.value, mapLayerOptions);
// ...
```

## Source code

You can see the source code on:

- [GitHub](https://github.com/diegoazh/gmap-vue/blob/2c697bb5ae78e5519d95f4873f1ab373e3d25ff9/packages/v3/src/components/map-layer.vue)
- [Here in docs](/docs/vue-3-version/api/components/map#source-code)

## How to use it

```html showLineNumbers
<template>
  <!-- you can use the auto close form if you don't use the slot -->
  <gmv-map :center="center" :zoom="7" style="width: 100%; height: 500px"/>

  <gmv-map :center="center" :zoom="7" style="width: 100%; height: 500px">
  </gmv-map>
</template>
```

```html showLineNumbers
<template>
  <!-- you can use the auto close form if you don't use the slot -->
  <GmvMap :center="center" :zoom="7" style="width: 100%; height: 500px"/>

  <GmvMap :center="center" :zoom="7" style="width: 100%; height: 500px">
  </GmvMap>
</template>
```

### Some tricky parts

#### `getBounds`

If you need to use the `getBounds` method of the Map instance, you can do it with a reference, and wait for the `mapPromise` to resolve or using the `useMapPromise('you-map-key')` composable to get the map promise and wait for it to resolve.

If you use the `getBounds` method in the mounted hook you need to take care about three things:

1. **The center should be defined**
2. **The zoom should be defined**
3. **The map should be visible**

In the [official documentation](https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds)
it says:

> If the map is not yet initialized or center and zoom have not been set then the result is undefined.

Because of that behavior you must listen for the `tilesloaded` event in the map component, this event is fired when the
maps is visible and allows you to accomplish with the three requirements mentioned above.

> You can refer to the [issue #67](https://github.com/diegoazh/gmap-vue/issues/67)

```html showLineNumbers
<template>
  <div>
    <GmvMap
      @tilesloaded="tilesloadedEvent"
      :center="center"
      :zoom="11"
      style="width: 100%; height: 500px"
      ref="gmap">
        ....
    </GmvMap>
  </div>
</template>

<script>
export default {
  // ...
  data() {
    return {
      map: undefined,
    }
  },
  async mounted() {
    // this is a good practice
    await this.$gmapApiPromiseLazy();
    this.map = await this.$refs.gmap.mapPromise;

    // you can do the same in the following way but is more verbose
    // this.$refs.gmap.mapPromise
    //   .then((map) => {
    //     map.addListener('tilesloaded', () => {
    //       console.log('>>>>>>>>>> getCenter', map.getCenter())
    //       console.log('>>>>>>>>>> getZoom', map.getZoom())
    //       console.log('>>>>>>>>>> getBounds', map.getBounds())
    //     });
    //   })
    //   .catch((e) => console.error(e));
  },
  methods: {
    tilesloadedEvent() {
      console.log('>>>>>>>>>> getCenter', this.map.getCenter())
      console.log('>>>>>>>>>> getZoom', this.map.getZoom())
      console.log('>>>>>>>>>> getBounds', this.map.getBounds())
    }
  }
};
</script>
```

#### `PlacesService`

If want to use the `google.maps.places.PlacesService` class we let you here an example about how to implement it.

> You can refer to the [issue #130](https://github.com/diegoazh/gmap-vue/issues/130)

```html showLineNumbers
<template>
  <div>
    <GmvMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 500px"
      ref="googleMap"
    >
    </GmvMap>
  </div>
</template>

<script>
import { utilities } from "gmap-vue";

const { getGoogleMapsAPI } = utilities;

export default {
  data() {
    return {
      center: { lat: 10, lng: 10 },
      zoom: 11,
    };
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();

    const google = getGoogleMapsAPI();
    console.log(">>>>>>>>>>>> placesService", google.maps.places);
    console.log(">>>>>>>>>>>> map instance", await this.$refs.googleMap.mapPromise);

    const service = new google.maps.places.PlacesService(
      document.createElement("div") // if you pass the map object here it doesn't work
    );

    console.log("service", service);

    const request = {
      query: "Museum of Contemporary Art Australia",
      fields: ["name", "geometry"],
    };

    const map = await this.$refs.googleMap.mapPromise;
    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  },
};
</script>
```
