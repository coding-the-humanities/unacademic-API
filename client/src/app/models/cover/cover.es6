(() => {

  angular.module('unacademic.models.cover', [])
         .factory('Cover', CoverInit);

  function CoverInit(BaseClass, schema, initData){

    class Cover extends BaseClass {}

    Cover.initialize({schema: schema, initData: initData});

    return Cover;
  };
   
})();
