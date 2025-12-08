const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

let authToken = null;

const api = {
  setToken: (token) => {
    authToken = token;
  },

  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` })
      }
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { error: 'Invalid response' };
    }
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = { data: responseData };
      throw error;
    }

    return responseData;
  },

  post: async (url, data) => {
    console.log('API POST:', `${API_BASE_URL}${url}`, data);
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` })
        },
        body: JSON.stringify(data)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { error: 'Invalid response' };
      }
      
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = { data: responseData };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error('API POST Error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        const networkError = new Error('Network request blocked. Please disable ad blocker or browser extensions.');
        networkError.response = { data: { error: 'Request blocked by browser extension or ad blocker' } };
        throw networkError;
      }
      throw error;
    }
  },

  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` })
      },
      body: JSON.stringify(data)
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { error: 'Invalid response' };
    }
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = { data: responseData };
      throw error;
    }

    return responseData;
  },

  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` })
      }
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { error: 'Invalid response' };
    }
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = { data: responseData };
      throw error;
    }

    return responseData;
  }
};

export default api;

