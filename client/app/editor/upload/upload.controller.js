'use strict';

angular.module('surveyApp')
  .controller('UploadCtrl', function(file, surveydata, Upload, $modalInstance, logger, toastr) {
    var vm = this;
    this.done = done;
    this.save = save;
    this.cancel = cancel;
    this.start = start;
    this.update = update;
    this.files = [];
    this.preview = {};
    this.file = file;
    this.isLoading = false;
    this.type = 'image';

    activate();

    /*** Implementations ***/

    function activate() {
      if (!vm.file) { return; }
      if (vm.file.type === 'video') {
        vm.type = 'video';
        vm.videoUrl = vm.file.videoUrl;
      } else if (vm.file.type === 'image') {
        var request = surveydata.getFile(vm.file.imgId);
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
    }

    function done() {
      vm.isLoading = true;
      if (vm.file && vm.file.imgId) {
        return vm.update(vm.files[0])
          .then(function(data) {
            if (vm.file.imgId !== data._id) { logger.error('Something goes wrong!'); }
            vm.isLoading = false;
            $modalInstance.close();
          });
      } else {
        return vm.start(vm.files[0])
          .then(function(data) {
            vm.isLoading = false;
            $modalInstance.close({ imgId: data._id, type: 'image' });
          });
      }
    }

    function save() {
      if (vm.videoUrl) {
        $modalInstance.close({ videoUrl: vm.videoUrl, type: 'video' });
      } else {
        toastr.warning('請貼上 YouTube 影片嵌入網址！');
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
          url: '/api/uploads/' + vm.file.imgId,
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
