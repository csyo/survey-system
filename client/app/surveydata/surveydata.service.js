'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth) {

    var user = this;
    user.name = Auth.getCurrentUser().name;
    user.surveys = [];

    var tmpSurvey = {index: 0, title: '', account: user.name, status: false},
      tmpPage = { pageOrder: 0, pageCount: 0 , pageType: ''};

    var pageType = [
      { val: 'txt', name: '文字頁面'},
      { val: 'pic', name: '圖片頁面'},
      { val: 'mix', name: '問卷頁面'},
      { val: 'ans', name: '填答頁面'}
    ];

    var survey = tmpSurvey;
    survey.pages = [];

    // Public API here
    return {
      pageType: pageType,
      setSurveys: function (data) { user.surveys.push(data); },
      getSurveys: function () { return user.surveys; },
      getCurrentSurvey: function () { return tmpSurvey; },
      setPage: function (data) { survey.pages.push(data); },
      getPages: function () { return survey.pages; },
      getPageIndex: function () { return survey.pages.length; },
      getCurrentPage: function () { return tmpPage; }
    };
  });
