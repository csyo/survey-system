'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $state, $http) {

  var surveydata = this;
  surveydata.surveys = [];

  // save currently editting survey data
  var tmpSurvey = { serialNo: '', title: '', pages: []},
    tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', items: []};

  // different types for a single page of a survey
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

  // different types for a single item of a page
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
    fetchSurveys: function (callback) {
      if (!surveydata.surveys.length) {
        Auth.isLoggedInAsync(function(loggedIn){
          if (loggedIn) {
            var name = Auth.getCurrentUser().name;
            $http({
              method: 'GET',
              url: '/api/surveys',
              params: { account: name }
            })
              .success(function(data, status){
                data.sort(function(a, b){
                  if (a.serialNo < b.serialNo) return -1;
                  else if (a.serialNo > b.serialNo) return 1;
                  else return 0;
                });
                data.forEach(function(survey, index){
                  survey.index = index;
                });
                surveydata.surveys = [].concat(data);
                if (callback) callback();
              });
          }
        });
      }
    },
    setSurveys: function (data, callback) {
      var survey = {};
      survey.title = data.title;
      survey.serialNo = data.serialNo;
      survey.status = data.status || false;
      survey.pages = data.pages;
      survey.account = data.account || Auth.getCurrentUser().name;
      if (survey.serialNo) { // edit mode
        survey.index = data.index || (parseInt(data.serialNo) - 1);
        survey._id = data._id;
        surveydata.surveys[survey.index] = survey;
        $http.put('/api/surveys/:id', survey)
          .success(function(data, status, headers, config){
            console.log(data);
          })
          .error(function(err, status, headers, config){
            if (err) throw Error(err);
          });
      } else { // add mode
        survey.index = surveydata.surveys.length;
        var pad = '000', n = parseInt(surveydata.surveys[survey.index-1].serialNo) + 1;
        survey.serialNo = (pad+n).slice(-pad.length);
        surveydata.surveys.push(survey);
        $http.post('/api/surveys', survey)
          .success(function(data, status, headers, config){
            console.log(data);
            surveydata.surveys[survey.index]._id = data._id;
          })
          .error(function(err, status, headers, config){
            if (err) throw Error(err);
          });
      }
      if (callback) callback();
    },
    getSurveys: function () { return surveydata.surveys; },
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
