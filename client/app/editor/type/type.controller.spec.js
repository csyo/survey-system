'use strict';

describe('Controller: TypeCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var TypeCtrl, scope, surveydata;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TypeCtrl = $controller('TypeCtrl', {
      $scope: scope
    });
  }));

  it('should have a "done" method', function () {
    expect(scope.done).toBeDefined();
  });

  it("should add a page to surveydata", function() {

  });
});
