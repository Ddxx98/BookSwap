import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Books from "./pages/Books/Books";
import NewBook from "./pages/NewBook/NewBook";
import MyBooks from "./pages/MyBooks/MyBooks";
import EditBook from "./pages/EditBook/EditBook";
import BookDetails from "./pages/BookDetails/BookDetails";
import RequestBook from "./pages/RequestBook/RequestBook";
import MyRequests from "./pages/MyRequests/MyRequests";
import IncomingRequests from "./pages/IncomingRequests/IncomingRequests";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected group */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route path="/books/mine" element={<MyBooks />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/:id/request" element={<RequestBook />} />
          <Route path="/requests/mine" element={<MyRequests />} />
          <Route path="/requests/incoming" element={<IncomingRequests />} />
        </Route>

        {/* Optional 404
        <Route path="*" element={<NotFound />} />
        */}
      </Routes>
    </>
  );
}
