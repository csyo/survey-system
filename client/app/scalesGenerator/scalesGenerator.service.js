'use strict';

angular.module('surveyApp')
  .factory('scalesGenerator', function() {

    var service = {
      getHeader: generateHeader,
      getOption: generateScaleOption,
      getLikerts: processLikertScale,
      getSemantics: processSemanticScale,
      getRule: generateScales
    };
    return service;

    function generateHeader(scales, type) {
      var headers = generateScales(scales);
      headers.forEach(function(scale, index) {
        var content = '';
        if (type.match(/likert/) !== null) {
          content = generateScaleOption(scale);
        } else { content = index + 1 + ''; }
        headers[index] = {val: scale, name: content};
      });
      return headers;
    }

    function generateScaleOption(scale) {
      switch (scale) {
        case 1:
          return '非常不同意';
        case 2:
          return '不同意';
        case 3:
          return '有點不同意';
        case 4:
          return '沒意見';
        case 5:
          return '有點同意';
        case 6:
          return '同意';
        case 7:
          return '非常同意';
      }
    }

    function processLikertScale(item) {
      var content = item.content;
      var scales = item.options.scales;
      var questions = item.richText ? content.split('<br>') : content.split('\n');
      questions.forEach(function(question, index) {
        questions[index] = {
          order: index + 1,
          content: question,
          selected: '',
          options: generateScales(scales)
        };
      });
      return questions;
    }

    function processSemanticScale(item) {
      var content = item.content;
      var scales = item.options.scales;
      var questions = item.richText ? content.split('<br>') : content.split('\n');
      if (!(questions[0].match(/\|/) || questions[0].match(/｜/))) { item.title = questions.shift(); }
      questions.forEach(function(question, index) {
        questions[index] = {
          order: index + 1,
          content: question.match(/\|/) ? question.split('|') :
            question.match(/｜/) ? question.split('｜') : [question, ''],
          selected: '',
          options: generateScales(scales)
        };
      });
      return questions;
    }

    function generateScales(scales) {
      var data = [1, 2, 3, 4, 5, 6, 7];
      switch (scales) {
        case 7:
          return data;
        case 6: // 1,2,3,5,6,7
          data.splice(3, 1);
          return data;
        case 5: // 2,3,4,5,6
          return data.slice(1, -1);
        case 4: // 2,3,5,6
          data = data.slice(1, -1);
          data.splice(2, 1);
          return data;
        case 3: // 3,5,6
          return data.slice(2, -2);
        default:
          return null;
      }
    }
  });
