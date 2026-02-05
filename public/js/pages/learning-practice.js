/**
 * Learning Practice Module
 * Handles listening, memory, and quiz practice modes
 */

import { apiRequest } from '../utils/api.js';
import { showAlert } from '../components/alert.js';

// State
let currentMode = 'listening';
let words = [];
let practiceWords = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;
let wrongAnswers = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const practiceScreen = document.getElementById('practiceScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startPracticeBtn = document.getElementById('startPracticeBtn');
const exitPracticeBtn = document.getElementById('exitPracticeBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const finishPracticeBtn = document.getElementById('finishPracticeBtn');
const practiceAgainBtn = document.getElementById('practiceAgainBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const categorySelect = document.getElementById('categorySelect');
const questionCount = document.getElementById('questionCount');
const logoutBtn = document.getElementById('logoutBtn');

// Practice Mode Radios
const modeRadios = document.querySelectorAll('input[name="practiceMode"]');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadWords();
    setupEventListeners();
    
    // Handle mode and category from URL params (from learning-modes.html)
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const categoryParam = urlParams.get('category');
    const categoryName = urlParams.get('name');
    
    // Display category banner if coming from category selection
    if (categoryName && categoryParam) {
        const banner = document.getElementById('categoryBanner');
        const nameDisplay = document.getElementById('categoryNameDisplay');
        if (banner && nameDisplay) {
            nameDisplay.textContent = categoryName;
            banner.style.display = 'block';
        }
        console.log('📂 Category from URL:', categoryName, '(', categoryParam, ')');
    }
    
    if (modeParam) {
        // Map mode from URL to radio value
        const modeMapping = {
            'listen-write': 'listening',
            'read-meaning': 'memory',
            'quiz': 'quiz'
        };
        
        const mappedMode = modeMapping[modeParam] || 'listening';
        currentMode = mappedMode;
        
        // Select the appropriate radio button
        const radioToSelect = document.getElementById(`mode${mappedMode.charAt(0).toUpperCase() + mappedMode.slice(1)}`);
        if (radioToSelect) {
            radioToSelect.checked = true;
        } else if (mappedMode === 'listening') {
            document.getElementById('modeListening').checked = true;
        }
        
        updatePracticeTitle();
        console.log('📻 Mode set from URL:', modeParam, '→', mappedMode);
    }
});

// Setup Event Listeners
function setupEventListeners() {
    startPracticeBtn.addEventListener('click', startPractice);
    exitPracticeBtn.addEventListener('click', exitPractice);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    prevQuestionBtn.addEventListener('click', prevQuestion);
    finishPracticeBtn.addEventListener('click', showResults);
    practiceAgainBtn.addEventListener('click', resetPractice);
    backToHomeBtn.addEventListener('click', () => {
        window.location.href = '/pages/dashboard/dashboard.html';
    });
    
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            updatePracticeTitle();
        });
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Load Categories
async function loadCategories() {
    try {
        const response = await apiRequest('/categories');
        console.log('Categories response:', response);
        
        // Handle different response formats
        let categories = [];
        if (response.success && response.data) {
            categories = response.data;
        } else if (Array.isArray(response.categories)) {
            categories = response.categories;
        } else if (Array.isArray(response)) {
            categories = response;
        }
        
        categorySelect.innerHTML = '<option value="">Tất cả danh mục</option>';
        
        if (categories && categories.length > 0) {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.slug;
                option.textContent = `${cat.name} (${cat.wordCount || 0})`;
                categorySelect.appendChild(option);
            });
        }
        
        // Auto-select category from URL params if provided
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            categorySelect.value = categoryParam;
            console.log('Auto-selected category from URL:', categoryParam);
        }
        
    } catch (error) {
        console.error('Error loading categories:', error);
        // Don't show error to user, just log it
    }
}

// Load Words
async function loadWords() {
    try {
        // Load all available words for practice (user's words + admin public words)
        const response = await apiRequest('/words/practice?count=1000&includeAdmin=true&shuffle=false');
        
        console.log('📦 Words response:', response);
        
        if (response && response.success && response.data) {
            words = response.data;
            console.log(`✅ Loaded ${words.length} words for practice`);
            
            if (words.length === 0) {
                console.warn('⚠️ No words available');
                showWelcomeMessage('Chưa có từ vựng', 'Vui lòng thêm từ vựng hoặc chọn danh mục có từ vựng.');
            }
        } else {
            words = [];
            console.warn('⚠️ Invalid response format:', response);
        }
    } catch (error) {
        console.error('❌ Error loading words:', error);
        words = [];
        showWelcomeMessage('Lỗi tải dữ liệu', 'Không thể tải danh sách từ vựng. Vui lòng thử lại sau.');
    }
}

// Show welcome message helper
function showWelcomeMessage(title, message) {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        const messageDiv = welcomeScreen.querySelector('.lead');
        if (messageDiv) {
            messageDiv.innerHTML = `<i class="fas fa-exclamation-triangle text-warning"></i> ${message}`;
            messageDiv.classList.add('text-warning');
        }
        const titleDiv = welcomeScreen.querySelector('h2');
        if (titleDiv) {
            titleDiv.textContent = title;
        }
    }
}

// Start Practice
async function startPractice() {
    // Get selected category
    const selectedCategory = categorySelect.value;
    
    // Get number of questions
    const count = questionCount.value === 'all' ? 1000 : parseInt(questionCount.value);
    
    try {
        // Use new practice API endpoint for better filtering
        const params = new URLSearchParams({
            count: count,
            includeAdmin: 'true',
            shuffle: 'true'
        });
        
        if (selectedCategory) {
            params.append('category', selectedCategory);
        }
        
        const response = await apiRequest(`/words/practice?${params.toString()}`);
        const availableWords = response.data || [];
        
        if (availableWords.length === 0) {
            showAlert('Không có từ vựng nào trong danh mục này để luyện tập', 'warning');
            return;
        }
        
        // Check minimum words required for quiz (need at least 4 for multiple choice)
        const minWordsRequired = 4;
        if (availableWords.length < minWordsRequired) {
            showAlert(
                `Cần ít nhất ${minWordsRequired} từ vựng để luyện tập trắc nghiệm. ` +
                `Hiện chỉ có ${availableWords.length} từ. Vui lòng thêm từ vựng hoặc chọn danh mục khác.`, 
                'warning'
            );
            return;
        }
        
        // Limit to requested count
        practiceWords = availableWords.slice(0, Math.min(count, availableWords.length));
        
        console.log(`✅ Starting practice with ${practiceWords.length} words from ${response.totalAvailable} available`);
        console.log(`📊 Minimum required for quiz: ${minWordsRequired} words`);
        
        // Reset state
        currentQuestionIndex = 0;
        userAnswers = [];
        correctAnswers = 0;
        wrongAnswers = 0;
        
        // Show practice screen
        welcomeScreen.style.display = 'none';
        practiceScreen.style.display = 'block';
        resultsScreen.style.display = 'none';
        
        updatePracticeTitle();
        showQuestion();
        
    } catch (error) {
        console.error('Error loading practice words:', error);
        showAlert('Không thể tải từ vựng cho bài luyện tập. Vui lòng thử lại.', 'danger');
    }
}

// Exit Practice
function exitPractice() {
    if (confirm('Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.')) {
        resetPractice();
    }
}

// Reset Practice
function resetPractice() {
    welcomeScreen.style.display = 'block';
    practiceScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    currentQuestionIndex = 0;
    userAnswers = [];
}

// Update Practice Title
function updatePracticeTitle() {
    const titles = {
        listening: '<i class="fas fa-headphones"></i> Luyện Nghe Phát Âm',
        memory: '<i class="fas fa-brain"></i> Nhớ Nghĩa Tiếng Việt',
        quiz: '<i class="fas fa-question-circle"></i> Trắc Nghiệm'
    };
    document.getElementById('practiceTitle').innerHTML = titles[currentMode];
}

// Show Question
function showQuestion() {
    const word = practiceWords[currentQuestionIndex];
    const questionArea = document.getElementById('questionArea');
    const optionsArea = document.getElementById('optionsArea');
    
    // Update progress
    document.getElementById('questionProgress').textContent = `${currentQuestionIndex + 1}/${practiceWords.length}`;
    const progressPercent = ((currentQuestionIndex + 1) / practiceWords.length) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    // Clear previous content
    questionArea.innerHTML = '';
    optionsArea.innerHTML = '';
    
    // Generate question based on mode
    if (currentMode === 'listening') {
        showListeningQuestion(word, questionArea, optionsArea);
    } else if (currentMode === 'memory') {
        showMemoryQuestion(word, questionArea, optionsArea);
    } else if (currentMode === 'quiz') {
        showQuizQuestion(word, questionArea, optionsArea);
    }
    
    // Update navigation buttons
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    nextQuestionBtn.style.display = 'none';
    finishPracticeBtn.style.display = 'none';
}

// Listening Mode: Hear pronunciation, choose correct word
function showListeningQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="mb-4">
            <h4 class="mb-3">Nghe và chọn từ đúng:</h4>
            <button class="btn btn-lg btn-primary" onclick="speakWord('${word.pinyin || word.traditional}')">
                <i class="fas fa-volume-up fa-2x"></i>
                <div class="mt-2">Phát Âm</div>
            </button>
            <p class="text-muted mt-3">Nhấn để nghe lại</p>
        </div>
    `;
    
    // Generate options (correct word + 3 random words)
    const options = generateOptions(word, 4);
    
    optionsArea.innerHTML = options.map(opt => `
        <div class="col-md-6">
            <button class="btn btn-outline-primary w-100 p-3 option-btn" data-word-id="${opt._id}">
                <h5 class="mb-1">${opt.traditional}</h5>
                <small class="text-muted">${opt.simplified}</small>
            </button>
        </div>
    `).join('');
    
    attachOptionListeners(word._id);
    
    // Auto-play on first load
    setTimeout(() => speakWord(word.pinyin || word.traditional), 500);
}

// Memory Mode: Show word, choose correct Vietnamese meaning
function showMemoryQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="mb-4">
            <h4 class="mb-3">Nghĩa tiếng Việt của từ này là gì?</h4>
            <div class="word-display p-4 bg-light rounded">
                <h1 class="display-3 mb-2">${word.traditional}</h1>
                <p class="h4 text-muted">${word.simplified}</p>
                <p class="text-secondary">${word.pinyin}</p>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="speakWord('${word.pinyin || word.traditional}')">
                    <i class="fas fa-volume-up"></i> Nghe Phát Âm
                </button>
            </div>
        </div>
    `;
    
    // Generate Vietnamese meaning options
    const options = generateMeaningOptions(word, 4);
    
    optionsArea.innerHTML = options.map(opt => `
        <div class="col-md-6">
            <button class="btn btn-outline-success w-100 p-3 option-btn" data-meaning="${opt.meaning}">
                <h6 class="mb-0">${opt.meaning}</h6>
            </button>
        </div>
    `).join('');
    
    attachMeaningListeners(word.vietnamese);
}

// Quiz Mode: Multiple question types randomly
function showQuizQuestion(word, questionArea, optionsArea) {
    const quizTypes = ['word-to-meaning', 'meaning-to-word', 'pinyin-to-word'];
    const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    
    if (quizType === 'word-to-meaning') {
        showMemoryQuestion(word, questionArea, optionsArea);
    } else if (quizType === 'meaning-to-word') {
        questionArea.innerHTML = `
            <div class="mb-4">
                <h4 class="mb-3">Từ nào có nghĩa là:</h4>
                <div class="meaning-display p-4 bg-light rounded">
                    <h2 class="text-primary">${word.vietnamese}</h2>
                </div>
            </div>
        `;
        
        const options = generateOptions(word, 4);
        optionsArea.innerHTML = options.map(opt => `
            <div class="col-md-6">
                <button class="btn btn-outline-warning w-100 p-3 option-btn" data-word-id="${opt._id}">
                    <h5 class="mb-1">${opt.traditional}</h5>
                    <small class="text-muted">${opt.pinyin}</small>
                </button>
            </div>
        `).join('');
        
        attachOptionListeners(word._id);
    } else {
        showListeningQuestion(word, questionArea, optionsArea);
    }
}

// Generate random word options
function generateOptions(correctWord, count) {
    const options = [correctWord];
    const availableWords = practiceWords.filter(w => w._id !== correctWord._id);
    
    // Need at least count-1 other words to make count options
    const needed = count - 1;
    
    while (options.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        options.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1);
    }
    
    // If we don't have enough words, warn and return what we have
    if (options.length < count) {
        console.warn(`⚠️ Only ${options.length} words available for options (requested ${count})`);
    }
    
    return shuffleArray(options);
}

// Generate meaning options
function generateMeaningOptions(correctWord, count) {
    const options = [{ meaning: correctWord.vietnamese, correct: true }];
    const availableWords = practiceWords.filter(w => 
        w._id !== correctWord._id && w.vietnamese !== correctWord.vietnamese
    );
    
    const needed = count - 1;
    
    while (options.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        options.push({ meaning: availableWords[randomIndex].vietnamese, correct: false });
        availableWords.splice(randomIndex, 1);
    }
    
    // If we don't have enough unique meanings, warn
    if (options.length < count) {
        console.warn(`⚠️ Only ${options.length} unique meanings available for options (requested ${count})`);
    }
    
    return shuffleArray(options);
}

// Attach option click listeners
function attachOptionListeners(correctWordId) {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedWordId = btn.dataset.wordId;
            checkAnswer(selectedWordId === correctWordId, btn);
        });
    });
}

// Attach meaning option listeners
function attachMeaningListeners(correctMeaning) {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedMeaning = btn.dataset.meaning;
            checkAnswer(selectedMeaning === correctMeaning, btn);
        });
    });
}

// Check Answer
function checkAnswer(isCorrect, btn) {
    // Disable all options
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    // Show feedback
    if (isCorrect) {
        btn.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
        btn.classList.add('btn-success');
        correctAnswers++;
        playSound('correct');
    } else {
        btn.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
        btn.classList.add('btn-danger');
        wrongAnswers++;
        playSound('wrong');
        
        // Highlight correct answer
        allBtns.forEach(b => {
            if (b.dataset.wordId === practiceWords[currentQuestionIndex]._id ||
                b.dataset.meaning === practiceWords[currentQuestionIndex].vietnamese) {
                b.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
                b.classList.add('btn-success');
            }
        });
    }
    
    // Save answer
    userAnswers.push({
        word: practiceWords[currentQuestionIndex],
        correct: isCorrect
    });
    
    // Show next/finish button
    if (currentQuestionIndex < practiceWords.length - 1) {
        nextQuestionBtn.style.display = 'inline-block';
    } else {
        finishPracticeBtn.style.display = 'inline-block';
    }
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Previous Question (review only)
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Show Results
async function showResults() {
    practiceScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
    
    const totalQuestions = practiceWords.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('accuracyPercent').textContent = accuracy + '%';
    
    // Set result message
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultIcon = document.getElementById('resultIcon');
    
    if (accuracy >= 90) {
        resultTitle.textContent = 'Xuất Sắc!';
        resultMessage.textContent = 'Bạn đã làm rất tốt!';
        resultIcon.innerHTML = '<i class="fas fa-trophy text-warning"></i>';
    } else if (accuracy >= 70) {
        resultTitle.textContent = 'Tốt Lắm!';
        resultMessage.textContent = 'Tiếp tục phát huy nhé!';
        resultIcon.innerHTML = '<i class="fas fa-star text-success"></i>';
    } else if (accuracy >= 50) {
        resultTitle.textContent = 'Khá Tốt!';
        resultMessage.textContent = 'Bạn đang tiến bộ!';
        resultIcon.innerHTML = '<i class="fas fa-thumbs-up text-primary"></i>';
    } else {
        resultTitle.textContent = 'Cố Gắng Thêm!';
        resultMessage.textContent = 'Hãy luyện tập nhiều hơn nhé!';
        resultIcon.innerHTML = '<i class="fas fa-redo text-info"></i>';
    }
    
    // Show wrong answers for review
    const reviewList = document.getElementById('reviewList');
    const wrongAnswersList = userAnswers.filter(a => !a.correct);
    
    if (wrongAnswersList.length === 0) {
        reviewList.innerHTML = '<p class="text-success">Bạn đã trả lời đúng tất cả! 🎉</p>';
    } else {
        reviewList.innerHTML = wrongAnswersList.map(ans => `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h5 class="mb-0">${ans.word.traditional}</h5>
                            <small class="text-muted">${ans.word.simplified}</small>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Phiên âm:</small>
                            <div>${ans.word.pinyin}</div>
                        </div>
                        <div class="col-md-4">
                            <small class="text-muted">Nghĩa:</small>
                            <div class="text-success fw-bold">${ans.word.vietnamese}</div>
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-sm btn-outline-primary" onclick="speakWord('${ans.word.pinyin || ans.word.traditional}')">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update today's stats
    updateTodayStats();
    
    // Save practice session to backend
    await savePracticeSession(accuracy);
}

// Update Today's Statistics
function updateTodayStats() {
    const today = new Date().toDateString();
    let stats = JSON.parse(localStorage.getItem('practiceStats') || '{}');
    
    if (!stats[today]) {
        stats[today] = { count: 0, correct: 0, total: 0 };
    }
    
    stats[today].count++;
    stats[today].correct += correctAnswers;
    stats[today].total += practiceWords.length;
    
    localStorage.setItem('practiceStats', JSON.stringify(stats));
    
    document.getElementById('todayPracticeCount').textContent = stats[today].count;
    const todayAccuracy = Math.round((stats[today].correct / stats[today].total) * 100);
    document.getElementById('todayAccuracy').textContent = todayAccuracy + '%';
}

// Speak Word (Text-to-Speech)
window.speakWord = function(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-TW'; // Taiwan Chinese
        utterance.rate = 0.8; // Slower for learning
        speechSynthesis.speak(utterance);
    }
}

// Play Sound Effect
function playSound(type) {
    // Simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    } else {
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Shuffle Array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/pages/auth/login.html';
}

// Save Practice Session to Backend
async function savePracticeSession(accuracy) {
    try {
        const sessionData = {
            mode: currentMode,
            category: categorySelect.value || 'all',
            totalQuestions: practiceWords.length,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            timeSpent: 0, // Could track actual time if needed
            answers: userAnswers.map(ans => ({
                wordId: ans.word._id,
                correct: ans.correct
            }))
        };

        const response = await apiRequest('/progress/practice', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });

        if (response.success) {
            console.log('Practice session saved:', response.data);
            // Update UI with server data if needed
            if (response.data.studyStreak) {
                console.log('Study streak:', response.data.studyStreak);
            }
        }
    } catch (error) {
        console.error('Error saving practice session:', error);
        // Don't show error to user, just log it
    }
}
