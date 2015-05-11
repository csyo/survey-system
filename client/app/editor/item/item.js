'use strict';

angular.module('surveyApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('item', {
        url: '/editor/page/item',
        templateUrl: 'app/editor/item/item.html',
        controller: 'ItemCtrl'
      });
  });