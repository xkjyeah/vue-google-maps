<template>
  <div class="auto-api">
    <AutoComponent v-for="component in components" :component="component" :key="component.name" />
  </div>
</template>

<style>
.auto-api {
  max-width: 800px;
  margin: 0 auto;
}
</style>

<script>
import _ from 'lodash'
import {
  Marker, Polyline, Polygon, Circle, Rectangle,
  InfoWindow, Map, MapElementFactory, Autocomplete,
  StreetViewPanorama
} from '../../src/main'
import ManualDoc from './auto/manualDoc.yml'
import Cluster from '../../src/components/cluster'
import AutoComponent from './auto/component.vue'

const COMPONENTS = Object.entries({
  Marker, Polyline, Polygon, Circle, Rectangle,
  InfoWindow, Map, Autocomplete,
  Cluster, StreetViewPanorama
}).map(([name, defn]) => {
  return _.merge(
    {name}, defn.$vgmOptions, ManualDoc[name] || {props:{}, mappedProps: {}})
}).filter(x => x.name)

console.log(COMPONENTS, ManualDoc)

export default {
  data () {
    return {}
  },
  components: {
    AutoComponent,
  },
  computed: {
    components () {
      return _.sortBy(COMPONENTS, 'name')
    }
  },
}


</script>