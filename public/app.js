// API URL - Change this in production
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// State
let allWords = [];
let practiceWords = [];
let currentPracticeIndex = 0;
let isFlipped = false;
let currentUser = null;
let authToken = null;

// Support multiple accounts on same localhost
// Use sessionStorage for current session, fallback to localStorage
function getAuthToken() {
    return sessionStorage.getItem('currentToken') || localStorage.getItem('token');
}

function setAuthToken(token) {
    localStorage.setItem('token', token);
    sessionStorage.setItem('currentToken', token);
}

function clearAuthToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('currentToken');
    localStorage.removeItem('user');
}

// DOM Elements - Safe get (check if element exists first)
const wordsList = document.getElementById('wordsList');
const loading = document.getElementById('loading');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const addWordBtn = document.getElementById('addWordBtn');
const practiceBtn = document.getElementById('practiceBtn');
const addWordModal = document.getElementById('addWordModal');
const practiceModal = document.getElementById('practiceModal');
const addWordForm = document.getElementById('addWordForm');

// Stats elements
const totalWordsEl = document.getElementById('totalWords');
const studyStreakEl = document.getElementById('studyStreak');
const averageMasteryEl = document.getElementById('averageMastery');
const currentLevelEl = document.getElementById('currentLevel');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check auth immediately
    console.log('🚀 DOMContentLoaded - starting auth check');
    checkAuth();
});

// Check authentication
async function checkAuth() {
    console.log('═══════════════════════════════════════════════');
    console.log('🔐 AUTH CHECK STARTED');
    console.log('═══════════════════════════════════════════════');
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Pathname:', window.location.pathname);
    
    // Get token from localStorage or sessionStorage (for multiple accounts support)
    authToken = getAuthToken();
    console.log('🎫 Token from storage:', authToken ? '✅ EXISTS' : '❌ NOT FOUND');
    
    if (authToken) {
        console.log('🎫 Token preview:', authToken.substring(0, 50) + '...');
        console.log('🎫 Token length:', authToken.length);
    }
    
    if (!authToken) {
        console.log('❌ No token found');
        console.log('🔄 Redirecting to login...');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '/pages/auth/login.html';
        } else {
            console.log('ℹ️ Already on login page');
        }
        return;
    }

    console.log('📡 Verifying token with server...');
    console.log('🔗 API Endpoint:', `${API_URL}/auth/verify`);
    
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📥 Server response status:', response.status);
        console.log('📥 Response OK:', response.ok ? '✅ YES' : '❌ NO');

        if (response.ok) {
            const data = await response.json();
            console.log('✅ AUTH VERIFICATION SUCCESSFUL!');
            console.log('👤 User:', data.user.email);
            console.log('👤 Display Name:', data.user.displayName);
            console.log('👤 User ID:', data.user._id);
            console.log('👤 User Role:', data.user.role || 'user');
            
            // Save token to session for multi-account support
            setAuthToken(authToken);
            
            currentUser = data.user;
            
            // Hide loading overlay
            const authLoading = document.getElementById('authLoading');
            const mainContent = document.getElementById('mainContent');
            
            if (authLoading) {
                authLoading.style.display = 'none';
                console.log('✅ Loading overlay hidden');
            }
            
            if (mainContent) {
                mainContent.style.display = 'block';
                console.log('✅ Main content displayed');
            }
            
            // Clear any redirect counters
            sessionStorage.removeItem('redirectCount');
            console.log('🗑️ Redirect counter cleared');
            
            console.log('═══════════════════════════════════════════════');
            console.log('✅ AUTH CHECK COMPLETED - USER AUTHENTICATED');
            console.log('═══════════════════════════════════════════════');
            
            // Initialize app
            displayUserInfo();
            setupEventListeners();
            await loadCategories(); // Load categories first
            loadWords();
            loadStats();
            
        } else {
            // Token verification failed
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.log('❌ AUTH VERIFICATION FAILED');
            console.log('❌ Status:', response.status);
            console.log('❌ Error:', errorData.message);
            
            // Clear invalid token using the new function
            console.log('🗑️ Clearing invalid token...');
            clearAuthToken();
            
            console.log('🔄 Redirecting to login...');
            
            // Show error message
            alert(`Phiên đăng nhập đã hết hạn hoặc không hợp lệ.\n\nLỗi: ${errorData.message}\n\nVui lòng đăng nhập lại.`);
            
            // Redirect to login
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/pages/auth/login.html';
            }
        }
    } catch (error) {
        console.error('❌ AUTH CHECK ERROR:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        
        // Network or other error
        console.log('⚠️ Possible network issue or server down');
        
        // Don't clear token on network error
        alert(`Không thể kết nối đến server.\n\nLỗi: ${error.message}\n\nVui lòng kiểm tra kết nối mạng.`);
        
        // Show error state
        const authLoading = document.getElementById('authLoading');
        if (authLoading) {
            authLoading.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin-bottom: 10px;">Lỗi kết nối</h2>
                    <p style="color: #666; margin-bottom: 20px;">${error.message}</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Thử lại
                    </button>
                </div>
            `;
        }
    }
}

// Display user info in header
function displayUserInfo() {
    const userDisplay = document.getElementById('userDisplay');
    
    // Check if element exists (might not be in DOM yet)
    if (!userDisplay) {
        console.log('⚠️ userDisplay element not found - skipping user info display');
        return;
    }
    
    if (currentUser) {
        console.log('👤 Displaying user info:', currentUser.displayName);
        userDisplay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                ${currentUser.avatar ? `<img src="${currentUser.avatar}" alt="${currentUser.displayName}" style="width: 40px; height: 40px; border-radius: 50%;">` : ''}
                <div>
                    <div style="font-weight: bold;">${currentUser.displayName}</div>
                    <div style="font-size: 12px; color: #666;">Level ${currentUser.level} | ${currentUser.totalXP} XP</div>
                </div>
            </div>
        `;
    }
}

// Logout function
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        clearAuthToken();
        window.location.href = '/pages/auth/login.html';
    }
}

// Text-to-Speech function for Chinese/Taiwanese pronunciation
function speakWord(traditional, pinyin) {
    // Check if browser supports Web Speech API
    if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt không hỗ trợ phát âm', 'error');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(traditional);
    
    // Set language to Chinese (Taiwan) - zh-TW
    utterance.lang = 'zh-TW';
    
    // Configure speech parameters
    utterance.rate = 0.8; // Slower speed for learning
    utterance.pitch = 1;
    utterance.volume = 1;

    // Error handling
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        showToast('Lỗi phát âm. Vui lòng thử lại.', 'error');
    };

    // Success feedback
    utterance.onstart = () => {
        console.log('Speaking:', traditional);
    };

    // Speak the word
    window.speechSynthesis.speak(utterance);
}

// Setup event listeners
function setupEventListeners() {
    // Filter and search
    if (categoryFilter) categoryFilter.addEventListener('change', filterWords);
    if (searchInput) searchInput.addEventListener('input', filterWords);

    // Modal controls
    if (addWordBtn) {
        addWordBtn.addEventListener('click', () => {
            if (addWordModal) addWordModal.classList.add('active');
        });
    }

    if (practiceBtn) practiceBtn.addEventListener('click', startPractice);

    // Close add word modal
    const closeAddWordModal = document.getElementById('closeAddWordModal');
    const cancelAddWord = document.getElementById('cancelAddWord');
    
    if (closeAddWordModal) {
        closeAddWordModal.addEventListener('click', () => {
            addWordModal.classList.remove('active');
        });
    }
    
    if (cancelAddWord) {
        cancelAddWord.addEventListener('click', () => {
            addWordModal.classList.remove('active');
            document.getElementById('addWordForm').reset();
        });
    }

    // Close modals (backward compatibility)
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            addWordModal.classList.remove('active');
            practiceModal.style.display = 'none';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === addWordModal) {
            addWordModal.classList.remove('active');
        }
        if (e.target === practiceModal) {
            practiceModal.style.display = 'none';
        }
    });

    // Difficulty slider interactive
    const difficultyRange = document.getElementById('difficulty');
    const diffLabels = document.querySelectorAll('.diff-label');
    
    if (difficultyRange) {
        difficultyRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            updateDifficultyLabels(value);
        });
    }
    
    if (diffLabels) {
        diffLabels.forEach((label, index) => {
            label.addEventListener('click', () => {
                const level = index + 1;
                difficultyRange.value = level;
                updateDifficultyLabels(level);
            });
        });
    }

    // Image upload handling
    const imageUrlInput = document.getElementById('imageUrl');
    const imageFileInput = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');

    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', (e) => {
            updateImagePreview(e.target.value);
        });
    }

    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }

    // Remove image button
    const removeImageBtn = document.querySelector('.image-remove-btn');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeImage);
    }

    // Add word form
    if (addWordForm) addWordForm.addEventListener('submit', handleAddWord);

    // Practice controls
    const flipCard_el = document.getElementById('flipCard');
    const knowWord_el = document.getElementById('knowWord');
    const dontKnowWord_el = document.getElementById('dontKnowWord');
    const nextWord_el = document.getElementById('nextWord');
    
    if (flipCard_el) flipCard_el.addEventListener('click', flipCard);
    if (knowWord_el) knowWord_el.addEventListener('click', () => markWord(80));
    if (dontKnowWord_el) dontKnowWord_el.addEventListener('click', () => markWord(30));
    if (nextWord_el) nextWord_el.addEventListener('click', nextPracticeWord);
}

// Load categories for dropdowns
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            let categories = data.data || [];
            
            // If no categories, initialize defaults
            if (categories.length === 0) {
                console.log('No categories found, initializing defaults...');
                const initResponse = await fetch(`${API_URL}/categories/init-defaults`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (initResponse.ok) {
                    const initData = await initResponse.json();
                    console.log('✅ Initialized default categories');
                    
                    // Reload categories
                    const reloadResponse = await fetch(`${API_URL}/categories`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    const reloadData = await reloadResponse.json();
                    categories = reloadData.data || [];
                }
            }
            
            // Update category filter dropdown
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>' +
                    categories.map(cat => 
                        `<option value="${cat.slug}">${cat.icon} ${cat.name}</option>`
                    ).join('');
            }
            
            // Update add word modal category dropdown
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">-- Chọn danh mục --</option>' +
                    categories.map(cat => 
                        `<option value="${cat.slug}">${cat.icon} ${cat.name}</option>`
                    ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load all words
async function loadWords() {
    try {
        loading.style.display = 'block';
        const response = await fetch(`${API_URL}/words`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            allWords = data.data;
            displayWords(allWords);
        }
    } catch (error) {
        console.error('Error loading words:', error);
        wordsList.innerHTML = '<p>Lỗi khi tải từ vựng. Vui lòng thử lại.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display words
function displayWords(words) {
    if (words.length === 0) {
        wordsList.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>Chưa có từ vựng nào. Hãy thêm từ mới!</div>';
        // Update word count badge
        const wordCountBadge = document.getElementById('wordCount');
        if (wordCountBadge) wordCountBadge.textContent = '0 từ';
        return;
    }

    // Update word count badge
    const wordCountBadge = document.getElementById('wordCount');
    if (wordCountBadge) {
        wordCountBadge.textContent = `${words.length} từ`;
    }

    wordsList.innerHTML = words.map(word => `
        <div class="word-card-modern">
            ${word.imageUrl ? `
                <div class="word-image-container">
                    <img src="${word.imageUrl}" alt="${word.traditional}" class="word-image" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}
            
            <div class="word-content">
                <div class="word-header">
                    <h3 class="word-traditional">${word.traditional}</h3>
                    <button class="btn-speak" onclick="speakWord('${word.traditional}', '${word.pinyin}')" title="Phát âm">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                
                <div class="word-phonetics">
                    <div class="word-pinyin"><i class="fas fa-language me-1"></i>${word.pinyin}</div>
                    ${word.zhuyin ? `<div class="word-zhuyin"><i class="fas fa-font me-1"></i>${word.zhuyin}</div>` : ''}
                </div>
                
                <div class="word-meanings">
                    <div class="word-vietnamese">
                        <i class="fas fa-comment-dots me-1"></i>
                        <strong>Tiếng Việt:</strong> ${word.vietnamese}
                    </div>
                    ${word.english ? `
                        <div class="word-english">
                            <i class="fas fa-globe me-1"></i>
                            <strong>English:</strong> ${word.english}
                        </div>
                    ` : ''}
                </div>
                
                <div class="word-meta">
                    <span class="badge bg-primary">${getCategoryName(word.category)}</span>
                    <span class="badge bg-secondary">${'⭐'.repeat(word.difficulty || 1)}</span>
                </div>
            </div>
            
            <div class="word-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="editWord('${word._id}')">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteWord('${word._id}')">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

// Filter words
function filterWords() {
    const category = categoryFilter.value;
    const search = searchInput.value.toLowerCase();

    let filtered = allWords;

    if (category) {
        filtered = filtered.filter(word => word.category === category);
    }

    if (search) {
        filtered = filtered.filter(word => 
            word.traditional.toLowerCase().includes(search) ||
            word.pinyin.toLowerCase().includes(search) ||
            word.vietnamese.toLowerCase().includes(search) ||
            (word.english && word.english.toLowerCase().includes(search))
        );
    }

    displayWords(filtered);
}

// Add new word
async function handleAddWord(e) {
    e.preventDefault();

    const exampleText = document.getElementById('example')?.value || '';
    
    const wordData = {
        traditional: document.getElementById('traditional').value,
        pinyin: document.getElementById('pinyin').value,
        zhuyin: document.getElementById('zhuyin').value,
        vietnamese: document.getElementById('vietnamese').value,
        english: document.getElementById('english').value,
        category: document.getElementById('category').value,
        difficulty: parseInt(document.getElementById('difficulty').value),
        imageUrl: document.getElementById('imageUrl')?.value || ''
    };

    // Add example as array if provided
    if (exampleText.trim()) {
        wordData.examples = [{
            traditional: exampleText,
            pinyin: '',
            vietnamese: '',
            english: ''
        }];
    }

    console.log('📤 Sending word data:', wordData);

    try {
        const response = await fetch(`${API_URL}/words`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(wordData)
        });

        console.log('📥 Response status:', response.status);
        const data = await response.json();
        console.log('📥 Response data:', data);

        if (data.success) {
            addWordModal.classList.remove('active');
            addWordForm.reset();
            resetImagePreview();
            updateDifficultyLabels(1); // Reset difficulty to level 1
            await loadWords();
            await loadStats();
            showSuccessToast('✅ Đã thêm từ mới thành công!');
        } else {
            showErrorToast('❌ Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('❌ Error adding word:', error);
        showErrorToast('❌ Lỗi khi thêm từ mới');
    }
}

// Update difficulty labels
function updateDifficultyLabels(level) {
    const labels = document.querySelectorAll('.diff-label');
    labels.forEach((label, index) => {
        if (index + 1 === level) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

// Show success toast
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show error toast
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification error';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Image handling functions
function updateImagePreview(url) {
    const preview = document.getElementById('imagePreview');
    const placeholder = preview.querySelector('.preview-placeholder');
    const img = preview.querySelector('.preview-image');
    const removeBtn = preview.querySelector('.image-remove-btn');
    
    if (url && url.trim()) {
        img.src = url;
        img.onload = () => {
            placeholder.style.display = 'none';
            img.style.display = 'block';
            removeBtn.style.display = 'block';
        };
        img.onerror = () => {
            placeholder.style.display = 'flex';
            img.style.display = 'none';
            removeBtn.style.display = 'none';
            showErrorToast('❌ Không thể tải hình ảnh từ URL này');
        };
    } else {
        placeholder.style.display = 'flex';
        img.style.display = 'none';
        removeBtn.style.display = 'none';
        img.src = '';
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showErrorToast('❌ Vui lòng chọn file hình ảnh');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showErrorToast('❌ Kích thước file không được vượt quá 5MB');
        return;
    }

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageUrl = event.target.result;
        document.getElementById('imageUrl').value = imageUrl;
        updateImagePreview(imageUrl);
        showSuccessToast('✅ Đã tải lên hình ảnh');
    };
    reader.onerror = () => {
        showErrorToast('❌ Lỗi khi đọc file hình ảnh');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    const imageUrlInput = document.getElementById('imageUrl');
    const imageFileInput = document.getElementById('imageFile');
    const preview = document.getElementById('imagePreview');
    const placeholder = preview.querySelector('.preview-placeholder');
    const img = preview.querySelector('.preview-image');
    const removeBtn = preview.querySelector('.image-remove-btn');
    
    imageUrlInput.value = '';
    imageFileInput.value = '';
    placeholder.style.display = 'flex';
    img.style.display = 'none';
    removeBtn.style.display = 'none';
    img.src = '';
}

function resetImagePreview() {
    removeImage();
}

// Delete word
async function deleteWord(id) {
    if (!confirm('Bạn có chắc muốn xóa từ này?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/words/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (data.success) {
            await loadWords();
            alert('Đã xóa từ thành công!');
        }
    } catch (error) {
        console.error('Error deleting word:', error);
        alert('Lỗi khi xóa từ');
    }
}

// Load statistics
async function loadStats() {
    // Skip if dashboard.html is handling stats (to avoid conflict)
    // Only load if we're NOT on dashboard page or elements don't exist
    const isDashboardPage = window.location.pathname.includes('dashboard.html');
    
    if (isDashboardPage) {
        console.log('⏭️ Skipping loadStats() - dashboard.html will handle it');
        
        // Only update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl && currentUser) {
            const displayName = currentUser.displayName || currentUser.username || currentUser.email || 'Học viên';
            userNameEl.textContent = displayName;
        }
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/stats/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.success && data.data) {
            const stats = data.data.user || {};
            const progress = data.data.progress || {};
            
            if (totalWordsEl) totalWordsEl.textContent = stats.totalWords || progress.totalWordsLearned || 0;
            if (studyStreakEl) studyStreakEl.textContent = stats.streak || progress.studyStreak || 0;
            
            // Calculate average mastery
            const learnedWords = progress.learnedWords || [];
            let averageMastery = 0;
            if (learnedWords.length > 0) {
                const totalMastery = learnedWords.reduce((sum, word) => sum + (word.masteryLevel || 0), 0);
                averageMastery = Math.round(totalMastery / learnedWords.length);
            }
            if (averageMasteryEl) averageMasteryEl.textContent = averageMastery + '%';
            
            if (currentLevelEl) currentLevelEl.textContent = getLevelName(stats.level || 1);
            
            // Update user name in welcome banner if exists
            const userNameEl = document.getElementById('userName');
            if (userNameEl && currentUser) {
                const displayName = currentUser.displayName || currentUser.username || currentUser.email || 'Học viên';
                userNameEl.textContent = displayName;
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Start practice
async function startPractice() {
    try {
        // Get 10 random words
        const response = await fetch(`${API_URL}/words`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            practiceWords = shuffleArray(data.data).slice(0, Math.min(10, data.data.length));
            currentPracticeIndex = 0;
            practiceModal.style.display = 'block';
            showPracticeWord();
            updateStreak();
        } else {
            alert('Chưa có từ vựng để luyện tập. Hãy thêm từ mới!');
        }
    } catch (error) {
        console.error('Error starting practice:', error);
        alert('Lỗi khi bắt đầu luyện tập');
    }
}

// Show practice word
function showPracticeWord() {
    if (currentPracticeIndex >= practiceWords.length) {
        alert('Hoàn thành! Bạn đã luyện tập xong tất cả các từ.');
        practiceModal.style.display = 'none';
        return;
    }

    const word = practiceWords[currentPracticeIndex];
    isFlipped = false;

    document.getElementById('practiceWord').textContent = word.traditional;
    document.getElementById('practicePinyin').textContent = word.pinyin;
    document.getElementById('practiceVietnamese').textContent = word.vietnamese;
    document.getElementById('practiceEnglish').textContent = word.english || '';

    document.getElementById('flashcardFront').style.display = 'flex';
    document.getElementById('flashcardBack').style.display = 'none';

    document.getElementById('currentCard').textContent = currentPracticeIndex + 1;
    document.getElementById('totalCards').textContent = practiceWords.length;
}

// Flip card
function flipCard() {
    isFlipped = !isFlipped;
    document.getElementById('flashcardFront').style.display = isFlipped ? 'none' : 'flex';
    document.getElementById('flashcardBack').style.display = isFlipped ? 'flex' : 'none';
}

// Mark word mastery
async function markWord(masteryLevel) {
    const word = practiceWords[currentPracticeIndex];

    try {
        await fetch(`${API_URL}/progress/word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wordId: word._id,
                masteryLevel: masteryLevel
            })
        });

        nextPracticeWord();
    } catch (error) {
        console.error('Error marking word:', error);
    }
}

// Next practice word
function nextPracticeWord() {
    currentPracticeIndex++;
    showPracticeWord();
}

// Update study streak
async function updateStreak() {
    try {
        await fetch(`${API_URL}/progress/streak`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        await loadStats();
    } catch (error) {
        console.error('Error updating streak:', error);
    }
}

// Helper functions
function getCategoryName(category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        const option = Array.from(categoryFilter.options).find(opt => opt.value === category);
        if (option) return option.textContent;
    }
    
    // Fallback
    return category || 'Khác';
}

function getLevelName(level) {
    const levels = {
        'beginner': 'Sơ cấp',
        'intermediate': 'Trung cấp',
        'advanced': 'Nâng cao'
    };
    return levels[level] || level;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Edit word (placeholder)
function editWord(id) {
    alert('Chức năng sửa từ sẽ được thêm trong phiên bản tiếp theo!');
}
