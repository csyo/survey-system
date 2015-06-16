'use strict';

angular.module('surveyApp')
  .filter('verticalText', function () {
    return function (input) {
      return input.length > 1 ? input.split('').join('<br>') : input;
    };
  });
