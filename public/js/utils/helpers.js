/**
 * Helper Utilities
 * Common helper functions used throughout the application
 */

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    
    return formatDate(date);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get category display name
 * @param {string} category - Category key
 * @returns {string} Display name
 */
export function getCategoryName(category) {
    const categories = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung cấp',
        'advanced': 'Nâng cao',
        'common-phrases': 'Cụm từ thường dùng',
        'numbers': 'Số đếm',
        'colors': 'Màu sắc',
        'food': 'Đồ ăn',
        'family': 'Gia đình',
        'other': 'Khác'
    };
    return categories[category] || category;
}

/**
 * Get level display name
 * @param {string} level - Level key
 * @returns {string} Display name
 */
export function getLevelName(level) {
    const levels = {
        'beginner': 'Sơ cấp',
        'intermediate': 'Trung cấp',
        'advanced': 'Nâng cao'
    };
    return levels[level] || level;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safe JSON parse
 * @param {string} json - JSON string
 * @param {*} defaultValue - Default value if parse fails
 * @returns {*} Parsed value or default
 */
export function safeJSONParse(json, defaultValue = null) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return defaultValue;
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Escaped HTML
 */
export function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
