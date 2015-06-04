'use strict';

angular.module('surveyApp')
  .controller('UploadCtrl', function (Upload, ngDialog, surveydata, fileId) {
  var upload = this;
  this.done = done;
  this.start = start;
  this.update = update;
  this.clear = clear;
  this.files = [];
  this.preview = {};
  this.isLoading = false;

  var getFile = function() {
    var request = surveydata.getFile(fileId);
    upload.isLoading = true;
    if (request) request.$promise.then(function(data){
      upload.isLoading = false;
      upload.preview.data = data.file.img;
      upload.preview.type = data.file.mimetype;
    });
  }();

  function done() {
    upload.isLoading = true;
    if (fileId) {
      upload.update(upload.files[0], function(id){
        if (fileId !== id) console.err('Something goes wrong!');
        upload.isLoading = false;
        ngDialog.closeAll(null);
      });
    } else {
      upload.start(upload.files[0], function(fileId){
        upload.isLoading = false;
        ngDialog.closeAll(fileId);
      });
    }
  }

  function start(file, callback) {
    if (file) {
      Upload.upload({
        url: '/api/uploads',
        fields: {'account': surveydata.getUserName().name},
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).success(function (data, status, headers, config) {
        console.log('file ' + config.file.name + ' uploaded. Response: ', data);
        if (callback) callback(data._id); // add file id to the specific row of page
      });
    }
  }

  function update(file, callback) {
    if (file) {
      Upload.upload({
        method: 'PUT',
        url: '/api/uploads/' + fileId,
        file: file
      }).success(function (data) {
        if (callback) callback(data._id);
      });
    }
  };

  function clear() {
    upload.preview = '';
  }

});
