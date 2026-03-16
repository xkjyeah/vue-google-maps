---
title: autocomplete-input
---

  # GmapAutocomplete

  
  > Autocomplete component
  
  
  
  
  
  [See]([source code](/guide/autocomplete.html#source-code))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | bounds | Map bounds this is an LatLngBounds<br/>object builded with<br/>`@value` new google.maps.LatLngBounds(...)<br/>`@see` [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object) | object | - | undefined |
| componentRestrictions | Restrict the search to a specific country<br/>`@value` `{[key: string]: string}`<br/>`@see` [componentRestrictions](https://developers.google.com/maps/documentation/javascript/places-autocomplete#restrict-the-search-to-a-specific-country) | object | - | undefined |
| types | Map types this is an array of strings<br/>`@value` string[]<br/>`@see` [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object) | array | - | undefined |
| selectFirstOnEnter | Select the first result in the list when press enter keyboard | boolean | `true`, `false` | false |
| slotRefName | the unique ref set to the component passed in the slot input | string | - | 'input' |
| childRefName | The name of the ref to obtain the html input element<br/>if its a child  of component in the slot input<br/>very useful whe we use a component like v-text-field of vuetify<br/>that has a 'input' ref pointing to the final html input element | string | - | 'input' |
| options | Other options that you can pass to the Google Mapas<br/>Autocomplete API<br/>`@see` [Options](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add-autocomplete) | object | `geocode`, `address`, `regions` | undefined |
| setFieldsTo | To avoid paying for data that you don't need,<br/>be sure to use Autocomplete.setFields() to specify<br/>only the place data that you will use.<br/>`@see` [Place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)<br/>`@see` [setFields](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)<br/>`@see` [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult) | array | - | null |

  
  
  
## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  | place_changed | **place** `object` - `this.$autocomplete.getPlace()` | Place change event

  
  
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  | default | Used to set your custom component for the input, eg: v-text-field.<br> | <br/> |

  ---


  
  