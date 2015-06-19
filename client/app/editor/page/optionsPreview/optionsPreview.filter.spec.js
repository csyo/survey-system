'use strict';

describe('Filter: optionsPreview', function() {

  // load the filter's module
  beforeEach(module('surveyApp'));

  // initialize a new instance of the filter before each test
  var optionsPreview;
  beforeEach(inject(function($filter) {
    optionsPreview = $filter('optionsPreview');
  }));

  it('should return the input prefixed with "optionsPreview filter:"', function() {
    var text = 'angularjs';
    expect(optionsPreview(text)).toBe('optionsPreview filter: ' + text);
  });

});
