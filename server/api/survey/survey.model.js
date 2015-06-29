'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SurveySchema = new Schema({
  account: String,
  serialNo: String,
  status: Boolean,
  title: String,
  pages: Array,
  permissionList: [String]
});

module.exports = mongoose.model('Survey', SurveySchema);
