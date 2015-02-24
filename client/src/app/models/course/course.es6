(() => {

  angular.module('unacademic.models.course', [
    'unacademic.models.course.initData',
    'unacademic.models.course.schema',
  ]).factory('Course', CourseInit);

  function CourseInit(BaseClass, courseSchema, courseInitData){

    class Course extends BaseClass {}

    Course.initialize({schema: courseSchema, initData: courseInitData});

    return Course;
  };
   
})();
