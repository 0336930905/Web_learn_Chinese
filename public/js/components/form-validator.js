/**
 * Form Validator Component
 * Client-side form validation
 */

/**
 * Validation rules
 */
const rules = {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value, length) => value.length >= length,
    maxLength: (value, length) => value.length <= length,
    pattern: (value, pattern) => new RegExp(pattern).test(value),
    match: (value, matchValue) => value === matchValue
};

/**
 * Error messages
 */
const messages = {
    required: 'Trường này là bắt buộc',
    email: 'Email không hợp lệ',
    minLength: 'Tối thiểu {0} ký tự',
    maxLength: 'Tối đa {0} ký tự',
    pattern: 'Định dạng không hợp lệ',
    match: 'Giá trị không khớp'
};

/**
 * Validate form field
 * @param {HTMLElement} field - Form field element
 * @param {object} validation - Validation rules
 * @returns {object} Validation result
 */
export function validateField(field, validation = {}) {
    const value = field.value;
    const errors = [];
    
    for (const [ruleName, ruleValue] of Object.entries(validation)) {
        if (!rules[ruleName]) continue;
        
        let isValid;
        if (typeof ruleValue === 'boolean' && ruleValue) {
            isValid = rules[ruleName](value);
        } else {
            isValid = rules[ruleName](value, ruleValue);
        }
        
        if (!isValid) {
            let message = messages[ruleName] || 'Validation failed';
            if (typeof ruleValue !== 'boolean') {
                message = message.replace('{0}', ruleValue);
            }
            errors.push(message);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Show field error
 * @param {HTMLElement} field - Form field element
 * @param {string} error - Error message
 */
export function showFieldError(field, error) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = error;
    
    // Insert after field
    field.parentElement.appendChild(errorEl);
}

/**
 * Clear field error
 * @param {HTMLElement} field - Form field element
 */
export function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element
 * @param {object} validations - Validation rules for each field
 * @returns {object} Validation result
 */
export function validateForm(form, validations = {}) {
    let isValid = true;
    const errors = {};
    
    for (const [fieldName, fieldRules] of Object.entries(validations)) {
        const field = form.elements[fieldName];
        if (!field) continue;
        
        const result = validateField(field, fieldRules);
        
        if (!result.valid) {
            isValid = false;
            errors[fieldName] = result.errors;
            showFieldError(field, result.errors[0]);
        } else {
            clearFieldError(field);
        }
    }
    
    return {
        valid: isValid,
        errors
    };
}

/**
 * Setup real-time validation
 * @param {HTMLFormElement} form - Form element
 * @param {object} validations - Validation rules for each field
 */
export function setupRealtimeValidation(form, validations = {}) {
    for (const [fieldName, fieldRules] of Object.entries(validations)) {
        const field = form.elements[fieldName];
        if (!field) continue;
        
        field.addEventListener('blur', () => {
            const result = validateField(field, fieldRules);
            if (!result.valid) {
                showFieldError(field, result.errors[0]);
            } else {
                clearFieldError(field);
            }
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                clearFieldError(field);
            }
        });
    }
}
