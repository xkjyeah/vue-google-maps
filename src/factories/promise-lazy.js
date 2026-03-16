import lazy from '../utils/lazy-value'

let resolveLoaded
let rejectLoaded
export const loaded = new Promise((resolve, reject) => {
  resolveLoaded = resolve
  rejectLoaded = reject
})

export default function (loadGmapApi, GmapApi) {
  return function promiseLazyCreator (options) {
    // Things to do once the API is loaded
    function onApiLoaded () {
      GmapApi.gmapApi = {}
      return window.google
    }

    if (options.load) { // If library should load the API
      return lazy(() => { // Load the
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

      return lazy(() => promise)
    }
  }
}
