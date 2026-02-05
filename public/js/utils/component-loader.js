/**
 * Component Loader Utility
 * Load reusable HTML components (header, footer)
 */

import { initializeNotifications } from './notifications.js';

/**
 * Load HTML component into placeholder
 * @param {string} componentPath - Path to component HTML file
 * @param {string} placeholderId - ID of placeholder element
 */
export async function loadComponent(componentPath, placeholderId) {
    try {
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        
        if (placeholder) {
            placeholder.innerHTML = html;
            console.log(`✅ Loaded component: ${componentPath}`);
        } else {
            console.warn(`⚠️ Placeholder not found: ${placeholderId}`);
        }
    } catch (error) {
        console.error(`❌ Error loading component ${componentPath}:`, error);
    }
}

/**
 * Load header component
 * @param {string} type - 'default' or 'dashboard'
 */
export async function loadHeader(type = 'default') {
    const componentPath = type === 'dashboard' 
        ? '/components/header-dashboard.html'
        : '/components/header.html';
    
    await loadComponent(componentPath, 'header-placeholder');
    
    // Initialize header functionality after loading
    if (type === 'default') {
        initializeHeader();
    } else {
        initializeDashboardHeader();
    }
}

/**
 * Load footer component
 */
export async function loadFooter() {
    await loadComponent('/components/footer.html', 'footer-placeholder');
}

/**
 * Initialize header functionality (mobile toggle, etc.)
 */
function initializeHeader() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Close mobile menu
                        menu.classList.remove('active');
                        toggle.classList.remove('active');
                    }
                }
            });
        });
    }
}

/**
 * Initialize dashboard header functionality
 */
function initializeDashboardHeader() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
    
    // Notification dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    if (notificationBtn && notificationMenu) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            // Close user menu if open
            const userMenu = document.getElementById('userMenu');
            if (userMenu) userMenu.classList.remove('show');
        });
    }
    
    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
            // Close notification menu if open
            if (notificationMenu) notificationMenu.classList.remove('show');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (notificationMenu) notificationMenu.classList.remove('show');
        if (userMenu) userMenu.classList.remove('show');
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                try {
                    // Clear local storage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Redirect to login
                    window.location.href = '/pages/auth/login.html';
                } catch (error) {
                    console.error('Logout error:', error);
                }
            }
        });
    }
    
    // Load user info
    loadUserInfo();
    
    // Initialize notification system
    initializeNotifications();
}

/**
 * Load user information into dashboard header
 */
async function loadUserInfo() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/pages/auth/login.html';
            return;
        }
        
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load user info');
        }
        
        const data = await response.json();
        const user = data.user;
        
        // Update user info in header
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const userMenuName = document.getElementById('userMenuName');
        const userMenuEmail = document.getElementById('userMenuEmail');
        const userMenuAvatar = document.getElementById('userMenuAvatar');
        
        if (userName) userName.textContent = user.displayName || user.username;
        if (userMenuName) userMenuName.textContent = user.displayName || user.username;
        if (userMenuEmail) userMenuEmail.textContent = user.email;
        
        // Update avatars
        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&background=667eea&color=fff`;
        if (userAvatar) userAvatar.src = avatarUrl;
        if (userMenuAvatar) userMenuAvatar.src = avatarUrl;
        
    } catch (error) {
        console.error('Error loading user info:', error);
        // Redirect to login if error
        window.location.href = '/pages/auth/login.html';
    }
}

/**
 * Auto-load header and footer on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Check if placeholders exist
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Determine header type based on page
    const isDashboard = window.location.pathname.includes('/dashboard/') || 
                       window.location.pathname.includes('/pages/dashboard/');
    
    if (headerPlaceholder) {
        await loadHeader(isDashboard ? 'dashboard' : 'default');
    }
    
    if (footerPlaceholder) {
        await loadFooter();
    }
});
