'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
  surveyId: String,
  results: Array
});

module.exports = mongoose.model('Result', ResultSchema);
