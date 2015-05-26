'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $state) {

    var user = {};
    user.info = Auth.getCurrentUser();
    user.surveys = [];

    var tmpSurvey = { serialNo: '', title: '', pages: []},
      tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', items: []};

    var pageTypes = {};
    pageTypes.arr = [
      { val: 'questionary', name: '問卷頁面'},
      { val: 'description', name: '文字說明頁面'},
      { val: 'multimedia', name: '多媒體頁面'}
    ];
    pageTypes.obj = pageTypes.arr.reduce(function(o, v){ // access types by val
      o[v.val] = v;
      return o;
    }, {});

    var itemTypes = {};
    itemTypes.arr = [
      { val: 'title', name: '標題'},
      { val: 'caption', name: '說明'},
      { val: 'likert', name: '李克特量表'},
      { val: 'likert-group', name: '李克特量表題組'},
      { val: 'semantic', name: '語意差異量表'},
      { val: 'semantic-group', name: '語意差異量表題組'},
      { val: 'choice', name: '選擇題'},
      { val: 'fill-in-blank', name: '問答題'}
    ];
    itemTypes.obj = itemTypes.arr.reduce(function(o, v){ // access types by val
      o[v.val] = v;
      return o;
    }, {});

    // Public API here
    return {
      getPageType: function (type) {
        if (type === 'arr') return pageTypes.arr;
        else return pageTypes.obj;
      },
      getItemType: function (type) {
        if (type === 'arr') return itemTypes.arr;
        else return itemTypes.obj;
      },
      reset: function () {
        var state = $state.current.name;
        switch (state) {
          case 'page':
            tmpPage.pageOrder = 0;
            tmpPage.pageCount = 0;
            tmpPage.pageType = '';
            tmpPage.items = [];
            break;
          case 'editor':
            tmpSurvey.serialNo = '';
            tmpSurvey.title = '';
            tmpSurvey.pages = [];
            break;
        }
      },
      getUserData: function () { return user; },
      setSurveys: function (data, callback) {
        var survey = {};
        survey.title = data.title;
        survey.serialNo = data.serialNo;
        survey.status = data.status || false;
        survey.pages = data.pages;
        survey.account = data.account || user.info.name;
        if (survey.serialNo) { // edit mode
          survey.index = data.index;
          user.surveys[survey.index] = survey;
        } else { // add mode
          survey.index = user.surveys.length;
          var pad = '000', n = survey.index + 1;
          survey.serialNo = (pad+n).slice(-pad.length);
          user.surveys.push(survey);
        }
        if (callback) callback();
      },
      getSurveys: function () { return user.surveys; },
      getCurrentSurvey: function () { return tmpSurvey; },
      setCurrentSurvey: function (data) { tmpSurvey = data; },
      setPage: function (data) { tmpSurvey.pages.push(data); },
      getPages: function () { return tmpSurvey.pages; },
      getPageIndex: function () { return tmpSurvey.pages.length; },
      getCurrentPage: function () { return tmpPage; },
      setItems: function (items) { tmpSurvey.pages[tmpPage.pageOrder - 1].items = items; },
      getItems: function () {
        var items = tmpSurvey.pages.length ? tmpSurvey.pages[tmpPage.pageOrder - 1].items : '';
        if (!items) return tmpPage.items;
        else {
          tmpPage.items = items;
          return items;
        }
      },
      getItemIndex: function () { return tmpPage.items.length; },
      setHtmlText: function (data) {
          tmpSurvey.pages[tmpPage.pageOrder-1].content = data;
      },
      getHtmlText: function () {
          return tmpSurvey.pages[tmpPage.pageOrder-1].content || '';
      }
    };
  });
