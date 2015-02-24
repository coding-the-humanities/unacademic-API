"use strict";

(function () {
  "use strict";

  angular.module("unacademic.content.course").factory("courseResolver", courseResolver);

  function courseResolver($q, Course, dispatcher) {
    return data;

    function data(_ref) {
      var curator = _ref.curator;
      var id = _ref.id;
      var schema = Course.schema;
      var curatorId;
      var courseId;

      if (curator) {
        curatorId = curator;
      }

      if (id) {
        courseId = id;
      }


      var promises;

      return $q(function (resolve, reject) {
        if (!curatorId) {
          return reject();
        }

        if (curatorId && courseId === "new") {
          var course = new Course();
          return resolve({ schema: schema, info: course, cards: course.waypoints });
        }

        promises = [Course.get(curatorId, courseId)];

        $q.all(promises).then(function (data) {
          var info = data[0];
          var cards = data[0].waypoints;
          return resolve({ name: name, info: info, schema: schema, cards: cards });
        });
      });
    }
  }
})();