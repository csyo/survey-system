'use strict';

describe('Controller: PageCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var PageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    PageCtrl = $controller('PageCtrl');
  }));

  it('should have a page title', function () {
    expect(PageCtrl.currentPage.title).toBeDefined();
  });

  it('should have display items', function() {
    expect(PageCtrl.displayed.length).not.toBe(0);
  });
});
