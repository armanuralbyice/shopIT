/* eslint-disable object-curly-newline */
const express = require('express');
const {newOrder, singleOrder, myOrders, allOrders} = require('../controller/orderController');
const {isAuthtication, authorizeRoles} = require('../middleware/auth');

const router = express.Router();
router.route('/new').post(isAuthtication, newOrder);
router.route('/:id').get(isAuthtication, singleOrder);
router.route('/me').get(isAuthtication, myOrders);
router.route('/admin/orders').get(isAuthtication, authorizeRoles('admin'), allOrders);
module.exports = router;
