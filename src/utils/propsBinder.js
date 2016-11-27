/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import _ from 'lodash';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default (vueElement, googleMapsElement, props, options) => {
  options = options || {};
  let {afterModelChanged : afterModelChanged} = options;
  _.forEach(props, ({twoWay: twoWay, type:type}, attribute) => {
    const setMethodName = 'set' + capitalizeFirstLetter(attribute);
    const getMethodName = 'get' + capitalizeFirstLetter(attribute);
    const eventName = attribute.toLowerCase() + '_changed';

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    let timesSet = 0;

    vueElement.$watch('local_'+attribute, () => {
      const attributeValue = vueElement['local_'+attribute];
      timesSet++;
      googleMapsElement[setMethodName](attributeValue);
      if (afterModelChanged) {
        afterModelChanged('local_'+attribute, attributeValue);
      }
    }, {
      deep: type === Object
    });
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
};
