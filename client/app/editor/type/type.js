'use strict';

angular.module('surveyApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('type', {
        url: '/type',
        templateUrl: 'app/editor/type/type.html',
        controller: 'TypeCtrl'
      });
  });