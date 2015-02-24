(() => {
  angular.module('unacademic.appState.queue', [])
    .factory('queue', queue);

  function queue($log){

    var count = 0;
    var queue = new Set();

    return {
      name: 'queue',
      get: get,
      set: set,
    }

    function get(){
      return queue;
    }

    function set({add, remove, register}){

      if(register){
        var modelId = `${register}_${count}`;
        count += 1;
        return modelId;
      }


      if(add){
        queue.add(add);
        return true;
      }

      if(remove){
        queue.delete(remove);
        return true;
      }

      return false;
    }
  };
})();
