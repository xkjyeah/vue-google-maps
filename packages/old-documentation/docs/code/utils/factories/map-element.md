---
title: map-element
---

# map-element

## Functions

<dl>
<dt><a href="#_assert">_assert(v, message)</a></dt>
<dd><p>Custom assert for local validation</p>
</dd>
<dt><a href="#mapElement">mapElement(options)</a> ⇒ <code>Object</code></dt>
<dd><p>A helper to build your own component for the plugin</p>
</dd>
</dl>

<a name="_assert"></a>

## \_assert(v, message)
Custom assert for local validation

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>boolean</code> | The expression that should return a boolean value, if false the assertion fails |
| message | <code>string</code> | Error message to be displayed |

<a name="mapElement"></a>

## mapElement(options) ⇒ <code>Object</code>
A helper to build your own component for the plugin

**Kind**: global function  
**Returns**: <code>Object</code> - A component object that should be exported by default from a Vue component  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.mappedProps | <code>Object</code> | Definitions of props |
| options.mappedProps.PROP.type | <code>Object</code> | Value type |
| options.mappedProps.PROP.twoWay | <code>Boolean</code> | - Whether the prop has a corresponding PROP_changed   event |
| options.mappedProps.PROP.noBind | <code>Boolean</code> | - If true, do not apply the default bindProps / bindEvents. However it will still be added to the list of component props |
| options.props | <code>Object</code> | Regular Vue-style props.  Note: must be in the Object form because it will be  merged with the `mappedProps` |
| options.events | <code>Object</code> | Google Maps API events  that are not bound to a corresponding prop |
| options.name | <code>String</code> | e.g. `polyline` |
| options.ctr | <code>function</code> | constructor, e.g.  `google.maps.Polyline`. However, since this is not  generally available during library load, this becomes  a function instead, e.g. () => google.maps.Polyline  which will be called only after the API has been loaded  default: () => String |
| options.ctrArgs | <code>function</code> | If the constructor in `ctr` needs to be called with   arguments other than a single `options` object, e.g. for   GroundOverlay, we call `new GroundOverlay(url, bounds, options)`   then pass in a function that returns the argument list as an array   default: (MappedProps, OtherVueProps) => Array Otherwise, the constructor will be called with an `options` object,   with property and values merged from:   1. the `options` property, if any   2. a `map` property with the Google Maps   3. all the properties passed to the component in `mappedProps` |
| options.beforeCreate | <code>function</code> | Hook to modify the options passed to the initializer  default: (Object) => Any |
| options.afterCreate | <code>function</code> | Hook called when  default: (options.ctr, Object) => Any |

