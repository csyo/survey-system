'use strict';

var express = require('express');
var controller = require('./upload.controller');

// Requires multiparty
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', multipartyMiddleware, controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;