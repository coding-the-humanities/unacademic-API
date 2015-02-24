(function(){

  describe("switcher", function(){
    var switcher;
    var $state;
    var $rootScope;
    var $q;

    beforeEach(function(){
      $state = {};

      dispatcher = {};
      dispatcher.getState = sinon.stub();

      module('unacademic.appState.switcher',  function($provide){
        $provide.value('$state', $state);
        $provide.value('dispatcher', dispatcher);
      });

      inject(function(_switcher_, _$q_, _$rootScope_){
        switcher = _switcher_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      var promise = $q.when('123');
      $state.go = sinon.stub().returns(promise);
    });

    describe("state switching", function(){
      var state;
      var response;

      describe("it has no name", function(){
        beforeEach(function(){
          state = {};
          switcher.set(state).then(function(msg){
            response = msg;
          });
          $rootScope.$digest();
        });

        it("calls state with the correct parameters", function(){
          expect($state.go).not.to.be.called;
        });

        it("returns the success message", function(){
          expect(response).to.contain('change');
        });
      });

      describe("it has a name", function(){
        beforeEach(function(){
          state = { name: 'waypoints.detail' };
          switcher.set(state).then(function(msg){
            response = msg;
          })
          $rootScope.$digest();
        });

        it("calls state with the correct parameters", function(){
          expect($state.go).to.be.calledWithExactly(state.name, undefined);
        });

        it("returns the success message", function(){
          expect(response).to.equal('123');
        });
      });
    })
  });
})();


