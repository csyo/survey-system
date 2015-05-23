'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($scope, $http, $state, surveydata) {
    // $scope.awesomeThings = [];
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

    $scope.rowCollection = surveydata.getSurveys();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.toggleStatus = function(row) {
      row.status = !row.status;
    };

    $scope.addSurvey = function() {
      $state.go('editor'); // change to editor view to create survey
    };

    $scope.editSurvey = function(row) {
      console.log(row);
      // update current page info
      surveydata.setCurrentSurvey(row);
      // change route to editing state
      $state.go('editor');
    };

    $scope.previewSurvey = function() {
      // TODO: generate the whole survey for preview
      console.log(surveydata.getUserData());
    };

    $scope.generateUrl = function() {
      // TODO: generate a url for the survey with database communication
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
