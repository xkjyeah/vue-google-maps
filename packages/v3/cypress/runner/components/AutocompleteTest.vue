<template>
  <div id="root">
    <h1>Autocomplete Example</h1>
    <label v-if="ready">
      AutoComplete
      <gmv-autocomplete
        id="autocomplete"
        name="autocomplete"
        placeholder="find a place..."
        @place_changed="setPlace"
      />
      <br />
    </label>
    <button
      v-if="ready"
      id="use-place-btn"
      :style="{ backgroundColor: 'teal', color: 'white' }"
      @click="usePlace"
    >
      Change map center using place
    </button>
    <br />
    <br />
    <gmv-map class="map" :zoom="4" :center="center" map-id="DEMO_MAP_ID">
      <gmv-marker
        v-for="(marker, index) in markers"
        :key="index"
        :marker-key="`autocomplete-marker-${index}`"
        :position="marker.position"
      />
    </gmv-map>
  </div>
</template>
<script setup lang="ts">
import { useMapPromise, useMarkerPromise } from '../../../dist/composables.es';
import { nextTick, onMounted, ref, toRaw, watch } from 'vue';

type MapMarkersWindow = Window & {
  __mapMarkers__?: google.maps.marker.AdvancedMarkerElement[];
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const mapPromise = useMapPromise();
const ready = ref<boolean>(false);
const map = ref<google.maps.Map | undefined>();
const center = ref<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
const markers = ref<{ position: { lat: number; lng: number } }[]>([]);
const place = ref<google.maps.places.PlaceResult | null>(null);

/**
 * Resolves all currently-mounted marker promises and writes live
 * AdvancedMarkerElement instances to window.__mapMarkers__ so that Cypress
 * tests can assert marker counts without relying on internal Google Maps CSS
 * class names (e.g. GMAMP-maps-pin-view) that change without notice.
 */
async function updateWindowMarkers(): Promise<void> {
  await nextTick();
  const instances = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions
    markers.value.map((_, i) => useMarkerPromise(`autocomplete-marker-${i}`)),
  );
  (window as MapMarkersWindow).__mapMarkers__ = instances.filter(
    (m): m is google.maps.marker.AdvancedMarkerElement => m != null,
  );
}

watch(markers, updateWindowMarkers, { deep: true });

function setPlace(p: google.maps.places.PlaceResult) {
  place.value = p;
  console.log(toRaw(place.value));
}
function usePlace() {
  if (place.value) {
    const lat = place.value.geometry?.location?.lat();
    const lng = place.value.geometry?.location?.lng();

    if (lat != null && lng != null) {
      markers.value.push({
        position: {
          lat,
          lng,
        },
      });

      center.value = {
        lat,
        lng,
      };

      map.value?.panTo({ lat, lng });
      place.value = null;
    }
  }
}

onMounted(() => {
  console.log(mapPromise);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  mapPromise.then((map) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    map.value = map;
    ready.value = true;
  });
  // map.value = await mapPromise;
  // ready.value = true;
});
</script>
<style scoped>
.map {
  height: 50vh;
  width: 50vw;
}
</style>
