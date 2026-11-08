const express = require("express");

const {
    createReview,
    getReviews,
    updateReview,
    deleteReview
} = require("../controllers/ReviewController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/reviews", verifyToken, createReview);
router.get("/reviews", getReviews);
router.put("/reviews/:id", verifyToken, updateReview);
router.delete("/reviews/:id", verifyToken, deleteReview);

module.exports = router;