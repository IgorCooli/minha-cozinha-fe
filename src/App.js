import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import MyStock from "./components/MyStock/MyStock";
import ShoppingList from './components/shoppingList/ShoppingList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/my-stock" element={<MyStock />} />
                <Route path="/my-shopping-list" element={<ShoppingList />} />
                {/* <Route path="/" element={<Login />} /> */}
                {/* <Route
                    path="/register-customer"
                    element={<ProtectedRoute element={<RegisterCustomerPage />} />} // Use CustomRoute with element
                />
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<HomePage />} />} // Use CustomRoute with element
                />

                <Route
                    path="/register-sale"
                    element={<ProtectedRoute element={<RegisterSalePage />} />} // Use CustomRoute with element
                />

                <Route
                    path="/sales-history"
                    element={<ProtectedRoute element={<SalesHistory />} />} // Use CustomRoute with element
                /> */}
            </Routes>
        </Router>
    );
}

export default App;
