
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [formdata, setFormdata] = useState({
        product: "",
        quantity: ""
    });

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
    }, [navigate]);

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const createOrder = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/orders",
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
                throw new Error(data.message || "Failed to create order");
            }

            alert(data.message || "Order created successfully");

            setFormdata({
                product: "",
                quantity: ""
            });

            navigate("/order");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Place Order</h2>

            <select
                name="product"
                value={formdata.product}
                onChange={handleChange}
            >
                <option value="">Select Product</option>

                {products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price}
                    </option>
                ))}
            </select>

            <br /><br />

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formdata.quantity}
                onChange={handleChange}
            />

            <br /><br />

            <button onClick={createOrder}>
                Place Order
            </button>

            <button onClick={() => navigate("/orders")}>
                View Orders
            </button>
        </div>
    );
};

export default CreateOrder;
