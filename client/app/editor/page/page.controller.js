'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($scope, $location, ngDialog, surveydata) {
    var currentPage = $scope.currentPage = surveydata.getCurrentPage();

    $scope.rowCollection = surveydata.getItems();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {
        // clear tmpPage data
        surveydata.reset();
        // change route
        $location.path('/editor');
    };

    $scope.addItem = function() {
        ngDialog.open({
            template: 'app/editor/item/item.html',
            controller: 'ItemCtrl'
        });
    };
    $scope.editItem = function(row) {
        var type = surveydata.getItemType()
        switch (row.itemType.val) {
            case type['likert'].val:
            case type['likert-group'].val:
                break;
            case type['semantic'].val:
            case type['semantic-group'].val:
                break;
        }
    };
    $scope.removeItem = function() {

    };
  });
