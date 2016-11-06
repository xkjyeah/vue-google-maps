/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import _ from 'lodash';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default (vueElement, googleMapsElement, props, options) => {
  options = options || {};
  var {afterModelChanged : afterModelChanged} = options;
  _.forEach(props, ({twoWay: twoWay, type:type}, attribute) => {
    const setMethodName = 'set' + capitalizeFirstLetter(attribute);
    const getMethodName = 'get' + capitalizeFirstLetter(attribute);
    const eventName = attribute.toLowerCase() + '_changed';

    if (!twoWay) {
      vueElement.$watch(attribute, () => {
        const attributeValue = vueElement['local_'+attribute];
        googleMapsElement[setMethodName](attributeValue);
        if (afterModelChanged) {
          afterModelChanged(attribute, attributeValue);
        }
      }, {
        deep: type === Object  
      });
    } else {
      var stable = 0;

      var modelWatcher = () => {
        stable++;
        if (stable > 0) {
          const attributeValue = vueElement['local_'+attribute];
          googleMapsElement[setMethodName](attributeValue);
          if (afterModelChanged) {
            afterModelChanged(attribute, attributeValue);
          }
        }
      };

      var gmapWatcher = () => {
        stable--;
        if (stable < 0) {
          const value = googleMapsElement[getMethodName]();
          if (value instanceof google.maps.LatLng) {
            vueElement['local_'+attribute] = {
              lat: value.lat(),
              lng: value.lng()
            };
          } else { //TODO Handle more google types !!
            vueElement['local_'+attribute] = value;
          }
        }
      };

      vueElement.$watch(attribute, modelWatcher, {
        deep: type===Object
      });

      googleMapsElement.addListener(eventName,
        _.throttle(gmapWatcher, 100, {
          leading: true,
          trailing: true
        }));
    }
  });
};
