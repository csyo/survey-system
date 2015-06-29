'use strict';

angular.module('surveyApp')
  .controller('PermissionCtrl', function($modalInstance, permissionList) {
    var permission = this;

    this.add = add;
    this.remove = remove;
    this.ok = ok;
    this.cancel = cancel;
    var data = this.data = permissionList.map(function(item) { return {name: item}; });

    function add() {
      data.push({});
    }

    function remove(index) {
      data.splice(index, 1);
    }

    function ok() {
      $modalInstance.close(permission.data);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  });
