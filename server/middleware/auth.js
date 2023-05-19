/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const catchAsync = require('./catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../model/userSchema');

exports.isAuthtication = catchAsync(async (req, res, next) => {
    const {token} = await req.cookies;
    if (!token) {
        return next(new ErrorHandler('Not authorized to access this route, Login first', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});
exports.authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
    next();
};
