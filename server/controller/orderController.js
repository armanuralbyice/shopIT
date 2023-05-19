/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const Order = require('../model/orderSchema');
// const Product = require('../model/productSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

exports.newOrder = catchAsyncError(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    });
    res.status(200).json({
        success: true,
        order,
    });
});
exports.singleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new ErrorHandler('No order found with this ID', 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});
exports.myOrders = catchAsyncError(async (req, res) => {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders,
    });
});
exports.allOrders = catchAsyncError(async (req, res) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});
