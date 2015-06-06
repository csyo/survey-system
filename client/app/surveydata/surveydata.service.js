'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $state, $http, $resource) {

  var surveydata = {
    surveys: []
  };

  // currently editting survey data
  var tmpSurvey = { serialNo: '', title: '', pages: []},
    tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', items: []};

  // different types for a single page of a survey
  var pageType = {
    questionary: { val: 'questionary', name: '問卷頁面'},
    description: { val: 'description', name: '文字說明頁面'},
    multimedia: { val: 'multimedia', name: '多媒體頁面'}
  };

  // different types for a single item of a page
  var itemType = {
    title: { val: 'title', name: '標題'},
    caption: { val: 'caption', name: '說明'},
    likert: { val: 'likert', name: '李克特量表'},
    likerts: { val: 'likerts', name: '李克特量表題組'},
    semantic: { val: 'semantic', name: '語意差異量表'},
    semantics: { val: 'semantics', name: '語意差異量表題組'},
    choice: { val: 'choice', name: '選擇題'},
    blank : { val: 'blank', name: '填答題'}
  };

  var surveydataService = {
    getPageType : function() { return pageType; },
    getItemType : function() { return itemType; },
    reset : reset,
    setSurveys : function(data) { surveydata.surveys = data; },
    getSurveys : function() { return surveydata.surveys; },
    fetchSurveys : fetchSurveys,
    setCurrentSurvey : function(data) { tmpSurvey = data; },
    getCurrentSurvey : function() { return tmpSurvey; },
    setPages : setPages,
    getPages : function() { return tmpSurvey.pages; },
    getPageIndex : function() { return tmpSurvey.pages.length; },
    setCurrentPage: setCurrentPage,
    getCurrentPage : function() { return tmpPage; },
    setItems : setItems,
    getItems : getItems,
    getItemIndex : function() { return tmpPage.items.length; },
    setHtmlText : setHtmlText,
    getHtmlText : getHtmlText,
    getFile : getFile
  };
  return surveydataService;

  /*** Implementations ***/

  function reset() {
    var state = $state.current.name;
    switch (state) {
      case 'login':
      case 'singup':
        surveydata.surveys = [];
        break;
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

  function fetchSurveys() {
    return $http.get('/api/surveys')
      .then(fetchSurveysComplete)
      .catch(fetchSurveysFailed);

    function fetchSurveysComplete(response) {
      var data = response.data;
      data.sort(function(a, b){ // sort the data by serial number
        if (a.serialNo < b.serialNo) return -1;
        else if (a.serialNo > b.serialNo) return 1;
        else return 0;
      });
      data.forEach(function(survey, index){ // add index for sorted data
        survey.index = index;
      });
      surveydata.surveys = [].concat(data);
      return data;
    }

    function fetchSurveysFailed(error) {
      console.error('XHR Failed for fetchSurveys.', error.data);
    }
  }

  function setPages(data, callback) {
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
      $http.put('/api/surveys/' + data._id, survey)
        .success(function(data){
        console.log(data);
      }).error(function(err){
        if (err) throw Error(err);
      });
    } else { // add mode
      survey.index = surveydata.surveys.length;
      var lastNo = survey.index ? surveydata.surveys[survey.index-1].serialNo : '0';
      var pad = '000', n = parseInt(lastNo) + 1;
      survey.serialNo = (pad+n).slice(-pad.length);
      surveydata.surveys.push(survey);
      $http.post('/api/surveys', survey)
        .success(function(data){
          console.log(data);
          surveydata.surveys[survey.index]._id = data._id;
        }).error(function(err){
          if (err) throw Error(err);
        });
    }
    if (callback) callback();
  }

  function setCurrentPage(page) {
    if (page) {
      tmpPage.pageOrder = page.pageOrder;
      tmpPage.pageCount = page.pageCount;
      tmpPage.pageType = page.pageType;
      tmpPage.fileId = page.fileId || null;
      return tmpPage;
    } else return null;
  }

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

  function setHtmlText(data) {
    tmpSurvey.pages[tmpPage.pageOrder-1].content = data;
  }

  function getHtmlText() {
    return tmpSurvey.pages[tmpPage.pageOrder-1].content || '';
  }

  function getFile(fileId) {
    if (!fileId) return;
    var Upload = $resource('/api/uploads/:id', {id:'@id'}, {
      query:  { method: 'GET', isArray:false }
    });
    return Upload.query({ id: fileId });
  }

});
