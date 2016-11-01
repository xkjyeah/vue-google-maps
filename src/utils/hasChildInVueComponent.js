export var hasChildInVueComponent = function (vueComponent, child) {
  var findReturn = _.find(vueComponent.$children, function(c) {
    return c == child;
  });
  return typeof findReturn !== 'undefined';
};
