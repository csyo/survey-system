'use strict';

angular.module('surveyApp')
  .controller('ItemCtrl', function ($scope, surveydata, ngDialog) {
    $scope.itemTypes = surveydata.itemType;
    $scope.done = function() {
      var item = {
        itemOrder: $scope.itemOrder | surveydata.getItemIndex() + 1,
        itemCount: $scope.itemCount | 0,
        itemType: $scope.itemType,
        must: false,
        title: '編輯題目'
      };
      surveydata.setItem(item);
      ngDialog.closeAll();
    };
  });
