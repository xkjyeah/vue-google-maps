<template>
  <div>
    <h1>{{friendlyName}}</h1>
    <strong>{{description}}</strong>
    <hr/>
    <div :is="component">
    </div>
    <h3>Source Code</h3>
    <SourceCodeViewer :source="source"/>
  </div>
</template>

<script>
import SourceCodeViewer from './SourceCodeViewer.vue'
export default {
  props: ['name', 'description', 'source', 'component'],
  computed: {
    friendlyName () {
      return this.name.replace(/^[0-9]+/, '')
    }
  },
  components: {
    SourceCodeViewer
  },
}
</script>
