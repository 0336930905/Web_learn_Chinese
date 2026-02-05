/**
 * Notification Utilities
 * Handle notification loading, display, and interactions
 */

import { api } from './api.js';

/**
 * Format time ago (e.g., "5 phút trước", "2 giờ trước")
 */
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  return `${diffMonths} tháng trước`;
}

/**
 * Get icon for notification type
 */
function getNotificationIcon(type, customIcon) {
  if (customIcon) return customIcon;
  
  const iconMap = {
    'achievement': 'fa-trophy',
    'badge': 'fa-medal',
    'level_up': 'fa-arrow-up',
    'streak': 'fa-fire',
    'test_result': 'fa-clipboard-check',
    'reminder': 'fa-clock',
    'social': 'fa-users',
    'system': 'fa-bell',
    'promotion': 'fa-gift'
  };
  
  return iconMap[type] || 'fa-bell';
}

/**
 * Get color for notification type
 */
function getNotificationColor(type, customColor) {
  if (customColor) return customColor;
  
  const colorMap = {
    'achievement': '#FFD700',
    'badge': '#FF6B6B',
    'level_up': '#667eea',
    'streak': '#FF6B6B',
    'test_result': '#4ECDC4',
    'reminder': '#95E1D3',
    'social': '#AA96DA',
    'system': '#667eea',
    'promotion': '#FF6B6B'
  };
  
  return colorMap[type] || '#667eea';
}

/**
 * Create notification HTML element
 */
function createNotificationElement(notification) {
  const isUnread = !notification.isRead;
  const icon = getNotificationIcon(notification.type, notification.icon);
  const color = getNotificationColor(notification.type, notification.color);
  
  const item = document.createElement('a');
  item.href = notification.actionUrl || '#';
  item.className = `notification-item${isUnread ? ' unread' : ''}`;
  item.dataset.notificationId = notification._id;
  
  item.innerHTML = `
    <div class="notification-icon" style="background-color: ${color}20; color: ${color}">
      <i class="fas ${icon}"></i>
    </div>
    <div class="notification-content">
      <p>${notification.message}</p>
      <small>${timeAgo(notification.createdAt)}</small>
    </div>
  `;
  
  // Mark as read on click
  item.addEventListener('click', async (e) => {
    if (isUnread) {
      e.preventDefault();
      await markNotificationAsRead(notification._id);
      item.classList.remove('unread');
      updateUnreadCount();
      
      // Navigate to action URL if exists
      if (notification.actionUrl && notification.actionUrl !== '#') {
        window.location.href = notification.actionUrl;
      }
    }
  });
  
  return item;
}

/**
 * Load and display notifications
 */
export async function loadNotifications(limit = 5) {
  try {
    const response = await api.get(`/notifications?limit=${limit}`);
    
    if (response.success) {
      const dropdown = document.querySelector('#notificationMenu .dropdown-body');
      if (!dropdown) return;
      
      const notifications = response.data.notifications;
      
      if (notifications.length === 0) {
        dropdown.innerHTML = `
          <div class="notification-empty">
            <i class="fas fa-bell-slash"></i>
            <p>Không có thông báo mới</p>
          </div>
        `;
        return;
      }
      
      // Clear existing notifications
      dropdown.innerHTML = '';
      
      // Add notifications
      notifications.forEach(notification => {
        dropdown.appendChild(createNotificationElement(notification));
      });
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
}

/**
 * Load and update unread count badge
 */
export async function updateUnreadCount() {
  try {
    const response = await api.get('/notifications/unread-count');
    
    if (response.success) {
      const badge = document.querySelector('#notificationBtn .badge');
      if (badge) {
        const count = response.data.count;
        if (count > 0) {
          badge.textContent = count > 99 ? '99+' : count;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    }
  } catch (error) {
    console.error('Failed to update unread count:', error);
  }
}

/**
 * Mark notification as read
 */
async function markNotificationAsRead(notificationId) {
  try {
    await api.put(`/notifications/${notificationId}/read`);
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    const response = await api.put('/notifications/mark-all-read');
    
    if (response.success) {
      // Update UI
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      updateUnreadCount();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    return false;
  }
}

/**
 * Initialize notification system
 */
export function initializeNotifications() {
  // Load initial unread count
  updateUnreadCount();
  
  // Load notifications when dropdown opens
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationMenu = document.getElementById('notificationMenu');
  
  if (notificationBtn && notificationMenu) {
    notificationBtn.addEventListener('click', () => {
      if (notificationMenu.classList.contains('show')) {
        // Dropdown is being opened, load notifications
        loadNotifications(10);
      }
    });
  }
  
  // Add "Mark all as read" button to header
  const dropdownHeader = document.querySelector('#notificationMenu .dropdown-header');
  if (dropdownHeader && !dropdownHeader.querySelector('.mark-all-read-btn')) {
    const markAllBtn = document.createElement('button');
    markAllBtn.className = 'mark-all-read-btn';
    markAllBtn.innerHTML = '<i class="fas fa-check-double"></i>';
    markAllBtn.title = 'Đánh dấu tất cả đã đọc';
    markAllBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await markAllNotificationsAsRead();
    });
    dropdownHeader.appendChild(markAllBtn);
  }
  
  // Update "View all" link
  const viewAllLink = document.querySelector('#notificationMenu .dropdown-footer a');
  if (viewAllLink) {
    viewAllLink.href = '/pages/dashboard/notifications.html';
  }
  
  // Refresh unread count every 30 seconds
  setInterval(updateUnreadCount, 30000);
}

/**
 * Create a new notification (for real-time updates)
 */
export function addNotification(notification) {
  const dropdown = document.querySelector('#notificationMenu .dropdown-body');
  if (!dropdown) return;
  
  // Remove "empty" message if exists
  const emptyMsg = dropdown.querySelector('.notification-empty');
  if (emptyMsg) {
    emptyMsg.remove();
  }
  
  // Add new notification at the top
  const newItem = createNotificationElement(notification);
  dropdown.insertBefore(newItem, dropdown.firstChild);
  
  // Limit to 10 notifications in dropdown
  const items = dropdown.querySelectorAll('.notification-item');
  if (items.length > 10) {
    items[items.length - 1].remove();
  }
  
  // Update unread count
  updateUnreadCount();
  
  // Show a toast/alert (optional)
  showNotificationToast(notification);
}

/**
 * Show toast notification (optional feature)
 */
function showNotificationToast(notification) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${getNotificationIcon(notification.type, notification.icon)}"></i>
    </div>
    <div class="toast-content">
      <strong>${notification.title || 'Thông báo mới'}</strong>
      <p>${notification.message}</p>
    </div>
    <button class="toast-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to page
  document.body.appendChild(toast);
  
  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

export default {
  loadNotifications,
  updateUnreadCount,
  markAllNotificationsAsRead,
  initializeNotifications,
  addNotification
};
