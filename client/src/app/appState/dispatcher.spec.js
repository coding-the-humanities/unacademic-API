(function(){

  describe("dispatcher", function(){
    var dispatcher;
    var $rootScope;

    var currentState;
    var queue;
    var mutator;

    var permissionMock;

    beforeEach(function(){

      currentState = {};
      queue = {};


      var permission = {
        get: function(){}
      };

      mutator = {}

      permissionMock = sinon.mock(permission);

      module('unacademic.appState.dispatcher',  function($provide){
        $provide.value('permission', permission);
        $provide.value('queue', queue);
        $provide.value('mutator', mutator);
        $provide.value('currentState', currentState);
      });

      inject(function(_dispatcher_, _$q_, _$rootScope_){
        dispatcher = _dispatcher_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      currentState.get = sinon.stub().returns({mode: 'learning'});
      currentState.set = sinon.spy();

      queue.get = sinon.stub().returns(['123']);
      queue.set = sinon.spy();

      var promise = $q.when();
      mutator.set = sinon.stub().returns(promise);
    });


    describe("get", function(){
      var state;

      beforeEach(function(){
        state = dispatcher.getState();
      })

      it("gets the currentState", function(){
        expect(currentState.get).calledOnce;
      });
    });

    describe("set", function(){
      var notificationSpy;

      beforeEach(function(){
        notificationSpy = sinon.spy();
        dispatcher.registerObserverCallback(notificationSpy);
      });

      afterEach(function(){
        permissionMock.verify();
      });

      describe("with no changes", function(){

        beforeEach(function(){
          permissionMock.expects('get').once().returns({});
          dispatcher.setState({user: 'yeehaa'});
        });

        it("does not call the mutator", function(){
          expect(mutator.set).not.called;
        });

        it("does not notify observers", function(){
          expect(notificationSpy).not.called;
        });
      });

      describe("with changes", function(){
        var changes;
        var state;

        beforeEach(function(){

          state = {
            mode: 'learning',
            queue: ['123']
          }

          changes = {
            mode: 'learning',
          }

          permissionMock.expects('get')
            .withArgs(state, changes)
            .once()
            .returns(changes);

          dispatcher.setState(changes);
          $rootScope.$digest();
        });

        it("calls the mutator with", function(){
          expect(mutator.set).calledWith(changes);
        });

        it("notifies observers", function(){
          expect(notificationSpy).calledOnce;
        });

      });
    });

    describe("queue", function(){
      it("delegates to the queue service", function(){
        var returnValue = dispatcher.queue();
        expect(queue.set).calledOnce;
      });
    });
  });
})();
