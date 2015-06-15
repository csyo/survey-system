'use strict';

var express = require('express');
var controller = require('./result.controller');

var router = express.Router();

router.get('/:surveyId', controller.index);
router.post('/', controller.create);

module.exports = router;
