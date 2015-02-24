"use strict";

(function () {
  "use strict";

  angular.module("unacademic.appState.currentState.timestamp", []).factory("timestamp", timestamp);

  function timestamp() {
    var time;

    return {
      name: "timestamp",
      get: get,
      set: set
    };

    function get() {
      return time;
    }

    function set(newTime) {
      time = newTime;
      return true;
    }
  };
})();