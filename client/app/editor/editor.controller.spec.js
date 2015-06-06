'use strict';

describe('Controller: EditorCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var EditorCtrl, mockSurveydata, mockData;

  beforeEach(inject(function ($controller, _surveydata_) {
    mockData = {
      serialNo: '000',
      title: 'test',
      account: 'test',
      pages: [{
        pageOrder: 0,
        pageCount: 0 ,
        pageType: '',
        items: []
      }]
    };
    mockSurveydata = _surveydata_;
    mockSurveydata.setSurveys([mockData]);
    mockSurveydata.setCurrentSurvey(0);
    spyOn(mockSurveydata,'setPages').andCallThrough();
    spyOn(mockSurveydata,'setCurrentPage').andCallThrough();
    EditorCtrl = $controller('EditorCtrl', {
      surveydata: mockSurveydata
    });
  }));

  it('should have a survey title', function () {
    expect(EditorCtrl.currentSurvey.title).toBeDefined();
  });

  it('should have display items', function() {
    expect(EditorCtrl.displayed.length).not.toBe(0);
  });

  it('should save all the pages', function () {
    EditorCtrl.saveAll();
    expect(mockSurveydata.setPages).toHaveBeenCalled();
  });

  it('should update current page information before going to edit it', function () {
    EditorCtrl.edit(mockData.pages[0]);
    expect(mockSurveydata.setCurrentPage).toHaveBeenCalled();
  });

});
