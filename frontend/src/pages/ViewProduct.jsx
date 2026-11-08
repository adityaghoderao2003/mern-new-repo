import React from 'react'
import {useState , useEffect} from 'react'
    import { useNavigate } from 'react-router-dom';
const ViewProduct = () => {
    const [products, setProducts] = useState([]);

    const role = localStorage.getItem("role");

    const navigate = useNavigate()

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");

    const getProducts = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/products?search=${search}&category=${category}&sort=${sort}&page=${page}`,
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
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            alert(err.message);
        }
    };


    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        getProducts();

    }, [search, category, sort, page]);

    return (
        <div>

            {role === "admin" && (
                <button onClick={() => navigate("/addproduct")}>
                    Manage Products
                </button>
            )}

            {/* SEARCH */}

            <input
                type="text"
                placeholder="Search product"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />


            {/* CATEGORY */}

            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">
                    All Categories
                </option>

                <option value="Mobile">
                    Mobile
                </option>

                <option value="Laptop">
                    Laptop
                </option>

                <option value="Accessories">
                    Accessories
                </option>

            </select>


            {/* SORT */}

            <select
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">
                    Sort by Price
                </option>

                <option value="low">
                    Low → High
                </option>

                <option value="high">
                    High → Low
                </option>

            </select>


            <hr />


            {/* PRODUCTS */}

            <h2>Products</h2>


            {products.length === 0 ? (
                <p>Products are not here</p>
            ) : (
                products.map((item) => (

                    <div key={item._id}>

                        <h3>{item.name}</h3>

                        <p>
                            Category: {item.category}
                        </p>

                        <p>
                            Price: ₹{item.price}
                        </p>

                        <p>
                            Stock: {item.stock}
                        </p>

                        <hr />

                    </div>

                ))
            )}

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>


            <span>
                {" "} Page {page} of {totalPages} {" "}
            </span>


            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>


            <br /><br />

            <button
                onClick={() => navigate("/order")}
            >
                Go to Orders
            </button>

            <button
                onClick={() => navigate("/review")}
            >
                Go to Reviews
            </button>

        </div>
    )
}

export default ViewProduct
