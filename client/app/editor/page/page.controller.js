'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($scope, $state, $modal, surveydata) {
    var currentPage = $scope.currentPage = surveydata.getCurrentPage();
    var itemType = surveydata.getItemType();
    $scope.itemTypes = surveydata.getItemType('arr');
    $scope.scaleOptions = [3,4,5,6,7].map(function(elem,i){
      return elem = { scaleVal: elem};
    });

    $scope.tips = '';

    $scope.rowCollection = surveydata.getItems();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {
        console.log($scope.rowCollection);
        surveydata.setItems($scope.rowCollection);
        // clear tmpPage data
        surveydata.reset();
        // change route
        $state.go('editor');
    };

    $scope.editOptions = function(row) {
      var options = $modal.open({
        animation: true,
        templateUrl: 'app/editor/page/options/options.html',
        controller: 'OptionsCtrl',
        resolve: {
          options: function () { return row.options ? row.options : [{index: 1}, {index: 2}]; }
        }
      });

      options.result.then(function (optionList){
        row.options = optionList;
        console.log(row);
      });
    };

    $scope.checkRow = function(row) {
        // clean previous data
        $scope.tips = '';
        row.content = '';
        if (row.options) row.options = undefined;
        // add default value for scales
        switch (row.itemType.val) {
            case itemType['semantic-group'].val:
            case itemType['semantic'].val:
              $scope.tips = '左右項目之間請以逗號隔開';
            case itemType['likert-group'].val:
            case itemType['likert'].val:
              row.options = $scope.scaleOptions[4]; // set default scale to 7
              break;
        }
    };

    $scope.checkGroup = function(row) {
        switch (row.itemType.val) {
            case itemType['likert-group'].val:
            case itemType['semantic-group'].val:
                return 'text-area.html';
            default:
                return 'text-input.html';
        }
    };

    $scope.checkScale = function(item) {
        switch (item.val) {
            case itemType['likert'].val:
            case itemType['likert-group'].val:
            case itemType['semantic'].val:
            case itemType['semantic-group'].val:
                return true;
            default:
                return false;
        }
    };

    $scope.checkChoice = function(item) {
      switch (item.val) {
        case itemType['choice'].val:
          return true;
        default:
          return false;
      }
    };

    $scope.format = function (row, flag) {
      if (row.itemType && row.itemType.val.search(/group/g)) {
        if (flag) row.content = row.content.replace(/\n/g,"<br>");
        else row.content = row.content.replace(/<br>/g, "\n");
      }
      return true;
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
