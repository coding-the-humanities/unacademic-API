(function(){

  angular.module('unacademic.models.course.schema', [])
         .factory('courseSchema', courseSchema);

  function courseSchema(){

    return {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          required: true
        },
        title: {
          type: 'string',
          minLength: 5,
          maxLength: 25,
          required: true
        },
        curator: {
          type: 'string',
          required: true
        },
        keywords: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        waypoints: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        learners: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        }
      }
    };
  }
})();
