# GmapVue

[![Build Status](https://travis-ci.org/diegoazh/gmap-vue.svg?branch=master)](https://travis-ci.org/diegoazh/gmap-vue)
[![](https://data.jsdelivr.com/v1/package/npm/gmap-vue/badge)](https://www.jsdelivr.com/package/npm/gmap-vue)

## Documentation

The new documentation page is ready and it contains all examples for any component in the plugin.

You can use your own gmap key in order to test it in the live example section.

We have planed improve and grow all required documentation about the plugin.

Please follow next link to our [documentation](https://diegoazh.github.io/gmap-vue/).

## Vue-2 port of vue-google-maps

This is a fork of the popular vue2-google-maps. As the author of the library no longer commit to maintain the project, we forked it to develop and maintain the project.

## CONTRIBUTORS NEEDED!

If you have time to contribute to a rather frequently used library, feel free to make a PR!
For more background, please refer to [this issue](https://github.com/xkjyeah/vue-google-maps/issues/514).

What's urgently needed are:

1. Better automated tests
2. Better integration tests with the popular frameworks, especially Nuxt and Vue template
3. ~Better documentation (examples, recommendations)~

The above three will go a long way to keeping the project maintainable and contributable, and will address many of the open issues.

## Breaking changes

### v3.0.0

- `autobindAllEvents` config option was renamed to `autoBindAllEvents`
- `vueGoogleMapsInit` name was renamed to `GoogleMapsCallback`
- `gmapApi` function was renamed to `getGoogleMapsAPI`
- `MapElementMixin` now is exported from `components` object instead of `helpers` object
- `customCallback` config option was added to reuse existing Google Maps API that already loaded, eg from an HTML file

### v2.0.0

- All components were rewriting in SFC (`.vue`)
- `MarkerCluster` was renamed to `Cluster`
- `@google/markerclustererplus` was replace for `@googlemaps/markerclusterer`
- The plugin exports two main objects:
  - `components`: it has all components and mountable mixin)
  - `helpers`: it has promise lazy factory function, gmapApi function and map element mixin
- The plugin now exports by default the install function, this means that you can do the following
- From **v2.0.0** and above, the `autocomplete` component uses the `default` slot instead of the named `input` slot, from v1.5.0 the `input` slot on the autocomplete component still works.

  ```js
  import GmapVue from 'gmap-vue';
  ```

  instead of

  ```js
  import * as GmapVue from 'gmap-vue';
  ```

## Installation

### npm

```shell
npm install gmap-vue --save
```

### yarn

```shell
yarn add gmap-vue
```

### Manually

Just download `dist/gmap-vue.js` file and include it from your HTML.

```html
<script src="./gmap-vue.js"></script>
```

### jsdelivr

You can use a free CDN like [jsdelivr](https://www.jsdelivr.com) to include this plugin in your html file

```html
<script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>
```

### unpkg

You can use a free CDN like [unpkg](https://unpkg.com) to include this plugin in your html file

```html
<script src="https://unpkg.com/gmap-vue@1.2.2/dist/gmap-vue.js"></script>
```

::: warning
Be aware that if you use this method, you cannot use TitleCase for your components and your attributes.
That is, instead of writing `<GmapMap>`, you need to write `<gmap-map>`.
:::

[Live example](https://diegoazh.github.io/gmap-vue/guide/).
