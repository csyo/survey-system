'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($scope, $location, ngDialog, surveydata) {
    $scope.currentPage = surveydata.getCurrentPage();

    $scope.rowCollection = surveydata.getItems();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {
        // TODO: saving changes
        $location.path('/editor');
    };

    $scope.addItem = function() {
        ngDialog.open({
            template: 'app/editor/item/item.html',
            controller: 'ItemCtrl'
        });
    };
    $scope.editItem = function(row) {
        console.log(row);
    };
    $scope.removeItem = function() {

    };
  });
