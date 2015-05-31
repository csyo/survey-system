'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($state, surveydata) {

  var main = this;

  this.rows = surveydata.getSurveys();

  this.fetchData = function () {
    surveydata.fetchSurveys(function(){
      main.rows = surveydata.getSurveys();
    });
  };

  this.displayed = [].concat(this.rows);

  this.toggleStatus = function(row) {
    row.status = !row.status;
  };

  this.add = function() {
    $state.go('editor'); // change to editor view to create survey
  };

  this.edit = function(row) {
    // update current page info
    surveydata.setCurrentSurvey(row);
    // change route to editing state
    $state.go('editor');
  };

  this.preview = function(row) {
    console.log(row);
    // set current survey
    surveydata.setCurrentSurvey(row);
    // change route to survey preview
    $state.go('survey');
  };

  this.generateUrl = function() {
    // TODO: generate a url for the survey with database communication
  };

//  this.addThing = function() {
//    if(main.newThing === '') {
//      return;
//    }
//    $http.post('/api/things', { name: $scope.newThing });
//    $scope.newThing = '';
//  };
//
//  this.deleteThing = function(thing) {
//    $http.delete('/api/things/' + thing._id);
//  };
});
