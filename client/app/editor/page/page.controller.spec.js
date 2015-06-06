'use strict';

describe('Controller: PageCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var PageCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    PageCtrl = $controller('PageCtrl');
  }));

  xit('should have a page title', function () {
    expect(PageCtrl.currentPage.title).toBeDefined();
  });

  xit('should have display items', function() {
    expect(PageCtrl.displayed.length).not.toBe(0);
  });

  xit('should save all the pages', function () {
    EditorCtrl.saveAll();
    expect(mockSurveydata.setPages).toHaveBeenCalled();
  });
});
