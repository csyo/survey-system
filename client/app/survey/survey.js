'use strict';

angular.module('surveyApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('survey', {
        url: '/survey',
        templateUrl: 'app/survey/survey.html',
        controller: 'SurveyCtrl',
        controllerAs: 'survey',
        authenticate: true
      });
  });
