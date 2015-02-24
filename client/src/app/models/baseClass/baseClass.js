"use strict";

(function () {
  "use strict";

  angular.module("unacademic.models.baseClass", []).factory("BaseClass", initBaseClass);

  function initBaseClass($http, $q, DataStore, utilities, dispatcher) {
    var BaseClass = (function () {
      var BaseClass = function BaseClass(data) {
        var _this = this;
        var instance = data || {};

        var schema = this.constructor.schema;
        var props = _.keys(schema.properties);

        if (!instance.id) {
          instance.id = utilities.generateUID();
        }
        _.each(props, function (prop) {
          _this[prop] = instance[prop];
        });

        if (!this.curator || this.curator === "general") {
          this.curator = dispatcher.getState().user;
        }
      };

      BaseClass.prototype.save = function () {
        var _this2 = this;
        var schema = this.constructor.schema;
        var props = _.keys(schema.properties);


        var required = _.select(props, function (prop) {
          return schema.properties[prop].required;
        });

        var valid = true;

        _.each(required, function (field) {
          valid = !_this2[field] ? false : valid;
        });

        if (valid) {
          var model = JSON.stringify(this);
          return DataStore.save(this);
        }

        return $q.reject();
      };

      BaseClass.getAll = function (userId) {
        var extractUserData = _.bind(_extractUserData, this);
        var extractObjects = _.bind(_extractObjects, this);

        if (!userId) {
          return DataStore.get(this.name).then(extractUserData);
        } else {
          return DataStore.get(this.name, userId).then(extractObjects);
        }
      };

      BaseClass.get = function (userId, id) {
        var extractData = _.bind(_extractData, this);

        return DataStore.get(this.name, userId, id).then(extractData);
      };

      BaseClass.initialize = function (_ref) {
        var schema = _ref.schema;
        var initData = _ref.initData;
        this.schema = schema;
        this.initData = initData;
      };

      return BaseClass;
    })();

    function _extractUserData(data) {
      var extractObjects = _.bind(_extractObjects, this);
      if (data) {
        var _ret = (function () {
          var names = _.keys(data);
          var users = _.map(names, function (name) {
            return data[name];
          });
          var objects = _.map(users, function (user) {
            return extractObjects(user);
          });
          return {
            v: _.flatten(objects)
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      }
    }

    function _extractObjects(data) {
      var _this3 = this;
      if (data) {
        var keys = _.keys(data);
        return _.map(keys, function (key) {
          return new _this3(data[key]);
        });
      }
    };

    function _extractData(data) {
      if (data) {
        return new this(data);
      }
      return new this(this.initData);
    };

    return BaseClass;
  };
})();