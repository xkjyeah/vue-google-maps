---
title: helpers
---

# helpers

## Functions

<dl>
<dt><a href="#bindEvents">bindEvents(vueInst, googleMapsInst, events)</a> ⇒ <code>void</code></dt>
<dd><p>This function helps you to bind events from Google Maps API to Vue events</p></dd>
<dt><a href="#capitalizeFirstLetter">capitalizeFirstLetter(text)</a> ⇒ <code>string</code></dt>
<dd><p>Function that helps you to capitalize the first letter on a word</p></dd>
<dt><a href="#getPropsValues">getPropsValues(vueInst, props)</a> ⇒ <code>Object</code></dt>
<dd><p>Function that helps you to get all non nullable props from a component</p></dd>
<dt><a href="#getLazyValue">getLazyValue(fn)</a> ⇒ <code>function</code></dt>
<dd><p>This function is a helper for return to the user the internal Google Maps promise
and can wait until it is ready.
This piece of code was orignally written by sindresorhus and can be seen here</p></dd>
<dt><a href="#mappedPropsToVueProps">mappedPropsToVueProps(mappedProps)</a> ⇒ <code>Object</code></dt>
<dd><p>Strips out the extraneous properties we have in our
mapped props definitions</p></dd>
<dt><a href="#downArrowSimulator">downArrowSimulator(input)</a> ⇒ <code>void</code></dt>
<dd><p>This function simulates a down arrow key event when user
hits return (enter) on the autocomplete component selection
the first occurrence in the list.</p>
<p>This piece of code was orignally written by amirnissim
and has been ported to Vanilla.js by GuillaumeLeclerc</p></dd>
<dt><a href="#twoWayBindingWrapper">twoWayBindingWrapper(fn)</a></dt>
<dd><p>When you have two-way bindings, but the actual bound value will not equal
the value you initially passed in, then to avoid an infinite loop you
need to increment a counter every time you pass in a value, decrement the
same counter every time the bound value changed, but only bubble up
the event when the counter is zero.</p></dd>
<dt><a href="#watchPrimitiveProperties">watchPrimitiveProperties(vueInst, propertiesToTrack, handler, immediate)</a> ⇒ <code>void</code></dt>
<dd><p>Watch the individual properties of a PoD object, instead of the object
per se. This is different from a deep watch where both the reference
and the individual values are watched.</p>
<p>In effect, it throttles the multiple $watch to execute at most once per tick.</p></dd>
<dt><a href="#bindProps">bindProps(vueInst, googleMapsInst, props)</a> ⇒ <code>void</code></dt>
<dd><p>Binds the properties defined in props to the google maps instance.
If the prop is an Object type, and we wish to track the properties
of the object (e.g. the lat and lng of a LatLng), then we do a deep
watch. For deep watch, we also prevent the _changed event from being
emitted if the data source was external.</p></dd>
</dl>

<a name="bindEvents"></a>

## bindEvents(vueInst, googleMapsInst, events) ⇒ <code>void</code>

This function helps you to bind events from Google Maps API to Vue events

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vueInst | <code>Object</code> | the Vue instance |
| googleMapsInst | <code>Object</code> | the Google Maps instance |
| events | <code>Array.&lt;string&gt;</code> | an array of string with all events that you want to bind |

<a name="capitalizeFirstLetter"></a>

## capitalizeFirstLetter(text) ⇒ <code>string</code>

Function that helps you to capitalize the first letter on a word

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the text that you want to capitalize |

<a name="getPropsValues"></a>

## getPropsValues(vueInst, props) ⇒ <code>Object</code>

Function that helps you to get all non nullable props from a component

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vueInst | <code>Object</code> | the Vue component instance |
| props | <code>Object</code> | the props object |

<a name="getLazyValue"></a>

## getLazyValue(fn) ⇒ <code>function</code>

This function is a helper for return to the user the internal Google Maps promise
and can wait until it is ready.
This piece of code was orignally written by sindresorhus and can be seen here

**Kind**: global function  
**Returns**: <code>function</code> - anonymous function that returns the value returned by the fn parameter  
**See**: `[https://github.com/sindresorhus/lazy-value/blob/master/index.js](https://github.com/sindresorhus/lazy-value/blob/master/index.js)`  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | a function that actually return the promise or async value |

<a name="mappedPropsToVueProps"></a>

## mappedPropsToVueProps(mappedProps) ⇒ <code>Object</code>

Strips out the extraneous properties we have in our
mapped props definitions

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mappedProps | <code>Object</code> | the mapped props object |

<a name="downArrowSimulator"></a>

## downArrowSimulator(input) ⇒ <code>void</code>

This function simulates a down arrow key event when user
hits return (enter) on the autocomplete component selection
the first occurrence in the list.

This piece of code was orignally written by amirnissim
and has been ported to Vanilla.js by GuillaumeLeclerc

**Kind**: global function  
**See**: `[http://stackoverflow.com/a/11703018/2694653](http://stackoverflow.com/a/11703018/2694653)`  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Object</code> | the HTML input node element reference |

<a name="downArrowSimulator..addEventListenerWrapper"></a>

### downArrowSimulator~addEventListenerWrapper(type, listener) ⇒ <code>void</code>

Add event listener wrapper that will replace to default addEventListener or attachEvent function

**Kind**: inner method of [<code>downArrowSimulator</code>](#downArrowSimulator)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the event type |
| listener | <code>function</code> | function should be executed when the event is fired |

<a name="twoWayBindingWrapper"></a>

## twoWayBindingWrapper(fn)

When you have two-way bindings, but the actual bound value will not equal
the value you initially passed in, then to avoid an infinite loop you
need to increment a counter every time you pass in a value, decrement the
same counter every time the bound value changed, but only bubble up
the event when the counter is zero.

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to be executed to determine if the event was executed     Example:     Let's say DrawingRecognitionCanvas is a deep-learning backed canvas     that, when given the name of an object (e.g. 'dog'), draws a dog.     But whenever the drawing on it changes, it also sends back its interpretation     of the image by way of the @newObjectRecognized event.     `<input       type="text"       placeholder="an object, e.g. Dog, Cat, Frog"       v-model="identifiedObject" />     <DrawingRecognitionCanvas       :object="identifiedObject"` |

**Kind**: global function 

**Example**:

Let's say DrawingRecognitionCanvas is a deep-learning backed canvas
    that, when given the name of an object (e.g. 'dog'), draws a dog.
    But whenever the drawing on it changes, it also sends back its interpretation
    of the image by way of the @newObjectRecognized event.

```html
<input
      type="text"
      placeholder="an object, e.g. Dog, Cat, Frog"
      v-model="identifiedObject" />
    <DrawingRecognitionCanvas
      :object="identifiedObject"
      @newObjectRecognized="identifiedObject = $event"
      />
```

```js
    new TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
      this.$watch('identifiedObject', () => {
        // new object passed in
        increment()
      })
      this.$deepLearningBackend.on('drawingChanged', () => {
        recognizeObject(this.$deepLearningBackend)
          .then((object) => {
            decrement()
            if (shouldUpdate()) {
              this.$emit('newObjectRecognized', object.name)
            }
          })
      })
    })
``` 

<a name="watchPrimitiveProperties"></a>

## watchPrimitiveProperties(vueInst, propertiesToTrack, handler, immediate) ⇒ <code>void</code>

Watch the individual properties of a PoD object, instead of the object
per se. This is different from a deep watch where both the reference
and the individual values are watched.

In effect, it throttles the multiple $watch to execute at most once per tick.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vueInst | <code>Object</code> |  | the component instance |
| propertiesToTrack | <code>Array.&lt;string&gt;</code> |  | string array with all properties that you want to track |
| handler | <code>function</code> |  | function to be fired when the prop change |
| immediate | <code>boolean</code> | <code>false</code> |  |

<a name="watchPrimitiveProperties..requestHandle"></a>

### watchPrimitiveProperties~requestHandle() ⇒

Function in charge to execute the handler function if it was not fired

**Kind**: inner method of [<code>watchPrimitiveProperties</code>](#watchPrimitiveProperties)  
**Returns**: void  
<a name="bindProps"></a>

## bindProps(vueInst, googleMapsInst, props) ⇒ <code>void</code>

Binds the properties defined in props to the google maps instance.
If the prop is an Object type, and we wish to track the properties
of the object (e.g. the lat and lng of a LatLng), then we do a deep
watch. For deep watch, we also prevent the _changed event from being
emitted if the data source was external.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vueInst | <code>Object</code> | the component instance |
| googleMapsInst | <code>Object</code> | the Google Maps instance |
| props | <code>Object</code> | object with the component props tha should be synched with the Google Maps instances props |
