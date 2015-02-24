"use strict";

(function () {
  "use strict";

  angular.module("unacademic.appState.currentState", ["unacademic.appState.currentState.user", "unacademic.appState.currentState.mode", "unacademic.appState.currentState.view", "unacademic.appState.currentState.timestamp", "unacademic.appState.currentState.resource"]).factory("currentState", currentState);

  function currentState(view, user, mode, resource, timestamp) {
    var modules = [mode, user, view, resource, timestamp];

    return {
      get: get,
      set: set };

    function get() {
      var state = {};

      _.each(modules, function (module) {
        state[module.name] = module.get();
      });

      return state;
    }

    function set(changes) {
      setServicesState(changes);
    }

    function setServicesState(changes) {
      _.each(modules, function (module) {
        if (changes[module.name]) {
          module.set(changes[module.name]);
        }
      });
    }
  };
})();