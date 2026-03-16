---
id: autocomplete
sidebar_position: 1
sidebar_label: Autocomplete
---

# Autocomplete

This component helps you to find and select a place on Google Maps API. For more information read the Google Maps documentation for [autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete).

It is exported with the name `Autocomplete`, it is registered as `GmvAutocomplete`.

## Autocomplete instance

This component save the original autocomplete object provided by Google Maps in a property called `autoCompleteInstance`, as the example below.

```ts showLineNumbers
// ...
const { Autocomplete } = (await google.maps.importLibrary(
  'places',
)) as google.maps.PlacesLibrary;

if (typeof Autocomplete !== 'function') {
  throw new Error(
    "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?",
  );
}

const autocomplete = new Autocomplete(scopedInput, autocompleteOptions);
// ...
```

## Source code

You can see the source code on:

- [GitHub](https://github.com/diegoazh/gmap-vue/blob/2c697bb5ae78e5519d95f4873f1ab373e3d25ff9/packages/v3/src/components/autocomplete-input.vue)
- [Here in docs](/docs/vue-3-version/api/components/autocomplete#source-code)

## How to use it

```html showLineNumbers
<template>
  <!-- you can use the auto close form if you don't use the slot -->
  <gmv-autocomplete />
  <!-- <gmv-autocomplete></gmv-autocomplete> -->

  <gmv-map :center="center" :zoom="7" style="width: 100%; height: 500px">
  </gmv-map>
</template>
```

```html showLineNumbers
<template>
  <!-- or use it with a slot -->
  <GmvAutocomplete></GmvAutocomplete>
  <!-- <GmvAutocomplete /> -->

  <gmv-map :center="center" :zoom="7" style="width: 100%; height: 500px">
  </gmv-map>
</template>
```

## Customizing your text field

:::tip
The autocomplete supports custom text field via scoped slot

```html showLineNumbers
<gmv-autocomplete class="introInput">
  <template v-slot:default="slotProps">
    <v-text-field
      outlined
      prepend-inner-icon="place"
      placeholder="Location Of Event"
      ref="input"
      v-bind:attrs="slotProps.attrs"
    >
    </v-text-field>
  </template>
</gmv-autocomplete>
```

The ref on the element must be unique. If you create more than one autocomplete, each one should have a unique ref and it must be mentioned in the slot-ref-name prop. Like this:

```html showLineNumbers
<gmv-autocomplete class="introInput">
  <template v-slot:default="slotProps">
    <v-text-field
      outlined
      prepend-inner-icon="place"
      placeholder="Location Of Event"
      ref="input"
      v-bind:attrs="slotProps.attrs"
    >
    </v-text-field>
  </template>
</gmv-autocomplete>
<gmv-autocomplete class="introInput" slot-ref-name="input2">
  <template v-slot:default="slotProps">
    <v-text-field
      outlined
      prepend-inner-icon="place"
      placeholder="Location Of Event"
      ref="input2"
      v-bind:attrs="slotProps.attrs"
    >
    </v-text-field>
  </template>
</gmv-autocomplete>
```

If the element in the slot is a vue component then it must have a child ref called input (like in vuetify text-field) or specify a custom name via the child-ref-name prop (only works one level deep into a component).

The v-bind:attrs is required.
:::
