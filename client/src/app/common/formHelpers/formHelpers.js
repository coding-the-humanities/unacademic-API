"use strict";

(function () {
  "use strict";

  angular.module("unacademic.common.formHelpers", []).factory("formHelpers", formHelpers);

  function formHelpers(dispatcher) {
    return {
      submit: submit,
      checkForm: checkForm
    };

    function submit(form, model) {
      if (!form.$dirty) {
        return dispatcher.setState({ mode: "learning" });
      }

      if (form.$dirty && form.$valid) {
        form.$setPristine();
        model.save().then(success, error);
      }

      function success() {
        dispatcher.queue({ remove: model.id });
        dispatcher.setState({ mode: "learning", resource: { id: model.id, curator: model.curator } });
      }

      function error() {
        form.$setDirty();
      }
    }

    function checkForm(form, modelId) {
      if (!!form.$dirty) {
        dispatcher.queue({ add: modelId });
      }
    }
  }
})();