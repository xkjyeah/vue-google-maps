---
title: google-maps-api-initializer
---

# google-maps-api-initializer

<a name="createGoogleMapsAPIInitializer"></a>

## createGoogleMapsAPIInitializer() ⇒ <code>function</code>
This function returns the initializer function, it is exported
in that way because we need to generate a closure to define a
private property called `isApiSetUp` to detect if the Google Maps
API was initializer in a previous execution.
The function that it exports is the function that we use inside
of promise-lazy file to initialize the Google Maps API if
it is required.

**Kind**: global function  
**Returns**: <code>function</code> - The initializer function  
<a name="createGoogleMapsAPIInitializer..googleMapsAPIInitializer"></a>

### createGoogleMapsAPIInitializer~googleMapsAPIInitializer(options, loadCn)
The initializer function, it adds into the head of the page the Google Maps API script tag to loads the library

**Kind**: inner method of [<code>createGoogleMapsAPIInitializer</code>](#createGoogleMapsAPIInitializer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> \| <code>undefined</code> |  | The configuration Object. (@see https://developers.google.com/maps/documentation/javascript/url-params)                         `libraries`. |
| options.key | <code>string</code> |  | Your Google Maps API key |
| options.libraries | <code>string</code> | <code>&quot;places&quot;</code> | The Google Maps libraries that you will use eg: 'places,drawing,visualization', can be given as an array too (@see https://developers.google.com/maps/documentation/javascript/libraries) |
| options.v | <code>string</code> \| <code>undefined</code> |  | The Google Maps API version, default latest |
| options.callback | <code>string</code> \| <code>undefined</code> | <code>&quot;GoogleMapsCallback&quot;</code> | This must be ignored if have another callback that you need to run when Google Maps API is ready please use the `customCallback` option. |
| options.customCallback | <code>string</code> \| <code>undefined</code> |  | This option was added on v3.0.0 but will be removed in the next major release. If you already have an script tag that loads Google Maps API and you want to use it set you callback in the `customCallback` option and our `GoogleMapsCallback` callback will execute your custom callback at the end; it must attached to the `window` object, is the only requirement. |
| loadCn | <code>boolean</code> | <code>false</code> | Boolean. If set to true, the map will be loaded from google maps China                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina) |

