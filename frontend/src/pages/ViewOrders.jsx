
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    // GET ORDERS
    const getOrders = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to get orders");
            }

            setOrders(data.orders || []);

        } catch (err) {
            alert(err.message);
        }
    };

    // DELETE ORDER
    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete order");
            }

            alert(data.message || "Order deleted successfully");

            getOrders();

        } catch (err) {
            alert(err.message);
        }
    };

    // CHECK LOGIN AND FETCH ORDERS
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        getOrders();
    }, [navigate]);



    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update status");
            }

            alert("Order status updated successfully");
            getOrders();
        } catch (err) {
            alert(err.message);
        }
    };
    return (
        <div>
            <h2>My Orders</h2>

            <button onClick={() => navigate("/create-order")}>
                Create Order
            </button>

            <hr />

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id}>
                        <p>
                            Product: {order.product?.name || "Product unavailable"}
                        </p>

                        <p>
                            Quantity: {order.quantity}
                        </p>

                        <p>
                            Total Amount: ₹{order.totalAmount}
                        </p>

                        <p>
                            Customer: {order.createdBy?.name}
                        </p>

                        <p>
                            Email: {order.createdBy?.email}
                        </p>

                        <p>
                            Status: {order.status}
                        </p>

                        {localStorage.getItem("role") === "admin" && (
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        )}

                        <button
                            onClick={() => navigate(`/edit-order/${order._id}`)}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteOrder(order._id)}
                        >
                            Delete
                        </button>

                        <hr />
                    </div>
                ))
            )}

            <button onClick={() => navigate("/product")}>
                Go to Products
            </button>

            <button onClick={() => navigate("/review")}>
                Go to Reviews
            </button>
        </div>
    );
};

export default ViewOrders;