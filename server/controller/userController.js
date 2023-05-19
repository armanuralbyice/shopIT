/* eslint-disable consistent-return */
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const User = require('../model/userSchema');
const catchAsync = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

exports.registerUser = catchAsync(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: '150',
        crop: 'scale',
    });
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler('Please provide all fields', 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url,
        },
    });
    res.status(201).json({
        success: true,
        user,
    });
});
exports.loginUser = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please provide all fields', 400));
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }
    await sendToken(user, 200, res);
});
exports.logout = catchAsync(async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        message: 'Logged out successfully',
    });
});
exports.forgetPasswod = catchAsync(async (req, res, next) => {
    const {email} = req.body;
    if (!email) {
        return next(new ErrorHandler('Please provide all fields', 400));
    }
    const user = await User.findOne({email});
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetUrl = `${req.protocol}://${req.get('host')}/api/user/reset/password/${resetToken}`;
    const message = `Your password reset token is as follow:\n${resetUrl}\nIf you have not requested this email, then ignore it`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
            resetToken,
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(err.message, 500));
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });
    if (!user) {
        return next(new ErrorHandler('Invalid token', 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    await sendToken(user, 200, res);
});
exports.getProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new ErrorHandler('Password does not match', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    await sendToken(user, 200, res);
});
exports.updateProfile = catchAsync(async (req, res) => {
    const updateData = {
        name: req.body.name,
        email: req.body.email,
    };
    // if (req.body.avatar !== '') {
    //     const user = await User.findById(req.user.id);
    //     const image_id = user.avatar.public_id;
    //     const res = await cloudinary.v2.uploadImage(image_id);
    //     const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //         folder: 'avatars',
    //         width: '150',
    //         crop: 'scale',
    //     });
    //     newUserData.avatar = {
    //         public_id: result.public_id,
    //         url: result.secure_url,
    //     };
    // }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    await user.save();
    res.status(200).json({
        success: true,
        user,
    });
});
exports.getAllUser = catchAsync(async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        users: user,
    });
});
exports.getUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        user,
    });
});
// Admin update user details
exports.updateUserProfile = catchAsync(async (req, res) => {
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    await user.save();
    res.status(200).json({
        success: true,
        user,
    });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
