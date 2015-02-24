"use strict";

(function () {
  "use strict";

  angular.module("unacademic.content").factory("init", init);

  function init(coverResolver, coverProps, courseResolver, courseProps) {
    return {
      cover: {
        resolver: coverResolver,
        props: coverProps
      },
      course: {
        resolver: courseResolver,
        props: courseProps
      }
    };
  }
})();