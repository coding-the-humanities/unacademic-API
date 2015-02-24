(function(){

  describe("formHelpers", function(){
    var formHelpers;
    var dispatcher;
    var $rootScope;
    var $q;
    var queue;

    beforeEach(function(){
      dispatcher = {}
      dispatcher.queue = sinon.stub();
      dispatcher.setState = sinon.stub();

      module('unacademic.common.formHelpers',  function($provide){
        $provide.value('dispatcher', dispatcher);
      });

      inject(function(_formHelpers_, _$rootScope_, _$q_){
        formHelpers = _formHelpers_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      });
    });

    describe("generateUrl", function(){
      var form;
      var model;

      describe("submit", function(){

        beforeEach(function(){
          model = {
            id: '123',
            curator: 'yeehaa'
          };

          form = {
            $setPristine: function(){},
            $setDirty: function(){}
          }
        });

        describe("if form is clean and invalid", function(){

          it("does not call save on the model", function(){

            form.$dirty = false;
            form.$valid = false;

            model.save = sinon.stub();
            formHelpers.submit(form, model);
            expect(model.save).not.called;
          });
        });

        describe("if form is clean and valid", function(){

          it("does not call save on the model", function(){

            form.$dirty = false;
            form.$valid = true;

            model.save = sinon.stub();
            formHelpers.submit(form, model);
            expect(model.save).not.called;
          });
        });

        describe("if form is dirty and valid", function(){

          beforeEach(function(){
            form.$dirty = true;
            form.$valid = true;
          });

          describe("successful save", function(){
            beforeEach(function(){
              var promise = $q(function(resolve, reject){
                resolve();
              });

              model.save = sinon.stub().returns(promise);
              formHelpers.submit(form, model);

              $rootScope.$apply();
            });

            it("calls save on the model", function(){
              expect(model.save).called;
            });

            it("removes the model from the queue", function(){
              expect(dispatcher.queue).calledWith({remove: '123'});
            });

            it("set the correct resource id", function(){
              var resource = {
                id: '123',
                curator: 'yeehaa'
              }
              expect(dispatcher.setState).calledWith({mode: 'learning', resource: resource});
            });
          });

          describe("failed save", function(){
            beforeEach(function(){
              var promise = $q(function(resolve, reject){
                reject();
              });

              model.save = sinon.stub().returns(promise);
              formHelpers.submit(form, model);

              $rootScope.$apply();
            });

            it("calls save on the model", function(){
              expect(model.save).called;
            });

            it("leaves the model in the queue", function(){
              expect(dispatcher.queue).not.called;
            });
          });
        });
      });

      describe("checkForm", function(){
        var id;
        var form;

        beforeEach(function(){
          id = '123';
          form = {};
        });

        describe("if form is clean", function(){
          it("does not add the model to the queue", function(){
            form.$dirty = false;
            formHelpers.checkForm(form, id, dispatcher);
            expect(dispatcher.queue).not.called;
          });
        });

        describe("if form is dirty", function(){
          it("adds the model to the queue", function(){
            form.$dirty = true;
            formHelpers.checkForm(form, id, dispatcher);
            expect(dispatcher.queue).calledWith({add: id});
          });
        });

        function submitForm(options){
          vm.info = {
            id: '123',
            save: function(){}
          }

          vm.form.$valid = options.valid;
          vm.form.$dirty = options.dirty;
          vm.form.$setPristine = function(){
            vm.form.$dirty = false;
          }

          vm.form.$setDirty = function(){
            vm.form.$dirty = true;
          }

          var promise = $q(function(resolve, reject){
            if(options.resolve){
              resolve();
            } else {
              reject();
            }
          });

          saveModelStub = sinon.stub(vm.info, 'save').returns(promise);

          vm.submit();
          $scope.$digest();
        }

      });
    });
  });
})();
