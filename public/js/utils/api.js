/**
 * API Configuration and Utilities
 * Centralized API calls and configuration
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api' 
        : '/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

/**
 * Make API request with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
        ...options,
        headers: {
            ...API_CONFIG.HEADERS,
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    try {
        console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`);
        
        const response = await fetch(url, config);
        const data = await response.json();

        console.log(`📥 API Response: ${response.status}`, data);

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`❌ API Error: ${endpoint}`, error);
        throw error;
    }
}

/**
 * API Methods
 */
export const api = {
    // Generic HTTP methods
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
    }),
    
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
    
    // Auth endpoints
    auth: {
        login: (email, password) => 
            apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            }),
        
        register: (email, displayName, password) => 
            apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, displayName, password })
            }),
        
        verify: () => apiRequest('/auth/verify'),
        
        logout: () => apiRequest('/auth/logout', { method: 'POST' }),
        
        changePassword: (currentPassword, newPassword) =>
            apiRequest('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword })
            })
    },

    // Words endpoints
    words: {
        getAll: () => apiRequest('/words'),
        
        getById: (id) => apiRequest(`/words/${id}`),
        
        create: (wordData) => 
            apiRequest('/words', {
                method: 'POST',
                body: JSON.stringify(wordData)
            }),
        
        update: (id, wordData) =>
            apiRequest(`/words/${id}`, {
                method: 'PUT',
                body: JSON.stringify(wordData)
            }),
        
        delete: (id) =>
            apiRequest(`/words/${id}`, { method: 'DELETE' }),
        
        practice: (limit = 20) => 
            apiRequest(`/words/practice?limit=${limit}`)
    },

    // Progress endpoints
    progress: {
        getStats: () => apiRequest('/progress/stats'),
        
        updateMastery: (wordId, masteryLevel) =>
            apiRequest('/progress/mastery', {
                method: 'POST',
                body: JSON.stringify({ wordId, masteryLevel })
            }),
        
        updateStreak: () =>
            apiRequest('/progress/streak', { method: 'POST' })
    }
};
