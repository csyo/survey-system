'use strict';

describe('Controller: UploadCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyApp'));

  var UploadCtrl, mockSurveydata, mockModalInstance, deferred;

  // Create a mock object using spies
  beforeEach(inject(function (){
    mockModalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };
  }));

  // Initialize the controller and mockData
  beforeEach(inject(function ($controller, $injector, $q) {
    mockSurveydata = $injector.get('surveydata');

    // promise always resolved
    deferred = $q.defer();
    deferred.resolve('ok');

    spyOn(mockSurveydata,'getFile').andCallThrough();
    UploadCtrl = $controller('UploadCtrl', {
      surveydata: mockSurveydata,
      $modalInstance: mockModalInstance,
      fileId: null
    });
  }));

  it('should activate to get the file', function () {
    expect(mockSurveydata.getFile).toHaveBeenCalled();
  });

  it('should start uploading when file is ready to upload', function () {
    spyOn(UploadCtrl,'start').andReturn(deferred.promise);
    UploadCtrl.done();
    expect(UploadCtrl.start).toHaveBeenCalled();
  });

  it('should update a file when fileId is given', function () {
    spyOn(UploadCtrl,'update').andReturn(deferred.promise);
    UploadCtrl.fileId = '000000000000';
    UploadCtrl.done();
    expect(UploadCtrl.update).toHaveBeenCalled();
  });
});
