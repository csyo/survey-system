'use strict';

angular.module('surveyApp')
  .filter('toSerialNo', function () {
    return function (input) {
      var pad = '000', n = parseInt(input) + 1;
      return (pad+n).slice(-pad.length);
    };
  });
