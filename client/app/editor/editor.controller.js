'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($scope, $location, ngDialog, surveydata) {
    $scope.currentSurvey = surveydata.getCurrentSurvey(); // TODO: how to detect the 'add' or 'edit' mode

    $scope.rowCollection = surveydata.getPages();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {

    };

    $scope.addPage = function() {
        ngDialog.open({
            template: 'app/editor/type/type.html',
            controller: 'TypeCtrl'
        });
    };
    $scope.editPage = function(row) {
        surveydata.getCurrentPage().pageOrder = row.pageOrder;
        surveydata.getCurrentPage().pageCount = row.pageCount;
        surveydata.getCurrentPage().pageType = row.pageType;
        $location.path('/editor/page');
    };
    $scope.removePage = function(row) {

    };

  });
