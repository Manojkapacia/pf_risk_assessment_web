import axios from 'axios';
import MESSAGES from '../constants/messages';
import staticData from '../../helper/admin-login.json';

// Create an Axios instance with default configurations
const apiClient = axios.create({
  baseURL: MESSAGES.api.baseUrl, // Replace with your API base URL
  withCredentials: true, // Ensure cookies are included in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle login
export const login = async (uan, password) => {
  try {
    const response = await apiClient.post('auth/login', { uan, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { message: MESSAGES.error.invalidUanPassword, status: 400 };
    }
    console.error('Login failed:', error);
    // Re-throw for other error cases
    throw error;
  }
};

// Function to handle admin login
export const adminLogin = async (endpoint, data) => {
  try {
    // const response = await apiClient.post(endpoint, data);
    // return response.data;
    if(data.email === staticData.email && data.password === staticData.password) {
      return { message: MESSAGES.error.loginSuccess, status: 200 };
    } else {
      return { message: MESSAGES.error.invalidOpnLogin, status: 400 };
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { message: MESSAGES.error.invalidUanPassword, status: 400 };
    }
    console.error('Admin Login failed:', error);
    // Re-throw for other error cases
    throw error;
  }
};

// Function to make GET requests
export const get = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data; // Return the API response data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.unauthorized, status: 401 };
    }
    console.error('GET request failed:', error);
    throw error;
  }
};

// Function to make POST requests
export const post = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data; // Return the API response data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.unauthorized, status: 401 };
    }
    console.error('POST request failed:', error);
    throw error;
  }
};

// Function to make PUT requests
export const put = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data; // Return the API response data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.unauthorized, status: 401 };
    }
    console.error('PUT request failed:', error);
    throw error;
  }
};

// Function to make DELETE requests
export const del = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data; // Return the API response data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.unauthorized, status: 401 };
    }
    console.error('DELETE request failed:', error);
    throw error;
  }
};
