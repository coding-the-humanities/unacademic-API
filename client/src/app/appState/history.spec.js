(function(){

  describe("history", function(){
    var history;
    var state1;
    var state2;
    var state3;
    var state4;
    var state5;
    var status;

    beforeEach(function(){
      dispatcher = {};
      dispatcher.getState = sinon.stub();

      module('unacademic.appState.history',  function($provide){
        $provide.value('dispatcher', dispatcher);
      });

      inject(function(_history_, _$log_){
        history = _history_;
      });

      state1 = {
        waypoints: 'waypoints.detail',
      }

      state2 = {
        waypoints: 'waypoints.index',
      }

      state3 = {
        waypoints: 'waypoints.other',
      }

      state4 = {
        waypoints: 'waypoints.any',
      }

      state5 = {
        waypoints: 'waypoints.any',
        timestamp: '123'
      }
      status = history.status;
    });

    describe("initialize", function(){
      beforeEach(function(){
        history.initialize();
      });

      it("is empty", function(){
        expect(status().length).to.equal(0);
      });

      it("has an index of 0", function(){
        expect(status().index).to.equal(0);
      });
    });

    describe("time travel", function(){

      beforeEach(function(){
        history.initialize();
        history.add(state1);
        history.add(state2);
        expect(status().length).to.equal(2);
      });

      describe("previous", function(){

        it("return the previous state", function(){
          expect(history.previous()).to.equal(state1);
          expect(status().index).to.equal(1);
        });

        it("returns the last state if at beginning", function(){
          history.previous();
          history.previous();
          expect(status().index).to.equal(1);
          expect(history.previous()).to.equal(state1);
        });
      });

      describe("next", function(){
        beforeEach(function(){
          history.previous();
        });

        it("return the next state", function(){
          expect(history.next()).to.equal(state2);
          expect(status().index).to.equal(0);
        });

        it("returns the first state if at end", function(){
          history.next();
          expect(history.next()).to.equal(state2);
          expect(status().index).to.equal(0);
        });
      });

      describe("reset", function(){

        beforeEach(function(){
          history.previous();
          history.add(state3);
          history.add(state4);
        });

        it("adds the state to the history", function(){
          expect(status().length).to.equal(3);
          expect(status().index).to.equal(0);
          expect(history.get()).to.contain(state3);
        });

        it("removes the detour from the history", function(){
          expect(history.get()).not.to.contain(state2);
        });

        it("resets the index", function(){
          expect(history.previous()).to.equal(state3);
        });
      });

      describe("with timestamp", function(){
        beforeEach(function(){
          expect(status().length).to.equal(2);
          history.previous();
          history.add(state5);
        });

        it("does not add the state to the history", function(){
          expect(status().index).to.equal(1);
          expect(history.get().length).to.equal(2);
          expect(history.get()).not.to.contain(state5);
        });

        it("does not reset the index", function(){
          expect(history.next()).to.equal(state2);
          expect(status().index).to.equal(0);
        });
      });
    });
  });
})();
