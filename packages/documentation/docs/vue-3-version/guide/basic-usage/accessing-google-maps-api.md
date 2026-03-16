---
id: accessing-google-maps-api
sidebar_position: 3
sidebar_label: Accessing the Google Maps API
---
# Accessing Google Maps API

If you need to access the Google maps API directly you can use the `getGoogleMapsAPI` function utility.

```html title="Options API" showLineNumbers {7,24}
<template>
  <GmvMap ref="mapRef" class="map" :center="center" :zoom="7"></GmvMap>
</template>
<script>
import { utilities } from '@gmap-vue/v3';

const { getGoogleMapsAPI } = utilities;

export default {
  name: 'your-component-name',
  data() {
    return {
      center: {
        lat: 1.32,
        lng: 103.8,
      },
    };
  },
  computed: {
    // The below example is the same as writing
    // google() {
    //   return getGoogleMapsAPI();
    // },
    google: getGoogleMapsAPI,
  },
};
</script>
<style scoped>
.map {
  height: 50vh;
  width: 50vw;
}
</style>
```

In composition API you can use this function as any normal function

```html title="Composition API" showLineNumbers {11,12}
<template>
  <GmvMap ref="mapRef" class="map" :center="center" :zoom="7"></GmvMap>
</template>
<script setup lang="ts">
import { utilities } from '@gmap-vue/v3';

const center = {
  lat: 1.32,
  lng: 103.8,
};
const { getGoogleMapsAPI } = utilities;
const googleAPI = getGoogleMapsAPI()
</script>
<style scoped>
.map {
  height: 50vh;
  width: 50vw;
}
</style>
```
