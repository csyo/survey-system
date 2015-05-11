'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($scope, $location, ngDialog) {
    $scope.currentPage = {
        // title: 'TestSurvey'
    };

    $scope.rowCollection = [
        {order: 0, must: true, itemType: 'unknown', title: 'test'}
    ];

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {

    };

    $scope.addItem = function() {
        ngDialog.open({
            template: 'app/editor/item/item.html',
            controller: 'ItemCtrl'
        });
    };
    $scope.editItem = function() {

    };
    $scope.removeItem = function() {

    };
  });
