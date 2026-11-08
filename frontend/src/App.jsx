import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar";

import ViewProduct from "./pages/ViewProduct";
import AddProduct from "./pages/AddProduct";

import ViewOrders from "./pages/ViewOrders";
import EditOrder from "./pages/EditOrder";
import CreateOrder from "./pages/CreateOrder";

import Review from "./pages/Review";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/product",
    element: (
      <>
        <Navbar />
        <ViewProduct />
      </>
    ),
  },
  {
    path: "/addproduct",
    element: (
      <>
        <Navbar />
        <AddProduct />
      </>
    ),
  },
  {
    path: "/order",
    element: (
      <>
        <Navbar />
        <ViewOrders />
      </>
    ),
  },
  {
    path: "/create-order",
    element: (
      <>
        <Navbar />
        <CreateOrder />
      </>
    ),
  },
  {
    path: "/edit-order/:id",
    element: (
      <>
        <Navbar />
        <EditOrder />
      </>
    ),
  },
  {
    path: "/review",
    element: (
      <>
        <Navbar />
        <Review />
      </>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;