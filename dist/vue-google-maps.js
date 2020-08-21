(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("MarkerClusterer"));
	else if(typeof define === 'function' && define.amd)
		define(["MarkerClusterer"], factory);
	else if(typeof exports === 'object')
		exports["VueGoogleMaps"] = factory(require("MarkerClusterer"));
	else
		root["VueGoogleMaps"] = factory(root["MarkerClusterer"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__25__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _utils_bind_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _utils_bind_props__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _mixins_map_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);





/**
 *
 * @param {Object} options
 * @param {Object} options.mappedProps - Definitions of props
 * @param {Object} options.mappedProps.PROP.type - Value type
 * @param {Boolean} options.mappedProps.PROP.twoWay
 *  - Whether the prop has a corresponding PROP_changed
 *   event
 * @param {Boolean} options.mappedProps.PROP.noBind
 *  - If true, do not apply the default bindProps / bindEvents.
 * However it will still be added to the list of component props
 * @param {Object} options.props - Regular Vue-style props.
 *  Note: must be in the Object form because it will be
 *  merged with the `mappedProps`
 *
 * @param {Object} options.events - Google Maps API events
 *  that are not bound to a corresponding prop
 * @param {String} options.name - e.g. `polyline`
 * @param {=> String} options.ctr - constructor, e.g.
 *  `google.maps.Polyline`. However, since this is not
 *  generally available during library load, this becomes
 *  a function instead, e.g. () => google.maps.Polyline
 *  which will be called only after the API has been loaded
 * @param {(MappedProps, OtherVueProps) => Array} options.ctrArgs -
 *   If the constructor in `ctr` needs to be called with
 *   arguments other than a single `options` object, e.g. for
 *   GroundOverlay, we call `new GroundOverlay(url, bounds, options)`
 *   then pass in a function that returns the argument list as an array
 *
 * Otherwise, the constructor will be called with an `options` object,
 *   with property and values merged from:
 *
 *   1. the `options` property, if any
 *   2. a `map` property with the Google Maps
 *   3. all the properties passed to the component in `mappedProps`
 * @param {Object => Any} options.beforeCreate -
 *  Hook to modify the options passed to the initializer
 * @param {(options.ctr, Object) => Any} options.afterCreate -
 *  Hook called when
 *
 */

/**
 * Custom assert for local validation
 **/
function _assert (v, message) {
  if (!v) throw new Error(message)
}

/* harmony default export */ __webpack_exports__["a"] = (function (options) {
  const {
    mappedProps,
    name,
    ctr,
    ctrArgs,
    events,
    beforeCreate,
    afterCreate,
    props,
    ...rest
  } = options

  const promiseName = `$${name}Promise`
  const instanceName = `$${name}Object`

  _assert(!(rest.props instanceof Array), '`props` should be an object, not Array')

  return {
    ...(typeof GENERATE_DOC !== 'undefined' ? { $vgmOptions: options } : {}),
    mixins: [_mixins_map_element__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]],
    props: {
      ...props,
      ...Object(_utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(mappedProps)
    },
    render () { return '' },
    provide () {
      const promise = this.$mapPromise.then((map) => {
        // Infowindow needs this to be immediately available
        this.$map = map

        // Initialize the maps with the given options
        const initialOptions = {
          ...this.options,
          map,
          ...Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* getPropsValues */ "b"])(this, mappedProps)
        }
        // don't use delete keyword in order to create a more predictable code for the engine
        let { options, ...finalOptions } = initialOptions // delete the extra options
        options = finalOptions

        if (beforeCreate) {
          const result = beforeCreate.bind(this)(options)

          if (result instanceof Promise) {
            return result.then(() => ({ options }))
          }
        }
        return { options }
      }).then(({ options }) => {
        const ConstructorObject = ctr()
        // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        this[instanceName] = ctrArgs
          ? new (Function.prototype.bind.call(
            ConstructorObject,
            null,
            ...ctrArgs(options, Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* getPropsValues */ "b"])(this, props || {}))
          ))()
          : new ConstructorObject(options)

        Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* bindProps */ "a"])(this, this[instanceName], mappedProps)
        Object(_utils_bind_events__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(this, this[instanceName], events)

        if (afterCreate) {
          afterCreate.bind(this)(this[instanceName])
        }
        return this[instanceName]
      })

      this[promiseName] = promise
      return { [promiseName]: promise }
    },
    destroyed () {
      // Note: not all Google Maps components support maps
      if (this[instanceName] && this[instanceName].setMap) {
        this[instanceName].setMap(null)
      }
    },
    ...rest
  }
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getPropsValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bindProps; });
/* harmony import */ var _watch_primitive_properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);


function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getPropsValues (vueInst, props) {
  return Object.keys(props)
    .reduce(
      (acc, prop) => {
        if (vueInst[prop] !== undefined) {
          acc[prop] = vueInst[prop]
        }
        return acc
      },
      {}
    )
}

/**
  * Binds the properties defined in props to the google maps instance.
  * If the prop is an Object type, and we wish to track the properties
  * of the object (e.g. the lat and lng of a LatLng), then we do a deep
  * watch. For deep watch, we also prevent the _changed event from being
  * emitted if the data source was external.
  */
function bindProps (vueInst, googleMapsInst, props, options) {
  for (const attribute in props) {
    const { twoWay, type, trackProperties, noBind } = props[attribute]

    if (noBind) continue

    const setMethodName = 'set' + capitalizeFirstLetter(attribute)
    const getMethodName = 'get' + capitalizeFirstLetter(attribute)
    const eventName = attribute.toLowerCase() + '_changed'
    const initialValue = vueInst[attribute]

    if (typeof googleMapsInst[setMethodName] === 'undefined') {
      throw new Error(`${setMethodName} is not a method of (the Maps object corresponding to) ${vueInst.$options._componentTag}`)
    }

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    if (type !== Object || !trackProperties) {
      // Track the object deeply
      vueInst.$watch(attribute, () => {
        const attributeValue = vueInst[attribute]

        googleMapsInst[setMethodName](attributeValue)
      }, {
        immediate: typeof initialValue !== 'undefined',
        deep: type === Object
      })
    } else {
      Object(_watch_primitive_properties__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(
        vueInst,
        trackProperties.map(prop => `${attribute}.${prop}`),
        () => {
          googleMapsInst[setMethodName](vueInst[attribute])
        },
        vueInst[attribute] !== undefined
      )
    }

    if (twoWay &&
        (vueInst.$gmapOptions.autobindAllEvents ||
        vueInst.$listeners[eventName])) {
      googleMapsInst.addListener(eventName, (ev) => { // eslint-disable-line no-unused-vars
        vueInst.$emit(eventName, googleMapsInst[getMethodName]())
      })
    }
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Strips out the extraneous properties we have in our
 * props definitions
 * @param {Object} props
 */
/* harmony default export */ __webpack_exports__["a"] = (function (mappedProps) {
  return Object.entries(mappedProps)
    .map(([key, prop]) => {
      const value = {}

      if ('type' in prop) value.type = prop.type
      if ('default' in prop) value.default = prop.default
      if ('required' in prop) value.required = prop.required

      return [key, value]
    })
    .reduce((acc, [key, val]) => {
      acc[key] = val
      return acc
    }, {})
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
Mixin for objects that are mounted by Google Maps
Javascript API.

These are objects that are sensitive to element resize
operations so it exposes a property which accepts a bus

*/

/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['resizeBus'],

  data () {
    return {
      _actualResizeBus: null
    }
  },

  created () {
    if (typeof this.resizeBus === 'undefined') {
      this.$data._actualResizeBus = this.$gmapDefaultResizeBus
    } else {
      this.$data._actualResizeBus = this.resizeBus
    }
  },

  methods: {
    _resizeCallback () {
      this.resize()
    },
    _delayedResizeCallback () {
      this.$nextTick(() => this._resizeCallback())
    }
  },

  watch: {
    resizeBus (newVal, oldVal) { // eslint-disable-line no-unused-vars
      this.$data._actualResizeBus = newVal
    },
    '$data._actualResizeBus' (newVal, oldVal) {
      if (oldVal) {
        oldVal.$off('resize', this._delayedResizeCallback)
      }
      if (newVal) {
        newVal.$on('resize', this._delayedResizeCallback)
      }
    }
  },

  destroyed () {
    if (this.$data._actualResizeBus) {
      this.$data._actualResizeBus.$off('resize', this._delayedResizeCallback)
    }
  }
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((vueInst, googleMapsInst, events) => {
  for (const eventName of events) {
    if (vueInst.$gmapOptions.autobindAllEvents ||
        vueInst.$listeners[eventName]) {
      googleMapsInst.addListener(eventName, (ev) => {
        vueInst.$emit(eventName, ev)
      })
    }
  }
});


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return watchPrimitiveProperties; });
/**
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 */
function watchPrimitiveProperties (vueInst, propertiesToTrack, handler, immediate = false) {
  let isHandled = false

  function requestHandle () {
    if (!isHandled) {
      isHandled = true
      vueInst.$nextTick(() => {
        isHandled = false
        handler()
      })
    }
  }

  for (const prop of propertiesToTrack) {
    vueInst.$watch(prop, requestHandle, { immediate })
  }
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ loaded; });

// CONCATENATED MODULE: ./src/utils/lazy-value.js
// This piece of code was orignally written by sindresorhus and can be seen here
// https://github.com/sindresorhus/lazy-value/blob/master/index.js

/* harmony default export */ var lazy_value = ((fn) => {
  let called = false
  let ret

  return () => {
    if (!called) {
      called = true
      ret = fn()
    }

    return ret
  }
});

// CONCATENATED MODULE: ./src/factories/promise-lazy.js


let resolveLoaded
let rejectLoaded
const loaded = new Promise((resolve, reject) => {
  resolveLoaded = resolve
  rejectLoaded = reject
})

/* harmony default export */ var promise_lazy = __webpack_exports__["a"] = (function (loadGmapApi, GmapApi) {
  return function promiseLazyCreator (options) {
    // Things to do once the API is loaded
    function onApiLoaded () {
      GmapApi.gmapApi = {}
      return window.google
    }

    if (options.load) { // If library should load the API
      return lazy_value(() => { // Load the
        // This will only be evaluated once
        if (typeof window === 'undefined') { // server side -- never resolve this promise
          return new Promise(() => {}).then(onApiLoaded)
        } else {
          return new Promise((resolve, reject) => {
            try {
              window.vueGoogleMapsInit = resolve
              loadGmapApi(options.load, options.loadCn)
            } catch (err) {
              reject(err)
            }
          }).then(onApiLoaded).then(resolveLoaded).catch(rejectLoaded)
        }
      })
    } else { // If library should not handle API, provide
      // end-users with the global `vueGoogleMapsInit: () => undefined`
      // when the Google Maps API has been loaded
      const promise = new Promise((resolve) => {
        if (typeof window === 'undefined') {
          // Do nothing if run from server-side
          return
        }
        window.vueGoogleMapsInit = resolve
      }).then(onApiLoaded).then(resolveLoaded).catch(rejectLoaded)

      return lazy_value(() => promise)
    }
  }
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @class MapElementMixin
 *
 * Extends components to include the following fields:
 *
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
/* harmony default export */ __webpack_exports__["a"] = ({
  inject: {
    $mapPromise: { default: 'abcdef' }
  },

  provide () {
    // Note: although this mixin is not "providing" anything,
    // components' expect the `$map` property to be present on the component.
    // In order for that to happen, this mixin must intercept the $mapPromise
    // .then(() =>) first before its component does so.
    //
    // Since a provide() on a mixin is executed before a provide() on the
    // component, putting this code in provide() ensures that the $map is
    // already set by the time the
    // component's provide() is called.
    this.$mapPromise.then((map) => {
      this.$map = map
    })

    return {}
  }
});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(26);
            var content = __webpack_require__(34);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(26);
            var content = __webpack_require__(37);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return twoWayBindingWrapper; });
/**
 * When you have two-way bindings, but the actual bound value will not equal
 * the value you initially passed in, then to avoid an infinite loop you
 * need to increment a counter every time you pass in a value, decrement the
 * same counter every time the bound value changed, but only bubble up
 * the event when the counter is zero.
 *
Example:

Let's say DrawingRecognitionCanvas is a deep-learning backed canvas
that, when given the name of an object (e.g. 'dog'), draws a dog.
But whenever the drawing on it changes, it also sends back its interpretation
of the image by way of the @newObjectRecognized event.

<input
  type="text"
  placeholder="an object, e.g. Dog, Cat, Frog"
  v-model="identifiedObject" />
<DrawingRecognitionCanvas
  :object="identifiedObject"
  @newObjectRecognized="identifiedObject = $event"
  />

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
 */
function twoWayBindingWrapper (fn) {
  let counter = 0

  fn(
    () => { counter += 1 },
    () => { counter = Math.max(0, counter - 1) },
    () => counter === 0
  )
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This piece of code was orignally written by amirnissim and can be seen here
// http://stackoverflow.com/a/11703018/2694653
// This has been ported to Vanilla.js by GuillaumeLeclerc
/* harmony default export */ __webpack_exports__["a"] = ((input) => {
  var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent

  function addEventListenerWrapper (type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type === 'keydown') {
      var origListener = listener
      listener = function (event) {
        var suggestionSelected = document.getElementsByClassName('pac-item-selected').length > 0
        if (event.which === 13 && !suggestionSelected) {
          var simulatedEvent = document.createEvent('Event')
          simulatedEvent.keyCode = 40
          simulatedEvent.which = 40
          origListener.apply(input, [simulatedEvent])
        }
        origListener.apply(input, [event])
      }
    }
    _addEventListener.apply(input, [type, listener])
  }

  input.addEventListener = addEventListenerWrapper
  input.attachEvent = addEventListenerWrapper
});


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @param apiKey    API Key, or object with the URL parameters. For example
 *                  to use Google Maps Premium API, pass
 *                    `{ client: <YOUR-CLIENT-ID> }`.
 *                  You may pass the libraries and/or version (as `v`) parameter into
 *                  this parameter and skip the next two parameters
 * @param version   Google Maps version
 * @param libraries Libraries to load (@see
 *                  https://developers.google.com/maps/documentation/javascript/libraries)
 * @param loadCn    Boolean. If set to true, the map will be loaded from google maps China
 *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
 *
 * Example:
 * ```
 *      import {load} from 'vue-google-maps'
 *
 *      load(<YOUR-API-KEY>)
 *
 *      load({
 *              key: <YOUR-API-KEY>,
 *      })
 *
 *      load({
 *              client: <YOUR-CLIENT-ID>,
 *              channel: <YOUR CHANNEL>
 *      })
 * ```
 */

/* harmony default export */ __webpack_exports__["a"] = ((() => {
  let isApiSetUp = false

  return (options, loadCn) => {
    if (typeof document === 'undefined') {
      // Do nothing if run from server-side
      return
    }

    if (!isApiSetUp) {
      isApiSetUp = true

      const googleMapScript = document.createElement('SCRIPT')

      // Allow options to be an object.
      // This is to support more esoteric means of loading Google Maps,
      // such as Google for business
      // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
      if (typeof options !== 'object') {
        throw new Error('options should  be an object')
      }

      // libraries
      if (Object.prototype.isPrototypeOf.call(Array.prototype, options.libraries)) {
        options.libraries = options.libraries.join(',')
      }

      options.callback = 'vueGoogleMapsInit'

      let baseUrl = 'https://maps.googleapis.com/'

      if (typeof loadCn === 'boolean' && loadCn === true) {
        baseUrl = 'https://maps.google.cn/'
      }

      const query = Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&')

      const url = `${baseUrl}maps/api/js?${query}`

      googleMapScript.setAttribute('src', url)
      googleMapScript.setAttribute('async', '')
      googleMapScript.setAttribute('defer', '')
      document.head.appendChild(googleMapScript)
    } else {
      throw new Error('You already started the loading of google maps')
    }
  }
})());


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  url: {
    twoWay: false,
    type: String
  },
  map: {
    twoWay: true,
    type: Object
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

/**
 * @class KML Layer
 *
 * KML Layer class (experimental)
 */
/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  events,
  name: 'kmlLayer',
  ctr: () => google.maps.KmlLayer
}));


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  events,
  name: 'marker',
  ctr: () => google.maps.Marker,

  inject: {
    $clusterPromise: {
      default: null
    }
  },

  render (h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
        'div',
        this.$slots.default
      )
    }
  },

  destroyed () {
    if (!this.$markerObject) { return }

    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      this.$clusterObject.removeMarker(this.$markerObject, true)
    } else {
      this.$markerObject.setMap(null)
    }
  },

  beforeCreate (options) {
    if (this.$clusterPromise) {
      options.map = null
    }

    return this.$clusterPromise
  },

  afterCreate (inst) {
    if (this.$clusterPromise) {
      this.$clusterPromise.then((co) => {
        co.addMarker(inst)
        this.$clusterObject = co
      })
    }
  }
}));


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    twoWay: false,
    type: Object
  },
  path: {
    type: Array,
    twoWay: true
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  props: {
    deepWatch: {
      type: Boolean,
      default: false
    }
  },
  events,

  name: 'polyline',
  ctr: () => google.maps.Polyline,

  afterCreate (inst) {
    var clearEvents = () => {}

    this.$watch('path', (path) => {
      if (path) {
        clearEvents()

        this.$polylineObject.setPath(path)

        const mvcPath = this.$polylineObject.getPath()
        const eventListeners = []

        const updatePaths = () => {
          this.$emit('path_changed', this.$polylineObject.getPath())
        }

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) => // eslint-disable-line no-unused-vars
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    })
  }
}));


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  },
  path: {
    type: Array,
    twoWay: true,
    noBind: true
  },
  paths: {
    type: Array,
    twoWay: true,
    noBind: true
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  props: {
    deepWatch: {
      type: Boolean,
      default: false
    }
  },
  events,
  mappedProps: props,
  name: 'polygon',
  ctr: () => google.maps.Polygon,

  beforeCreate (options) {
    if (!options.path) delete options.path
    if (!options.paths) delete options.paths
  },

  afterCreate (inst) {
    var clearEvents = () => {}

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    this.$watch('paths', (paths) => {
      if (paths) {
        clearEvents()

        inst.setPaths(paths)

        const updatePaths = () => {
          this.$emit('paths_changed', inst.getPaths())
        }
        const eventListeners = []

        const mvcArray = inst.getPaths()
        for (let i = 0; i < mvcArray.getLength(); i++) {
          const mvcPath = mvcArray.getAt(i)
          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])
        }
        eventListeners.push([mvcArray, mvcArray.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) => // eslint-disable-line no-unused-vars
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    })

    this.$watch('path', (path) => {
      if (path) {
        clearEvents()

        inst.setPaths(path)

        const mvcPath = inst.getPath()
        const eventListeners = []

        const updatePaths = () => {
          this.$emit('path_changed', inst.getPath())
        }

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) => // eslint-disable-line no-unused-vars
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    })
  }
}));


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  radius: {
    type: Number,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    twoWay: false
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  name: 'circle',
  ctr: () => google.maps.Circle,
  events
}));


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  bounds: {
    type: Object,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    twoWay: false
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

/* harmony default export */ __webpack_exports__["a"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  name: 'rectangle',
  ctr: () => google.maps.Rectangle,
  events
}));


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/info-window.vue?vue&type=template&id=1d70e6cc&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{ref:"flyaway"},[_vm._t("default")],2)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/info-window.vue?vue&type=template&id=1d70e6cc&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/components/info-window.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var info_windowvue_type_script_lang_js_ = (((x) => x.default || x)(__webpack_require__(31)));

// CONCATENATED MODULE: ./src/components/info-window.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_info_windowvue_type_script_lang_js_ = (info_windowvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/info-window.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_info_windowvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var info_window = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/map.vue?vue&type=template&id=43e5bf1b&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-map-container"},[_c('div',{ref:"vue-map",staticClass:"vue-map"}),_vm._v(" "),_c('div',{staticClass:"vue-map-hidden"},[_vm._t("default")],2),_vm._v(" "),_vm._t("visible")],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/map.vue?vue&type=template&id=43e5bf1b&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/components/map.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var mapvue_type_script_lang_js_ = (((x) => x.default || x)(__webpack_require__(32)));

// CONCATENATED MODULE: ./src/components/map.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_mapvue_type_script_lang_js_ = (mapvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/map.vue?vue&type=style&index=0&lang=css&
var mapvue_type_style_index_0_lang_css_ = __webpack_require__(33);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/map.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_mapvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var map = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/street-view-panorama.vue?vue&type=template&id=4c5c2aff&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-street-view-pano-container"},[_c('div',{ref:"vue-street-view-pano",staticClass:"vue-street-view-pano"}),_vm._v(" "),_vm._t("default")],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/street-view-panorama.vue?vue&type=template&id=4c5c2aff&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/components/street-view-panorama.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//

/* harmony default export */ var street_view_panoramavue_type_script_lang_js_ = (((x) => x.default || x)(__webpack_require__(35)));

// CONCATENATED MODULE: ./src/components/street-view-panorama.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_street_view_panoramavue_type_script_lang_js_ = (street_view_panoramavue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/street-view-panorama.vue?vue&type=style&index=0&lang=css&
var street_view_panoramavue_type_style_index_0_lang_css_ = __webpack_require__(36);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/street-view-panorama.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_street_view_panoramavue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var street_view_panorama = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/place-input.vue?vue&type=template&id=221eb736&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',[_c('span',{domProps:{"textContent":_vm._s(_vm.label)}}),_vm._v(" "),_c('input',{ref:"input",class:_vm.className,attrs:{"type":"text","placeholder":_vm.placeholder}})])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/place-input.vue?vue&type=template&id=221eb736&

// EXTERNAL MODULE: ./src/utils/bind-props.js
var bind_props = __webpack_require__(1);

// EXTERNAL MODULE: ./src/utils/simulate-arrow-down.js
var simulate_arrow_down = __webpack_require__(12);

// CONCATENATED MODULE: ./src/components-implementation/place-input.js?vue&type=script&lang=js&



const props = {
  bounds: {
    type: Object
  },
  defaultPlace: {
    type: String,
    default: ''
  },
  componentRestrictions: {
    type: Object,
    default: null
  },
  types: {
    type: Array,
    default: function () {
      return []
    }
  },
  placeholder: {
    required: false,
    type: String
  },
  className: {
    required: false,
    type: String
  },
  label: {
    required: false,
    type: String,
    default: null
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false
  }
}

/* harmony default export */ var place_inputvue_type_script_lang_js_ = ({
  mounted () {
    const input = this.$refs.input

    // Allow default place to be set
    input.value = this.defaultPlace
    this.$watch('defaultPlace', () => {
      input.value = this.defaultPlace
    })

    this.$gmapApiPromiseLazy().then(() => {
      const options = Object(bind_props["b" /* getPropsValues */])(this, props)
      if (this.selectFirstOnEnter) {
        Object(simulate_arrow_down["a" /* default */])(this.$refs.input)
      }

      if (typeof (google.maps.places.Autocomplete) !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?')
      }

      this.autoCompleter = new google.maps.places.Autocomplete(this.$refs.input, options)
      const {placeholder, place, defaultPlace, className, label, selectFirstOnEnter, ...rest} = props // eslint-disable-line
      Object(bind_props["a" /* bindProps */])(this, this.autoCompleter, rest)

      this.autoCompleter.addListener('place_changed', () => {
        this.$emit('place_changed', this.autoCompleter.getPlace())
      })
    })
  },
  created () {
    console.warn('The PlaceInput class is deprecated! Please consider using the Autocomplete input instead') // eslint-disable-line no-console
  },
  props: props
});

// CONCATENATED MODULE: ./src/components-implementation/place-input.js?vue&type=script&lang=js&
 /* harmony default export */ var components_implementation_place_inputvue_type_script_lang_js_ = (place_inputvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/place-input.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_implementation_place_inputvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var place_input = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/autocomplete.vue?vue&type=template&id=fd9210a8&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$scopedSlots['input'])?_c('span',[_vm._t("input",null,{"attrs":_vm.$attrs,"listeners":_vm.$listeners})],2):(!_vm.$scopedSlots['input'])?_c('input',_vm._g(_vm._b({ref:"input"},'input',_vm.$attrs,false),_vm.$listeners)):_vm._e()}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/autocomplete.vue?vue&type=template&id=fd9210a8&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib??vue-loader-options!./src/components/autocomplete.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//

/* harmony default export */ var autocompletevue_type_script_lang_js_ = (((x) => x.default || x)(__webpack_require__(38)));

// CONCATENATED MODULE: ./src/components/autocomplete.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_autocompletevue_type_script_lang_js_ = (autocompletevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/autocomplete.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_autocompletevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var autocomplete = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__25__;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(29);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cluster", function() { return Cluster; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gmapApi", function() { return gmapApi; });
/* harmony import */ var _manager_initializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadGmapApi", function() { return _manager_initializer__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony import */ var _factories_promise_lazy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _components_kml_layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KmlLayer", function() { return _components_kml_layer__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony import */ var _components_marker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Marker", function() { return _components_marker__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony import */ var _components_polyline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polyline", function() { return _components_polyline__WEBPACK_IMPORTED_MODULE_4__["a"]; });

/* harmony import */ var _components_polygon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(17);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Polygon", function() { return _components_polygon__WEBPACK_IMPORTED_MODULE_5__["a"]; });

/* harmony import */ var _components_circle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(18);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Circle", function() { return _components_circle__WEBPACK_IMPORTED_MODULE_6__["a"]; });

/* harmony import */ var _components_rectangle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(19);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return _components_rectangle__WEBPACK_IMPORTED_MODULE_7__["a"]; });

/* harmony import */ var _components_info_window_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(20);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InfoWindow", function() { return _components_info_window_vue__WEBPACK_IMPORTED_MODULE_8__["a"]; });

/* harmony import */ var _components_map_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(21);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return _components_map_vue__WEBPACK_IMPORTED_MODULE_9__["a"]; });

/* harmony import */ var _components_street_view_panorama_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(22);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StreetViewPanorama", function() { return _components_street_view_panorama_vue__WEBPACK_IMPORTED_MODULE_10__["a"]; });

/* harmony import */ var _components_place_input_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(23);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PlaceInput", function() { return _components_place_input_vue__WEBPACK_IMPORTED_MODULE_11__["a"]; });

/* harmony import */ var _components_autocomplete_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(24);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Autocomplete", function() { return _components_autocomplete_vue__WEBPACK_IMPORTED_MODULE_12__["a"]; });

/* harmony import */ var _mixins_map_element__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(8);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MapElementMixin", function() { return _mixins_map_element__WEBPACK_IMPORTED_MODULE_13__["a"]; });

/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(0);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MapElementFactory", function() { return _factories_map_element__WEBPACK_IMPORTED_MODULE_14__["a"]; });

/* harmony import */ var _mixins_mountable__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(4);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MountableMixin", function() { return _mixins_mountable__WEBPACK_IMPORTED_MODULE_15__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loaded", function() { return _factories_promise_lazy__WEBPACK_IMPORTED_MODULE_1__["b"]; });











// Vue component imports











console.log('loaded', _factories_promise_lazy__WEBPACK_IMPORTED_MODULE_1__[/* loaded */ "b"])

// HACK: Cluster should be loaded conditionally
// However in the web version, it's not possible to write
// `import 'vue2-google-maps/src/components/cluster'`, so we need to
// import it anyway (but we don't have to register it)
// Therefore we use babel-plugin-transform-inline-environment-variables to
// set BUILD_DEV to truthy / falsy
const Cluster = (process.env.BUILD_DEV === '1')
  ? undefined
  : ((s) => s.default || s)(__webpack_require__(39))

let GmapApi = null

// export everything


function install (Vue, options) {
  // Set defaults
  options = {
    installComponents: true,
    autobindAllEvents: false,
    ...options
  }

  // Update the global `GmapApi`. This will allow
  // components to use the `google` global reactively
  // via:
  //   import {gmapApi} from 'vue2-google-maps'
  //   export default {  computed: { google: gmapApi }  }
  GmapApi = new Vue({ data: { gmapApi: null } })

  const defaultResizeBus = new Vue()

  // Use a lazy to only load the API when
  // a VGM component is loaded
  const promiseLazyCreator = Object(_factories_promise_lazy__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(_manager_initializer__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"], GmapApi)
  const gmapApiPromiseLazy = promiseLazyCreator(options)

  Vue.mixin({
    created () {
      this.$gmapDefaultResizeBus = defaultResizeBus
      this.$gmapOptions = options
      this.$gmapApiPromiseLazy = gmapApiPromiseLazy
    }
  })

  Vue.$gmapDefaultResizeBus = defaultResizeBus
  Vue.$gmapApiPromiseLazy = gmapApiPromiseLazy

  if (options.installComponents) {
    Vue.component('GmapMap', _components_map_vue__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"])
    Vue.component('GmapMarker', _components_marker__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])
    Vue.component('GmapInfoWindow', _components_info_window_vue__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"])
    Vue.component('GmapKmlLayer', _components_kml_layer__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])
    Vue.component('GmapPolyline', _components_polyline__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])
    Vue.component('GmapPolygon', _components_polygon__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])
    Vue.component('GmapCircle', _components_circle__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"])
    Vue.component('GmapRectangle', _components_rectangle__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"])
    Vue.component('GmapAutocomplete', _components_autocomplete_vue__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"])
    Vue.component('GmapPlaceInput', _components_place_input_vue__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"])
    Vue.component('GmapStreetViewPanorama', _components_street_view_panorama_vue__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"])
  }
}

function gmapApi () {
  return GmapApi.gmapApi && window.google
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(30)))

/***/ }),
/* 30 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


const props = {
  options: {
    type: Object,
    required: false,
    default () {
      return {}
    }
  },
  position: {
    type: Object,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  }
}

const events = [
  'domready',
  'closeclick',
  'content_changed'
]

/* harmony default export */ __webpack_exports__["default"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
  mappedProps: props,
  events,
  name: 'infoWindow',
  ctr: () => google.maps.InfoWindow,
  props: {
    opened: {
      type: Boolean,
      default: true
    }
  },

  inject: {
    $markerPromise: {
      default: null
    }
  },

  mounted () {
    const el = this.$refs.flyaway
    el.parentNode.removeChild(el)
  },

  beforeCreate (options) {
    options.content = this.$refs.flyaway

    if (this.$markerPromise) {
      delete options.position
      return this.$markerPromise.then(mo => {
        this.$markerObject = mo
        return mo
      })
    }
  },

  methods: {
    _openInfoWindow () {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindowObject.open(this.$map, this.$markerObject)
        } else {
          this.$infoWindowObject.open(this.$map)
        }
      } else {
        this.$infoWindowObject.close()
      }
    }
  },

  afterCreate () {
    this._openInfoWindow()
    this.$watch('opened', () => {
      this._openInfoWindow()
    })
  }
}));


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_bind_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _utils_bind_props__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _mixins_mountable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _utils_two_way_binding_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _utils_watch_primitive_properties__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);








const props = {
  center: {
    required: true,
    twoWay: true,
    type: Object,
    noBind: true
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number,
    noBind: true
  },
  heading: {
    type: Number,
    twoWay: true
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  tilt: {
    twoWay: true,
    type: Number
  },
  options: {
    type: Object,
    default () { return {} }
  }
}

const events = [
  'bounds_changed',
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'idle',
  'mousemove',
  'mouseout',
  'mouseover',
  'resize',
  'rightclick',
  'tilesloaded'
]

// Plain Google Maps methods exposed here for convenience
const linkedMethods = [
  'panBy',
  'panTo',
  'panToBounds',
  'fitBounds'
].reduce((all, methodName) => {
  all[methodName] = function (...args) {
    if (this.$mapObject) { this.$mapObject[methodName].apply(this.$mapObject, args) }
  }
  return all
}, {})

// Other convenience methods exposed by Vue Google Maps
const customMethods = {
  resize () {
    if (this.$mapObject) {
      google.maps.event.trigger(this.$mapObject, 'resize')
    }
  },
  resizePreserveCenter () {
    if (!this.$mapObject) { return }

    const oldCenter = this.$mapObject.getCenter()
    google.maps.event.trigger(this.$mapObject, 'resize')
    this.$mapObject.setCenter(oldCenter)
  },

  /// Override mountableMixin::_resizeCallback
  /// because resizePreserveCenter is usually the
  /// expected behaviour
  _resizeCallback () {
    this.resizePreserveCenter()
  }
}

const recyclePrefix = '__gmc__'

/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [_mixins_mountable__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]],
  props: Object(_utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(props),

  provide () {
    this.$mapPromise = new Promise((resolve, reject) => {
      this.$mapPromiseDeferred = { resolve, reject }
    })
    return {
      $mapPromise: this.$mapPromise
    }
  },

  computed: {
    finalLat () {
      return this.center &&
        (typeof this.center.lat === 'function') ? this.center.lat() : this.center.lat
    },
    finalLng () {
      return this.center &&
        (typeof this.center.lng === 'function') ? this.center.lng() : this.center.lng
    },
    finalLatLng () {
      return { lat: this.finalLat, lng: this.finalLng }
    }
  },

  watch: {
    zoom (zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(zoom)
      }
    }
  },

  beforeDestroy () {
    const recycleKey = this.getRecycleKey()
    if (window[recycleKey]) {
      window[recycleKey].div = this.$mapObject.getDiv()
    }
  },

  mounted () {
    return this.$gmapApiPromiseLazy().then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-map']

      // creating the map
      const initialOptions = {
        ...this.options,
        ...Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* getPropsValues */ "b"])(this, props)
      }

      // don't use delete keyword in order to create a more predictable code for the engine
      let { options, ...finalOptions } = initialOptions
      options = finalOptions

      const recycleKey = this.getRecycleKey()
      if (this.options.recycle && window[recycleKey]) {
        element.appendChild(window[recycleKey].div)
        this.$mapObject = window[recycleKey].map
        this.$mapObject.setOptions(options)
      } else {
        // console.warn('[vue2-google-maps] New google map created')
        this.$mapObject = new google.maps.Map(element, options)
        window[recycleKey] = { map: this.$mapObject }
      }

      // binding properties (two and one way)
      Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* bindProps */ "a"])(this, this.$mapObject, props)
      // binding events
      Object(_utils_bind_events__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(this, this.$mapObject, events)

      // manually trigger center and zoom
      Object(_utils_two_way_binding_wrapper__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])((increment, decrement, shouldUpdate) => {
        this.$mapObject.addListener('center_changed', () => {
          if (shouldUpdate()) {
            this.$emit('center_changed', this.$mapObject.getCenter())
          }
          decrement()
        })

        const updateCenter = () => {
          increment()
          this.$mapObject.setCenter(this.finalLatLng)
        }

        Object(_utils_watch_primitive_properties__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(
          this,
          ['finalLat', 'finalLng'],
          updateCenter
        )
      })
      this.$mapObject.addListener('zoom_changed', () => {
        this.$emit('zoom_changed', this.$mapObject.getZoom())
      })
      this.$mapObject.addListener('bounds_changed', () => {
        this.$emit('bounds_changed', this.$mapObject.getBounds())
      })

      this.$mapPromiseDeferred.resolve(this.$mapObject)

      return this.$mapObject
    }).catch((error) => {
      throw error
    })
  },
  methods: {
    ...customMethods,
    ...linkedMethods,
    getRecycleKey () {
      return this.options.recycle ? recyclePrefix + this.options.recycle : recyclePrefix
    }
  }
});


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(27);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.vue-map-container {\n  position: relative;\n}\n.vue-map-container .vue-map {\n  left: 0; right: 0; top: 0; bottom: 0;\n  position: absolute;\n}\n.vue-map-hidden {\n  display: none;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_bind_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _utils_bind_props__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _mixins_mountable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _utils_two_way_binding_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _utils_watch_primitive_properties__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);








const props = {
  zoom: {
    twoWay: true,
    type: Number
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading']
  },
  position: {
    twoWay: true,
    type: Object,
    noBind: true
  },
  pano: {
    twoWay: true,
    type: String
  },
  motionTracking: {
    twoWay: false,
    type: Boolean
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true
  },
  options: {
    twoWay: false,
    type: Object,
    default () { return {} }
  }
}

const events = [
  'closeclick',
  'status_changed'
]

/* harmony default export */ __webpack_exports__["default"] = ({
  mixins: [_mixins_mountable__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]],
  props: Object(_utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(props),
  replace: false, // necessary for css styles
  methods: {
    resize () {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize')
      }
    }
  },

  provide () {
    const promise = new Promise((resolve, reject) => {
      this.$panoPromiseDeferred = { resolve, reject }
    })
    return {
      $panoPromise: promise,
      $mapPromise: promise // so that we can use it with markers
    }
  },

  computed: {
    finalLat () {
      return this.position &&
        (typeof this.position.lat === 'function') ? this.position.lat() : this.position.lat
    },
    finalLng () {
      return this.position &&
        (typeof this.position.lng === 'function') ? this.position.lng() : this.position.lng
    },
    finalLatLng () {
      return {
        lat: this.finalLat,
        lng: this.finalLng
      }
    }
  },

  watch: {
    zoom (zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(zoom)
      }
    }
  },

  mounted () {
    return this.$gmapApiPromiseLazy().then(() => {
      // getting the DOM element where to create the map
      const element = this.$refs['vue-street-view-pano']

      // creating the map
      const options = {
        ...this.options,
        ...Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* getPropsValues */ "b"])(this, props)
      }
      delete options.options

      this.$panoObject = new google.maps.StreetViewPanorama(element, options)

      // binding properties (two and one way)
      Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_1__[/* bindProps */ "a"])(this, this.$panoObject, props)
      // binding events
      Object(_utils_bind_events__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(this, this.$panoObject, events)

      // manually trigger position
      Object(_utils_two_way_binding_wrapper__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])((increment, decrement, shouldUpdate) => {
        // Panos take a while to load
        increment()

        this.$panoObject.addListener('position_changed', () => {
          if (shouldUpdate()) {
            this.$emit('position_changed', this.$panoObject.getPosition())
          }
          decrement()
        })

        const updateCenter = () => {
          increment()
          this.$panoObject.setPosition(this.finalLatLng)
        }

        Object(_utils_watch_primitive_properties__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(
          this,
          ['finalLat', 'finalLng'],
          updateCenter
        )
      })

      this.$panoPromiseDeferred.resolve(this.$panoObject)

      return this.$panoPromise
    }).catch((error) => {
      throw error
    })
  }
});


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_street_view_panorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_street_view_panorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_street_view_panorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_street_view_panorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(27);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "\n.vue-street-view-pano-container {\n  position: relative;\n}\n.vue-street-view-pano-container .vue-street-view-pano {\n  left: 0; right: 0; top: 0; bottom: 0;\n  position: absolute;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_bind_props__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _utils_simulate_arrow_down__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);




const mappedProps = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true
  },
  types: {
    type: Array,
    default: function () {
      return []
    }
  }
}

const props = {
  selectFirstOnEnter: {
    required: false,
    type: Boolean,
    default: false
  },
  // the name of the ref to obtain the input (if its a child  of component in the slot)
  childRefName: {
    required: false,
    type: String,
    default: 'input'
  },
  options: {
    type: Object
  },
  fields: {
    required: false,
    type: Array,
    default: null
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  mounted () {
    this.$gmapApiPromiseLazy().then(() => {
      var scopedInput = null
      if (this.$scopedSlots.input) {
        scopedInput = this.$scopedSlots.input()[0].context.$refs.input
        if (scopedInput && scopedInput.$refs) {
          scopedInput = scopedInput.$refs[this.childRefName || 'input']
        }
        if (scopedInput) { this.$refs.input = scopedInput }
      }
      if (this.selectFirstOnEnter) {
        Object(_utils_simulate_arrow_down__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(this.$refs.input)
      }

      if (typeof (google.maps.places.Autocomplete) !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?')
      }

      /* eslint-disable no-unused-vars */
      const finalOptions = {
        ...Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_0__[/* getPropsValues */ "b"])(this, mappedProps),
        ...this.options
      }

      this.$autocomplete = new google.maps.places.Autocomplete(this.$refs.input, finalOptions)
      Object(_utils_bind_props__WEBPACK_IMPORTED_MODULE_0__[/* bindProps */ "a"])(this, this.$autocomplete, mappedProps)

      this.$watch('componentRestrictions', v => {
        if (v !== undefined) {
          this.$autocomplete.setComponentRestrictions(v)
        }
      })

      // IMPORTANT: To avoid paying for data that you don't need,
      // be sure to use Autocomplete.setFields() to specify only the place data that you will use.
      if (this.fields) {
        this.$autocomplete.setFields(this.fields)
      }

      // Not using `bindEvents` because we also want
      // to return the result of `getPlace()`
      this.$autocomplete.addListener('place_changed', () => {
        this.$emit('place_changed', this.$autocomplete.getPlace())
      })
    })
  },
  props: {
    ...Object(_utils_mapped_props_to_vue_props__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(mappedProps),
    ...props
  }
});


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var marker_clusterer_plus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);
/* harmony import */ var marker_clusterer_plus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(marker_clusterer_plus__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _factories_map_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class

  List of properties from
  https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/src/markerclusterer.js
**/



const props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  batchSizeIE: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  enableRetinaIcons: {
    type: Boolean,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  averageCenter: {
    type: Boolean,
    twoWay: false
  },
  ignoreHidden: {
    type: Boolean,
    twoWay: false
  },
  imageExtension: {
    type: String,
    twoWay: false
  },
  imagePath: {
    type: String,
    twoWay: false
  },
  imageSizes: {
    type: Array,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

/* harmony default export */ __webpack_exports__["default"] = (Object(_factories_map_element__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])({
  mappedProps: props,
  events,
  name: 'cluster',
  ctr: () => {
    if (typeof marker_clusterer_plus__WEBPACK_IMPORTED_MODULE_0___default.a === 'undefined') {
      /* eslint-disable no-console */
      console.error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js')
      throw new Error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js')
    }
    return marker_clusterer_plus__WEBPACK_IMPORTED_MODULE_0___default.a
  },
  ctrArgs: ({ map, ...otherOptions }) => [map, [], otherOptions],

  render (h) {
    // <div><slot></slot></div>
    return h(
      'div',
      this.$slots.default
    )
  },

  afterCreate (inst) {
    const reinsertMarkers = () => {
      const oldMarkers = inst.getMarkers()
      inst.clearMarkers()
      inst.addMarkers(oldMarkers)
    }

    for (const prop in props) {
      if (props[prop].twoWay) {
        this.$on(prop.toLowerCase() + '_changed', reinsertMarkers)
      }
    }
  },

  updated () {
    if (this.$clusterObject) {
      this.$clusterObject.repaint()
    }
  },

  beforeDestroy () {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(marker => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null
      }
    })

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers()
    }
  }
}));


/***/ })
/******/ ]);
});