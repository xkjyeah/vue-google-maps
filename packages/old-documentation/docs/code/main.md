---
title: main
---

# main

## Members

<dl>
<dt><a href="#GoogleMapsApi">GoogleMapsApi</a> : <code>Object</code> | <code>undefined</code></dt>
<dd><p>An independent Vue instance that helps us to know when the Google Maps API is loaded.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#components">components</a> : <code>Object</code></dt>
<dd><p>Export all components and mixins</p>
</dd>
<dt><a href="#helpers">helpers</a> : <code>Object</code></dt>
<dd><p>Export all helpers</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getGoogleMapsAPI">getGoogleMapsAPI()</a></dt>
<dd><p>This function helps you to get the Google Maps API
when its ready on the window object</p>
</dd>
<dt><a href="#gmapVuePluginInstallFn">gmapVuePluginInstallFn(Vue, options)</a></dt>
<dd><p>GmapVue install function</p>
</dd>
</dl>

<a name="GoogleMapsApi"></a>

## GoogleMapsApi : <code>Object</code> \| <code>undefined</code>
An independent Vue instance that helps us to know when the Google Maps API is loaded.

**Kind**: global variable  
<a name="components"></a>

## components : <code>Object</code>
Export all components and mixins

**Kind**: global constant  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| HeatmapLayer | <code>Object</code> | Vue component HeatmapLayer |
| KmlLayer | <code>Object</code> | Vue component KmlLayer |
| Marker | <code>Object</code> | Vue component Marker |
| Polyline | <code>Object</code> | Vue component Polyline |
| Polygon | <code>Object</code> | Vue component Polygon |
| Circle | <code>Object</code> | Vue component Circle |
| Cluster | <code>Object</code> | Vue component Cluster |
| Rectangle | <code>Object</code> | Vue component Rectangle |
| DrawingManager | <code>Object</code> | Vue component DrawingManager |
| InfoWindow | <code>Object</code> | Vue component InfoWindow |
| MapLayer | <code>Object</code> | Vue component MapLayer |
| PlaceInput | <code>Object</code> | Vue component PlaceInput |
| Autocomplete | <code>Object</code> | Vue component Autocomplete |
| StreetViewPanorama | <code>Object</code> | Vue component StreetViewPanorama |
| MapElementMixin | <code>Object</code> | Vue component MapElementMixin |
| MountableMixin | <code>Object</code> | Vue component MountableMixin |

<a name="helpers"></a>

## helpers : <code>Object</code>
Export all helpers

**Kind**: global constant  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initGoogleMapsApi | <code>function</code> | function to initialize the Google Maps API |
| MapElementFactory | <code>function</code> | function to initialize the Google Maps API |

<a name="getGoogleMapsAPI"></a>

## getGoogleMapsAPI()
This function helps you to get the Google Maps API
when its ready on the window object

**Kind**: global function  
<a name="gmapVuePluginInstallFn"></a>

## gmapVuePluginInstallFn(Vue, options)
GmapVue install function

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| Vue | <code>Object</code> |  | the vue instance |
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


* [gmapVuePluginInstallFn(Vue, options)](#gmapVuePluginInstallFn)
    * [~GoogleMapsApi](#gmapVuePluginInstallFn..GoogleMapsApi)
    * [~promiseLazyCreator](#gmapVuePluginInstallFn..promiseLazyCreator) : <code>function</code>
    * [~gmapApiPromiseLazy](#gmapVuePluginInstallFn..gmapApiPromiseLazy) : <code>function</code>

<a name="gmapVuePluginInstallFn..GoogleMapsApi"></a>

### gmapVuePluginInstallFn~GoogleMapsApi
Update the global `GoogleMapsApi`. This will allow
components to use the `google` global reactively
via:
  import { getGoogleMapsAPI } from 'gmap-vue'
  export default {  computed: { google: getGoogleMapsAPI }  }

**Kind**: inner property of [<code>gmapVuePluginInstallFn</code>](#gmapVuePluginInstallFn)  
<a name="gmapVuePluginInstallFn..promiseLazyCreator"></a>

### gmapVuePluginInstallFn~promiseLazyCreator : <code>function</code>
Use a lazy to only load the API when
a GMap component is loaded

**Kind**: inner constant of [<code>gmapVuePluginInstallFn</code>](#gmapVuePluginInstallFn)  
<a name="gmapVuePluginInstallFn..gmapApiPromiseLazy"></a>

### gmapVuePluginInstallFn~gmapApiPromiseLazy : <code>function</code>
The gmapApiPromiseLazy function to can wait until Google Maps API is ready

**Kind**: inner constant of [<code>gmapVuePluginInstallFn</code>](#gmapVuePluginInstallFn)  
