const express = require("express");

const {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,updateOrderStatus,
    getAllOrders
} = require("../controllers/OrderController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/orders", verifyToken, createOrder);
router.get("/orders", verifyToken, getOrders);
router.get("/orders/admin", verifyToken, getAllOrders);
router.put("/orders/:id", verifyToken, updateOrder);
router.delete("/orders/:id", verifyToken, deleteOrder);
router.put("/orders/:id/status", verifyToken, updateOrderStatus);
module.exports = router;