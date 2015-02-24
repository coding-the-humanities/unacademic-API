(function(){

  describe("currentState", function(){
    var currentState;

    var mode;
    var user;
    var view;
    var resource;
    var getState;
    var timestamp;
    var modules;

    beforeEach(function(){

      mode = {
        name: 'mode',
        get: function(){},
        set: function(){}
      };

      user = {
        name: 'user',
        get: function(){},
        set: function(){}
      };

      view = {
        name: 'name',
        get: function(){},
        set: function(){}
      }

      resource = {
        name: 'resource',
        get: function(){},
        set: function(){}
      }

      timestamp = {
        name: 'timestamp',
        get: function(){},
        set: function(){}
      }


      modules = [mode, user, view, resource, timestamp];

      _.each(modules, function(module){
        module['get'] = sinon.spy();
        module['set'] = sinon.spy();
      });

      module('unacademic.appState.currentState',  function($provide){
        $provide.value('mode', mode);
        $provide.value('user', user);
        $provide.value('view', view);
        $provide.value('timestamp', timestamp);
        $provide.value('resource', resource);
      });

      inject(function(_currentState_){
        currentState = _currentState_;
      });
      getState = currentState.get;
    });

    describe("get", function(){
      var state;

      beforeEach(function(){
        state = getState();
      })

      it("gets the correct data", function(){
        _.each(modules, function(module){
          expect(module.get).calledOnce;
        })
      });
    });

    describe("set", function(){
      describe("with no changes", function(){

        beforeEach(function(){
          setState = currentState.set({});
        });


        it("does not set any value", function(){
          _.each(modules, function(module){
            expect(module.set).not.called;
          })
        });
      });

      describe("with one change", function(){

        beforeEach(function(){

          var newState = {
            mode: 'learning',
          }

          setState = currentState.set(newState);
        });

        it("sets the values", function(){
          expect(user.set).not.called;
          expect(mode.set).calledWith('learning');
          expect(view.set).not.called;
          expect(resource.set).not.called;
        });
      });

      describe("with multiple changes", function(){
        beforeEach(function(){

          var newState = {
            mode: 'learning',
            resource: '123',
            name: 'courses.detail',
            user: 'yeehaa',
            timestamp: '123'
          }

          setState = currentState.set(newState);
        });

        it("sets the values", function(){
          expect(user.set).calledWith('yeehaa');
          expect(mode.set).calledWith('learning');
          expect(view.set).calledWith('courses.detail');
          expect(resource.set).calledWith('123');
          expect(timestamp.set).calledWith('123');
        });

      });
    });
  });
})();
