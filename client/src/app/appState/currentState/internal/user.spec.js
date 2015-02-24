(function(){

  describe("user", function(){
    var userId;
    var $log;

    beforeEach(function(){

      module('unacademic.appState.currentState.user');

      inject(function(_user_){
        user = _user_;
      });
    });

    describe("current user id", function(){

      it("is undefined by default", function(){
        expect(user.get()).to.be.undefined;
      });

      describe("set", function(){
        var userId;
        var setUserId;
        var notification;

        beforeEach(function(){
          userId = 'John123';
          setUserId = user.set(userId);
        });

        it("returns true", function(){
          expect(setUserId).to.be.true;
        });

        it("can be set", function(){
          expect(user.get()).to.equal(userId);
        });
      })
    })
  });
})();


