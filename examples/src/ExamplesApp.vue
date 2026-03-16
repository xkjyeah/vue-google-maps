<template>
  <div class="examples-app">
    <div class="sidebar">
      <h3>List of Examples</h3>
      <ul>
        <li v-for="(example, index) in examples" :key="index" @click="loadExample(example.name)"
            :title="example.description">
          <router-link :to="{name: example.name}">
            {{example.friendlyName}}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<style>
* {
  font-family: Lato, sans-serif;
}
.examples-app .sidebar {
  border-right: solid 1px black;
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  bottom: 0;
  padding: 1em 0.5em;
  box-sizing: border-box;
}
.examples-app .sidebar ul {
  padding: 0;
  margin: 0;
  background-color: #DDE;
}
.examples-app .sidebar ul li {
  cursor: pointer;
  list-style-type: none;
  padding: 0.3em;
  margin: 0;
}
.examples-app .sidebar ul li:hover {
  background-color: #EDC;
}
.examples-app .sidebar ul li a {
  display: block;
  margin: -0.3em;
  padding: 0.3em;
}
.examples-app .main {
  box-sizing: border-box;
  margin-left: 200px;
  padding: 1em;
}
</style>
<script>
import Examples from '../examples-index'

/* A list of examples, and their source codes */
const ExamplesWithoutOrdering = Examples.map((ex) => {
  const nameWithoutOrdering = ex.name.replace(/^[0-9]*/, '')

  return {
    ...ex,
    friendlyName: nameWithoutOrdering
  }
})

const ExamplesByName = ExamplesWithoutOrdering.reduce(
  (all, example) => {
    all[example.name] = example
    return all
  },
  {}
)

export default {
  data () {
    return {
      loadedExample: null
    }
  },
  computed: {
    examples () {
      return ExamplesWithoutOrdering
    },
    examplesByName () {
      return ExamplesByName
    }
  },
  methods: {
    loadExample (e) {
      this.loadedExample = e
    }
  }
}
</script>
