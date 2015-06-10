'use strick';

angular.module('surveyApp')
  .controller('ConfirmCtrl', function ($modalInstance, title) {
    var vm = this;
    this.ok = ok;
    this.cancel = cancel;
    this.surveyTitle = title;

    function ok() {
      $modalInstance.close(true);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  });
