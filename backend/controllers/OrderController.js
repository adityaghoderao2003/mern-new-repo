const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const createOrder = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity || quantity == 0) {
            return res.status(400).json({
                success: false,
                message: "Product and quantity are required"
            });
        }

        const productdata = await Product.findById(product);

        if (!productdata) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (productdata.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock"
            });
        }

        let totalAmount = productdata.price * quantity;

        const order = await Order.create({
            product: productdata._id,
            quantity,
            totalAmount,
            createdBy: req.user.id
        });

        productdata.stock -= quantity;
        await productdata.save()

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// GET MY ORDERS
const getOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            createdBy: req.user.id
        })
            .populate("product")
            .populate("createdBy", "name email");

        res.status(200).json({
            success: true,
            orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(404).json({
                success: false,
                message: 'Only admin access'
            })
        }
        const orders = await Order.find()
            .populate("product")
            .populate("createdBy", "name email");

        if (!orders) {
            return res.status(400).json({
                success: false,
                message: 'Order not found'
            })
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// UPDATE ORDER
const updateOrder = async (req, res) => {
    try {

        const id = req.params.id;

        const order = await Order.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user.id
            },
            {
                quantity: req.body.quantity
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const deleteOrder = async (req, res) => {
    try {

        const id = req.params.id;

        const order = await Order.findOneAndDelete({
            _id: id,
            createdBy: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update order status"
            });
        }

        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    updateOrder,
    updateOrderStatus,
    deleteOrder
};