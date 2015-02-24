"use strict";

(function () {
  "use strict";

  angular.module("unacademic.appState.history", []).factory("history", history);

  function history() {
    var _history;
    var index;

    return {
      initialize: initialize,
      get: get,
      add: add,
      status: status,
      previous: previous,
      next: next
    };

    function next() {
      if (index > 0) {
        index -= 1;
      }
      return _history[index];
    }

    function previous() {
      if (index < _history.length - 1) {
        index += 1;
      }
      return _history[index];
    }

    function get() {
      return _history;
    }

    function status() {
      var length = _history.length;
      var _index = _index;
      return { length: length, index: index };
    }

    function initialize() {
      _history = [];
      index = 0;
    }

    function add(state) {
      if (!state.timestamp) {
        _history = shortenHistory(_history);
        state.timestamp = Date.now();
        _history.unshift(state);
        index = 0;
      }
    }

    function shortenHistory(history) {
      return _history.slice(index, _history.length);
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