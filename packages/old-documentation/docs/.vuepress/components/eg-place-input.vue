<template>
  <div>
    <h3>Changing Default Place updates text box</h3>
    <button @click="setPlaceText('Tokyo')">Set to Tokyo</button><br/>
    <button @click="setPlaceText('Shanghai')">Set to Shanghai</button><br/>
    <button @click="setPlaceText('Seoul')">Set to Seoul</button><br/>
    <gmap-place-input :default-place="place"
      @place_changed="setPlace">
    </gmap-place-input>
    <br/>
    {{latLng.lat}},
    {{latLng.lng}}
  </div>
</template>

<script>
export default {
  name: 'eg-place-input',
  data () {
    return {
      place: 'Singapore',
      latLng: {}
    }
  },
  methods: {
    setPlaceText(place) {
      this.place = place;
    },
    setPlace(place) {
      this.latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    }
  }
}
</script>
