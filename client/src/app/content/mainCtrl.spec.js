(function(){

  describe("MainCtrl", function(){
    var vm;
    var $scope;
    var dispatcher;
    var formHelpers;
    var navHelpers;
    var data;

    beforeEach(function () {

      module('unacademic.content.controller');

      dispatcher = {
        setState: function(){},
        registerObserverCallback: function(){ return; }
      }

      dispatcher.setState = sinon.spy();
      dispatcher.registerObserverCallback = sinon.spy();

      formHelpers = {
        submit: function(){},
        checkForm: function(){}
      }

      formHelpers.submit = sinon.spy();
      formHelpers.checkForm = sinon.spy();

      navHelpers = {
        goTo: function(){}
      }

      navHelpers.goTo = sinon.spy();

      data = {
        info: {
          constructor: {
            name: 'cover'
          }
        },
        cards: '',
        schema: ''
      }

      var init = {
        cover: {
          props: function(){},
          resolver: function(){}
        }
      }
      var props = {
        learn: '123',
        curate: '123',
      }

      init.cover.props = sinon.stub().returns(props);

      inject(function ($rootScope, $controller, _$q_) {
        $scope = $rootScope.$new();
        $q = _$q_;
        vm = $controller('MainCtrl', {
          $scope: $scope,
          init: init,
          dispatcher: dispatcher,
          formHelpers: formHelpers,
          navHelpers: navHelpers,
          data: data
        });
      });
    });

    describe("general", function(){

      it("knows itself and its family", function(){
        expect(vm.viewName).to.equal('cover');
        expect(vm.childViewName).to.equal('course');
      });

      it("sets all the necessary props on the vm", function(){
        expect(vm.info).not.to.be.undefined;
        expect(vm.form).not.to.be.undefined;
        expect(vm.cards).not.to.be.undefined;
        expect(vm.schema).not.to.be.undefined;
        expect(vm.learn).not.to.be.undefined;
        expect(vm.curate).not.to.be.undefined;
      });

      it("binds goto correctly to the vm", function(){
        vm.goTo();
        expect(navHelpers.goTo).to.be.calledWith('course');
      });

      it("binds submit correctly to the vm", function(){
        vm.submit();
        expect(formHelpers.submit).to.be.calledWith({}, data.info);
      });

      it("registers the dispatcher observer callback", function(){
        expect(dispatcher.registerObserverCallback).to.have.been.calledOnce;
      });
    });

    describe("submiting the coverInfo data", function(){
      it("calls form helpers submit with the right arguments", function(){
        vm.form = '123';
        vm.info = '456';
        vm.submit()
        expect(formHelpers.submit).calledWith('123', '456');
      });
    });

    describe("watching the model for changes", function(){
      it("calls form helpers checkForm with the right arguments", function(){
        vm.form = '123';
        vm.info = {id: '456'};
        $scope.$digest();
        expect(formHelpers.checkForm).calledWith('123', '456');
      });
    });
  });
})();
