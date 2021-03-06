'use strict';

angular.module('surveyApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('editor', {
        url: '/editor',
        templateUrl: 'app/editor/editor.html',
        controller: 'EditorCtrl',
        controllerAs: 'editor',
        authenticate: true
      });
  });
