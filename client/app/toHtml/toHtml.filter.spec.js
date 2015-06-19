'use strict';

describe('Filter: toHtml', function() {

  // load the filter's module
  beforeEach(module('surveyApp'));

  // initialize a new instance of the filter before each test
  var toHtml;
  beforeEach(inject(function($filter) {
    toHtml = $filter('toHtml');
  }));

  it('should return the input prefixed with "toHtml filter:"', function() {
    var text = 'angularjs';
    expect(toHtml(text)).toBe('toHtml filter: ' + text);
  });

});
