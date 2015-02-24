(function(){

  describe("resource", function(){
    var resource;

    beforeEach(function(){

      module('unacademic.appState.currentState.resource');

      inject(function(_resource_, _$rootScope_){
        resource = _resource_;
        $rootScope = _$rootScope_;
      });
    });

    describe("resource", function(){

      it("is undefined by default", function(){
        expect(resource.get()).to.be.undefined;
      });


      describe("set", function(){
        var newResource;
        var setName;

        beforeEach(function(){
          newResource = {
            id: '123',
            curator: 'yeehaa'
          }
          setName = resource.set(newResource);
        });


        it("returns true", function(){
          expect(setName).to.be.true;
        });

        it("can be set", function(){
          expect(resource.get()).to.equal(newResource);
        });
      })
    })
  });
})();
