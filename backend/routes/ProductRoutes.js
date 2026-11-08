const express = require("express");

const {
    createProduct,
    getProducts,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/ProductController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products", verifyToken, getProducts);
router.get("/products/admin", verifyToken, getAllProducts);

router.post(
    "/products",
    verifyToken,
    createProduct
);

router.put(
    "/products/:id",
    verifyToken,
    updateProduct
);

router.delete(
    "/products/:id",
    verifyToken,
    deleteProduct
);

module.exports = router;