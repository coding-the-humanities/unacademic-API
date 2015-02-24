(function(){

  angular.module('unacademic.models.cover')
         .factory('initData', initData);


  function initData(dispatcher){
    var description = "Welcome to UnAcademic. We understand that learning is personal. Therefore everything in our interface is fully customizable. Including this landing page. Start your journey by sliding the curation button below.";

    return {
      id: 'info',
      title: '_Unacademic',
      curator: dispatcher.getState().user || 'general',
      summary: 'Learning by Dwelling',
      description: description,
      paths: ['hello']
    };
  }
})();
