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

export const getUser = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
};