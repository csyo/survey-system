'use strict';

describe('Controller: OptionsCtrl', function() {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var OptionsCtrl, $modalInstance;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$modalInstance_) {
    $modalInstance =  _$modalInstance_;
    OptionsCtrl = $controller('OptionsCtrl');
  }));

  xit('should ...', function() {
    expect(1).toEqual(1);
  });
});
