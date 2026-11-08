const Product = require('../models/ProductModel');

const createProduct = async (req, res) => {

    try {
        const { name, category, price, stock } = req.body;

        if (!name || !category || price == null || stock == null) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const product = await Product.create({
            name, category, price, stock, createdBy: req.user.id
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: 'i'
            }
        }
        if (category) {
            query.category = category
        };

        let sortOptions = {};

        if (sort === 'low') {
            sortOptions.price = 1
        }

        if (sort === 'high') {
            sortOptions.price = -1
        }

        const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query).populate('createdBy', 'name email').sort(sortOptions).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const getAllProducts = async(req,res)=>{
    try{

        if(req.user.role !== 'admin'){
            return res.status(403).json({
                success : false,
                message : 'Sorry you are not allowed only for admin'
            })
        }

        const getproduct = await Product.find().populate('createdBy', 'email name');

        if(getproduct.length == 0){
            return res.status(400).json({
                success : false,
                message : 'products not found'
            })
        }

        res.status(200).json({
            success : true,
            message :'Your all products',
            getproduct,
            allProducts : getproduct.length
        })
    }catch(err){res.status(500).json({
            success: false,
            message: err.message
        });}
}


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOneAndDelete({
            _id: id,
            createdBy: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getAllProducts,
    updateProduct,
    deleteProduct
};