<template>
  <div class="vue-map-container">
    <div ref="vue-map" class="vue-map"></div>
    <slot></slot>
  </div>
</template>

<script src="./mapImpl.js">
</script>

<style lang="css">
.vue-map-container {
  width: 100%;
  height:100%;
}

.vue-map-container .vue-map {
  width: 100%;
  height:100%;
}
</style>
