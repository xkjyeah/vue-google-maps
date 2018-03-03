/**
 * 1. Create a DeferredReady plugin.
 *
 * a. Updates options.configMergeStrategies to handle our new hook correctly (using Promise.all!)
 *
 * 2. VueGoogleMaps uses a DeferredReady mixin.
 *
 *     a. Each component checks for ancestors that are also DeferredReady (via dispatch/emit)
 *     b. If no, then run DeferredReady after ready.
 *     c. If yes, then run DeferredReady after parent's deferredReady.
 *
 *
 * Say we have the following inheritance:
 *
 * --> == 'child of'
 *
 * A --> B --> C
 *
 * ready is called in the following order:
 *
 * A.ready, B.ready, C.ready
 *
 * C.ready -- no further ancestors supporting mixin, so in ready() we run+
 *
   **/

export var DeferredReady = {
  install (Vue, options) { // eslint-disable-line no-unused-vars
    // Use the same merge strategy as regular hooks
    Vue.config.optionMergeStrategies.deferredReady = Vue.config.optionMergeStrategies.created
    Vue.config.optionMergeStrategies.beforeDeferredReady = Vue.config.optionMergeStrategies.beforeDeferredReady
  },
}

function runHooks (vm) {
  var hooks = vm.$options.deferredReady || []

  // Run the beforeDeferredReady methods first
  var beforePromise = vm.beforeDeferredReady
    ? ((typeof vm.beforeDeferredReady.then === 'function')
      ? vm.beforeDeferredReady : Promise.all(vm.beforeDeferredReady))
    : Promise.resolve(null)

  beforePromise.then(() => {
    if (vm._isDestroyed) return
    if (typeof hooks === 'function') {
      hooks = [hooks]
    }
    return Promise.all(hooks.map(x => {
      try {
        return x.apply(vm)
      } catch (err) {
        console.error(err.stack) // eslint-disable-line no-console
      }
    }))
    // execute all handlers, expecting them to return promises
    // wait for the promises to complete, before allowing child to execute
  })
    .then(() => {
      vm.$deferredReadyPromiseResolve()
    })
}

export var DeferredReadyMixin = {
  /* Resolved after the deferredReady has been called
    and the (optional) promise it returns has been
    resolved */
  $deferredReadyPromise: false,
  $deferredReadyPromiseResolve: false,
  $deferredReadyAncestor: false,

  created () {
    this.$deferredReadyPromise = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      this.$deferredReadyPromiseResolve = resolve
    })

    let search = this.$parent
    while (search) {
      if (search.$deferredReadyPromise) {
        this.$deferredReadyAncestor = search
        break
      }
      search = search.$parent
    }
  },

  mounted () {
    // Execute the hooks only if this is the first
    // ancestor that is a DeferredReady
    // this.$deferredReadyMountedPromiseResolve();

    if (!this.$deferredReadyAncestor) {
      runHooks(this)
    } else {
      this.$deferredReadyAncestor.$deferredReadyPromise
        .then(() => {
          runHooks(this)
        })
    }
  },
}
