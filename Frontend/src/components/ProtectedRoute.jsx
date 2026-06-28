import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${backendUrl}/auth/verify-session`, {
                    withCredentials: true
                });
                if (response.data.loggedIn) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [backendUrl]);

    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="text-primary font-inter font-semibold tracking-wider uppercase">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted url
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};
