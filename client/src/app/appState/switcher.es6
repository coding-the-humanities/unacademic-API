(() => {

  'use strict';

  angular.module('unacademic.appState.switcher', [])
         .factory('switcher', switcher);

  function switcher($state, $q){
    return {
      set: set
    };

    function set({name, resource}){
      if(name || resource){
        return $state.go(name, resource);
      }
      return $q.when('no route change');
    };
  }
})();
