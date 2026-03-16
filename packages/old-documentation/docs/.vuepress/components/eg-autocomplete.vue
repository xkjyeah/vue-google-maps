<template>
  <div>
    <h3>Autocomplete Example (#164)</h3>
    <label>
      AutoComplete
      <gmap-autocomplete placeholder="This is a placeholder text" @place_changed="setPlace">
      </gmap-autocomplete>
      <button @click="usePlace">Add</button>
    </label>
    <br>
    <br>
    <Gmap-Map style="width: 600px; height: 300px;" :zoom="1" :center="{lat: 0, lng: 0}">
      <Gmap-Marker v-for="(marker, index) in markers" :key="index" :position="marker.position"></Gmap-Marker>
      <Gmap-Marker v-if="this.place" label="&#x2605;" :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"></Gmap-Marker>
    </Gmap-Map>
  </div>
</template>

<script>
export default {
  name: 'eg-autocomplete',
  data() {
    return {
      markers: [],
      place: null,
    }
  },
  methods: {
    setDescription(description) {
      this.description = description;
    },
    setPlace(place) {
      this.place = place
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          }
        })
        this.place = null;
      }
    }
  }
}
</script>
