'use strict';

var _ = require('lodash');
var Survey = require('./survey.model');

// Get list of surveys
exports.index = function(req, res) {
  if (req.user._doc.role === 'admin') {
    Survey.find({}, function (err, surveys) {
      if(err) { return handleError(res, err); }
      return res.json(200, surveys);
    });
  } else {
    Survey.find({ account: req.user._doc.name }, function (err, surveys) {
      if(err) { return handleError(res, err); }
      return res.json(200, surveys);
    });
  }
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
  if(req.body._id) { delete req.body._id; }
  Survey.findById(req.params.id, function (err, survey) {
    if (err) { return handleError(res, err); }
    if(!survey) { return res.send(404); }
    var updated = _.merge(survey, req.body, function(a,b){
      if (_.isArray(a)) return b; // discard previous pages
    });
    updated.markModified('pages');
    updated.save(function (err, result) {
      if (err) { return handleError(res, err); }
      return res.json(200, result);
    });
  });
};

// Updates an survey status or basic information in the DB.
exports.patch = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Survey.findById(req.params.id, function (err, survey) {
    if (err) { return handleError(res, err); }
    if(!survey) { return res.send(404); }
    var updated = _.merge(survey, req.body);
    updated.save(function (err, result) {
      if (err) { return handleError(res, err); }
      return res.json(200, result);
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
