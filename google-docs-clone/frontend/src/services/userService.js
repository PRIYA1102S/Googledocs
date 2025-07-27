import axios from 'axios';

const API_URL = '/api/users';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const logoutUser = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/users/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getUser = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/auth/check`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.user;
};
