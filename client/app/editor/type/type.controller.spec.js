'use strict';

describe('Controller: TypeCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var TypeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TypeCtrl = $controller('TypeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
