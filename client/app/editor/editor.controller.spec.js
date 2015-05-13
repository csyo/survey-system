'use strict';

describe('Controller: EditorCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var EditorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorCtrl = $controller('EditorCtrl', {
      $scope: scope
    });
  }));

  it('should have a survey title', function () {
    expect(scope.currentSurvey.title).toBeDefined();
  });

  it("should have display items", function() {
    expect(scope.displayedCollection.length).not.toBe(0);
  });
});
