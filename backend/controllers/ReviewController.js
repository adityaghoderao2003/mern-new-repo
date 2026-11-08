const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");
const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        if (!product || !rating) {
            return res.status(400).json({
                success: false,
                message: "Product and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const order = await Order.findOne({
            product: product,
            createdBy: req.user.id,
            status: "delivered"
        });

        if (!order) {
            return res.status(403).json({
                success: false,
                message: "You can review this product only after your order is delivered"
            });
        }

        const review = await Review.create({
            product: product,
            rating: rating,
            comment: comment,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// GET REVIEWS
const getReviews = async (req, res) => {
    try {
        const { product } = req.query;

        let query = {};

        // Agar product ID di hai toh us product ke reviews
        if (product) {
            query.product = product;
        }

        const reviews = await Review.find(query)
            .populate("product", "name price")
            .populate("createdBy", "name email");

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// UPDATE REVIEW
const updateReview = async (req, res) => {
    try {
        const id = req.params.id;

        const review = await Review.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user.id
            },
            {
                rating: req.body.rating,
                comment: req.body.comment
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// DELETE REVIEW
const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;

        const review = await Review.findOneAndDelete({
            _id: id,
            createdBy: req.user.id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview
};
