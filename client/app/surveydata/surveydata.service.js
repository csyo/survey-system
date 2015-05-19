'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $location) {

    var user = {};
    user.info = Auth.getCurrentUser();
    user.surveys = [];

    var tmpSurvey = { index: 0, title: '', account: '', status: false, pages: []},
      tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', items: []};

    var pageTypes = [
      { val: 'questionary', name: '問卷頁面'},
      { val: 'multimedia', name: '多媒體頁面'},
      { val: 'description', name: '文字說明頁面'},
      { val: 'information', name: '資料填答頁面'}
    ];

    var itemTypes = [
      { val: 'title', name: '標題'},
      { val: 'caption', name: '說明'},
      { val: 'likert', name: '李克特量表'},
      { val: 'likert-group', name: '李克特量表題組'},
      { val: 'semantic', name: '語意差異量表'},
      { val: 'semantic-group', name: '語意差異量表題組'},
      { val: 'choice', name: '選擇題'},
      { val: 'fill-in-blank', name: '問答題'}
    ],
    itemTypesRef = itemTypes.reduce(function(o, v, i){
      o[v.val] = v
      return o;
    }, {});

    // Public API here
    return {
      pageType: pageTypes,
      getItemType: function (type) {
        if (type === 'arr') return itemTypes;
        else return itemTypesRef;
      },
      reset: function () {
        var type = $location.path();
        switch (type) {
          case '/editor/page':
            tmpPage.pageOrder = 0;
            tmpPage.pageCount = 0;
            tmpPage.pageType = '';
            tmpPage.items = [];
            break;
          case '/editor':
            break;
        }
      },
      setSurveys: function (data) {
        data.account = user.info.name;
        user.surveys.push(data);
      },
      getSurveys: function () { return user.surveys; },
      getCurrentSurvey: function () { return tmpSurvey; },
      setPage: function (data) { tmpSurvey.pages.push(data); },
      getPages: function () { return tmpSurvey.pages; },
      getPageIndex: function () { return tmpSurvey.pages.length; },
      getCurrentPage: function () { return tmpPage; },
      setItem: function (data) {
        tmpPage.items.push(data);
        tmpSurvey.pages[tmpPage.pageOrder - 1].items = tmpPage.items;
      },
      getItems: function () {
        var items = tmpSurvey.pages[tmpPage.pageOrder - 1].items;
        if (!items) return tmpPage.items;
        else {
          tmpPage.items = items;
          return items;
        }
      },
      getItemIndex: function () { return tmpPage.items.length; }
    };
  });
