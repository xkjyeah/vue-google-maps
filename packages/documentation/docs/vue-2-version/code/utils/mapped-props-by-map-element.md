---
title: mapped-props-by-map-element
---

# mapped-props-by-map-element

<a name="autocompleteMappedProps"></a>

## autocompleteMappedProps
This are GoogleMapsOptions that we want to have like
props in our Vue component.
This properties are in the way that GoogleMaps accept it
and with extraneous properties for the VueJs API.
In a previous version of this plugin, to avoid repetition,
we created a .js file component with a `mappedProps` key on it
and used a variety of helper functions to clean it and bind it
to Vue props and watch them, etc.
To day our primary main goal is get a more intuitive and descriptive
API and a better documentation of it, following this goals we move
this extraneous properties to an independent file in order to consume
it when is needed.
Please you need to remind that you need to create properties in the
correspondent Vue component with the same names and the same values
for those properties that are not extraneous to Vue.

**Kind**: global constant  
