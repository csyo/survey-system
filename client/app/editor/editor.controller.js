'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($state, ngDialog, surveydata) {
    var editor = this;
    this.currentSurvey = surveydata.getCurrentSurvey();
    this.pageTypes = surveydata.getPageType('arr');
    this.theme = 'ngdialog-theme-default custom-width';

    this.rows = surveydata.getPages();
    this.displayed = [].concat(this.rows);

    this.saveAll = function () {
      surveydata.setSurveys(this.currentSurvey, function (err) {
        // clear tmpSurvey data
        surveydata.reset();
        // change route
        $state.go('main');
      });
    };

    this.add = function () {
      this.inserted = {
        pageOrder: surveydata.getPageIndex() + 1,
        pageCount: 0,
        pageType: ''
      };
      this.rows.push(this.inserted);
    };
    this.edit = function (row) {
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
            controller: 'TextCtrl',
            controllerAs: 'text'
          });
          break;
        case type['multimedia'].val:
            ngDialog.open({
              template: 'app/editor/upload/upload.html',
              controller: 'UploadCtrl'
            });
          break;
      }
    };
    this.remove = function (index) {
      this.rows.splice(index, 1);
    };

  });