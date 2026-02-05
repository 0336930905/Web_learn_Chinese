// Admin Dashboard JavaScript
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('token');

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('👑 Admin Dashboard Initialized');
    
    // Verify authentication
    if (!authToken) {
        window.location.href = '/pages/auth/login.html';
        return;
    }

    // Load admin email
    loadAdminInfo();
    
    // Load all statistics
    await loadStatistics();
    
    // Load initial data for active tab
    await loadUsers();
    
    // Setup event listeners
    setupEventListeners();
});

// Load admin info
function loadAdminInfo() {
    try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        document.getElementById('adminEmail').textContent = payload.email || 'Admin';
        console.log('✅ Admin info loaded:', payload.email);
    } catch (error) {
        console.error('❌ Error loading admin info:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab change listeners
    document.getElementById('users-tab').addEventListener('click', loadUsers);
    document.getElementById('words-tab').addEventListener('click', loadAllWords);
    document.getElementById('categories-tab').addEventListener('click', loadAllCategories);
    document.getElementById('activity-tab').addEventListener('click', loadActivityLog);
    
    // Search listeners
    document.getElementById('searchUsers')?.addEventListener('input', filterUsers);
    document.getElementById('searchWords')?.addEventListener('input', filterWords);
    document.getElementById('filterCategory')?.addEventListener('change', filterWordsByCategory);
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================

async function loadStatistics() {
    try {
        console.log('📊 Loading statistics...');
        
        // Load all data in parallel
        const [usersRes, wordsRes, categoriesRes] = await Promise.all([
            fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch(`${API_URL}/admin/words`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch(`${API_URL}/categories`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
        ]);

        if (usersRes.ok) {
            const usersData = await usersRes.json();
            const users = usersData.data || [];
            document.getElementById('totalUsers').textContent = users.length;
            
            // Calculate active today (example: users created today)
            const today = new Date().toDateString();
            const activeToday = users.filter(u => new Date(u.createdAt).toDateString() === today).length;
            document.getElementById('activeToday').textContent = activeToday;
        }

        if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            const words = wordsData.data || [];
            document.getElementById('totalWords').textContent = words.length;
        }

        if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            const categories = categoriesData.data || [];
            document.getElementById('totalCategories').textContent = categories.length;
        }

        console.log('✅ Statistics loaded successfully');
    } catch (error) {
        console.error('❌ Error loading statistics:', error);
    }
}

// ============================================
// USERS MANAGEMENT
// ============================================

let allUsers = [];
let currentPage = 1;
const usersPerPage = 10;

async function loadUsers() {
    try {
        console.log('👥 Loading users...');
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </td>
            </tr>
        `;

        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to load users');
        }

        const data = await response.json();
        allUsers = data.data || [];
        currentPage = 1;
        displayUsers();
        
        console.log('✅ Loaded users:', allUsers.length);
    } catch (error) {
        console.error('❌ Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Lỗi tải danh sách người dùng
                </td>
            </tr>
        `;
    }
}

function displayUsers(users = null) {
    const tbody = document.getElementById('usersTableBody');
    const dataToDisplay = users || allUsers;
    
    if (!dataToDisplay || dataToDisplay.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Chưa có người dùng nào
                </td>
            </tr>
        `;
        document.getElementById('usersPagination').style.display = 'none';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(dataToDisplay.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, dataToDisplay.length);
    const paginatedUsers = dataToDisplay.slice(startIndex, endIndex);

    tbody.innerHTML = paginatedUsers.map((user, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>${user.email}</td>
            <td>${user.displayName || user.name || '-'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
            <td><span class="badge bg-info">${user.wordCount || 0}</span></td>
            <td>
                ${user.isActive !== false ? `
                    <span class="badge-status badge-active">
                        <i class="fas fa-check-circle"></i> Hoạt động
                    </span>
                ` : `
                    <span class="badge-status badge-inactive">
                        <i class="fas fa-lock"></i> Đã khóa
                    </span>
                `}
            </td>
            <td>
                <button class="action-btn btn-view" onclick="viewUser('${user._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn btn-edit" onclick="editUser('${user._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.isActive !== false ? `
                    <button class="action-btn btn-lock" onclick="toggleUserStatus('${user._id}', '${user.email}', false)">
                        <i class="fas fa-lock"></i>
                    </button>
                ` : `
                    <button class="action-btn btn-unlock" onclick="toggleUserStatus('${user._id}', '${user.email}', true)">
                        <i class="fas fa-lock-open"></i>
                    </button>
                `}
            </td>
        </tr>
    `).join('');

    // Update pagination info
    document.getElementById('usersShowingStart').textContent = startIndex + 1;
    document.getElementById('usersShowingEnd').textContent = endIndex;
    document.getElementById('usersTotalCount').textContent = dataToDisplay.length;

    // Render pagination
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('usersPagination');
    const paginationList = document.getElementById('usersPaginationList');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationList.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    displayUsers();
    // Scroll to top of table
    document.getElementById('users-panel').scrollIntoView({ behavior: 'smooth' });
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm))
    );
    currentPage = 1; // Reset to first page when filtering
    displayUsers(filtered);
}

function viewUser(userId) {
    console.log('👁️ Viewing user:', userId);
    alert(`Xem chi tiết người dùng: ${userId}\n(Tính năng đang phát triển)`);
}

function editUser(userId) {
    console.log('✏️ Editing user:', userId);
    alert(`Chỉnh sửa người dùng: ${userId}\n(Tính năng đang phát triển)`);
}

async function toggleUserStatus(userId, email, activate) {
    const action = activate ? 'mở khóa' : 'khóa';
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản: ${email}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive: activate })
        });

        if (!response.ok) {
            throw new Error(`Failed to ${action} user`);
        }

        alert(`✅ ${activate ? 'Mở khóa' : 'Khóa'} tài khoản thành công!`);
        await loadUsers();
        await loadStatistics();
    } catch (error) {
        console.error(`❌ Error toggling user status:`, error);
        alert(`❌ Lỗi khi ${action} tài khoản!`);
    }
}

function exportUsers() {
    console.log('📥 Exporting users...');
    
    // Create CSV content
    const csv = [
        ['ID', 'Email', 'Tên', 'Ngày đăng ký', 'Số từ vựng'].join(','),
        ...allUsers.map((user, index) => [
            index + 1,
            user.email,
            user.name || '-',
            new Date(user.createdAt).toLocaleDateString('vi-VN'),
            user.wordCount || 0
        ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    console.log('✅ Users exported');
}

// ============================================
// WORDS MANAGEMENT
// ============================================

let allWords = [];
let currentWordPage = 1;
const wordsPerPage = 20;

async function loadAllWords() {
    try {
        console.log('📚 Loading all words...');
        const tbody = document.getElementById('wordsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                </td>
            </tr>
        `;

        const response = await fetch(`${API_URL}/admin/words`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to load words');
        }

        const data = await response.json();
        allWords = data.data || [];
        currentWordPage = 1;
        displayWords();
        
        // Load categories for filter
        await loadCategoriesForFilter();
        
        console.log('✅ Loaded words:', allWords.length);
    } catch (error) {
        console.error('❌ Error loading words:', error);
        document.getElementById('wordsTableBody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Lỗi tải danh sách từ vựng
                </td>
            </tr>
        `;
    }
}

function displayWords(words = null) {
    const tbody = document.getElementById('wordsTableBody');
    const dataToDisplay = words || allWords;
    
    if (!dataToDisplay || dataToDisplay.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Chưa có từ vựng nào
                </td>
            </tr>
        `;
        document.getElementById('wordsPagination').style.display = 'none';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(dataToDisplay.length / wordsPerPage);
    const startIndex = (currentWordPage - 1) * wordsPerPage;
    const endIndex = Math.min(startIndex + wordsPerPage, dataToDisplay.length);
    const paginatedWords = dataToDisplay.slice(startIndex, endIndex);

    tbody.innerHTML = paginatedWords.map((word, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td><strong>${word.traditional}</strong></td>
            <td>${word.pinyin || '-'}</td>
            <td>${word.vietnamese || '-'}</td>
            <td><span class="badge bg-secondary">${word.category || 'other'}</span></td>
            <td>${word.createdBy?.email || 'Admin'}</td>
            <td>
                ${'⭐'.repeat(word.difficulty || 1)}
            </td>
            <td>
                <button class="action-btn btn-edit" onclick="editWord('${word._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteWord('${word._id}', '${word.traditional}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update pagination info
    document.getElementById('wordsShowingStart').textContent = startIndex + 1;
    document.getElementById('wordsShowingEnd').textContent = endIndex;
    document.getElementById('wordsTotalCount').textContent = dataToDisplay.length;

    // Render pagination
    renderWordsPagination(totalPages);
}

async function loadCategoriesForFilter() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) return;

        const data = await response.json();
        const categories = data.data || [];
        
        const select = document.getElementById('filterCategory');
        select.innerHTML = '<option value="">Tất cả danh mục</option>' +
            categories.map(cat => `<option value="${cat.slug}">${cat.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading categories for filter:', error);
    }
}

function filterWords() {
    const searchTerm = document.getElementById('searchWords').value.toLowerCase();
    const filtered = allWords.filter(word => 
        word.traditional.toLowerCase().includes(searchTerm) ||
        (word.pinyin && word.pinyin.toLowerCase().includes(searchTerm)) ||
        (word.vietnamese && word.vietnamese.toLowerCase().includes(searchTerm))
    );
    currentWordPage = 1;
    displayWords(filtered);
}

function filterWordsByCategory() {
    const category = document.getElementById('filterCategory').value;
    currentWordPage = 1;
    if (!category) {
        displayWords(allWords);
        return;
    }
    
    const filtered = allWords.filter(word => word.category === category);
    displayWords(filtered);
}

function editWord(wordId) {
    console.log('✏️ Editing word:', wordId);
    alert(`Chỉnh sửa từ vựng: ${wordId}\n(Tính năng đang phát triển)`);
}

async function deleteWord(wordId, traditional) {
    if (!confirm(`Bạn có chắc muốn xóa từ: ${traditional}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/words/${wordId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to delete word');
        }

        alert('✅ Xóa từ vựng thành công!');
        await loadAllWords();
        await loadStatistics();
    } catch (error) {
        console.error('❌ Error deleting word:', error);
        alert('❌ Lỗi khi xóa từ vựng!');
    }
}

// Render words pagination
function renderWordsPagination(totalPages) {
    const paginationContainer = document.getElementById('wordsPagination');
    const paginationList = document.getElementById('wordsPaginationList');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentWordPage === 1 ? 'disabled' : ''}">
            <a class="page-link" onclick="changeWordPage(${currentWordPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentWordPage - 1 && i <= currentWordPage + 1)
        ) {
            paginationHTML += `
                <li class="page-item ${i === currentWordPage ? 'active' : ''}">
                    <a class="page-link" onclick="changeWordPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentWordPage - 2 || i === currentWordPage + 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentWordPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" onclick="changeWordPage(${currentWordPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationList.innerHTML = paginationHTML;
}

// Change word page
function changeWordPage(page) {
    currentWordPage = page;
    displayWords();
    // Scroll to top of table
    document.getElementById('words-panel').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// CATEGORIES MANAGEMENT
// ============================================

async function loadAllCategories() {
    try {
        console.log('📁 Loading admin\'s own categories...');
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = `
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
        `;

        // Use /my-categories endpoint to get only this admin's categories
        const response = await fetch(`${API_URL}/categories/my-categories`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        const data = await response.json();
        const categories = data.data || [];
        
        if (categories.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center text-muted">
                    Chưa có danh mục nào
                </div>
            `;
            return;
        }

        grid.innerHTML = categories.map(cat => {
            // Check if icon is emoji or FontAwesome class
            const isEmoji = cat.icon && !cat.icon.startsWith('fa');
            const iconHTML = isEmoji 
                ? `<span style="font-size: 1.5rem;">${cat.icon}</span>`
                : `<i class="${cat.icon || 'fas fa-folder'}"></i>`;
            
            // Escape name for onclick attribute
            const escapedName = cat.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            return `
            <div class="col-md-6 col-lg-4">
                <div class="stat-card-admin">
                    <div class="d-flex align-items-center mb-3">
                        <div class="stat-icon bg-gradient-primary me-3" style="width: 50px; height: 50px; font-size: 1.25rem;">
                            ${iconHTML}
                        </div>
                        <div>
                            <h5 class="mb-0">${cat.name}</h5>
                            <small class="text-muted">${cat.slug}</small>
                        </div>
                    </div>
                    <p class="text-muted mb-3">${cat.description || 'Không có mô tả'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge ${cat.isSystem ? 'bg-info' : 'bg-secondary'}">
                            ${cat.isSystem ? 'Hệ thống' : 'Người dùng'}
                        </span>
                        <div>
                            <button class="action-btn btn-edit" onclick="editCategory('${cat._id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" onclick="handleDeleteCategory('${cat._id}', '${escapedName}', ${cat.isSystem ? 'true' : 'false'})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        
        console.log('✅ Loaded categories:', categories.length);
    } catch (error) {
        console.error('❌ Error loading categories:', error);
        document.getElementById('categoriesGrid').innerHTML = `
            <div class="col-12 text-center text-danger">
                Lỗi tải danh sách danh mục
            </div>
        `;
    }
}

function showAddCategoryModal() {
    alert('Thêm danh mục hệ thống\n(Tính năng đang phát triển)');
}

function editCategory(categoryId) {
    console.log('✏️ Editing category:', categoryId);
    alert(`Chỉnh sửa danh mục: ${categoryId}\n(Tính năng đang phát triển)`);
}

// Handle delete category with proper parameter parsing
function handleDeleteCategory(categoryId, name, isSystem) {
    // Convert string 'true'/'false' to boolean if needed
    const isSystemCategory = (isSystem === true || isSystem === 'true');
    deleteCategory(categoryId, name, isSystemCategory);
}

async function deleteCategory(categoryId, name, isSystem) {
    // Warning message based on category type
    let warningMessage = '';
    if (isSystem) {
        warningMessage = `⚠️⚠️⚠️ CẢNH BÁO NGHIÊM TRỌNG ⚠️⚠️⚠️\n\nĐây là danh mục HỆ THỐNG: "${name}"\n\n🔥 HÀNH ĐỘNG NÀY SẼ:\n• Xóa danh mục này\n• Xóa TẤT CẢ từ vựng trong danh mục\n• Ảnh hưởng đến TẤT CẢ người dùng!\n\n⛔ KHÔNG THỂ HOÀN TÁC!\n\nBạn có CHẮC CHẮN muốn tiếp tục?`;
    } else {
        warningMessage = `⚠️ CẢNH BÁO: Xóa danh mục "${name}"\n\n🔥 Hành động này sẽ:\n• Xóa danh mục này\n• Xóa TẤT CẢ từ vựng trong danh mục\n\n⛔ KHÔNG THỂ HOÀN TÁC!\n\nBạn có chắc chắn muốn xóa?`;
    }
    
    if (!confirm(warningMessage)) {
        return;
    }

    try {
        console.log('🗑️ Deleting category:', categoryId, 'isSystem:', isSystem);
        
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const message = result.deletedWords > 0 
                ? `✅ Xóa thành công!\n\n• Danh mục: ${name}\n• Từ vựng: ${result.deletedWords} từ`
                : `✅ Xóa danh mục "${name}" thành công!`;
            
            alert(message);
            console.log('✅ Category deleted:', result);
            await loadAllCategories();
            await loadStatistics();
        } else {
            throw new Error(result.message || 'Failed to delete category');
        }
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        alert('❌ Lỗi: ' + error.message);
    }
}

// ============================================
// ACTIVITY LOG
// ============================================

async function loadActivityLog() {
    const logContainer = document.getElementById('activityLog');
    
    // Mock activity data (replace with real API call)
    const activities = [
        {
            type: 'user_registered',
            user: 'user@example.com',
            timestamp: new Date(),
            description: 'Người dùng mới đăng ký'
        },
        {
            type: 'word_added',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 3600000),
            description: 'Thêm 5 từ vựng mới'
        },
        {
            type: 'category_created',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 7200000),
            description: 'Tạo danh mục mới: Ẩm thực'
        }
    ];

    logContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${activity.description}</strong>
                    <div class="text-muted small">${activity.user}</div>
                </div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
}

// ============================================
// SYSTEM ACTIONS
// ============================================

async function initDefaultCategories() {
    if (!confirm('Khởi tạo các danh mục mặc định cho hệ thống?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/categories/init-defaults`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to initialize categories');
        }

        alert('✅ Khởi tạo danh mục thành công!');
        await loadAllCategories();
        await loadStatistics();
    } catch (error) {
        console.error('❌ Error initializing categories:', error);
        alert('❌ Lỗi khi khởi tạo danh mục!');
    }
}

function viewSystemLogs() {
    alert('Xem logs hệ thống\n(Tính năng đang phát triển)');
}

function clearCache() {
    if (!confirm('Bạn có chắc muốn xóa cache?')) {
        return;
    }
    localStorage.clear();
    sessionStorage.clear();
    alert('✅ Đã xóa cache!');
}

function backupDatabase() {
    alert('Sao lưu dữ liệu\n(Tính năng đang phát triển)');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('token');
        window.location.href = '/pages/auth/login.html';
    }
}
// ============================================
// WORD MANAGEMENT FUNCTIONS
// ============================================

let addWordModal;
let allCategories = [];

// Show add word modal
function showAddWordModal() {
    if (!addWordModal) {
        addWordModal = new bootstrap.Modal(document.getElementById('addWordModal'));
    }
    
    // Reset form
    document.getElementById('addWordForm').reset();
    document.getElementById('difficultyBadge').textContent = '3';
    document.getElementById('imagePreview').style.display = 'none';
    
    // Reset examples to single input
    const examplesContainer = document.getElementById('examplesContainer');
    examplesContainer.innerHTML = `
        <div class="example-item mb-2">
            <div class="input-group">
                <input type="text" class="form-control example-input" placeholder="Nhập câu ví dụ...">
                <button class="btn btn-outline-danger" type="button" onclick="removeExample(this)" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    // Load categories for dropdown
    loadCategoriesForDropdown();
    
    // Show modal
    addWordModal.show();
}

// Load categories for dropdown
async function loadCategoriesForDropdown() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        const result = await response.json();
        allCategories = result.data || [];
        const categorySelect = document.getElementById('wordCategory');
        
        categorySelect.innerHTML = '<option value="">Chọn danh mục...</option>';
        allCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.slug;
            option.textContent = `${category.name} ${category.isSystem ? '(Hệ thống)' : ''}`;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Error loading categories:', error);
        document.getElementById('wordCategory').innerHTML = '<option value="">Lỗi tải danh mục</option>';
    }
}

// Add example input
function addExample() {
    const container = document.getElementById('examplesContainer');
    const exampleItem = document.createElement('div');
    exampleItem.className = 'example-item mb-2';
    exampleItem.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control example-input" placeholder="Nhập câu ví dụ...">
            <button class="btn btn-outline-danger" type="button" onclick="removeExample(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(exampleItem);
}

// Remove example input
function removeExample(button) {
    const exampleItem = button.closest('.example-item');
    exampleItem.remove();
}

// Update difficulty badge
document.addEventListener('DOMContentLoaded', () => {
    const difficultySlider = document.getElementById('wordDifficulty');
    if (difficultySlider) {
        difficultySlider.addEventListener('input', (e) => {
            document.getElementById('difficultyBadge').textContent = e.target.value;
        });
    }
    
    // Image file preview
    const imageFileInput = document.getElementById('wordImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            if (file) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                if (!validTypes.includes(file.type)) {
                    alert('⚠️ Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP, SVG)');
                    e.target.value = '';
                    preview.style.display = 'none';
                    return;
                }
                
                // Validate file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('⚠️ Kích thước file không được vượt quá 5MB!');
                    e.target.value = '';
                    preview.style.display = 'none';
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }
});

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Handle add word
async function handleAddWord() {
    const traditional = document.getElementById('wordTraditional').value.trim();
    
    if (!traditional) {
        alert('⚠️ Vui lòng nhập từ truyền thống!');
        return;
    }
    
    // Get all examples - format as objects
    const exampleInputs = document.querySelectorAll('.example-input');
    const examples = Array.from(exampleInputs)
        .map(input => {
            const text = input.value.trim();
            if (text) {
                return {
                    traditional: text,
                    pinyin: '',
                    vietnamese: text,
                    english: ''
                };
            }
            return null;
        })
        .filter(val => val !== null);
    
    // Upload image if selected
    let imageUrl = '';
    const imageFile = document.getElementById('wordImageFile').files[0];
    if (imageFile) {
        try {
            imageUrl = await uploadImage(imageFile);
        } catch (error) {
            alert('❌ Lỗi khi upload hình ảnh: ' + error.message);
            return;
        }
    }
    
    const wordData = {
        traditional: traditional,
        simplified: document.getElementById('wordSimplified').value.trim() || traditional,
        pinyin: document.getElementById('wordPinyin').value.trim(),
        zhuyin: document.getElementById('wordZhuyin').value.trim(),
        vietnamese: document.getElementById('wordVietnamese').value.trim(),
        english: document.getElementById('wordEnglish').value.trim(),
        category: document.getElementById('wordCategory').value || 'other',
        difficulty: parseInt(document.getElementById('wordDifficulty').value),
        imageUrl: imageUrl,
        examples: examples,
        isPublic: true // Admin words are public by default
    };
    
    try {
        const response = await fetch(`${API_URL}/words`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wordData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create word');
        }

        const result = await response.json();
        console.log('✅ Word created:', result);
        
        // Close modal
        addWordModal.hide();
        
        // Show success message
        showSuccessAlert('✅ Thêm từ vựng thành công!');
        
        // Reload words list
        await loadAllWords();
        await loadStatistics();
        
    } catch (error) {
        console.error('❌ Error creating word:', error);
        alert('❌ Lỗi khi thêm từ vựng: ' + error.message);
    }
}

// Show success alert
function showSuccessAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
// Upload image to server
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(`${API_URL}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        const result = await response.json();
        console.log('✅ Image uploaded:', result.imageUrl);
        return result.imageUrl;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        throw error;
    }
}

// Clear image preview
function clearImagePreview() {
    document.getElementById('wordImageFile').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// ============================================
// SYSTEM MANAGEMENT FUNCTIONS
// ============================================

/**
 * Initialize default categories for all users
 */
async function initDefaultCategories() {
    if (!confirm('Bạn có chắc muốn khởi tạo danh mục mặc định? Các danh mục đã tồn tại sẽ không bị ghi đè.')) {
        return;
    }

    try {
        console.log('🔄 Initializing default categories...');
        
        const response = await fetch(`${API_URL}/categories/init-defaults`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(`✅ ${result.message}\nĐã tạo: ${result.data.length} danh mục mới`);
            console.log('✅ Default categories initialized:', result.data);
            
            // Reload categories if on categories tab
            if (document.getElementById('categories-tab').classList.contains('active')) {
                await loadAllCategories();
            }
        } else {
            throw new Error(result.message || 'Failed to initialize categories');
        }
    } catch (error) {
        console.error('❌ Error initializing categories:', error);
        alert('❌ Lỗi khi khởi tạo danh mục: ' + error.message);
    }
}

/**
 * Restore default settings
 */
async function restoreDefaultSettings() {
    const confirmMessage = `⚠️ CẢNH BÁO NGHIÊM TRỌNG ⚠️

Khôi phục cài đặt gốc sẽ:
• Xóa TẤT CẢ danh mục của bạn
• Xóa TẤT CẢ từ vựng của bạn
• Tạo lại 12 danh mục mặc định
• KHÔNG thể hoàn tác!

Bạn THỰC SỰ muốn tiếp tục?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Double confirmation
    const secondConfirm = prompt('Để xác nhận, vui lòng nhập: XOA TAT CA');
    if (secondConfirm !== 'XOA TAT CA') {
        alert('❌ Đã hủy thao tác');
        return;
    }

    try {
        console.log('🔄 Restoring default settings...');
        
        const response = await fetch(`${API_URL}/admin/restore-defaults`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(`✅ ${result.message}\n\nĐã xóa:\n• Danh mục: ${result.data.deletedCategories}\n• Từ vựng: ${result.data.deletedWords}\n\nĐã tạo:\n• Danh mục mới: ${result.data.createdCategories}`);
            console.log('✅ Default settings restored:', result.data);
            
            // Reload all data
            await loadStatistics();
            await loadAllCategories();
            await loadAllWords();
        } else {
            throw new Error(result.message || 'Failed to restore defaults');
        }
    } catch (error) {
        console.error('❌ Error restoring defaults:', error);
        alert('❌ Lỗi khi khôi phục cài đặt: ' + error.message);
    }
}

/**
 * Backup database (export all data as JSON)
 */
async function backupDatabase() {
    if (!confirm('Bạn có chắc muốn sao lưu dữ liệu? File JSON sẽ được tải xuống.')) {
        return;
    }

    try {
        console.log('💾 Creating database backup...');
        
        const response = await fetch(`${API_URL}/admin/backup`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Create downloadable JSON file
            const dataStr = JSON.stringify(result.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `backup-${result.data.metadata.timestamp.replace(/:/g, '-')}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert(`✅ Sao lưu thành công!\n\nThống kê:\n- Người dùng: ${result.data.stats.totalUsers}\n- Từ vựng: ${result.data.stats.totalWords}\n- Danh mục: ${result.data.stats.totalCategories}`);
            console.log('✅ Backup created:', result.data.stats);
        } else {
            throw new Error(result.message || 'Failed to create backup');
        }
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        alert('❌ Lỗi khi sao lưu dữ liệu: ' + error.message);
    }
}

/**
 * View system logs (placeholder)
 */
function viewSystemLogs() {
    alert('🚧 Chức năng này đang được phát triển.\n\nSẽ hiển thị:\n- Logs hệ thống\n- Lỗi server\n- Hoạt động người dùng');
}

/**
 * Clear cache (placeholder)
 */
function clearCache() {
    if (!confirm('Bạn có chắc muốn xóa cache? Điều này có thể làm chậm truy cập trang web tạm thời.')) {
        return;
    }
    
    try {
        // Clear localStorage (except auth token)
        const token = localStorage.getItem('token');
        localStorage.clear();
        if (token) {
            localStorage.setItem('token', token);
        }
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        alert('✅ Cache đã được xóa thành công!');
        console.log('✅ Cache cleared');
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        alert('❌ Lỗi khi xóa cache: ' + error.message);
    }
}

