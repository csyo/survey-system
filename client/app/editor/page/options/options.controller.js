'use strict';

angular.module('surveyApp')
  .controller('OptionsCtrl', function ($scope, $modalInstance, options) {
    $scope.options = options;
    $scope.options.typeName = options.typeName || '';

    $scope.add = function() {
      var newIndex = $scope.options.data.length + 1;
      $scope.options.data.push({index: newIndex});
    };

    $scope.removeLast = function() {
      var lastIndex = $scope.options.data.length - 1;
      $scope.options.data.splice(lastIndex);
    };

    $scope.ok = function() {
      $modalInstance.close($scope.options);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
