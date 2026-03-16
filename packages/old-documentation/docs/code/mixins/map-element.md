---
title: map-element
---

# map-element

<a name="mapElementMixin"></a>

## mapElementMixin
MapElementMixin

Add a inject object to inject $mapPromise and a provide function to the
component this function save the returned Google Maps object in the $map
property after the $mapPromise is resolved.

## The mixin code:
```js
  export default {
    inject: {
      $mapPromise: { default: 'abcdef' },
    },
    provide() {
      this.$mapPromise.then((map) => {
        this.$map = map;
      });

      return {};
    },
  };
```

**Kind**: global class  
**Properties**

| Name | Description |
| --- | --- |
| $mapPromise | The map property that should return the `$map`.<br>           **Note**: although this mixin is not "providing" anything,           components' expect the `$map` property to be present on the component.           In order for that to happen, this mixin must intercept the `$mapPromise           .then(() => )` first before its component does so.           Since a `provide()` on a mixin is executed before a `provide()` on the           component, putting this code in `provide()` ensures that the `$map` is           already set by the time the component's `provide()` is called. |
| $map | The Google map (valid only after the promise (`$mapPromise`) returns) |

