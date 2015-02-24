(function(){

  describe("DataStore", function(){
    var DataStore;
    var $httpBackend;
    var userId;
    var generateUrlStub;


    beforeEach(function(){
      var utilities = {
        generateUrl: function(){},
        generateUID: function(){}
      };

      generateUrlStub = sinon.stub(utilities, 'generateUrl').returns('/bla.com');

      module('unacademic.DataStore',  function($provide){
        $provide.value('baseUrl', '');
        $provide.value('utilities', utilities);
      });

      userId = 'general'

      inject(function(_DataStore_, _$httpBackend_, _$q_){
        DataStore = _DataStore_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
      });
    });

    afterEach(function() {
      $httpBackend.flush();
      expect(generateUrlStub).calledWith('CoverInfo', 'general');
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    describe("get", function(){

      beforeEach(function(){
        $httpBackend.when('GET', '/bla.com').respond({status: 200});
      });

      it("gets the info", function(){
        DataStore.get('CoverInfo', userId).then(function(data){
          expect(data.status).to.equal(200);
        });
      });
    });

    describe("save", function(){

      beforeEach(function(){
        $httpBackend.when('PUT', '/bla.com').respond(200);
      });

      it("saves the info", function(){
        var instance = new CoverInfo(userId);

        DataStore.save(instance).then(function(data){
          expect(generateUrlStub).called;
          expect(data.status).to.equal(200);
        });
      });
    });
  })

  function CoverInfo(userId){
    this.curator = userId;
  }
})();
