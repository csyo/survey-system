'use strict';

angular.module('surveyApp')
  .factory('surveydata', function(Auth, $state, $http, logger) {

    // global survey data
    var surveys = [];

    // currently editing data
    var tmpSurvey = {
      serialNo: '',
      title: '',
      pages: []
    };
    var tmpPage = {
      pageOrder: 0,
      pageCount: 0,
      pageType: '',
      items: []
    };

    // currently viewing survey
    var tmpId;

    // different types for a single page of a survey
    var pageType = {
      questionary: {
        val: 'questionary',
        name: '問卷頁面'
      },
      description: {
        val: 'description',
        name: '文字說明頁面'
      },
      multimedia: {
        val: 'multimedia',
        name: '多媒體頁面'
      }
    };

    // different types for a single item of a page
    var itemType = {
      title: {
        val: 'title',
        name: '標題'
      },
      caption: {
        val: 'caption',
        name: '說明'
      },
      likert: {
        val: 'likert',
        name: '李克特量表'
      },
      likerts: {
        val: 'likerts',
        name: '李克特量表題組'
      },
      semantic: {
        val: 'semantic',
        name: '語意差異量表'
      },
      semantics: {
        val: 'semantics',
        name: '語意差異量表題組'
      },
      choice: {
        val: 'choice',
        name: '選擇題'
      },
      blank: {
        val: 'blank',
        name: '填答題'
      }
    };

    var service = {
      surveyId: tmpId,
      saveResult: saveResult,
      getPageType: function() { return pageType; },
      getItemType: function() { return itemType; },
      reset: reset,
      setSurveys: function(data) { surveys = data; },
      getSurveys: function() { return surveys; },
      fetchSurveys: fetchSurveys,
      setCurrentSurvey: setCurrentSurvey,
      getCurrentSurvey: getCurrentSurvey,
      removeSurvey: removeSurvey,
      setPages: setPages,
      getPages: function() { return tmpSurvey.pages; },
      setCurrentPage: setCurrentPage,
      getCurrentPage: function() { return tmpPage; },
      setItems: setItems,
      setHtmlText: setHtmlText,
      getHtmlText: getHtmlText,
      getFile: getFile,
      removeFile: removeFile
    };
    return service;

    /*** Implementations ***/

    function saveResult(results) {
      var result = {
        surveyId: tmpId,
        results: results
      };
      return $http.post('/api/results', result)
        .then(savedComplete).catch(savedFailed);

      function savedComplete(responce) {
        return responce;
      }

      function savedFailed(error) {
        return error;
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
        tmpId = '';
        break;
      default:
        surveys = [];
      }
    }

    function fetchSurveys() {
      return $http.get('/api/surveys')
        .then(fetchSurveysComplete)
        .catch(fetchSurveysFailed);

      function fetchSurveysComplete(response) {
        var data = response.data;
        data.sort(function(a, b) { // sort the data by objectId
          return a._id < b._id ? -1 : a._id > b._id ? 1 : 0;
        });
        data.forEach(function(survey, index) { // add index for sorted data
          survey.index = index;
        });
        surveys = [].concat(data);
        return data;
      }

      function fetchSurveysFailed(error) {
        logger.error('XHR Failed for fetchSurveys.', error.data);
      }
    }

    function setPages(callback) {
      if (typeof tmpSurvey.index === 'number') { // edit mode; index defined
        surveys[tmpSurvey.index] = tmpSurvey;
        if (tmpSurvey.__v) {
          delete tmpSurvey.__v;
        }
        $http.put('/api/surveys/' + tmpSurvey._id, tmpSurvey)
          .success(function(data) {
            logger.info(data);
          }).error(function(err) {
            if (err) {
              throw Error(err);
            }
          });
      } else { // add mode; index undefined
        tmpSurvey.index = surveys.length;
        tmpSurvey.status = false;
        tmpSurvey.account = Auth.getCurrentUser().name;
        surveys.push(tmpSurvey);
        $http.post('/api/surveys', tmpSurvey)
          .success(function(data) {
            logger.info(data);
            surveys[tmpSurvey.index]._id = data._id;
          }).error(function(err) {
            if (err) {
              throw Error(err);
            }
          });
      }
      if (callback) {
        callback();
      }
    }

    function setCurrentPage(page) {
      if (page) {
        tmpPage = _.cloneDeep(page);
        return tmpPage;
      } else {
        return null;
      }
    }

    function setCurrentSurvey(index) {
      tmpSurvey = _.cloneDeep(surveys[index]);
    }

    function getCurrentSurvey(mode) {
      if (mode.view) {
        return $http.get('/api/surveys/' + tmpId || 0)
          .then(getSurveyComplete)
          .catch(getSurveyFailed);
      } else if (mode.edit) {
        return tmpSurvey;
      }

      function getSurveyComplete(response) {
        return response.data;
      }

      function getSurveyFailed(err) {
        logger.error(err);
      }
    }

    function removeSurvey(survey) {
      var pages = survey.pages;
      pages.forEach(function(page) {
        if (page.pageType.val === pageType.multimedia.val) {
          removeFile(page.fileId)
            .then(function(data) {
              logger.info(data);
            })
            .catch(function(err) {
              logger.error(err);
            });
        }
      });

      return $http.delete('/api/surveys/' + survey._id)
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

    function setHtmlText(data) {
      tmpSurvey.pages[tmpPage.pageOrder - 1].content = data;
    }

    function getHtmlText() {
      return tmpSurvey.pages[tmpPage.pageOrder - 1].content || '';
    }

    function getFile(fileId) {
      if (!fileId) {
        return;
      }
      return $http.get('/api/uploads/' + fileId, {
          cache: true
        })
        .then(getFileComplete)
        .catch(getFileFailed);

      function getFileComplete(response) {
        return response.data;
      }

      function getFileFailed(error) {
        logger.error('XHR Failed for fetchSurveys.', error.data);
      }
    }

    function removeFile(fileId) {
      return $http.delete('/api/uploads/' + fileId)
        .then(deleted)
        .catch(failed);

      function deleted(response) {
        return response;
      }

      function failed(error) {
        return error;
      }
    }

  });
