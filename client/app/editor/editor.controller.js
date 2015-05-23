'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($scope, $state, ngDialog, surveydata) {
    $scope.currentSurvey = surveydata.getCurrentSurvey();
    $scope.pageTypes = surveydata.getPageType('arr');
    $scope.theme = 'ngdialog-theme-default custom-width';

    $scope.rowCollection = surveydata.getPages();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.saveAll = function () {
      surveydata.setSurveys($scope.currentSurvey, function (err) {
        if (err) throw Error('error on saving survey');
        // clear tmpSurvey data
        surveydata.reset();
        // change route
        $state.go('main');
      });
    };

    $scope.addPage = function () {
      $scope.inserted = {
        pageOrder: surveydata.getPageIndex() + 1,
        pageCount: 0,
        pageType: ''
      };
      $scope.rowCollection.push($scope.inserted);
    };
    $scope.editPage = function (row) {
      console.log(row);
      // update current page info
      var targetPage = surveydata.getCurrentPage();
      targetPage.pageOrder = row.pageOrder;
      targetPage.pageCount = row.pageCount;
      targetPage.pageType = row.pageType;
      // change route
      var type = surveydata.getPageType();
      switch (targetPage.pageType.val) {
        case type['questionary'].val:
          $state.go('page');
          break;
        case type['description'].val:
          ngDialog.open({
            template: 'app/editor/text/text.html',
            className: 'ngdialog-theme-default custom-width',
            controller: 'TextCtrl'
          });
          break;
        case type['multimedia'].val:
          break;
      }
    };
    $scope.removePage = function (index) {
      $scope.rowCollection.splice(index, 1);
    };

  });