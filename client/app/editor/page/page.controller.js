'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($scope, $state, ngDialog, surveydata) {
    var currentPage = $scope.currentPage = surveydata.getCurrentPage();
    $scope.itemTypes = surveydata.getItemType('arr');
    $scope.scaleOptions = [
        {val: 3},
        {val: 4},
        {val: 5},
        {val: 6},
        {val: 7}
    ];

    $scope.rowCollection = surveydata.getItems();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {
        surveydata.setItems($scope.rowCollection);
        // clear tmpPage data
        surveydata.reset();
        // change route
        $state.go('editor');
    };

    $scope.checkRow = function(row) {
        var type = surveydata.getItemType();
        switch (row.itemType.val) {
            case type['likert'].val:
            case type['semantic'].val:
                row.multicontent = '';
                break;
            case type['likert-group'].val:
            case type['semantic-group'].val:
                row.content = '';
            default:
                row.multicontent = '';
                row.options = undefined;
        }
    };

    $scope.checkGroup = function(row) {
        var type = surveydata.getItemType();
        switch (row.itemType.val) {
            case type['likert-group'].val:
            case type['semantic-group'].val:
                return true;
            default:
                return false;
        }
    };

    $scope.checkType = function(item) {
        var type = surveydata.getItemType();
        switch (item.val) {
            case type['likert'].val:
            case type['likert-group'].val:
            case type['semantic'].val:
            case type['semantic-group'].val:
                return true;
            default:
                return false;
        }
    };

    $scope.addItem = function() {
        $scope.inserted = {
            itemOrder: surveydata.getItemIndex() + 1,
            itemType: '',
            must: false,
            content: ''
        };
        $scope.rowCollection.push($scope.inserted);
    };

    $scope.removeItem = function(index) {
        $scope.rowCollection.splice(index, 1);
    };
  });
