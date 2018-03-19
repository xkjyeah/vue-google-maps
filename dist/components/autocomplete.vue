<template>
  <input type="text" :placeholder="placeholder" ref="input"
         :value="value"
         v-on:input="updateValue($event.target.value)"
  />
</template>

<script src="./autocompleteImpl.js">
</script>
