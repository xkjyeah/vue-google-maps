import WatchPrimitiveProperties from '../utils/WatchPrimitiveProperties'

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getPropsValues (vueInst, props) {
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
export function bindProps (vueInst, googleMapsInst, props, options) {
  for (let attribute in props) {
    let {twoWay, type, trackProperties, noBind} = props[attribute]

    if (noBind) return

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
      WatchPrimitiveProperties(
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
