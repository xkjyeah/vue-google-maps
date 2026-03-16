<template>
  <GmvMap
    ref="mapRef"
    class="map"
    :center="center"
    :zoom="7"
    map-id="DEMO_MAP_ID"
    map-key="firstMap"
  >
    <!-- <GmvInfoWindow
      :content="'<strong style=\'color:black\'>Marker 1</strong>'"
      :marker="markerRef?.markerInstance"
      :opened="infoWinOpen"
      :position="{ lat: 1.0, lng: 100.0 }"
      @closeclick="toggleInfoWindow"
    /> -->
    <GmvMarker
      v-if="mapRef"
      ref="markerRef"
      :position="{ lat: 1.0, lng: 100.0 }"
      @click="toggleInfoWindow"
    />
  </GmvMap>

  <br />
  <br />

  <GmvMap
    ref="mapRef2"
    class="map"
    :center="center"
    :zoom="7"
    map-id="DEMO_MAP_ID"
    :options="{ recycle: 'secondMap' }"
  >
    <!-- <GmvInfoWindow
      :content="'<strong style=\'color:black\'>Marker 1</strong>'"
      :marker="markerRef2?.markerInstance"
      :opened="infoWinOpen"
      :position="center"
      @closeclick="toggleInfoWindow"
    /> -->
    <GmvMarker
      v-if="mapRef2"
      ref="markerRef2"
      :position="center"
      @click="toggleInfoWindow"
    />
  </GmvMap>
</template>
<script setup lang="ts">
import { MapLayer, Marker } from '@gmap-vue/v3/components';
import { useMapPromise } from '@gmap-vue/v3/composables';
import { ComponentInstance } from 'vue';
import { onMounted, ref } from 'vue';

const mapRef = ref<ComponentInstance<typeof MapLayer>>();

const mapRef2 = ref<ComponentInstance<typeof MapLayer>>();

const markerRef = ref<ComponentInstance<typeof Marker>>();

const markerRef2 = ref<ComponentInstance<typeof Marker>>();
const infoWinOpen = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const mapPromise = useMapPromise('firstMap');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const mapPromise2 = useMapPromise('secondMap');
const center = {
  lat: 1.32,
  lng: 103.8,
};

function toggleInfoWindow() {
  console.log('clicked...', infoWinOpen.value);
  infoWinOpen.value = !infoWinOpen.value;
}

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  mapPromise
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .then((map) => {
      if (map) {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          map.panTo({ lat: 1.0, lng: 100.0 });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          console.log(mapRef.value?.getRecycleKey());
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          console.log(mapRef2.value?.getRecycleKey());
        }, 2000);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .catch((error: unknown) => {
      throw error;
    });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  mapPromise2.then((map) => {
    if (map) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        map.panTo({ lat: 1.0, lng: 100.0 });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        console.log(mapRef.value?.getRecycleKey());
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        console.log(mapRef2.value?.getRecycleKey());
      }, 2000);
    }
  });
});
</script>
<style scoped>
.map {
  height: 50vh;
  width: 50vw;
}
</style>
