Turbo.Sortable = function (element, classes, opts) {
  element = (typeof(element) === "string") ? Turbo.$(element) : element;
/*
  if (Turbo.activeModules.carousel[element.id]) {
    return false;
  } else {
    Turbo.activeModules.carousel[element.id] = true;
  }
*/
  classes = (typeof(classes) === "string") ? Turbo.$$(element, classes) : classes;
};
