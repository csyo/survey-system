'use strict';

describe('Controller: TextCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var TextCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    TextCtrl = $controller('TextCtrl');
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
