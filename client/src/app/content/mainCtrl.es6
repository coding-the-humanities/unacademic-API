(function(){
  'use strict';


  angular.module('unacademic.content.controller', [])
         .controller('MainCtrl', MainCtrl)

  function MainCtrl(init, $scope, dispatcher, data, navHelpers, formHelpers) {

    let vm = this;
    initialize();

    function initialize(){
      vm.viewName = data.info.constructor.name.toLowerCase();

      if(vm.viewName === 'cover'){
        vm.childViewName = 'course';
      } else {
        vm.childViewName = 'waypoint';
      }

      vm.info = data.info;
      vm.cards = data.cards;
      vm.form = {};
      vm.schema = data.schema;

      vm.goTo = ()=> { navHelpers.goTo(vm.childViewName)};
      vm.submit = ()=> formHelpers.submit(vm.form, vm.info);
      let checkForm = ()=> formHelpers.checkForm(vm.form, vm.info.id);

      var props = init[vm.viewName].props(vm.goTo);
      vm.learn = props.learn
      vm.curate = props.curate;

      $scope.$watch('vm.info', checkForm, true);

      dispatcher.registerObserverCallback(updateInfo);
    }

    function updateInfo(params){
      init[vm.viewName].resolver(params)
        .then(({info, cards}) => {
          vm.info = info;
          vm.cards = cards;
        })
    }
  };
})();
