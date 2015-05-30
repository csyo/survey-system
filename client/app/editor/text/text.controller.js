'use strict';

angular.module('surveyApp')
  .controller('TextCtrl', function (ngDialog, surveydata) {
  var text = this;
  text.htmlContent = surveydata.getHtmlText();
  text.done = function () {
      surveydata.setHtmlText(text.htmlContent);
      ngDialog.closeAll();
  };
});
