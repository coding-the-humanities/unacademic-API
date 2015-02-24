(function(){

  describe("mutator", function(){
    var mutator;
    var $rootScope;

    var currentState;
    var history;
    var switcher;

    beforeEach(function(){

      currentState = {};
      history = {};
      switcher = {}

      module('unacademic.appState.mutator',  function($provide){
        $provide.value('history', history);
        $provide.value('switcher', switcher);
        $provide.value('currentState', currentState);
      });

      inject(function(_mutator_, _$q_, _$rootScope_){
        mutator = _mutator_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      currentState.get = sinon.stub().returns({mode: 'learning'});
      currentState.set = sinon.spy();

      history.add = sinon.spy();

    });


    describe("set", function(){
      var changes;
      beforeEach(function(){


        changes = {
          mode: 'learning',
        }

        $rootScope.$digest();
      });

      describe("successful mutations", function(){

        var success;
        var error;

        beforeEach(function(){

          switcher.set = sinon.stub().returns($q.when());
          changes = {
            mode: 'learning',
          }

          mutator.set(changes)
            .then(function(msg){
              success = msg;
            })
            .catch(function(msg){
              error = msg;
            })
          $rootScope.$apply();
        });

        it("sets the values", function(){
          expect(currentState.set).calledWith(changes)
        });

        it("gets the currentState", function(){
          expect(currentState.get).calledOnce;
        });

        it("adds to the history", function(){
          expect(history.add).calledOnce;
        });

        it("returns the new state", function(){
          expect(success).to.deep.equal({mode: 'learning'});
        });

        it("does not returns an error message", function(){
          expect(error).to.be.undefined;
        });
      });

      describe("successful mutations", function(){

        var success;
        var error;

        beforeEach(function(){
          switcher.set = sinon.stub().returns($q.reject());

          mutator.set()
            .then(function(msg){
              success = msg;
            })
            .catch(function(msg){
              error = msg;
            })
          $rootScope.$digest();
        });

        it("sets the values", function(){
          expect(currentState.set).not.called;
        });

        it("gets the currentState", function(){
          expect(currentState.get).not.called;
        });

        it("adds to the history", function(){
          expect(history.add).not.called;
        });

        it("returns a success message", function(){
          expect(success).to.be.undefined;
        });

        it("does not returns an error message", function(){
          expect(error).to.contain("groundcontrol");
        });
      });

    });
  });
})();
