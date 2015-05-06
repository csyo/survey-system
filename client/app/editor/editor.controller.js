'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($scope) {
    $scope.currentSurvey = {
        // title: 'TestSurvey'
    };

    $scope.rowCollection = [
        {order: 0, type: 'unknown'}
    ];

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {

    };

    $scope.addItem = function() {

    };
    $scope.editItem = function() {

    };
    $scope.removeItem = function() {

    };

  });
