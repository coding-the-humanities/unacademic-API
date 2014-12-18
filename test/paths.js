const superagent = require('superagent');
const expect = require('chai').expect;

describe('unacademic-api server', function(){
  var resource = 'paths';
  var mock_resource = {
    curator: "Ashley Williams",
    title: "Writing RESTful APIs with Express and MongoDB",
    version: "1.0.0"
  };
  var mock_update = {
    curator: "Ashley Williams",
    title: "Writing RESTful APIs with Express and MongoDB",
    version: "2.0.0"
  };

  var host = 'http://localhost';
  var port = ':8080';
  var namespace = '/api/0';
  var collection_url = host + port + namespace + '/' + resource;
  var id;
  var element_url;

  it('accepts a POST to create a new instance of ' + resource, function(done){
    superagent.post(collection_url)
      .send(mock_resource)
      .end(function(e, res){
        expect(e).to.equal(null);
        id = res.body._id;
        element_url = collection_url + '/' + id;
        done();
      });
  });

  it('retrieves a collection of ' + resource, function(done){
    superagent.get(collection_url)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(res.body.map(function(item){return item._id;})).to.contain(id);
        done();
      });
  });

  it('retrieves an instance of ' + resource, function(done){
    superagent.get(element_url)
      .end(function(e,res){
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id).to.eql(id);
        done();
      });
  });

  it('updates an instance of ' + resource, function(done){
    superagent.put(element_url)
      .send(mock_update)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id).to.eql(id);
        expect(res.body.version).to.eql('2.0.0');
        done();
      });
  });

  it('checks an instance of ' + resource, function(done){
    superagent.get(element_url)
      .end(function(e, res){
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id).to.eql(id);
        expect(res.body.version).to.eql('2.0.0');
        done();
      });
  });

  it('removes an instance of ' + resource, function(done){
    superagent.del(element_url)
      .end(function(e,res){
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id).to.eql(id);
        expect(res.body.version).to.eql('2.0.0');
        done();
      });
  });
});
