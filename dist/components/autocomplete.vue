<template>
  <input type="text" :placeholder="placeholder" ref="input"
    :value="value"/>
</template>

<script>
export default (x => x.default || x)(require('./autocompleteImpl.js'))
</script>
