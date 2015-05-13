'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($scope, $http, $location, surveydata) {
    // $scope.awesomeThings = [];
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

    $scope.rowCollection = surveydata.getSurveys();

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.toggleStatus = function(row) {
      row.status = !row.status;
    };

    $scope.addForm = function() {
      $location.path('/editor'); // change to editor view to create survey
    };

    $scope.editForm = function() {
      $location.path('/editor'); // change to editor view to edit survey
    };

    $scope.previewForm = function() {
      // TODO: generate the whole survey for preview
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
