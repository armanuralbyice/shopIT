const express = require('express');
const {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controller/productController');
const {isAuthtication, authorizeRoles} = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProduct);
router.route('/:id').get(getProductById);
router.route('/newProduct').post(createProduct);
router.route('/update/:id').put(updateProduct);
router.route('/delete/:id').delete(isAuthtication, authorizeRoles('admin'), deleteProduct);

module.exports = router;
