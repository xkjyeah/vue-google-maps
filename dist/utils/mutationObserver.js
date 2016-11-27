"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var _ret = function () {
      var observer = new MutationObserver(callback);
      observer.observe(element, mutatorObservatorConfig);
      return {
        v: function v() {
          observer.disconnect();
        }
      };
    }();

    if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
  } else {
    var oldContent = "";
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