(function(){
  var app = angular.module('unacademic.content');

  /*@ngInject*/

  app.config(function($stateProvider) {
    $stateProvider

      .state('cover', {
        url: '/cover',
        controller: 'MainCtrl',
        controllerAs: 'vm',
        templateUrl: 'content/views/index.html',
        resolve: {
          data: function(init){
            return init.cover.resolver();
          },
        }
      })

      .state('course', {
        url: '/course/:curator/:id',
        controller: 'MainCtrl',
        controllerAs: 'vm',
        templateUrl: 'content/views/index.html',
        resolve: {
          data: function(init, $stateParams){
            var params = $stateParams
            return init.course.resolver(params);
          }
        }
      })
  });
})();
