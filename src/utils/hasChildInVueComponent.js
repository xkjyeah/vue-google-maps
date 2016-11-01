export var hasChildInVueComponent = function (vueComponent, child, recursivily) {

  var findReturn = _.find(vueComponent.$children, function(c) {
    if (c == child) {
      return true;
    }
    if (recursivily && c.$children.length>0) {
      return hasChildInVueComponent(child, c);
    }
    return false;
  });
  return typeof findReturn !== 'undefined';
};
