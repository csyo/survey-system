'use strict';

angular.module('surveyApp')
  .controller('TextCtrl', function ($scope, ngDialog, surveydata) {
    $scope.htmlContent = surveydata.getHtmlText();
    $scope.done = function () {
        surveydata.setHtmlText($scope.htmlContent);
        ngDialog.closeAll();
    };
  });
