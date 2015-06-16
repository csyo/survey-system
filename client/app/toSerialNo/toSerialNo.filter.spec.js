'use strict';

describe('Filter: toSerialNo', function () {

  // load the filter's module
  beforeEach(module('surveyApp'));

  // initialize a new instance of the filter before each test
  var toSerialNo;
  beforeEach(inject(function ($filter) {
    toSerialNo = $filter('toSerialNo');
  }));

  it('should return the input prefixed with "toSerialNo filter:"', function () {
    var text = 'angularjs';
    expect(toSerialNo(text)).toBe('toSerialNo filter: ' + text);
  });

});
