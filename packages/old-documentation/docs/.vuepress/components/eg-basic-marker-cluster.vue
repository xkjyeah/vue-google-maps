<template>
  <div>
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <gmap-cluster>
        <gmap-marker
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center = m.position"
          :key="index"
        ></gmap-marker>
      </gmap-cluster>
    </gmap-map>
  </div>
</template>

<script>
import { components } from "gmap-vue";

export default {
  name: "eg-basic-marker-cluster",
  data() {
    return {
      center: {
        lat: 10.0,
        lng: 10.0
      },
      markers: [
        {
          position: {
            lat: 10.0,
            lng: 10.0
          }
        },
        {
          position: {
            lat: 11.0,
            lng: 11.0
          }
        }
      ]
    };
  },
  components: {
    "gmap-cluster": components.Cluster
  }
};
</script>
