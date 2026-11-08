
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [quantity, setQuantity] = useState("");

    // GET SINGLE ORDER
    const getOrder = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to get order");
            }

            const order = data.order;

            setQuantity(order.quantity);

        } catch (err) {
            alert(err.message);
        }
    };

    // UPDATE ORDER
    const updateOrder = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        quantity: quantity
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update order");
            }

            alert(data.message || "Order updated successfully");

            navigate("/orders");

        } catch (err) {
            alert(err.message);
        }
    };

    // CHECK LOGIN AND GET ORDER
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        getOrder();
    }, [id, navigate]);

    return (
        <div>
            <h2>Edit Order</h2>

            <label>Quantity:</label>

            <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
            />

            <br /><br />

            <button onClick={updateOrder}>
                Update Order
            </button>

            <button onClick={() => navigate("/orders")}>
                Cancel
            </button>
        </div>
    );
};

export default EditOrder;
