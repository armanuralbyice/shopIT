/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const Product = require('../model/productSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/ApiFeatures');

exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});
exports.getAllProduct = catchAsync(async (req, res, next) => {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        count: products.length,
        products,
    });
});
// eslint-disable-next-line consistent-return
exports.getProductById = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        findAndModify: false,
    });
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});
