const express = require('express');
const {
    registerUser,
    loginUser,
    logout,
    forgetPasswod,
    resetPassword,
    getProfile,
    updatePassword,
    updateProfile,
    getAllUser,
    getUser,
    updateUserProfile,
    deleteUser,
} = require('../controller/userController');
const {isAuthtication, authorizeRoles} = require('../middleware/auth');

const router = express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/forget/password').post(forgetPasswod);
router.route('/reset/password/:token').put(resetPassword);
router.route('/me').get(isAuthtication, getProfile);
router.route('/update/password').put(isAuthtication, updatePassword);
router.route('/update/profile').put(isAuthtication, updateProfile);
router.route('/admin/users').get(isAuthtication, authorizeRoles('admin'), getAllUser);
router.route('/admin/:id').get(isAuthtication, authorizeRoles('admin'), getUser);
router.route('/admin/update/:id').put(isAuthtication, authorizeRoles('admin'), updateUserProfile);
router.route('/admin/delete/:id').delete(isAuthtication, authorizeRoles('admin'), deleteUser);
module.exports = router;
