// Observed bug with Vue 2.1.6 under certain circumstances:
// If you pass an object constant into :center, the deep watch
// is still triggered
function isChanged(prop, val, oldVal) {
  var oldProp = (typeof oldVal[prop] === 'number') ? oldVal[prop] :
               (typeof oldVal[prop] === 'function') ? oldVal[prop].apply(oldVal) :
               oldVal[prop]; // don't know how to handle
  var newProp = (typeof val[prop] === 'number') ? val[prop] :
               (typeof val[prop] === 'function') ? val[prop].apply(val) :
               val[prop]; // don't know how to handle
  return oldProp !== newProp;
}

export default function handler(action) {
  return function (val, oldVal) {
    // Check if the value has really changed
    if (isChanged('lat', val, oldVal) || isChanged('lng', val, oldVal)) {
      action.apply(this, [val, oldVal]);
    }
  }
}
