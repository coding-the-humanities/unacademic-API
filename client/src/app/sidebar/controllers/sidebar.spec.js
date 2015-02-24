(function(){

  describe("Sidebar", function(){
    var sidebar;
    var dispatcher;
    var navHelpers;

    beforeEach(function () {
      module('unacademic.sidebar.controller');

      dispatcher = {};
      dispatcher.getState = sinon.stub().returns({mode: 'browsing'});
      dispatcher.setState = sinon.stub();

      dispatcher.registerObserverCallback = sinon.stub();

      navHelpers = {};
      navHelpers.goBack = sinon.spy();
      navHelpers.goForward = sinon.spy();

      inject(function ($rootScope, $controller, _$q_) {
        $q = _$q_;
        sidebar = $controller('Sidebar', {
          navHelpers: navHelpers,
          dispatcher: dispatcher
        });
      });
    });

    describe("initialize",function(){

      describe("app state", function(){
        it("gets the app state", function(){
          expect(dispatcher.getState).called;
        });

        it("sets the corresponding props", function(){
          expect(sidebar.user).to.be.undefined;
          expect(sidebar.mode).to.equal('browsing')
        });
      });

      describe("nav props", function(){
        it("sets the other vm props", function(){
          expect(sidebar.back).not.to.be.undefined;
          expect(sidebar.forward).not.to.be.undefined;
        });
      });

      describe("other props", function(){
        it("sets the other vm props", function(){
          expect(sidebar.modes).not.to.be.undefined;
          expect(sidebar.signIn).not.to.be.undefined;
          expect(sidebar.checkMode).not.to.be.undefined;
        });
      });

      it("sets the observer", function(){
        expect(dispatcher.registerObserverCallback).called;
      });
    });

    describe("navigation", function(){

      it("wires up navhelpers.back", function(){
        sidebar.back();
        expect(navHelpers.goBack).to.be.called;
      });

      it("wires up navhelpers.forward", function(){
        sidebar.forward();
        expect(navHelpers.goForward).to.be.called;
      });
    });

    describe("signing in", function(){

      it("sets the state", function(){
        sidebar.signIn();
        expect(dispatcher.setState).to.be.called;
      });

    });

    describe("check mode", function(){

      beforeEach(function(){
        sidebar.checkMode('learning');
      });

      it('keeps the old mode', function(){
        expect(sidebar.mode).to.equal('browsing');
      });

      it("sets the state", function(){
        expect(dispatcher.setState).to.be.called;
      });

    });

    describe("state switching", function(){

      describe("new mode, same user", function(){
        beforeEach(function(){
          dispatcher.registerObserverCallback.callArgWith(0, {mode: 'learning'});
        });

        it("sets the mode to learning", function(){
          expect(sidebar.mode).to.equal('learning');
        });

        it("keep the mode to learning", function(){
          expect(sidebar.user).to.undefined;
        });
      });

      describe("new mode, new user", function(){
        beforeEach(function(){
          dispatcher.registerObserverCallback.callArgWith(0, {mode: 'learning', user: 'yeehaa'});
        });

        it("sets the mode to learning", function(){
          expect(sidebar.mode).to.equal('learning');
        });

        it("keep the mode to learning", function(){
          expect(sidebar.user).to.equal('yeehaa');
        });
      });
    });
  });
})();
