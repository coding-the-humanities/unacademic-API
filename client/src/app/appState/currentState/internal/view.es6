(function(){
  'use strict';

  angular.module('unacademic.appState.currentState.view', [])
         .factory('view', view);

  function view($state){

    let name;

    return {
      name: 'name',
      get: get,
      set: set
    }

    function get(){
      let defaultName = $state.current.name;
      return name = name || defaultName;
    }

    function set(newName){
      name = newName;
      return true;
    }
  };
})();
