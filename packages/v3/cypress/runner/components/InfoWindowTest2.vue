<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <gmv-map
    ref="mapRef"
    class="map"
    :center="center"
    :zoom="7"
    mapId="DEMO_MAP_ID"
    mapKey="firstMap"
  >
    <template v-for="(marker, idx) in markers" :key="`item${marker.id}`">
      <gmv-marker
        :markerKey="`marker${marker.id}`"
        :position="marker.position"
        mapKey="firstMap"
      />

      <gmv-info-window
        mapKey="firstMap"
        :opened="!!markers[idx]"
        :options="infoWinOptions"
        :markerKey="`marker${marker.id}`"
        :infoWindowKey="`window${marker.id}`"
        :position="marker.position"
      >
        <button @click="deleteMarker(marker.id)">
          try to click me for close and check your console {{ marker.id }}
        </button>
      </gmv-info-window>
    </template>
  </gmv-map>
</template>
<script setup lang="ts">
import { useMapPromise } from '../../../dist/composables.es';
import { ComponentInstance, onMounted, ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-redundant-type-constituents
const mapRef = ref<ComponentInstance<typeof MapLayer> | null>(null);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const mapPromise = useMapPromise('firstMap');

const markers = ref([
  { id: 1, position: { lat: 1.0, lng: 101.0 } },
  { id: 2, position: { lat: 2, lng: 102.001 } },
  { id: 3, position: { lat: 0.1, lng: 100.004 } },
]);

const deleteMarker = (markerId: number) => {
  markers.value.splice(
    markers.value.findIndex((it) => it.id === markerId),
    1,
  );

  console.log(markers.value);
  if (markers.value.length === 0) {
    console.log('InfoWindow components not closed :(');
  }
};

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  mapPromise
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ?.then((map) => {
      if (map) {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          map.panTo({ lat: 1.0, lng: 100.0 });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          console.log(mapRef.value?.getRecycleKey());
        }, 2000);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .catch((e: unknown) => {
      console.error(e);
    });
});

const center = {
  lat: 1.32,
  lng: 103.8,
};

const infoWinOptions = {
  pixelOffset: {
    width: 0,
    height: -35,
  },
};
</script>

<style scoped>
.map {
  height: 50vh;
  width: 50vw;
}

:deep(button.gm-ui-hover-effect),
:deep(.gm-style-iw-tc) {
  visibility: hidden !important;
  display: none !important;
}
</style>
