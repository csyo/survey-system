'use strict';

describe('Service: surveydata', function() {

  // load the service's module
  beforeEach(module('surveyApp'));

  // instantiate service
  var surveydata;
  beforeEach(inject(function(_surveydata_) {
    surveydata = _surveydata_;
  }));

  it('should do something', function() {
    expect(!!surveydata).toBe(true);
  });

});
