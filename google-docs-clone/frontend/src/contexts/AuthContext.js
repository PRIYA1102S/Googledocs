import React, { createContext, useState, useEffect } from 'react';
import { getUser, loginUser, logoutUser } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setLoading(false);

                const currentUser = await getUser(); // Updated below
                setUser(currentUser);
                setIsAuthenticated(true);
            } catch (err) {
                console.error(err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        const { user, token } = await loginUser(credentials);
        localStorage.setItem('token', token); // Save token
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await logoutUser(); // optional
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, setUser, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
