'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var MainCtrl, mockDataSvc, mockAuth;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_surveydata_, _Auth_, $controller) {
    mockDataSvc = _surveydata_;
    mockAuth = _Auth_;
    spyOn(mockAuth, 'isLoggedInAsync').andCallThrough();
    spyOn(mockDataSvc,'fetchSurveys').andCallThrough();
    MainCtrl = $controller('MainCtrl', {
      surveydata: mockDataSvc
    });
  }));

    it('should fetch surveys when the table rows are empty', function () {
      expect(MainCtrl.rows.length).toBe(0);
      expect(mockAuth.isLoggedInAsync).toHaveBeenCalled();
      expect(mockDataSvc.fetchSurveys).toHaveBeenCalled();
    });

});
