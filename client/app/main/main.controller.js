'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($state, surveydata, logger) {

  var vm = this;
  this.add = add;
  this.edit = edit;
  this.preview = preview;
  this.generateUrl = generateUrl;
  this.toggleStatus = toggleStatus;

  this.displayed = [].concat(this.rows);
  this.rows = surveydata.getSurveys();
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

  function preview(row) {
    logger.info(row);
    // TODO: generate the whole survey for preview
  }

  function generateUrl() {
    // TODO: generate a url for the survey with database communication
  }

});
