'use strict';

var _ = require('lodash');
var Upload = require('./upload.model');

// Get list of uploads
exports.index = function(req, res) {
  Upload.find(function (err, uploads) {
    if(err) { return handleError(res, err); }
    return res.json(200, uploads);
  });
};

// Get a single upload
exports.show = function(req, res) {
  Upload.findById(req.params.id, function (err, upload) {
    if(err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    var pic = new Buffer(upload._doc.file.buffer).toString('base64');
    upload._doc.file.buffer = null;
    upload._doc.file.img = pic;
    return res.json(upload);
  });
};

// Creates a new upload in the DB.
exports.create = function(req, res) {
  var file = {
    account: req.user._doc.name,
    file: req.files.file
  };
  Upload.create(file, function(err, upload) {
    if(err) { return handleError(res, err); }
    return res.json(201, upload);
  });
};

// Updates an existing upload in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Upload.findById(req.params.id, function (err, upload) {
    if (err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    var updated = _.merge(upload, { account: upload._doc.account, file: req.files.file });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, upload);
    });
  });
};

// Deletes a upload from the DB.
exports.destroy = function(req, res) {
  Upload.findById(req.params.id, function (err, upload) {
    if(err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    upload.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}