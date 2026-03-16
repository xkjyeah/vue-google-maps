---
title: place-input
---

---
title: PlaceInput
---

  # ~~PlaceInput~~

  > **Deprecated** true

  > PlaceInput component
  
  
  
  
  
  [See]([source code](/guide/place-input.html#source-code))
,[See]([Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | bounds | Map bounds this is an LatLngBounds<br/>object builded with<br/>`@value` new google.maps.LatLngBounds(...)<br/>`@see` [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object) | object | - | undefined |
| defaultPlace | A default value for the html input<br/>`@value` string | string | - | '' |
| componentRestrictions | Restrict the search to a specific country<br/>`@value` `{[key: string]: string}`<br/>`@see` [componentRestrictions](https://developers.google.com/maps/documentation/javascript/places-autocomplete#restrict-the-search-to-a-specific-country) | object | - | null |
| types | Map types this is an array of strings<br/>`@value` string[]<br/>`@see` [Map Bounds](https://developers.google.com/maps/documentation/javascript/places-autocomplete#set-the-bounds-on-creation-of-the-autocomplete-object) | array | - | undefined |
| placeholder | A placeholder for the html input<br/>`@value` string | string | - | undefined |
| className | A html class name for the html input<br/>`@value` string | string | - | undefined |
| label | A label for the html input<br/>`@value` string | string | - | null |
| selectFirstOnEnter | If true the first element on the list will be selected<br/>when you press enter in the html input.<br/>`@value` boolean | boolean | - | false |

  
  
  
## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  | place_changed | **place** `object` - `this.$autocomplete.getPlace()` | Place change event

  
  
  ---


  
  