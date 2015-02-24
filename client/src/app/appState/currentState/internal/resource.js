"use strict";

(function () {
  var app = angular.module("unacademic.appState.currentState.resource", []);
  app.factory("resource", resource);

  function resource() {
    var _resource;

    return {
      name: "resource",
      get: get,
      set: set
    };

    function get() {
      return _resource;
    }

    function set(newResource) {
      _resource = newResource;
      return true;
    }
  };
})();