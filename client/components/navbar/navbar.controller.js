'use strict';

angular.module('surveyApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, surveydata) {
    $scope.menu = [{
      'title': '首頁',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      surveydata.reset();
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
