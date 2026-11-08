const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const UserRoutes = require("./routes/UserRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const ReviewRoutes = require("./routes/ReviewRoutes");

const app = express();

const port = 5000;

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", UserRoutes);
app.use("/api", ProductRoutes);
app.use("/api", OrderRoutes);
app.use("/api", ReviewRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Hello there");
});

app.listen(port, () => {
    console.log(`App listening on ${port}`);
});