'use strict';

angular.module('surveyApp')
  .controller('ConfirmCtrl', function($modalInstance, title) {
    var vm = this;
    vm.ok = ok;
    vm.cancel = cancel;
    vm.surveyTitle = title;

    function ok() {
      $modalInstance.close(true);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  });
