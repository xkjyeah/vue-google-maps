<template>
  <div>
    <!--
				@slot Used to set your custom component for the input, eg: v-text-field.<br>
        It has two binding properties:<br>
        - `attrs`, it's type is `object`, it's all attributes passed to the component ([vm.$attrs](https://vuejs.org/v2/api/?#vm-attrs))<br>
        - `listeners`, it's type is `object`, it's all events passed to the component ([vm.$listeners](https://vuejs.org/v2/api/?#vm-listeners))
			-->
    <slot :attrs="$attrs" :listeners="$listeners">
      <input ref="input" v-bind="$attrs" v-on="$listeners" />
    </slot>
  </div>
</template>

<script>
import {
  downArrowSimulator,
  getPropsValues,
  bindProps,
} from '../utils/helpers';
import { autocompleteMappedProps } from '../utils/mapped-props-by-map-element';

/**
 * Autocomplete component
 * @displayName GmapAutocomplete
 * @see [source code](/guide/autocomplete.html#source-code)
 */
export default {
  name: 'AutocompleteInput',
  props: {
    /**
     * Map bounds this is an LatLngBounds
     * object builded with
     * @value new google.maps.LatLngBounds(...)
     * @see [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object)
     */
    bounds: {
      type: Object,
      default: undefined,
    },
    /**
     * Restrict the search to a specific country
     * @value `{[key: string]: string}`
     * @see [componentRestrictions](https://developers.google.com/maps/documentation/javascript/places-autocomplete#restrict-the-search-to-a-specific-country)
     */
    componentRestrictions: {
      type: Object,
      default: undefined,
    },
    /**
     * Map types this is an array of strings
     * @value string[]
     * @see [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object)
     */
    types: {
      type: Array,
      default: undefined,
    },
    /**
     * Select the first result in the list when press enter keyboard
     * @values true, false
     */
    selectFirstOnEnter: {
      required: false,
      type: Boolean,
      default: false,
    },
    /**
     * the unique ref set to the component passed in the slot input
     */
    slotRefName: {
      required: false,
      type: String,
      default: 'input',
    },
    /**
     * The name of the ref to obtain the html input element
     * if its a child  of component in the slot input
     * very useful whe we use a component like v-text-field of vuetify
     * that has a 'input' ref pointing to the final html input element
     */
    childRefName: {
      required: false,
      type: String,
      default: 'input',
    },
    /**
     * Other options that you can pass to the Google Mapas
     * Autocomplete API
     * @values geocode, address, regions
     * @see [Options](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete)
     */
    options: {
      type: Object,
      default: undefined,
    },
    /**
     * To avoid paying for data that you don't need,
     * be sure to use Autocomplete.setFields() to specify
     * only the place data that you will use.
     *
     * @see [Place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
     * @see [setFields](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)
     * @see [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)
     */
    setFieldsTo: {
      required: false,
      type: Array,
      default: null,
    },
  },
  watch: {
    /**
     * This watcher is incharge to update
     * the component restrictions when is
     * changed from the parent
     */
    componentRestrictions(v) {
      if (v !== undefined) {
        this.$autocomplete.setComponentRestrictions(v);
      }
    },
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();

    let scopedInput = null;

    if (this.$scopedSlots.default) {
      if (!Object.keys(this.$scopedSlots.default()[0].context.$refs).length) {
        throw new Error(
          'If you use the slot input you must add a ref to the element that you will use as the input, and if you use a vue component, eg: v-text-field, etc, you need to set the childRefName indicating what is the ref name of the html input elemnt behind your component.'
        );
      }

      scopedInput =
        this.$scopedSlots.default()[0].context.$refs[this.slotRefName];

      if (scopedInput && scopedInput.$refs) {
        scopedInput = scopedInput.$refs[this.childRefName];
      }

      if (scopedInput) {
        this.$refs.input = scopedInput;
      }
    }

    if (this.selectFirstOnEnter) {
      downArrowSimulator(this.$refs.input);
    }

    if (typeof google.maps.places.Autocomplete !== 'function') {
      throw new Error(
        "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?"
      );
    }

    const autocompleteOptions = {
      ...getPropsValues(this, autocompleteMappedProps),
      ...this.options,
    };

    this.$autocomplete = new google.maps.places.Autocomplete(
      this.$refs.input,
      autocompleteOptions
    );

    bindProps(this, this.$autocomplete, autocompleteMappedProps);

    if (this.setFieldsTo) {
      this.$autocomplete.setFields(this.setFieldsTo);
    }

    // Not using `bindEvents` because we also want
    // to return the result of `getPlace()`
    this.$autocomplete.addListener('place_changed', () => {
      /**
       * Place change event
       * @event place_changed
       * @property {object} place `this.$autocomplete.getPlace()`
       * @see [Get place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
       */
      this.$emit('place_changed', this.$autocomplete.getPlace());
    });
  },
  destroyed() {
    // Note: not all Google Maps components support maps
    if (this.$$autocomplete && this.$$autocomplete.setMap) {
      this.$$autocomplete.setMap(null);
    }
  },
};
</script>
