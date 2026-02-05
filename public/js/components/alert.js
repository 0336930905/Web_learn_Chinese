/**
 * Alert Component
 * Display toast notifications
 */

let alertContainer = null;

/**
 * Initialize alert container
 */
function initAlertContainer() {
    if (!alertContainer) {
        alertContainer = document.getElementById('alertContainer');
        
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.className = 'alert-container';
            document.body.appendChild(alertContainer);
        }
    }
}

/**
 * Show alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {number} duration - Duration in ms (default: 5000)
 */
export function showAlert(message, type = 'info', duration = 5000) {
    initAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    
    const icon = getIcon(type);
    alert.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, duration);
    }
    
    return alert;
}

/**
 * Get icon for alert type
 * @param {string} type - Alert type
 * @returns {string} Icon class
 */
function getIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Show success alert
 * @param {string} message - Message to display
 */
export function showSuccess(message) {
    return showAlert(message, 'success');
}

/**
 * Show error alert
 * @param {string} message - Message to display
 */
export function showError(message) {
    return showAlert(message, 'danger');
}

/**
 * Show warning alert
 * @param {string} message - Message to display
 */
export function showWarning(message) {
    return showAlert(message, 'warning');
}

/**
 * Show info alert
 * @param {string} message - Message to display
 */
export function showInfo(message) {
    return showAlert(message, 'info');
}

/**
 * Clear all alerts
 */
export function clearAlerts() {
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}
