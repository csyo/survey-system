'use strict';

angular.module('surveyApp')
  .controller('OptionsCtrl', function ($scope, $modalInstance, options) {
    $scope.options = options;

    $scope.add = function() {
      var newIndex = $scope.options.length + 1;
      $scope.options.push({id: newIndex});
    };

    $scope.removeLast = function() {
      var lastIndex = $scope.options.length - 1;
      $scope.options.splice(lastIndex);
    };

    $scope.ok = function() {
      $modalInstance.close($scope.options);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
