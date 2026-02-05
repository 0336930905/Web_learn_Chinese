/**
 * Modal Component
 * Reusable modal dialog
 */

/**
 * Create and show modal
 * @param {object} options - Modal options
 * @returns {HTMLElement} Modal element
 */
export function createModal(options = {}) {
    const {
        title = 'Modal',
        content = '',
        footer = '',
        size = 'medium', // small, medium, large
        closeButton = true,
        backdrop = true,
        keyboard = true,
        onClose = null
    } = options;
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;
    modal.innerHTML = `
        <div class="modal-backdrop ${backdrop ? '' : 'hidden'}"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${closeButton ? '<button class="modal-close" data-dismiss="modal"><i class="fas fa-times"></i></button>' : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Event listeners
    if (closeButton) {
        modal.querySelector('[data-dismiss="modal"]').addEventListener('click', () => {
            closeModal(modal, onClose);
        });
    }
    
    if (backdrop) {
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            closeModal(modal, onClose);
        });
    }
    
    if (keyboard) {
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal(modal, onClose);
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    return modal;
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 * @param {Function} onClose - Callback on close
 */
export function closeModal(modal, onClose = null) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
        if (onClose) onClose();
    }, 300);
}

/**
 * Confirm dialog
 * @param {object} options - Confirm options
 * @returns {Promise<boolean>} User choice
 */
export function confirmDialog(options = {}) {
    const {
        title = 'Xác nhận',
        message = 'Bạn có chắc chắn?',
        confirmText = 'Xác nhận',
        cancelText = 'Hủy',
        type = 'warning' // warning, danger, info
    } = options;
    
    return new Promise((resolve) => {
        const footer = `
            <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
            <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'}" data-action="confirm">${confirmText}</button>
        `;
        
        const modal = createModal({
            title,
            content: `<p>${message}</p>`,
            footer,
            size: 'small',
            backdrop: true,
            keyboard: true,
            onClose: () => resolve(false)
        });
        
        modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
            closeModal(modal);
            resolve(true);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            closeModal(modal);
            resolve(false);
        });
    });
}
