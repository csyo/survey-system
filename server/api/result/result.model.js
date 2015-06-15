'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
  surveyId: String,
  clientIp: String,
  results: Array
});

module.exports = mongoose.model('Result', ResultSchema);
