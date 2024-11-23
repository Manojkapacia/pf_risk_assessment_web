import axios from 'axios';
import MESSAGES from '../constants/messages';

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
    console.error('Login failed:', error);
    throw error;
  }
};

// Interceptor to attach the session cookie to every request
apiClient.interceptors.request.use((config) => {
  const sessionCookie = localStorage.getItem('sessionCookie');

  if (sessionCookie) {
    // Add the session cookie to the Authorization or Cookie header
    config.headers['Authorization'] = sessionCookie; // Replace with 'Cookie' if required by the server
  }

  return config;
});

// Function to make GET requests
export const get = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data; // Return the API response data
  } catch (error) {
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
    console.error('DELETE request failed:', error);
    throw error;
  }
};
