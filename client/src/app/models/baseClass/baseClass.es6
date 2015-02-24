(() => {
  'use strict';

  angular.module('unacademic.models.baseClass', [])
         .factory('BaseClass', initBaseClass);

  function initBaseClass($http, $q, DataStore, utilities, dispatcher){

    class BaseClass {

      constructor(data){
        let instance = data || {};

        let schema = this.constructor.schema;
        let props = _.keys(schema.properties);

        if(!instance.id){
          instance.id = utilities.generateUID();
        }
        _.each(props, (prop) => { this[prop] = instance[prop]; });

        if(!this.curator || this.curator === 'general'){
          this.curator = dispatcher.getState().user;
        }
      }

      save(){
        let schema = this.constructor.schema;
        let props = _.keys(schema.properties);


        let required = _.select(props, function(prop){
           return schema.properties[prop].required;
        });

        let valid = true;

        _.each(required, (field) => {
          valid = !this[field] ? false : valid;
        });

        if(valid){
          let model = JSON.stringify(this);
          return DataStore.save(this);
        }

        return $q.reject();

      }

      static getAll(userId){
        let extractUserData = _.bind(_extractUserData, this);
        let extractObjects = _.bind(_extractObjects, this);

        if(!userId){
          return DataStore.get(this.name)
            .then(extractUserData);
        } else {
          return DataStore.get(this.name, userId)
            .then(extractObjects);
        }
      }

      static get(userId, id){
        let extractData = _.bind(_extractData, this);

        return DataStore.get(this.name, userId, id)
          .then(extractData);
      }

      static initialize({schema, initData}){
        this.schema = schema;
        this.initData = initData;
      }
    }

    function _extractUserData(data){
      let extractObjects = _.bind(_extractObjects, this);
      if(data){
        let names = _.keys(data);
        let users = _.map(names, (name) => data[name]);
        let objects = _.map(users, (user) => extractObjects(user));
        return _.flatten(objects);
      }
    }

    function _extractObjects(data){
      if(data){
        let keys = _.keys(data);
        return _.map(keys, (key) => new this(data[key]));
      }
    };

    function _extractData(data){
      if(data){
        return new this(data);
      }
      return new this(this.initData);
    };

    return BaseClass
  };
})();
