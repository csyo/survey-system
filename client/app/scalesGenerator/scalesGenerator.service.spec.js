'use strict';

describe('Service: scalesGenerator', function () {

  // load the service's module
  beforeEach(module('surveyApp'));

  // instantiate service
  var scalesGenerator;
  beforeEach(inject(function (_scalesGenerator_) {
    scalesGenerator = _scalesGenerator_;
  }));

  it('should do something', function () {
    expect(!!scalesGenerator).toBe(true);
  });

});
