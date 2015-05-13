'use strict';

describe('Controller: PageCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var PageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PageCtrl = $controller('PageCtrl', {
      $scope: scope
    });
  }));

  it('should have a page title', function () {
    expect(scope.currentPage.title).toBeDefined();
  });

  it("should have display items", function() {
    expect(scope.displayedCollection.length).not.toBe(0);
  });
});
