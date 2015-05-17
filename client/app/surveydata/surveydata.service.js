'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth) {

    var user = this;
    user.name = Auth.getCurrentUser().name;
    user.surveys = [];

    var tmpSurvey = {index: 0, title: '', account: user.name, status: false},
      tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', must: true};

    var pageType = [
      { val: 'txt', name: '文字頁面'},
      { val: 'pic', name: '圖片頁面'},
      { val: 'mix', name: '問卷頁面'},
      { val: 'ans', name: '填答頁面'}
    ];

    var itemType = [
      { val: 'title', name: '標題'},
      { val: 'likert', name: '李克特量表'},
      { val: 'likert-group', name: '李克特量表題組'},
      { val: 'semantic', name: '語意差異量表'},
      { val: 'semantic-group', name: '語意差異量表題組'},
      { val: 'choice', name: '選擇題'},
      { val: 'answer', name: '問答題'}
    ];

    var survey = tmpSurvey;
    survey.pages = [];

    var page = tmpPage;
    page.items = [];

    // Public API here
    return {
      pageType: pageType,
      itemType: itemType,
      setSurveys: function (data) { user.surveys.push(data); },
      getSurveys: function () { return user.surveys; },
      getCurrentSurvey: function () { return tmpSurvey; },
      setPage: function (data) { survey.pages.push(data); },
      getPages: function () { return survey.pages; },
      getPageIndex: function () { return survey.pages.length; },
      getCurrentPage: function () { return tmpPage; },
      setItem: function (data) { page.items.push(data); },
      getItems: function () { return page.items; },
      getItemIndex: function () { return page.items.length; }
    };
  });
