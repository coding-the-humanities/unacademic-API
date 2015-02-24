(function(){
  var app = angular.module('unacademic.sidebar', [
    'unacademic.sidebar.controller'
  ])

  app.directive('sidebar', sidebar);

  function sidebar(){
    return {
      templateUrl: 'sidebar/views/sidebar.html',
      replace: true,
      scope: {
        model:  '=',
        schema: '=',
        form:   '=',
        learn:  '=',
        curate: '=',
        submit: '&'
      },
      bindToController: true,
      controllerAs: 'sidebar',
      controller: 'Sidebar'
    }
  };
})();
