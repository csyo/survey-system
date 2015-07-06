'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function($state, $modal, surveydata, logger) {
    var vm = this;
    this.pageTypes = surveydata.getPageType();
    this.theme = 'ngdialog-theme-default custom-width';
    this.showTextEditor = false;

    this.saveAll = saveAll;
    this.add = add;
    this.edit = edit;
    this.done = done;
    this.goBack = goBack;
    this.cancel = cancel;
    this.remove = remove;
    this.movePage = movePage;
    this.toggleTextEditor = toggleTextEditor;

    this.pageOrder = [];

    activate();

    ////////////////

    function activate() {
      vm.currentSurvey = surveydata.getCurrentSurvey({edit: true});
      vm.rows = vm.currentSurvey.pages;
      vm.displayed = [].concat(vm.rows);
      vm.pageOrder = vm.displayed.map(function(row) {
        return row.pageOrder;
      });
    }

    function saveAll() {
      surveydata.setPages(function() {
        vm.goBack();
      });
    }

    function goBack() {
      surveydata.reset();
      // change route
      $state.go('main');
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
            file: function() {
              return row.file ? row.file : null;
            }
          }
        });
        upload.result.then(function(file) {
          if (!row.file) { row.file = file; }
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
      var file = vm.rows[index].file;
      if (file && file.type === 'image') {
        surveydata.removeFile(file.imgId)
          .then(function(response) {
            logger.info(response);
            surveydata.setPages(vm.currentSurvey);
          });
      }
      vm.rows.splice(index, 1);
      vm.rows.forEach(function(row, index) {
        row.pageOrder = index + 1;
      });
    }

    function movePage(newIndex, oldIndex, row) {
      if (newIndex <= vm.rows.length) {
        vm.rows.splice(oldIndex, 1);
        vm.rows.splice(newIndex, 0, row);
        vm.rows.forEach(function(row, index) {
          row.pageOrder = index + 1;
        });
      }
    }

    function toggleTextEditor() {
      vm.showTextEditor = !vm.showTextEditor;
    }

  });
