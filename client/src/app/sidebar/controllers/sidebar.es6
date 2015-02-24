(function(){
  'use strict';

  angular.module('unacademic.sidebar.controller', [])
         .controller('Sidebar', Sidebar);

  function Sidebar(dispatcher, navHelpers){

    let sidebar = this;
    var modes = ['browsing', 'learning', 'curation'];
    var currentMode;
    initialize();

    function initialize(){
      let state = dispatcher.getState();
      currentMode = state.mode;
      initSidebar(state);
      dispatcher.registerObserverCallback(updateAppState);
    }

    function initSidebar({mode, user}){
      sidebar.modes = modes;
      sidebar.user = user;
      sidebar.mode = mode;
      sidebar.back = back;
      sidebar.forward = forward;
      sidebar.signIn = signIn;
      sidebar.checkMode = checkMode;
    }

    function back(){
      navHelpers.goBack();
    }

    function forward(){
      navHelpers.goForward();
    }

    function signIn(){
      let users = ['yeehaa', 'marijn', 'reika', 'peter'];
      let user = _.sample(users);
      return dispatcher.setState({user: user, mode: 'learning'});
    }

    function checkMode(newMode){
      sidebar.mode = currentMode;
      dispatcher.setState({mode: newMode});
    }

    function updateAppState(state){
      sidebar.user = state.user;
      currentMode = state.mode;
      sidebar.mode = state.mode;
    }
  }
})();
