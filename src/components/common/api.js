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
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }catch (error) {
    if (error.response && error.response.status === 400) {
      return { message: MESSAGES.error.invalidUanPassword, status: 400 };
    }
    console.error('Admin Login failed:', error);
    // Re-throw for other error cases
    throw error;
  }
};

// Function to make GET requests
export const getUanNumber = async (page = 1, limit = 100) => {
  try {
    const response = await apiClient.get(`admin/uan-details?page=${page}&limit=${limit}`);
    return response.data; // Return the API response data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.unauthorized, status: 401 };
    }
    console.error('GET request failed:', error);
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

export const logout = async () => {
  try {
    const response = await apiClient.post('auth/logout');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { message: MESSAGES.error.logoutError, status: 401 };
    }
    console.error('logout failed:', error);
    // Re-throw for other error cases
    throw error;
  }
};

//ZOHO API
export const zohoRequest = async (formData) => {
  try {
    const response = await apiClient.post('data/createLead', {formData});
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { message: MESSAGES.error.ZOHOError, status: 400 };
    }
    console.error('Request failed:', error);
    // Re-throw for other error cases
    throw error;
  }
};