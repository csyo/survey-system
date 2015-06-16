'use strict';

angular.module('surveyApp')
  .filter('toHtml', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  });
