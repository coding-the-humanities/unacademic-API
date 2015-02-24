(function(){
  angular.module('unacademic.appState', [
    'unacademic.appState.dispatcher',
    'unacademic.appState.switcher',
    'unacademic.appState.currentState',
    'unacademic.appState.history',
    'unacademic.appState.queue',
    'unacademic.appState.mutator',
    'unacademic.appState.permission',
  ]);
})();
