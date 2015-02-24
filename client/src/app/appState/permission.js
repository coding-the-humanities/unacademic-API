"use strict";

(function () {
  var app = angular.module("unacademic.appState.permission", []);

  app.factory("permission", permission);

  function permission($log) {
    var modes = ["browsing", "learning", "curation"];

    return {
      get: get
    };

    function get(currentState, changes) {
      var proposal = createProposal(currentState, changes);
      var valid = checkPermissions(currentState, proposal);

      if (!valid) {
        return {};
      }

      var intersection = _.omit(proposal, function (value, key) {
        return _.isEqual(currentState[key], value);
      });

      var hasResource = _.has(intersection, "resource");
      var hasName = _.has(intersection, "name");

      if (hasResource && !hasName) {
        intersection.name = currentState.name;
      }

      delete intersection.queue;

      return intersection;
    }

    function createProposal(currentState, changes) {
      var modules = ["mode", "name", "user", "resource", "queue", "timestamp"];
      var state = _.clone(currentState);

      _.each(modules, function (module) {
        if (changes[module]) {
          state[module] = changes[module];
        }
      });
      return state;
    }

    function checkPermissions(currentState, nextState) {
      if (nextState.queue.size > 0) {
        $log.warn("app is locked");
        return false;
      }

      if (!_.contains(modes, nextState.mode)) {
        $log.warn("invalid appmode");
        return false;
      }

      if ((nextState.mode === "curation" || nextState.mode === "learning") && !nextState.user) {
        $log.warn("curation and learning mode are only accessible after signing in");
        return false;
      }

      if (nextState.mode === "browsing" && nextState.user) {
        $log.warn("browsing mode is not available for logged in users");
        return false;
      }

      return true;
    }
  }
})();