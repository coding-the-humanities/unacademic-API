"use strict";

(function () {
  "use strict";


  angular.module("unacademic.content.controller", []).controller("MainCtrl", MainCtrl);

  function MainCtrl(init, $scope, dispatcher, data, navHelpers, formHelpers) {
    var vm = this;
    initialize();

    function initialize() {
      vm.viewName = data.info.constructor.name.toLowerCase();

      if (vm.viewName === "cover") {
        vm.childViewName = "course";
      } else {
        vm.childViewName = "waypoint";
      }

      vm.info = data.info;
      vm.cards = data.cards;
      vm.form = {};
      vm.schema = data.schema;

      vm.goTo = function () {
        navHelpers.goTo(vm.childViewName);
      };
      vm.submit = function () {
        return formHelpers.submit(vm.form, vm.info);
      };
      var checkForm = function () {
        return formHelpers.checkForm(vm.form, vm.info.id);
      };

      var props = init[vm.viewName].props(vm.goTo);
      vm.learn = props.learn;
      vm.curate = props.curate;

      $scope.$watch("vm.info", checkForm, true);

      dispatcher.registerObserverCallback(updateInfo);
    }

    function updateInfo(params) {
      init[vm.viewName].resolver(params).then(function (_ref) {
        var info = _ref.info;
        var cards = _ref.cards;
        vm.info = info;
        vm.cards = cards;
      });
    }
  };
})();