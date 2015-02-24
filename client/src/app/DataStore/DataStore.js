"use strict";

(function () {
  "use strict";


  angular.module("unacademic.DataStore", []).factory("DataStore", DataStore);


  function DataStore(baseUrl, $http, $q, utilities) {
    return {
      get: get,
      save: save
    };

    function get(modelName, userId, id) {
      var url = utilities.generateUrl(modelName, userId, id);
      return $http.get(url).then(extractData);
    }

    function save(instance) {
      var url = utilities.generateUrl(instance.constructor.name, instance.curator, instance.id);
      return $http.put(url, instance);
    }

    function extractData(response) {
      return $q(function (resolve, reject) {
        var data = response.data;
        resolve(data);
      });
    }
  }
})();