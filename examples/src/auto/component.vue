<template>
  <div class="component">
    <h1 @click="showDocumentation = !showDocumentation"
      :class="{'expanded': showDocumentation}">
      {{capitalize(component.name)}}
    </h1>

    <transition name="expand">
      <div v-if="showDocumentation">
        <div v-html="component.description" v-if="component.description"></div>
        <h2>Properties mapped <template v-if="!component.is3rdParty">from Google Maps API</template></h2>
        <CiteRef v-if="!component.is3rdParty" />
        <ul>
          <li v-for="[key, value] in sort(Object.entries(component.mappedProps))" :key="key">
            <code><b>{{key}}</b></code>

            <ul>
              <li v-if="value.type">
                Type: <em>{{value.type.name}}</em>
              </li>
              <li v-if="value.twoWay">
                A <code>{{key}}_changed</code> event will be emitted
                if the property is modified by the user interacting with the UI.
              </li>
            </ul>

            <div v-if="value.description" v-html="value.description">
              </div>
          </li>
        </ul>

        <h2>Events mapped <template v-if="!component.is3rdParty">from Google Maps API</template></h2>
        <CiteRef v-if="!component.is3rdParty" />
        <ul>
          <li v-for="value in sort(component.events)" :key="value">
            <code><b>{{value}}</b></code>
          </li>
        </ul>

        <template v-if="component.props">
          <h2>Other properties defined (reactive)</h2>
          <ul>
            <li v-for="[key, value] in sort(Object.entries(component.props))" :key="key">
              <code><b>{{key}}</b></code>
              <ul>
                <li v-if="value.type">
                  Type: <em>{{value.type.name}}</em>
                </li>
                <li v-if="value.default && typeof value.default !== 'object'">
                  Default: <code>{{value.default}}</code>
                </li>
                <li v-if="value.required">
                  <em>Required</em>
                </li>
              </ul>

              <div v-if="value.description" v-html="value.description">
              </div>
            </li>
          </ul>
        </template>

        <template v-if="!component.isIrregular">
          <h2>Other properties defined (non-reactive)</h2>
          <ul>
            <li>
              <code>${{component.name}}Object</code> &mdash; The underlying instance of
              a <code>{{capitalize(component.name)}}</code> object.
            </li>
            <li>
              <code>${{component.name}}Promise</code> &mdash; A promise that resolves to the underlying
              <template v-if="!component.is3rdParty">Google Maps API</template> instance when the
              instance has been created.
            </li>
          </ul>
        </template>

        <template v-if="component.inject">
        <h2>Recognized parent elements (injects)</h2>
          <ul>
            <li v-for="[key, value] in sort(Object.entries(component.inject))" :key="key">
              {{capitalize(extractComponent(key))}}
            </li>
          </ul>
        </template>
      </div>
    </transition>

  </div>
</template>
<style lang="scss">
li, div, a {
  font-family: sans-serif;
}
h1, h2 {
  font-family: sans-serif;
  margin: -12px -12px 0 -12px;
  padding: 12px 12px 12px 12px;
}
h1 {
  cursor: pointer;

  &:hover {
    background: #DEF;
  }
  &.expanded:before {
    content: "- ";
    opacity: 0.5;
  }
  &:not(.expanded):before {
    content: "+";
    opacity: 0.5;
  }
}
.component {
  border: solid 1px #888;
  padding: 12px;
  margin: 12px;
}

.expand-enter-active, .expand-leave-active {
  transition: transform .5s;
  transform-origin: top;
}
.expand-enter-to, .expand-leave {
  transform: scaleY(1.0);
}
.expand-enter, .expand-leave-to {
  transform: scaleY(0);
}
</style>
<script>
import _ from 'lodash'
import CiteRef from './CiteRef.vue'

export default {
  props: { component: { type: Object, required: true } },
  components: {CiteRef},
  data () {
    return {
      showDocumentation: false,
    }
  },
  methods: {
    capitalize (s) {
      return s.substr(0, 1).toUpperCase() + s.substr(1)
    },
    sort (s) {
      return _.sortBy(s)
    },
    extractComponent (s) {
      const m = s.match(/^\$(.*)Promise$/)
      if (m) return m[1]
    }
  }
}
</script>