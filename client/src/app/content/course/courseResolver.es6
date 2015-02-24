(function(){

  'use strict';

  angular.module('unacademic.content.course')
        .factory('courseResolver', courseResolver);

  function courseResolver($q, Course, dispatcher){

    return data;

    function data({curator, id}){
      let schema = Course.schema;
      let curatorId;
      let courseId;

      if(curator){
        curatorId = curator;
      }

      if(id){
        courseId = id;
      }


      let promises;

      return $q(function(resolve, reject){

        if(!curatorId){
          return reject();
        }

        if(curatorId && courseId === 'new'){
          let course = new Course();
          return resolve({schema: schema, info: course, cards: course.waypoints});
        }

        promises = [
          Course.get(curatorId, courseId)
        ];

        $q.all(promises).then(function(data){
          let info = data[0];
          let cards = data[0].waypoints;
          return resolve({name, info, schema, cards});
        });
      });
    }
  }
})();
