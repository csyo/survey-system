'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($scope, $location, ngDialog) {
    $scope.currentSurvey = {
        // title: 'TestSurvey'
    };

    $scope.rowCollection = [
        {order: 0, pageType: 'unknown'}
    ];

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {

    };

    $scope.addItem = function() {
        ngDialog.open({
            template: 'app/editor/type/type.html',
            controller: 'TypeCtrl'
        });
    };
    $scope.editItem = function() {
        $location.path('/editor/page');
    };
    $scope.removeItem = function() {

    };

  });
