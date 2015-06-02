'use strict';

angular.module('surveyApp')
  .controller('EditorCtrl', function ($state, ngDialog, surveydata) {
  var editor = this;
  this.currentSurvey = surveydata.getCurrentSurvey();
  this.pageTypes = surveydata.getPageType('arr');
  this.theme = 'ngdialog-theme-default custom-width';
  this.showTextEditor = false;

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

  function saveAll() {
    surveydata.setSurveys(this.currentSurvey, function (err) {
      // clear tmpSurvey data
      surveydata.reset();
      // change route
      $state.go('main');
    });
  }

  function add() {
    this.inserted = {
      pageOrder: surveydata.getPageIndex() + 1,
      pageCount: 0,
      pageType: ''
    };
    this.rows.push(this.inserted);
  }

  function edit(row) {
    console.log(row);
    // update current page info
    var targetPage = surveydata.getCurrentPage();
    targetPage.pageOrder = row.pageOrder;
    targetPage.pageCount = row.pageCount;
    targetPage.pageType = row.pageType;
    // change route
    var type = surveydata.getPageType();
    switch (targetPage.pageType.val) {
      case type['questionary'].val:
        $state.go('page');
        break;
      case type['description'].val:
        editor.toggleTextEditor();
//        ngDialog.open({
//          template: 'app/editor/text/text.html',
//          className: 'ngdialog-theme-default custom-width',
//          controller: 'TextCtrl',
//          controllerAs: 'text'
//        });
        break;
      case type['multimedia'].val:
        ngDialog.open({
          template: 'app/editor/upload/upload.html',
          controller: 'UploadCtrl'
        });
        break;
    }
  }

  function done() {
    editor.toggleTextEditor();
    surveydata.setHtmlText(editor.htmlContent);
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
});