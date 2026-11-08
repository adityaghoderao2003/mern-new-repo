
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);

    const [formdata, setFormdata] = useState({
        name: "",
        category: "",
        price: "",
        stock: ""
    });

    // GET ALL PRODUCTS
    const getProducts = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to get products");
            }

            setProducts(data.products || []);

        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        getProducts();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };



    // CREATE PRODUCT
    const createProduct = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create product");
            }

            alert(data.message || "Product created successfully");

            resetForm();
            getProducts();

        } catch (err) {
            alert(err.message);
        }
    };

    // EDIT BUTTON
    const handleEdit = (item) => {
        setEditProductId(item._id);

        setFormdata({
            name: item.name,
            category: item.category,
            price: item.price,
            stock: item.stock
        });

        window.scrollTo(0, 0);
    };

    // UPDATE PRODUCT
    const updateProduct = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${editProductId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update product");
            }

            alert(data.message || "Product updated successfully");

            setEditProductId(null);
            setFormdata({
                name: "",
                category: "",
                price: "",
                stock: ""
            });
            getProducts();

        } catch (err) {
            alert(err.message);
        }
    };

    // DELETE PRODUCT
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete product");
            }

            alert(data.message || "Product deleted successfully");

            setEditProductId(null);

            setFormdata({
                name: "",
                category: "",
                price: "",
                stock: ""
            });
            getProducts();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>
                {editProductId ? "Update Product" : "Add Product"}
            </h2>

            {role === "admin" && (
                <>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formdata.name}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formdata.category}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formdata.price}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={formdata.stock}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button
                        onClick={editProductId ? updateProduct : createProduct}
                    >
                        {editProductId ? "Update Product" : "Add Product"}
                    </button>

                    {editProductId && (
                        <button onClick={resetForm}>
                            Cancel
                        </button>
                    )}

                    <hr />

                    <h2>Manage Products</h2>

                    {products.length === 0 ? (
                        <p>No products found</p>
                    ) : (
                        products.map((item) => (
                            <div key={item._id}>
                                <h3>{item.name}</h3>
                                <p>Category: {item.category}</p>
                                <p>Price: ₹{item.price}</p>
                                <p>Stock: {item.stock}</p>

                                <button onClick={() => handleEdit(item)}>
                                    Edit
                                </button>

                                <button onClick={() => deleteProduct(item._id)}>
                                    Delete
                                </button>

                                <hr />
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default AddProduct;
