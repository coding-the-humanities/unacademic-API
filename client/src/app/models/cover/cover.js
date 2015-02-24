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
  angular.module("unacademic.models.cover", []).factory("Cover", CoverInit);

  function CoverInit(BaseClass, schema, initData) {
    var Cover = (function (BaseClass) {
      var Cover = function Cover() {
        BaseClass.apply(this, arguments);
      };

      _extends(Cover, BaseClass);

      return Cover;
    })(BaseClass);

    Cover.initialize({ schema: schema, initData: initData });

    return Cover;
  };
})();