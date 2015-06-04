'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UploadSchema = new Schema({
  file: {
    buffer: Buffer,
    name: String,
    originalname: String,
    size: Number,
    mimetype: String
  },
  account: String
});

module.exports = mongoose.model('Upload', UploadSchema);