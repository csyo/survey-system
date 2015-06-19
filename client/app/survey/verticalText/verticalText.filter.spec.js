'use strict';

describe('Filter: verticalText', function() {

  // load the filter's module
  beforeEach(module('surveyApp'));

  // initialize a new instance of the filter before each test
  var verticalText;
  beforeEach(inject(function($filter) {
    verticalText = $filter('verticalText');
  }));

  it('should return the input prefixed with "verticalText filter:"', function() {
    var text = 'angularjs';
    expect(verticalText(text)).toBe('verticalText filter: ' + text);
  });

});
