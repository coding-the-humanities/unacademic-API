(function(){

  angular.module('unacademic.models.course.initData', [])
        .factory('courseInitData', courseInitData);


  function courseInitData(dispatcher){

    var description = "Hello World"; 

    return {
      title: "Coding the Humanities",
      curator: dispatcher.getState().user,
      summary: 'Research through Coding',
      description: description,
      points: ['hello']
    };
  }
})();
