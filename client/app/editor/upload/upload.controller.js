'use strict';

angular.module('surveyApp')
  .controller('UploadCtrl', function ($scope, Upload, ngDialog, surveydata) {
  var upload = this;
  this.start = start;
  this.done = done;

  $scope.$watch('files', function () {
    upload.start(upload.files);
  });

  function start (files) {
    if (files && files.length) {
      for (var i = 0, j = files.length; i < j; i++) {
        var file = files[i];
        Upload.upload({
          url: '/api/uploads',
          fields: {'account': surveydata.getUserName().name},
          file: file
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        });
      }
    }
  }

  function done () {
    // TODO: add infos to surveydata
    ngDialog.closeAll();
  };
});
