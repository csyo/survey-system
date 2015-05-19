'use strict';

angular.module('surveyApp')
  .controller('ItemCtrl', function ($scope, surveydata, ngDialog) {
    $scope.itemTypes = surveydata.getItemType('arr');
    $scope.done = function() {
      var item = {
        itemOrder: $scope.itemOrder | surveydata.getItemIndex() + 1,
        itemCount: $scope.itemCount | 0,
        itemType: $scope.itemType,
        must: false,
        content: '編輯'
      };
      surveydata.setItem(item);
      // ngDialog.closeAll();
    };
  });
