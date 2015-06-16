'use strict';

angular.module('surveyApp')
  .factory('surveydata', function (Auth, $state, $http, logger) {

  var surveydata = {
    surveys: []
  };

  // currently editting survey data
  var tmpSurvey = { serialNo: '', title: '', pages: []},
    tmpPage = { pageOrder: 0, pageCount: 0 , pageType: '', items: []},
    tmpId;

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
    surveyId: tmpId,
    saveResult: saveResult,
    getPageType : function() { return pageType; },
    getItemType : function() { return itemType; },
    reset : reset,
    setSurveys : function(data) { surveydata.surveys = data; },
    getSurveys : function() { return surveydata.surveys; },
    fetchSurveys : fetchSurveys,
    setCurrentSurvey : setCurrentSurvey,
    getCurrentSurvey : getCurrentSurvey,
    removeSurvey: removeSurvey,
    setPages : setPages,
    getPages : function() { return tmpSurvey.pages; },
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

  function saveResult(results) {
    var result = {
      surveyId: surveydataService.surveyId,
      results: results
    };
    return $http.post('/api/results', result)
      .then(savedComplete).catch(savedFailed);

    function savedComplete(responce) {
      return responce;
    }
    function savedFailed(error) {
      logger.error(error);
    }
  }

  function reset() {
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
      case 'survey':
        surveydataService.surveyId = '';
        break;
      default:
        surveydata.surveys = [];
    }
  }

  function fetchSurveys() {
    return $http.get('/api/surveys')
      .then(fetchSurveysComplete)
      .catch(fetchSurveysFailed);

    function fetchSurveysComplete(response) {
      var data = response.data;
      data.sort(function(a, b){ // sort the data by objectId
        if (a._id < b._id) return -1;
        else if (a._id > b._id) return 1;
        else return 0;
      });
      data.forEach(function(survey, index){ // add index for sorted data
        survey.index = index;
      });
      surveydata.surveys = [].concat(data);
      return data;
    }

    function fetchSurveysFailed(error) {
      logger.error('XHR Failed for fetchSurveys.', error.data);
    }
  }

  function setPages(data, callback) {
    var survey = {};
    survey.title = data.title;
    survey.status = data.status || false;
    survey.pages = data.pages;
    survey.account = data.account || Auth.getCurrentUser().name;
    if (data.index) { // edit mode
      survey.index = data.index;
      survey._id = data._id;
      surveydata.surveys[survey.index] = survey;
      $http.put('/api/surveys/' + data._id, survey)
        .success(function(data){
        logger.info(data);
      }).error(function(err){
        if (err) throw Error(err);
      });
    } else { // add mode
      survey.index = surveydata.surveys.length;
      surveydata.surveys.push(survey);
      $http.post('/api/surveys', survey)
        .success(function(data){
          logger.info(data);
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
      if (page.fileId) tmpPage.fileId = page.fileId;
      return tmpPage;
    } else return null;
  }

  function setCurrentSurvey(index) {
    tmpSurvey = surveydata.surveys[index];
  }

  function getCurrentSurvey() {
    if (surveydataService.surveyId) {
      return $http.get('/api/surveys/'+ surveydataService.surveyId)
        .then(getSurveyComplete)
        .catch(getSurveyFailed);
    } else return tmpSurvey;

    function getSurveyComplete(response) {
      return response.data;
    }
    function getSurveyFailed(err) {
      logger.error(err);
    }
  }

  function removeSurvey(surveyId) {
    return $http.delete('/api/surveys/'+ surveyId)
            .then(deleted).catch(notDeleted);

    function deleted(data) {
      logger.info(data.status);
      return data;
    }

    function notDeleted(error) {
      logger.waring(error);
    }
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
    return $http.get('/api/uploads/' + fileId, { cache: true })
            .then(getFileComplete)
            .catch(getFileFailed);

    function getFileComplete(response) {
      return response.data;
    }

    function getFileFailed(error) {
      logger.error('XHR Failed for fetchSurveys.', error.data);
    }
  }

});
