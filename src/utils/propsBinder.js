/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import _ from 'lodash'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default (vueElement, googleMapsElement, props, options) => {
  options = options || {};
  let {afterModelChanged} = options;
  _.forEach(props, ({twoWay, type, trackProperties}, attribute) => {
    const setMethodName = 'set' + capitalizeFirstLetter(attribute);
    const getMethodName = 'get' + capitalizeFirstLetter(attribute);
    const eventName = attribute.toLowerCase() + '_changed';

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    let timesSet = 0;

    if (type !== Object || !trackProperties) {
      // Track the object deeplyvueElement.$watch('local_'+attribute, () => {
      vueElement.$watch(attribute, () => {
        const attributeValue = vueElement['local_'+attribute];

        timesSet++;
        googleMapsElement[setMethodName](attributeValue);
        if (afterModelChanged) {
          afterModelChanged('local_'+attribute, attributeValue);
        }
      }, {
        deep: type === Object
      });
    } else if (type === Object && trackProperties) {
      // The indicator variable that is updated whenever any of the properties have changed
      // This ensures that the event handler will only be fired once
      let attributeTrackerName = `_${attribute}_changeTracker`;
      let attributeTrackerRoot = '$data._changeIndicators'

      vueElement.$set(vueElement.$data._changeIndicators, attributeTrackerName, 0);

      vueElement.$watch(attributeTrackerRoot + '.' + attributeTrackerName, () => {
        googleMapsElement[setMethodName](vueElement[attribute]);
        if (afterModelChanged) {
          afterModelChanged(attribute, attributeValue);
        }
      })

      trackProperties.forEach(propName => {
        vueElement.$watch(`${attribute}.${propName}`, () => {
          vueElement.$set(attributeTrackerRoot, attributeTrackerName,
            vueElement.$get(attributeTrackerRoot, attributeTrackerName) + 1);
        })
      })
    }

    if (twoWay) {
      let gmapWatcher = () => {
        if (timesSet > 0) {
          timesSet--;
          return;
        }
        const value = googleMapsElement[getMethodName]();
        if (value instanceof google.maps.LatLng) {
          vueElement['local_' + attribute] = {
            lat: value.lat(),
            lng: value.lng()
          };
        }
        else { //TODO Handle more google types !!
          vueElement['local_' + attribute] = value;
        }
      };

      googleMapsElement.addListener(eventName,
        _.throttle(gmapWatcher, 100, {
          leading: true,
          trailing: true
        }));
    }
  });
}
