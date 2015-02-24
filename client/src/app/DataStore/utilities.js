"use strict";

(function () {
  "use strict";

  angular.module("unacademic.DataStore").factory("utilities", utilities);


  function utilities(baseUrl) {
    return {
      generateUrl: generateUrl,
      generateResourceName: generateResourceName,
      generateUID: generateUID };

    function generateUrl(modelName, userId, id) {
      var resourceName = generateResourceName(modelName);

      if (!userId) {
        return "" + baseUrl + "/" + resourceName + ".json";
      }

      if (!id) {
        return "" + baseUrl + "/" + resourceName + "/" + userId + ".json";
      }

      return "" + baseUrl + "/" + resourceName + "/" + userId + "/" + id + ".json";
    }

    function generateUID() {
      var uid = Date.now();
      return uid;
    }

    function generateResourceName(modelName) {
      return modelName.substr(0, 1).toLowerCase() + modelName.substr(1);
    }

    /* function generateId(){ */
    /*   function constructId(model){ */
    /*     if(model.curator && model.title){ */
    /*       var version = model.version.split(".").join("_"); */
    /*       return parameterize(model.curator) + "_" + parameterize(model.title); */
    /*     } */
    /*   } */

    /*   function parameterize(string){ */
    /*     return string.toLowerCase().split(' ').join("_"); */
    /*   } */

    /*   return constructId; */
    /* } */
  };
})();