import bindEvents from '../utils/bind-events'
import { bindProps, getPropsValues } from '../utils/bind-props'
import MapElementMixin from '../mixins/map-element'
import mappedPropsToVueProps from '../utils/mapped-props-to-vue-props'

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

export default function (options) {
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
    mixins: [MapElementMixin],
    props: {
      ...props,
      ...mappedPropsToVueProps(mappedProps)
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
          ...getPropsValues(this, mappedProps)
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
            ...ctrArgs(options, getPropsValues(this, props || {}))
          ))()
          : new ConstructorObject(options)

        bindProps(this, this[instanceName], mappedProps)
        bindEvents(this, this[instanceName], events)

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
}
