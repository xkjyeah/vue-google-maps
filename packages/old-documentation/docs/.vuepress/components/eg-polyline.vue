<template>
  <div>
    <label>
      Start at:
      <gmap-autocomplete @place_changed="updateCenter($event)" />
    </label>

    <gmap-map :center="center" :zoom="12" style="width: 100%; height: 500px" ref="map">
      <gmap-polyline v-if="path.length > 0" :path="path" :editable="true" @path_changed="updateEdited($event)"
          @rightclick="handleClickForDelete"
          ref="polyline">
      </gmap-polyline>
    </gmap-map>

    <div>
      <textarea :value="polylineGeojson" style="width: 100%; height: 200px"
        @input="readGeojson">
      </textarea>
      <div v-if="errorMessage">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'eg-polyline',
  data() {
    return {
      center: {lat: 1.38, lng: 103.8},
      edited: null,
      path: [
        {lat: 1.33, lng: 103.75},
        {lat: 1.43, lng: 103.85},
      ],
      mvcPath: null,
      errorMessage: null,
      polylineGeojson: '',
    }
  },
  watch: {
    polylinePath: _.throttle(function (path) {
      if (path) {
        this.path = path
        this.polylineGeojson = JSON.stringify({
          type: 'Polyline',
          coordinates: this.path.map(({lat, lng}) => [lng, lat])
        }, null, 2)
      }
    }, 1000)
  },
  computed: {
    polylinePath() {
      if (!this.mvcPath) return null

      let path = [];
      for (let j=0; j<this.mvcPath.getLength(); j++) {
        let point = this.mvcPath.getAt(j);
        path.push({lat: point.lat(), lng: point.lng()});
      }
      return path
    },
  },
  methods: {
    updateCenter(place) {
      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    },
    updateEdited(mvcPath) {
      this.mvcPath = mvcPath
    },
    handleClickForDelete($event) {
      if ($event.vertex) {
        this.$refs.polyline.$polylineObject.getPaths()
          .getAt($event.path)
          .removeAt($event.vertex)
      }
    },
    readGeojson($event) {
      try {
        this.polylineGeojson = $event.target.value

        var v = JSON.parse($event.target.value);

        this.path = v.coordinates
          .map(([lng, lat]) => ({lat, lng}))

        this.errorMessage = null
      } catch (err) {
        this.errorMessage = err.message
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
