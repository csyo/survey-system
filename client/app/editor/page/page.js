'use strict';

angular.module('surveyApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page', {
        url: '/editor/page',
        templateUrl: 'app/editor/page/page.html',
        controller: 'PageCtrl',
        controllerAs: 'page',
        authenticate: true
      });
  });
