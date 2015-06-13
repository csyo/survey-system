'use strict';

var _ = require('lodash');
var Result = require('./result.model');

// Get list of results
exports.index = function(req, res) {
  Result.find({ surveyId: req.query.surveyId }, function (err, results) {
    if(err) { return handleError(res, err); }
    return res.json(200, results);
  });
};

// Creates a new result in the DB.
exports.create = function(req, res) {
  Result.create(req.body, function(err, result) {
    if(err) { return handleError(res, err); }
    return res.json(201, result);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
