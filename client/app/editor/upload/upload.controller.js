'use strict';

angular.module('surveyApp')
  .controller('UploadCtrl', function(fileId, surveydata, Upload, $modalInstance, logger) {
    var vm = this;
    this.done = done;
    this.cancel = cancel;
    this.start = start;
    this.update = update;
    this.files = [];
    this.preview = {};
    this.fileId = fileId;
    this.isLoading = false;

    activate();

    /*** Implementations ***/

    function activate() {
      var request = surveydata.getFile(vm.fileId);
      if (request) {
        vm.isLoading = true;
        request.then(function(data) {
          vm.isLoading = false;
          if (data && data.file) {
            vm.preview.data = data.file.img;
            vm.preview.type = data.file.mimetype;
          }
        });
      }
    }

    function done() {
      vm.isLoading = true;
      if (vm.fileId) {
        return vm.update(vm.files[0])
          .then(function(data) {
            if (vm.fileId !== data._id) {logger.error('Something goes wrong!');}
            vm.isLoading = false;
            $modalInstance.close();
          });
      } else {
        return vm.start(vm.files[0])
          .then(function(data) {
            vm.isLoading = false;
            $modalInstance.close(data._id);
          });
      }
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function start(file) {
      if (file) {
        return Upload.upload({
          url: '/api/uploads',
          file: file
        }).progress(uploadProgress)
          .then(uploadComplete)
          .catch(uploadFailed);
      }
    }

    function update(file) {
      if (file) {
        return Upload.upload({
          method: 'PUT',
          url: '/api/uploads/' + vm.fileId,
          file: file
        }).progress(uploadProgress)
          .then(uploadComplete)
          .catch(uploadFailed);
      }
    }

    function uploadProgress (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      logger.info('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    }

    function uploadComplete (response) {
      logger.info('file ' + response.config.file.name + ' uploaded.');
      return response.data;
    }

    function uploadFailed (error) {
      logger.error(error.data);
    }
  });
