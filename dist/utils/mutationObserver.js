'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

var mutatorObservatorConfig = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

exports.default = function (element, callback) {
  if (MutationObserver) {
    var observer = new MutationObserver(callback);
    observer.observe(element, mutatorObservatorConfig);
    return function () {
      observer.disconnect();
    };
  } else {
    var oldContent = '';
    // IE Fallback !!!! crappy browser
    setInterval(function () {
      if (oldContent != element.innerHTML) {
        oldContent = element.innerHTML;
        callback();
      }
    }, 500);
    return function () {};
  }
};