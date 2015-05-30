'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($state, surveydata) {
  // $scope.awesomeThings = [];
  // $http.get('/api/things').success(function(awesomeThings) {
  //   $scope.awesomeThings = awesomeThings;
  // });
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
    // TODO: generate the whole survey for preview
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
