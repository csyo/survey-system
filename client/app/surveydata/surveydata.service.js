'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $state, $http) {

  var surveydata = {};
  surveydata.surveys = [];

  // currently editting survey data
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

  var surveydataService = {
    getUserName : Auth.getUserData,
    getPageType : getPageType,
    getItemType : getItemType,
    reset : reset,
    fetchSurveys : fetchSurveys,
    setSurveys : setSurveys,
    getSurveys : getSurveys,
    setCurrentSurvey : setCurrentSurvey,
    getCurrentSurvey : getCurrentSurvey,
    setPage : setPage,
    getPages : getPages,
    getPageIndex : getPageIndex,
    getCurrentPage : getCurrentPage,
    setItems : setItems,
    getItems : getItems,
    getItemIndex : getItemIndex,
    setHtmlText : setHtmlText,
    getHtmlText : getHtmlText
  };
  return surveydataService;

  function getPageType(type) {
    if (type === 'arr') return pageTypes.arr;
    else return pageTypes.obj;
  }

  function getItemType(type) {
    if (type === 'arr') return itemTypes.arr;
    else return itemTypes.obj;
  }

  function reset() {
    var state = $state.current.name;
    switch (state) {
      case 'login':
      case 'singup':
        surveydata.surveys = [];
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
  }

  function fetchSurveys(callback) {
    if (!surveydata.surveys.length) {
      Auth.isLoggedInAsync(function(loggedIn){
        if (loggedIn) {
          var name = Auth.getCurrentUser().name;
          $http({
            method: 'GET',
            url: '/api/surveys',
            params: { account: name }
          }).success(function(data, status){
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
  }

  function setSurveys(data, callback) {
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
      $http({
        method: 'PUT',
        url: '/api/surveys/:id',
        data: survey,
        params: { id: data._id }
      }).success(function(data, status, headers, config){
        console.log(data);
      }).error(function(err, status, headers, config){
        if (err) throw Error(err);
      });
    } else { // add mode
      survey.index = surveydata.surveys.length;
      var lastNo = survey.index ? surveydata.surveys[survey.index-1].serialNo : '0';
      var pad = '000', n = parseInt(lastNo) + 1;
      survey.serialNo = (pad+n).slice(-pad.length);
      surveydata.surveys.push(survey);
      $http.post('/api/surveys', survey)
        .success(function(data, status, headers, config){
          console.log(data);
          surveydata.surveys[survey.index]._id = data._id;
        }).error(function(err, status, headers, config){
          if (err) throw Error(err);
        });
    }
    if (callback) callback();
  }

  function getSurveys() { return surveydata.surveys; }
  function setCurrentSurvey(data) { tmpSurvey = data; }
  function getCurrentSurvey() { return tmpSurvey; }
  function setPage(data) { tmpSurvey.pages.push(data); }
  function getPages() { return tmpSurvey.pages; }
  function getPageIndex() { return tmpSurvey.pages.length; }
  function getCurrentPage() { return tmpPage; }

  function setItems(items) {
    tmpSurvey.pages[tmpPage.pageOrder - 1].items = items;
  }

  function getItems() {
    var items = tmpSurvey.pages.length ? tmpSurvey.pages[tmpPage.pageOrder - 1].items : '';
    if (!items) return tmpPage.items;
    else {
      tmpPage.items = items;
      return items;
    }
  }

  function getItemIndex() { return tmpPage.items.length; }

  function setHtmlText(data) {
    tmpSurvey.pages[tmpPage.pageOrder-1].content = data;
  }

  function getHtmlText() {
    return tmpSurvey.pages[tmpPage.pageOrder-1].content || '';
  }

});
