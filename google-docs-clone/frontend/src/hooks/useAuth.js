import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../services/userService';

const useAuth = () => {
    const { setUser, setIsAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/check', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await res.json();
                if (res.ok && data.user) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setError(err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [setUser, setIsAuthenticated]);

    const handleLogin = async (credentials) => {
        setLoading(true);
        try {
            const { user, token } = await loginUser(credentials);
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData) => {
        setLoading(true);
        try {
            const { user, token } = await registerUser(userData);
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleLogin,
        handleRegister,
    };
};

export default useAuth;
