'use strict';

describe('Controller: TextCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var TextCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TextCtrl = $controller('TextCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
