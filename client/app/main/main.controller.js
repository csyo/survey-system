'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    // $scope.awesomeThings = [];
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

    $scope.rowCollection = [
        {number: 0, title: 'TestSurvey', account: 'test', name: 'test', status: true}
    ];

    $scope.displayedCollection = [].concat($scope.rowCollection);

    $scope.toggleStatus = function(row) {
      row.status = !row.status;
    };

    $scope.addForm = function() {
      $location.path('/editor');
    };

    $scope.editForm = function() {
      // body...
    };

    $scope.previewForm = function() {
      // body...
    };

    $scope.generateUrl = function() {
      // body...
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
