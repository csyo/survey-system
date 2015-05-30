'use strict';

var _ = require('lodash');
var Survey = require('./survey.model');

// Get list of surveys
exports.index = function(req, res) {
  Survey.find({ account: req.query.account }, function (err, surveys) {
    if(err) { return handleError(res, err); }
    return res.json(200, surveys);
  });
};

// Get a single survey
exports.show = function(req, res) {
  Survey.findById(req.params.id, function (err, survey) {
    if(err) { return handleError(res, err); }
    if(!survey) { return res.send(404); }
    return res.json(survey);
  });
};

// Creates a new survey in the DB.
exports.create = function(req, res) {
  Survey.create(req.body, function(err, survey) {
    if(err) { return handleError(res, err); }
    return res.json(201, survey);
  });
};

// Updates an existing survey in the DB.
exports.update = function(req, res) {
  Survey.findById(req.body._id, function (err, survey) {
    if (err) { return handleError(res, err); }
    if(!survey) { return res.send(404); }
    var updated = _.merge(survey, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, survey);
    });
  });
};

// Deletes a survey from the DB.
exports.destroy = function(req, res) {
  Survey.findById(req.params.id, function (err, survey) {
    if(err) { return handleError(res, err); }
    if(!survey) { return res.send(404); }
    survey.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}