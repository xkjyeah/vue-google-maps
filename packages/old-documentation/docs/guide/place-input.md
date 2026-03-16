## Description

::: danger
DEPRECATED, use [autocomplete](/examples/autocomplete.html) component instead.
:::

This component helps you to create a place input it use the auto-complete API but was the first implementation of that API.
We encourage to use [autocomplete](/examples/autocomplete.html) component instead of this component, because it will be removed in the next major release.

For more information read the Google Maps documentation for [autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete).

It is exported with the name `GmapPlaceInput`.

## Variables

This component save the original autocomplete object provided by Google Maps in a property called `autoCompleter`, as the example below.

```javascript
this.autoCompleter = new google.maps.places.Autocomplete(...);
```

## Source code

:::details Click to se the source code of <code>autocomplete.vue</code> component

```vue
<template>
  <label>
    <span v-text="label"></span>
    <input
      type="text"
      :placeholder="placeholder"
      :class="className"
      ref="input"
    />
  </label>
</template>

<script>
import MapElementMixin from '../mixins/map-element';
import {
  bindProps,
  downArrowSimulator,
  getPropsValues,
} from '../utils/helpers';

export default {
  mixins: [MapElementMixin],
  props: {
    bounds: {
      type: Object,
    },
    defaultPlace: {
      type: String,
      default: '',
    },
    componentRestrictions: {
      type: Object,
      default: null,
    },
    types: {
      type: Array,
      default: undefined
    },
    placeholder: {
      required: false,
      type: String,
    },
    className: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
      default: null,
    },
    selectFirstOnEnter: {
      require: false,
      type: Boolean,
      default: false,
    },
  },
  created() {
    window.console.warn(
      'The PlaceInput class is deprecated! Please consider using the Autocomplete input instead, it will be removed in the next major release of this plugin.'
    );
  },
  mounted() {
    const { input } = this.$refs;

    // Allow default place to be set
    input.value = this.defaultPlace;

    this.$watch('defaultPlace', () => {
      input.value = this.defaultPlace;
    });

    this.$gmapApiPromiseLazy().then(() => {
      const options = getPropsValues(this, this.props);

      if (this.selectFirstOnEnter) {
        downArrowSimulator(this.$refs.input);
      }

      if (typeof google.maps.places.Autocomplete !== 'function') {
        throw new Error(
          "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?"
        );
      }

      this.autoCompleter = new google.maps.places.Autocomplete(
        this.$refs.input,
        options
      );

      const {
        placeholder,
        place,
        defaultPlace,
        className,
        label,
        selectFirstOnEnter,
        ...rest
      } = this.props;

      bindProps(this, this.autoCompleter, rest);

      this.autoCompleter.addListener('place_changed', () => {
        this.$emit('place_changed', this.autoCompleter.getPlace());
      });
    });
  },
};
</script>
```

:::

If you need to know what are `mappedProps` please read the general concepts of this application [here](/code/utils/mapped-props-by-map-element.html#autocompletemappedprops).

::: details Mapped Props of <code>GmapAutocomplete</code> component

This component does not has mapped props.

:::

## How to use it

```vue
<template>
  <gmap-place-input :default-place="place"
    @place_changed="setPlace">
  </gmap-place-input>
</template>
```

If you need to know the **API of this component** please read it [here](/code/components/place-input.html).


## HTML examples

::: details basic HTML example

```html
<body>
  <div id="root">
    <h1>Changing Default Place updates text box</h1>
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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places'
      },
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          place: 'Singapore',
          latLng: {}
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
      });
    });
  </script>
</body>
```

:::

::: details Place input with default place HTML example

```html
<body>
  <div id="root">
    <h1>Test</h1> "Singapore" should appear in the text box on page load. No errors in console.
    <gmap-place-input default-place="Singapore" @place_changed="updatePlace">
    </gmap-place-input>
    {{place && place.lat}}, {{place && place.lng}},
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>

  <script>
    Vue.use(GmapVue, {
      load: {
        key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
        libraries: 'places'
      },
      // Demonstrating how we can customize the name of the components
      installComponents: true,
    });

    document.addEventListener('DOMContentLoaded', function() {
      new Vue({
        el: '#root',
        data: {
          place: null
        },
        methods: {
          updatePlace(what) {
            this.place = {
              lat: what.geometry.location.lat(),
              lng: what.geometry.location.lng()
            };
          }
        }
      });
    });
  </script>
</body>
```

:::

## Test the component

::: danger
DEPRECATED, use [autocomplete](/examples/autocomplete.html) component instead.
:::

::: details Basic Place Input example

<eg-base>
  <eg-place-input />
</eg-base>

:::

::: details Basic Place Input example

<eg-base>
  <eg-place-default />
</eg-base>

:::
