<template>
  <div>
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <gmap-kml-layer
        v-for="(l, index) of kmlLayers"
        :key="index"
        :url="l.url"
        :clickable="true"
        :preserveViewport="true"
      ></gmap-kml-layer>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "eg-kml-layer",
  data() {
    return {
      center: {
        lat: 37.7272,
        lng: -123.032,
      },
      kmlLayers: [
        {
          url: "https://raw.githubusercontent.com/googlearchive/kml-samples/gh-pages/kml/Placemark/placemark.kml",
        },
      ],
    };
  },
};
</script>
