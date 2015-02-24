(() => {

  'use strict';

  angular.module('unacademic.appState.history', [])
         .factory('history', history);

  function history(){
    let history;
    let index;

    return {
      initialize: initialize,
      get: get,
      add: add,
      status: status,
      previous: previous,
      next: next
    };

    function next(){
       if(index > 0){
         index -= 1;
       }
       return history[index];
    }

    function previous(){
       if(index < history.length - 1){
         index += 1;
       }
       return history[index];
    }

    function get(){
      return history;
    }

    function status(){
      let length = history.length;
      let index = index;
      return {length, index};
    }

    function initialize(){
      history = [];
      index = 0;
    }

    function add(state){
       if(!state.timestamp){
         history = shortenHistory(history);
         state.timestamp = Date.now();
         history.unshift(state);
         index = 0;
       }
    }

    function shortenHistory(history){
      return history.slice(index, history.length);
    }
  }
})();


// move to separate service

  /* function save(state){ */
  /*   var url = generateUrl(baseUrl, state); */
  /*   $http.put(url, state) */
  /*   handleBacklog(backlog, state) */
  /* } */

  /* function handleBacklog(backlog, state){ */
  /*   if(backlog.length > 0){ */
  /*     _.each(backlog, (entry) => { */
  /*       entry.user = state.user; */
  /*       var url = generateUrl(baseUrl, entry); */
  /*       $http.put(url, entry) */
  /*     }); */
  /*     backlog = []; */
  /*   } */
  /* } */


  /* function log(state){ */
  /*   $log.log(state) */
  /* } */

  /* function generateUrl(baseUrl, entry){ */
  /*   return `${baseUrl}/history/${entry.user}/${entry.timestamp}.json`; */
  /* } */
