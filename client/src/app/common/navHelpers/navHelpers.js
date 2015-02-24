"use strict";

(function () {
  "use strict";

  angular.module("unacademic.common.navHelpers", []).factory("navHelpers", navHelpers);

  function navHelpers(dispatcher, history) {
    return {
      goTo: goTo,
      goBack: goBack,
      goForward: goForward,
      canGoBack: canGoBack,
      canGoForward: canGoForward
    };

    function goBack() {
      var previous = history.previous();
      if (previous) {
        dispatcher.setState(previous);
      }
    }

    function canGoBack() {
      var status = history.status();
      if (status.index < status.length) {
        return true;
      }
      return false;
    }

    function canGoForward() {
      var status = history.status();
      if (status.index > 0) {
        return true;
      }
      return false;
    }

    function goForward() {
      var next = history.next();
      if (next) {
        dispatcher.setState(next);
      }
    }

    function goTo(name, resource) {
      if (!resource) {
        resource = createNewResource();
      }

      dispatcher.setState({
        name: name,
        resource: {
          id: resource.id,
          curator: resource.curator
        }
      });
    }

    function createNewResource() {
      return {
        id: "new",
        curator: dispatcher.getState().user
      };
    }
  }
})();