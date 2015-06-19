'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var createController, rootScope, mockDataSvc, mockData;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    rootScope = $injector.get('$rootScope');
    mockDataSvc = $injector.get('surveydata');
    mockData = {
      serialNo: '000',
      title: 'test',
      account: 'test',
      pages: []
    };

    spyOn(mockDataSvc, 'fetchSurveys').andCallThrough();
    spyOn(mockDataSvc, 'getSurveys').andCallThrough();
    spyOn(mockDataSvc, 'setCurrentSurvey').andCallThrough();

    createController = function() {
      return $controller('MainCtrl', {
        surveydata: mockDataSvc
      });
    };
  }));

  it('should fetch surveys when the table rows are empty', function() {
    var MainCtrl = createController();
    expect(mockDataSvc.getSurveys).toHaveBeenCalled();
    expect(MainCtrl.rows.length).toBe(0);
    expect(mockDataSvc.fetchSurveys).toHaveBeenCalled();
  });
 
  it('should not fetch surveys when rows are not empty', function() {
    mockDataSvc.setSurveys([mockData]);
    var MainCtrl = createController();
    expect(mockDataSvc.getSurveys).toHaveBeenCalled();
    expect(MainCtrl.rows.length).toBe(1);
    expect(mockDataSvc.fetchSurveys).not.toHaveBeenCalled();
  });

  it('should update current page info before going to editor', function() {
    mockDataSvc.setSurveys([mockData]);
    var MainCtrl = createController();
    MainCtrl.edit(0);
    expect(mockDataSvc.setCurrentSurvey).toHaveBeenCalled();
    expect(mockDataSvc.getCurrentSurvey().title).toBe('test');
  });

});
