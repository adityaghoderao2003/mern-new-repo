import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Review = () => {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [reviews, setReviews] = useState([]);

    const [formdata, setFormdata] = useState({
        product: "",
        rating: "",
        comment: ""
    });

    const [editReviewId, setEditReviewId] = useState(null);

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
                throw new Error(
                    data.message || "Failed to get products"
                );
            }

            setProducts(data.products || []);

        } catch (err) {

            alert(err.message);

        }
    };

    // ================= GET REVIEWS =================

    const getReviews = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to get reviews"
                );
            }

            setReviews(data.reviews || []);

        } catch (err) {

            alert(err.message);

        }
    };


    // ================= CREATE REVIEW =================

    const createReview = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/reviews",
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
                throw new Error(
                    data.message || "Failed to create review"
                );
            }

            alert(data.message);

            setFormdata({
                product: "",
                rating: "",
                comment: ""
            });

            await getReviews();

        } catch (err) {

            alert(err.message);

        }
    };


    // ================= UPDATE REVIEW =================

    const updateReview = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/reviews/${editReviewId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },

                    body: JSON.stringify({
                        rating: formdata.rating,
                        comment: formdata.comment
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update review"
                );
            }

            alert(data.message);

            setEditReviewId(null);

            setFormdata({
                product: "",
                rating: "",
                comment: ""
            });

            await getReviews();

        } catch (err) {

            alert(err.message);

        }
    };


    // ================= DELETE REVIEW =================

    const deleteReview = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/reviews/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete review"
                );
            }

            alert(data.message);

            await getReviews();

        } catch (err) {

            alert(err.message);

        }
    };


    // ================= EDIT REVIEW =================

    const handleEdit = (review) => {

        setEditReviewId(review._id);

        setFormdata({
            product: review.product?._id || "",
            rating: review.rating,
            comment: review.comment
        });
    };


    // ================= INPUT CHANGE =================

    const handleChange = (e) => {

        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };


    // ================= CANCEL EDIT =================

    const cancelEdit = () => {

        setEditReviewId(null);

        setFormdata({
            product: "",
            rating: "",
            comment: ""
        });
    };


    // ================= PAGE LOAD =================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }

        getReviews();
        getProducts();

    }, [navigate]);


    return (
        <>

            <h2>
                {editReviewId
                    ? "Update Review"
                    : "Add Review"}
            </h2>


            {/* PRODUCT */}

            <select
                name="product"
                value={formdata.product}
                onChange={handleChange}
                disabled={editReviewId}
            >
                <option value="">
                    Select Product
                </option>

                {products.map((product) => (

                    <option
                        key={product._id}
                        value={product._id}
                    >
                        {product.name}
                    </option>

                ))}
            </select>

            <br /><br />


            {/* RATING */}

            <input
                type="number"
                name="rating"
                placeholder="Rating 1-5"
                min="1"
                max="5"
                value={formdata.rating}
                onChange={handleChange}
            />

            <br /><br />


            {/* COMMENT */}

            <textarea
                name="comment"
                placeholder="Write your review"
                value={formdata.comment}
                onChange={handleChange}
            />

            <br /><br />


            {/* CREATE / UPDATE */}

            <button
                onClick={
                    editReviewId
                        ? updateReview
                        : createReview
                }
            >
                {editReviewId
                    ? "Update Review"
                    : "Add Review"}
            </button>


            {/* CANCEL */}

            {editReviewId && (

                <button
                    onClick={cancelEdit}
                >
                    Cancel
                </button>

            )}


            <hr />


            {/* REVIEWS */}

            <h2>Reviews</h2>


            {reviews.length === 0 ? (

                <p>No reviews found</p>

            ) : (

                reviews.map((review) => (

                    <div key={review._id}>

                        <p>
                            Product:{" "}
                            {review.product?.name}
                        </p>

                        <p>
                            Price: ₹
                            {review.product?.price}
                        </p>

                        <p>
                            Rating: {review.rating}/5
                        </p>

                        <p>
                            Comment: {review.comment}
                        </p>

                        <p>
                            User:{" "}
                            {review.createdBy?.name}
                        </p>

                        <p>
                            Email:{" "}
                            {review.createdBy?.email}
                        </p>


                        <button
                            onClick={() => handleEdit(review)}
                        >
                            Edit
                        </button>


                        <button
                            onClick={() =>
                                deleteReview(review._id)
                            }
                        >
                            Delete
                        </button>

                        <hr />

                    </div>

                ))
            )}


            {/* NAVIGATION */}

            <button
                onClick={() => navigate("/product")}
            >
                Go to Products
            </button>


            <button
                onClick={() => navigate("/order")}
            >
                Go to Orders
            </button>

        </>
    );
};

export default Review;