'use strict';

angular.module('surveyApp')
  .filter('optionsPreview', function () {
    return function (options) {
      if (options && options.list) {
          var preview = '',
              typeName = options.typeName,
              otherOption = options.otherOption,
              list = options.list;
          preview = typeName === 'radio' ? '(單選題)' :
            typeName === 'checkbox' ? '(多選題)' : '(---)';
          list.forEach(function (option) {
            preview += '<li>' + option.name + '</li>';
          });
          preview += otherOption ? '<li>其他</li>' : '';
        return preview;
      } else { return ''; }
    };
  });
