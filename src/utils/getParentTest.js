export var getParentTest = function (child, callTest){
  var ancestor = child.$parent;
  if (!ancestor) {
    return null;
  }
  while (!callTest(ancestor)){
    if (!ancestor.$parent) {
      return null;
    }
    ancestor = ancestor.$parent;
  }
  return ancestor;
};
