/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

const mutatorObservatorConfig = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree:true
};

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

export default (element, callback) => {
  if (MutationObserver) {
    const observer = new MutationObserver(callback);
    observer.observe(element, mutatorObservatorConfig);
    return () => {
      observer.disconnect();
    }
  } else {
    var oldContent = "";
    // IE Fallback !!!! crappy browser
    setInterval(() => {
      if(oldContent != element.innerHTML) {
        oldContent = element.innerHTML;
        callback();
      }
    }, 500);
    return () => {}
  }
};
