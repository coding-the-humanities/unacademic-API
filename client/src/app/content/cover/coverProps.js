"use strict";

(function () {
  "use strict";

  angular.module("unacademic.content.cover").factory("coverProps", coverProps);

  function coverProps() {
    return data;

    function data(goTo) {
      return {
        learn: ["summary", "description"],
        curate: [{
          key: "title" }, {
          key: "summary" }, {
          key: "description",
          type: "textarea" }, {
          type: "button",
          title: "Add New Course",
          onClick: function () {
            return goTo();
          }
        }, {
          type: "submit",
          title: "Save" }]
      };
    }
  }
})();