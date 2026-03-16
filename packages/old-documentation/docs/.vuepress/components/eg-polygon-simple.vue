<template>
  <div>
    <gmap-map :center="{lat: 1.38, lng: 103.8}" :zoom="12" style="width: 100%; height: 500px">
      <gmap-polygon :paths="paths" :editable="true" @paths_changed="updateEdited($event)">
      </gmap-polygon>
    </gmap-map>

    <ul v-if="edited" @click="edited = null">
      <li v-for="path in edited">
        <ol>
          <li v-for="point in path">
            {{point.lat}}, {{point.lng}}
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'eg-polygon-simple',
  data() {
    return {
      edited: null,
      paths: [
        [ {lat: 1.380, lng: 103.800}, {lat:1.380, lng: 103.810}, {lat: 1.390, lng: 103.810}, {lat: 1.390, lng: 103.800} ],
        [ {lat: 1.382, lng: 103.802}, {lat:1.382, lng: 103.808}, {lat: 1.388, lng: 103.808}, {lat: 1.388, lng: 103.802} ],
      ]
    }
  },
  methods: {
    updateEdited(mvcArray) {
      let paths = [];
      for (let i=0; i<mvcArray.getLength(); i++) {
        let path = [];
        for (let j=0; j<mvcArray.getAt(i).getLength(); j++) {
          let point = mvcArray.getAt(i).getAt(j);
          path.push({lat: point.lat(), lng: point.lng()});
        }
        paths.push(path);
      }
      this.edited = paths;
    }
  }
}
</script>

<style lang="css" scoped>
</style>
