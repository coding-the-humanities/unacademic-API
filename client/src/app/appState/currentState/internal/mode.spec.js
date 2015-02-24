(function(){

  describe("mode", function(){
    var mode;

    beforeEach(function(){
      module('unacademic.appState.currentState.mode');

      inject(function(_mode_){
        mode = _mode_;
      });
    });


    it("defaults to browsing", function(){
      expect(mode.get()).to.equal('browsing');
    });

    it("can set a different mode", function(){
      mode.set('learning');
      expect(mode.get()).to.equal('learning');
    });
  });
})();
