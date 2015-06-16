'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($state, $modal, surveydata, logger) {
    var vm = this;
    this.pageTypes = surveydata.getPageType();
    this.theme = 'ngdialog-theme-default custom-width';
    this.showTextEditor = false;

    /*jshint -W030*/
    this.currentSurvey;
    this.rows;
    this.displayed;

    this.saveAll = saveAll;
    this.add = add;
    this.edit = edit;
    this.done = done;
    this.cancel = cancel;
    this.remove = remove;
    this.movePage = movePage;
    this.toggleTextEditor = toggleTextEditor;

    activate();

    ////////////////

    function activate() {
      vm.currentSurvey = surveydata.getCurrentSurvey({ edit: true });
      vm.rows = surveydata.getPages();
      vm.displayed = [].concat(vm.rows);
    }

    function saveAll() {
      surveydata.setPages(vm.currentSurvey, function () {
        // clear tmpSurvey data
        surveydata.reset();
        // change route
        $state.go('main');
      });
    }

    function add() {
      vm.inserted = {
        pageOrder: vm.rows.length + 1,
        pageCount: 0,
        pageType: ''
      };
      vm.rows.push(vm.inserted);
    }

    function edit(row) {
      logger.info(row);
      // update current page info
      var targetPage = surveydata.setCurrentPage(row);
      // change route
      var type = surveydata.getPageType();
      switch (targetPage.pageType.val) {
      case type.questionary.val:
        $state.go('page');
        break;
      case type.description.val:
        vm.htmlContent = row.content;
        vm.toggleTextEditor();
        break;
      case type.multimedia.val:
        var upload = $modal.open({
          templateUrl: 'app/editor/upload/upload.html',
          controller: 'UploadCtrl',
          controllerAs: 'upload',
          resolve: {
            fileId: function () {
              return row.fileId ? row.fileId : null;
            }
          }
        });
        upload.result.then(function (fileId) {
          if (!row.fileId) row.fileId = fileId;
        });
        break;
      }
    }

    function done() {
      vm.toggleTextEditor();
      surveydata.setHtmlText(vm.htmlContent);
      vm.htmlContent = '';
    }

    function cancel() {
      vm.toggleTextEditor();
      vm.htmlContent = '';
    }

    function remove(index) {
      vm.rows.splice(index, 1);
      vm.rows.forEach(function (row, index) {
        row.pageOrder = index + 1;
      });
    }

    function movePage(newIndex, oldIndex, row) {
      if (newIndex <= vm.rows.length) {
        vm.rows.splice(oldIndex, 1);
        vm.rows.splice(newIndex, 0, row);
        vm.rows.forEach(function (row, index) {
          row.pageOrder = index + 1;
        });
      }
    }

    function toggleTextEditor() {
      vm.showTextEditor = !vm.showTextEditor;
    }

  });
