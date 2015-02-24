"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

(function () {
  angular.module("unacademic.models.course", ["unacademic.models.course.initData", "unacademic.models.course.schema"]).factory("Course", CourseInit);

  function CourseInit(BaseClass, courseSchema, courseInitData) {
    var Course = (function (BaseClass) {
      var Course = function Course() {
        BaseClass.apply(this, arguments);
      };

      _extends(Course, BaseClass);

      return Course;
    })(BaseClass);

    Course.initialize({ schema: courseSchema, initData: courseInitData });

    return Course;
  };
})();