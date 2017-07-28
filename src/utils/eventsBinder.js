/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import {forEach} from 'lodash';

export default (vueElement, googleMapObject, events) => {
  forEach(events, (eventName) => {
    const exposedName = eventName;
    googleMapObject.addListener(eventName, (ev) => {
      vueElement.$emit(exposedName, ev);
    });
  });
};
