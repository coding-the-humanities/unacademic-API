"use strict";

(function () {
  "use strict";

  angular.module("unacademic.appState.switcher", []).factory("switcher", switcher);

  function switcher($state, $q) {
    return {
      set: set
    };

    function set(_ref) {
      var name = _ref.name;
      var resource = _ref.resource;
      if (name || resource) {
        return $state.go(name, resource);
      }
      return $q.when("no route change");
    };
  }
})();