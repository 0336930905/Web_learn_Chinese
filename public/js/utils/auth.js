/**
 * Authentication Utilities
 * Handle authentication state and token management
 */

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Set auth token to localStorage
 * @param {string} token - JWT token
 */
export function setToken(token) {
    localStorage.setItem('token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/**
 * Check if user is authenticated
 * @returns {boolean} Is authenticated
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * Redirect to login page
 * @param {string} message - Optional message to display
 */
export function redirectToLogin(message = null) {
    removeToken();
    sessionStorage.clear();
    
    const url = message 
        ? `/pages/auth/login.html?message=${encodeURIComponent(message)}`
        : '/pages/auth/login.html';
    
    window.location.href = url;
}

/**
 * Redirect to dashboard
 */
export function redirectToDashboard() {
    sessionStorage.clear();
    window.location.href = '/index.html';
}

/**
 * Handle OAuth token from URL
 * @returns {boolean} True if OAuth token was found and processed
 */
export function handleOAuthToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) return false;
    
    console.log('🔐 OAuth token detected');
    sessionStorage.clear();
    setToken(token);
    
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return true;
}

/**
 * Verify token with server
 * @returns {Promise<object>} User data
 */
export async function verifyToken() {
    const token = getToken();
    
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Token verification failed');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('❌ Token verification failed:', error);
        throw error;
    }
}

/**
 * Initialize auth guard for protected pages
 * Redirects to login if not authenticated
 */
export async function initAuthGuard() {
    console.log('🔒 Auth Guard: Checking authentication...');
    
    if (!isAuthenticated()) {
        console.log('❌ Not authenticated - redirecting to login');
        redirectToLogin('Please login to continue');
        return null;
    }

    try {
        const user = await verifyToken();
        console.log('✅ Authentication verified:', user.email);
        return user;
    } catch (error) {
        console.error('❌ Auth verification failed:', error);
        redirectToLogin('Session expired. Please login again.');
        return null;
    }
}
