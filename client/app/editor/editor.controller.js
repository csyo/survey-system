'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($state, ngDialog, surveydata) {
  var editor = this;
  this.currentSurvey = surveydata.getCurrentSurvey();
  this.pageTypes = surveydata.getPageType('arr');
  this.theme = 'ngdialog-theme-default custom-width';
  this.showTextEditor = false;
  this.showFileUpload = false;

  this.rows = surveydata.getPages();
  this.displayed = [].concat(this.rows);

  this.saveAll = saveAll;
  this.add = add;
  this.edit = edit;
  this.done = done;
  this.cancel = cancel;
  this.remove = remove;
  this.movePage = movePage;
  this.toggleTextEditor = toggleTextEditor;
  this.toggleFileUpload = toggleFileUpload;

  function saveAll() {
    surveydata.setPages(editor.currentSurvey, function () {
      // clear tmpSurvey data
      surveydata.reset();
      // change route
      $state.go('main');
    });
  }

  function add() {
    editor.inserted = {
      pageOrder: surveydata.getPageIndex() + 1,
      pageCount: 0,
      pageType: ''
    };
    editor.rows.push(editor.inserted);
  }

  function edit(row) {
    console.log(row);
    // update current page info
    var targetPage = surveydata.setCurrentPage(row);
    // change route
    var type = surveydata.getPageType();
    switch (targetPage.pageType.val) {
      case type.questionary.val:
        $state.go('page');
        break;
      case type.description.val:
        editor.htmlContent = row.content;
        editor.toggleTextEditor();
        break;
      case type.multimedia.val:
        var uploadDialog = ngDialog.open({
          template: 'app/editor/upload/upload.html',
          controller: 'UploadCtrl',
          controllerAs: 'upload',
          resolve: {
            fileId: function () {
              return row.fileId ? row.fileId : null;
            }
          }
        });
        uploadDialog.closePromise.then(function(dialog){
          if (!row.fileId) row.fileId = dialog.value;
        })
//        editor.toggleFileUpload();
        break;
    }
  }

  function done() {
    editor.toggleTextEditor();
    surveydata.setHtmlText(editor.htmlContent);
    editor.htmlContent = '';
  }

  function cancel() {
    editor.toggleTextEditor();
    editor.htmlContent = '';
  }

  function remove(index) {
    editor.rows.splice(index, 1);
    editor.rows.forEach(function(row, index){
      row.pageOrder = index + 1;
    });
  }

  function movePage(newIndex, oldIndex, row) {
    if (newIndex <= editor.rows.length) {
      editor.rows.splice(oldIndex, 1);
      editor.rows.splice(newIndex, 0, row);
      editor.rows.forEach(function(row, index){
        row.pageOrder = index + 1;
      });
    }
  }

  function toggleTextEditor() {
    editor.showTextEditor = !editor.showTextEditor;
  }

  function toggleFileUpload() {
    editor.showFileUpload = !editor.showFileUpload;
  }
});