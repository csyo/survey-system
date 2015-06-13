'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($state, surveydata, $modal, logger) {

  var vm = this;
  this.add = add;
  this.edit = edit;
  this.remove = remove;
  this.preview = preview;
  this.generateUrl = generateUrl;
  this.toggleStatus = toggleStatus;

  this.rows = surveydata.getSurveys();
  this.displayed = [].concat(this.rows);
  this.isLoading = false;

  /* fetch data only when loading the first time */
  if (!vm.rows.length) {
    vm.isLoading = true;
    activate();
  }

  ////////////

  function activate() {
    return fetchSurveys()
      .then(function(){
        logger.info('Activated Main View');
        vm.isLoading = false;
      });
  }

  function fetchSurveys() {
    return surveydata.fetchSurveys()
      .then(function(surveys){
        vm.rows = surveys;
        return vm.rows;
      });
  }

  function toggleStatus(row) {
    row.status = !row.status;
  }

  function add() {
    $state.go('editor'); // change to editor view to create survey
  }

  function edit(index) {
    // update current page info
    surveydata.setCurrentSurvey(index);
    // change route to editing state
    $state.go('editor');
  }

  function remove(index) {
    var confirm = $modal.open({
      size: 'sm',
      animation: false,
      windowClass: 'center-modal',
      templateUrl: 'app/editor/confirm/confirm.html',
      controller: 'ConfirmCtrl',
      controllerAs: 'confirm',
      resolve: {
        title: function(){ return vm.rows[index].title; }
      }
    });
    confirm.result.then(function (remove){
      if (remove) {
        surveydata.removeSurvey(vm.rows[index]._id);
        vm.rows.splice(index, 1);
      }
    });
  }

  function preview(index) {
    surveydata.surveyId = surveyId;
    // change route to survey preview
    $state.go('survey');
  }

  function generateUrl() {
    // TODO: generate a url for the survey with database communication
  }

});
