'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($state, ngDialog, surveydata) {
  var editor = this;
  this.currentSurvey = surveydata.getCurrentSurvey();
  this.pageTypes = surveydata.getPageType('arr');
  this.theme = 'ngdialog-theme-default custom-width';

  this.rows = surveydata.getPages();
  this.displayed = [].concat(this.rows);

  this.saveAll = saveAll;
  this.add = add;
  this.edit = edit;
  this.remove = remove;
  this.movePage = movePage;

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
    var targetPage = surveydata.getCurrentPage(row);
    // change route
    var type = surveydata.getPageType();
    switch (targetPage.pageType.val) {
      case type.questionary.val:
        $state.go('page');
        break;
      case type.description.val:
        ngDialog.open({
          template: 'app/editor/text/text.html',
          className: 'ngdialog-theme-default custom-width',
          controller: 'TextCtrl',
          controllerAs: 'text'
        });
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
        break;
    }
    uploadDialog.closePromise.then(function(dialog){
      if (!row.fileId) row.fileId = dialog.value;
    })
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

});