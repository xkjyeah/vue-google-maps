---
title: promise-lazy
---

# promise-lazy

## Functions

<dl>
<dt><a href="#createCallbackAndChecksIfMapIsLoaded">createCallbackAndChecksIfMapIsLoaded(resolveFn, customCallback)</a></dt>
<dd><p>This function allow to auto detect an external load of the Google Maps API
or load it dynamically from our component.</p>
</dd>
<dt><a href="#getPromiseLazyCreatorFn">getPromiseLazyCreatorFn(googleMapsApiInitializer, GoogleMapsApi)</a> ⇒ <code>function</code></dt>
<dd><p>This function is a factory of the promise lazy creator
it helps you creating the function that will call the
Google Maps API in an async way</p>
</dd>
</dl>

<a name="createCallbackAndChecksIfMapIsLoaded"></a>

## createCallbackAndChecksIfMapIsLoaded(resolveFn, customCallback)
This function allow to auto detect an external load of the Google Maps API
or load it dynamically from our component.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resolveFn | <code>function</code> | the function that indicates to the plugin that Google Maps is loaded |
| customCallback | <code>function</code> | the custom callback to execute when the plugin load. This option will be removed on the next major release |

<a name="getPromiseLazyCreatorFn"></a>

## getPromiseLazyCreatorFn(googleMapsApiInitializer, GoogleMapsApi) ⇒ <code>function</code>
This function is a factory of the promise lazy creator
it helps you creating the function that will call the
Google Maps API in an async way

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| googleMapsApiInitializer | <code>function</code> | function that initialize the Google Maps API |
| GoogleMapsApi | <code>Object</code> | Vue instance that will help to know if the google API object is ready |


* [getPromiseLazyCreatorFn(googleMapsApiInitializer, GoogleMapsApi)](#getPromiseLazyCreatorFn) ⇒ <code>function</code>
    * [~promiseLazyCreator(options)](#getPromiseLazyCreatorFn..promiseLazyCreator)
        * [~onMapsReady()](#getPromiseLazyCreatorFn..promiseLazyCreator..onMapsReady) ⇒ <code>Object</code>

<a name="getPromiseLazyCreatorFn..promiseLazyCreator"></a>

### getPromiseLazyCreatorFn~promiseLazyCreator(options)
The creator of the lazy promise

**Kind**: inner method of [<code>getPromiseLazyCreatorFn</code>](#getPromiseLazyCreatorFn)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> \| <code>undefined</code> |  | configuration object to initialize the GmapVue plugin |
| options.dynamicLoad | <code>boolean</code> | <code>false</code> | load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API |
| options.installComponents | <code>boolean</code> | <code>true</code> | install all components |
| options.autoBindAllEvents | <code>boolean</code> | <code>false</code> | auto bind all Google Maps API events |
| options.load | <code>Object</code> \| <code>undefined</code> |  | options to configure the Google Maps API |
| options.load.key | <code>string</code> |  | your Google Maps API key |
| options.load.libraries | <code>string</code> | <code>&quot;places&quot;</code> | the Google Maps libraries that you will use eg: 'places,drawing,visualization' |
| options.load.v | <code>string</code> \| <code>undefined</code> |  | the Google Maps API version, default latest |
| options.load.callback | <code>string</code> \| <code>undefined</code> | <code>&quot;GoogleMapsCallback&quot;</code> | This must be ignored if have another callback that you need to run when Google Maps API is ready please use the `customCallback` option. |
| options.load.customCallback | <code>string</code> \| <code>undefined</code> |  | This option was added on v3.0.0 but will be removed in the next major release. If you already have an script tag that loads Google Maps API and you want to use it set you callback in the `customCallback` option and our `GoogleMapsCallback` callback will execute your custom callback at the end; it must attached to the `window` object, is the only requirement. |

<a name="getPromiseLazyCreatorFn..promiseLazyCreator..onMapsReady"></a>

#### promiseLazyCreator~onMapsReady() ⇒ <code>Object</code>
Things to do once the API is loaded

**Kind**: inner method of [<code>promiseLazyCreator</code>](#getPromiseLazyCreatorFn..promiseLazyCreator)  
**Returns**: <code>Object</code> - the Google Maps API object  
