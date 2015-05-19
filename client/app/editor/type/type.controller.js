'use strict';

angular.module('surveyApp')
  .controller('TypeCtrl', function ($scope, surveydata, ngDialog) {
    $scope.pageTypes = surveydata.pageType;
    $scope.validate = function () {
      return $scope.pageType !== '';
    };
    $scope.done = function() {
      var page = {
        pageOrder: $scope.pageOrder | surveydata.getPageIndex() + 1,
        pageCount: $scope.pageCount | 0,
        pageType: $scope.pageType
      };
      surveydata.setPage(page);
      // ngDialog.closeAll();
    };
  });
