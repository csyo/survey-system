'use strict';

angular.module('surveyApp')
  .filter('toSerialNo', function() {
    return function(input) {
      var pad = '000';
      var n = parseInt(input) + 1;
      return (pad + n).slice(-pad.length);
    };
  });
