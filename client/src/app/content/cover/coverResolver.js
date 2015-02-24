"use strict";

(function () {
  "use strict";

  angular.module("unacademic.content.cover").factory("coverResolver", coverResolver);

  function coverResolver($q, Cover, Course, dispatcher) {
    return data;

    function data() {
      var userId = dispatcher.getState().user;
      var promises;

      var coverUser = userId || "general";

      return $q(function (resolve, reject) {
        promises = [Cover.get(coverUser, "info"), Course.getAll(userId)];

        $q.all(promises).then(function (data) {
          var name = "cover";
          var info = data[0];
          var cards = data[1];
          var schema = Cover.schema;
          return resolve({ name: name, info: info, schema: schema, cards: cards });
        });
      });
    }
  }
})();