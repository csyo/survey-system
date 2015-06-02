'use strict';

angular.module('surveyApp')
  .controller('OptionsCtrl', function ($modalInstance, optionList) {
    var options = this;

    var data = this.data = {};
    data.list = optionList.list || optionList;
    data.typeName = optionList.typeName || '';

    this.add = add;
    this.removeLast = removeLast;
    this.ok = ok;
    this.cancel = cancel;

    function add() {
      var newIndex = data.list.length + 1;
      data.list.push({index: newIndex});
    };

    function removeLast() {
      var lastIndex = data.list.length - 1;
      data.list.splice(lastIndex);
    };

    function ok() {
      $modalInstance.close(options.data);
    };

    function cancel() {
      $modalInstance.dismiss('cancel');
    };
  });
