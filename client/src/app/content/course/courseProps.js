"use strict";

(function () {
  "use strict";

  angular.module("unacademic.content.course").factory("courseProps", courseProps);

  function courseProps() {
    return data;

    function data(goTo) {
      return {
        learn: ["curator", "summary", "description", "keywords", "learners", "waypoints"],
        curate: [{
          key: "title" }, {
          key: "summary" }, {
          key: "description",
          type: "textarea" }, {
          key: "keywords" }, {
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