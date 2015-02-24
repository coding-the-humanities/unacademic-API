(function(){

  describe("view", function(){
    var view;
    var $log;

    beforeEach(function(){

      module('unacademic.appState.currentState.view');

      $state = {
        current: {
          name: '123'
        }
      };


      module('unacademic.appState.dispatcher',  function($provide){
        $provide.value('$state', $state);
      });

      inject(function(_view_, _$rootScope_){
        view = _view_;
        $rootScope = _$rootScope_;
      });
    });

    describe("view name", function(){

      it("calls $state to get its initial state name", function(){
        expect(view.get()).to.equal('123');
      });

      it("is set to its internal value on subsequent calls", function(){
        view.get();
        $state.current.name = '456';
        $rootScope.$apply();
        expect(view.get()).to.equal('123');
      });

      describe("set", function(){
        var name;
        var setName;

        beforeEach(function(){
          name = '123';
          setName = view.set(name);
        });


        it("returns true", function(){
          expect(setName).to.be.true;
        });

        it("can be set", function(){
          expect(view.get()).to.equal(name);
        });
      })
    })
  });
})();
