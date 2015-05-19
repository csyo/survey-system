'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($scope, $location, ngDialog, surveydata) {
    var currentSurvey = $scope.currentSurvey = surveydata.getCurrentSurvey(); // TODO: how to detect the 'add' or 'edit' mode

    $scope.rowCollection = surveydata.getPages();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function() {
        surveydata.setSurveys(currentSurvey);
    };

    $scope.addPage = function() {
        ngDialog.open({
            template: 'app/editor/type/type.html',
            controller: 'TypeCtrl'
        });
    };
    $scope.editPage = function(row) {
        console.log(row);
        // update current page info
        var targetPage = surveydata.getCurrentPage();
        targetPage.pageOrder = row.pageOrder;
        targetPage.pageCount = row.pageCount;
        targetPage.pageType = row.pageType;
        // change route
        switch (targetPage.pageType) {
            case surveydata.pageType[0]: // questionary
                $location.path('/editor/page');
                break;
            case surveydata.pageType[1]: // multimedia
            case surveydata.pageType[2]: // description
            case surveydata.pageType[3]: // information
                break;
        }
    };
    $scope.removePage = function(row) {

    };

  });
