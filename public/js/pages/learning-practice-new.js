/**
 * Learning Practice - Simplified Version
 * User flow: Categories → Modes → Practice
 * All settings (category, mode) are from URL params
 */

import { apiRequest } from '../utils/api.js';

// ===== STATE =====
let categorySlug = '';
let categoryName = '';
let currentMode = 'listening';
let questionCount = 10;
let practiceWords = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;
let wrongAnswers = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 Learning Practice Started');
    
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    categorySlug = urlParams.get('category');
    categoryName = urlParams.get('name') || 'Luyện Tập';
    const modeParam = urlParams.get('mode');
    const countParam = urlParams.get('count') || '10';
    
    // Validate required params
    if (!categorySlug) {
        alert('Thiếu thông tin danh mục! Vui lòng chọn lại.');
        window.location.href = '/pages/dashboard/learning-categories.html';
        return;
    }
    
    // Map mode
    const modeMapping = {
        'listen-write': 'listening',
        'read-meaning': 'memory',
        'write-character': 'writing',
        'speaking': 'speaking',
        'quiz': 'quiz'
    };
    currentMode = modeMapping[modeParam] || 'listening';
    questionCount = countParam === 'all' ? 1000 : parseInt(countParam);
    
    console.log('📂 Category:', categoryName, '(' + categorySlug + ')');
    console.log('🎮 Mode:', currentMode);
    console.log('🔢 Question Count:', questionCount);
    
    // Update UI
    updateHeader();
    
    // Load and start practice
    await loadAndStartPractice();
    
    // Setup event listeners
    setupEventListeners();
});

// ===== UPDATE HEADER =====
function updateHeader() {
    document.getElementById('categoryNameDisplay').textContent = categoryName;
    
    const modeIcons = {
        listening: '<i class="fas fa-headphones"></i> Luyện Nghe Phát Âm',
        memory: '<i class="fas fa-brain"></i> Nhớ Nghĩa Tiếng Việt',
        writing: '<i class="fas fa-pen-fancy"></i> Viết Chữ Đài',
        speaking: '<i class="fas fa-microphone"></i> Luyện Phát Âm',
        quiz: '<i class="fas fa-question-circle"></i> Trắc Nghiệm Tổng Hợp'
    };
    document.getElementById('modeDisplay').innerHTML = modeIcons[currentMode];
}

// ===== LOAD AND START PRACTICE =====
async function loadAndStartPractice() {
    try {
        // Show loading
        document.getElementById('loadingScreen').style.display = 'block';
        
        // Load words for this category
        const response = await apiRequest(`/words/practice?category=${categorySlug}&count=${questionCount}&includeAdmin=true&shuffle=true`);
        
        console.log('📦 Response:', response);
        
        if (!response || !response.success || !response.data || response.data.length === 0) {
            showError('Không tìm thấy từ vựng trong danh mục này. Vui lòng chọn danh mục khác.');
            return;
        }
        
        practiceWords = response.data;
        console.log(`✅ Loaded ${practiceWords.length} words`);
        
        // Check minimum words for quiz
        if (practiceWords.length < 4) {
            showError(`Cần ít nhất 4 từ vựng để luyện tập. Hiện chỉ có ${practiceWords.length} từ.`);
            return;
        }
        
        // Update word count display
        document.getElementById('wordCountDisplay').innerHTML = 
            `<i class="fas fa-layer-group"></i> ${practiceWords.length} từ vựng`;
        
        // Start practice
        currentQuestionIndex = 0;
        userAnswers = [];
        correctAnswers = 0;
        wrongAnswers = 0;
        
        // Hide loading, show practice
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('practiceScreen').style.display = 'block';
        
        showQuestion();
        
    } catch (error) {
        console.error('❌ Error loading practice:', error);
        showError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
}

// ===== SHOW ERROR =====
function showError(message) {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.innerHTML = `
        <div class="card-body text-center py-5">
            <i class="fas fa-exclamation-triangle fa-4x text-warning mb-4"></i>
            <h3>${message}</h3>
            <button class="btn btn-primary mt-3" onclick="window.location.href='/pages/dashboard/learning-categories.html'">
                <i class="fas fa-arrow-left"></i> Quay lại chọn danh mục
            </button>
        </div>
    `;
}

// ===== SHOW QUESTION =====
function showQuestion() {
    const word = practiceWords[currentQuestionIndex];
    const questionArea = document.getElementById('questionArea');
    const optionsArea = document.getElementById('optionsArea');
    
    // Update progress
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = practiceWords.length;
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
    } else if (currentMode === 'writing') {
        showWritingQuestion(word, questionArea, optionsArea);
    } else if (currentMode === 'speaking') {
        showSpeakingQuestion(word, questionArea, optionsArea);
    } else if (currentMode === 'quiz') {
        showQuizQuestion(word, questionArea, optionsArea);
    }
    
    // Update navigation
    const prevBtn = document.getElementById('prevQuestionBtn');
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        // Always show next button to allow skipping difficult questions
        if (currentQuestionIndex < practiceWords.length - 1) {
            nextBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'none';
        }
    }
    const finishBtn = document.getElementById('finishPracticeBtn');
    if (finishBtn) {
        if (currentQuestionIndex === practiceWords.length - 1) {
            finishBtn.style.display = 'inline-block';
        } else {
            finishBtn.style.display = 'none';
        }
    }
}

// ===== LISTENING MODE =====
function showListeningQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="mb-4">
            <h4 class="mb-3">Nghe và chọn từ đúng:</h4>
            <button class="btn btn-lg btn-primary" id="listeningPlayBtn">
                <i class="fas fa-volume-up fa-2x"></i>
                <div class="mt-2">Phát Âm</div>
            </button>
            <p class="text-muted mt-3"><small>Nhấn để nghe lại</small></p>
        </div>
    `;
    
    // Add event listener
    setTimeout(() => {
        const playBtn = document.getElementById('listeningPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => speakWord(word.pinyin || word.traditional));
        }
    }, 100);
    
    const options = generateOptions(word, 4);
    optionsArea.innerHTML = options.map(opt => `
        <div class="col-12 col-md-6">
            <button class="btn btn-outline-primary w-100 option-btn" data-word-id="${opt._id}">
                <h5 class="mb-1">${opt.traditional}</h5>
                <small class="text-muted">${opt.simplified || ''}</small>
            </button>
        </div>
    `).join('');
    
    attachOptionListeners(word._id);
    // Delay auto-play to avoid conflicts
    setTimeout(() => speakWord(word.pinyin || word.traditional), 800);
}

// ===== MEMORY MODE =====
function showMemoryQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="mb-4">
            <h4 class="mb-3">Nghĩa tiếng Việt của từ này là gì?</h4>
            <div class="word-display">
                <h1 class="display-3 mb-2">${word.traditional}</h1>
                <p class="h4 text-muted">${word.simplified || ''}</p>
                <p class="text-secondary">${word.pinyin}</p>
                <button class="btn btn-sm btn-outline-primary mt-2" id="memoryPlayBtn">
                    <i class="fas fa-volume-up"></i> Nghe Phát Âm
                </button>
            </div>
        </div>
    `;
    
    const options = generateMeaningOptions(word, 4);
    optionsArea.innerHTML = options.map(opt => `
        <div class="col-12 col-md-6">
            <button class="btn btn-outline-success w-100 option-btn" data-meaning="${opt.meaning}">
                <h6 class="mb-0">${opt.meaning}</h6>
            </button>
        </div>
    `).join('');
    
    // Add event listener for play button
    setTimeout(() => {
        const playBtn = document.getElementById('memoryPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => speakWord(word.pinyin || word.traditional));
        }
    }, 100);
    
    attachMeaningListeners(word.vietnamese);
}

// ===== QUIZ MODE =====
function showQuizQuestion(word, questionArea, optionsArea) {
    const quizTypes = ['word-to-meaning', 'meaning-to-word', 'pinyin-to-word'];
    const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    
    if (quizType === 'word-to-meaning') {
        showMemoryQuestion(word, questionArea, optionsArea);
    } else if (quizType === 'meaning-to-word') {
        questionArea.innerHTML = `
            <div class="mb-4">
                <h4 class="mb-3">Từ nào có nghĩa là:</h4>
                <div class="word-display">
                    <h2 class="text-primary display-5">${word.vietnamese}</h2>
                </div>
            </div>
        `;
        
        const options = generateOptions(word, 4);
        optionsArea.innerHTML = options.map(opt => `
            <div class="col-12 col-md-6">
                <button class="btn btn-outline-warning w-100 option-btn" data-word-id="${opt._id}">
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

// ===== WRITING MODE =====
function showWritingQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="mb-4">
            <h4 class="mb-3">Nghe và gõ chữ Đài chính xác:</h4>
            <button class="btn btn-lg btn-primary mb-3" id="writingPlayBtn">
                <i class="fas fa-volume-up fa-2x"></i>
                <div class="mt-2">Phát Âm</div>
            </button>
            <div class="mt-3">
                <p class="text-muted"><strong>Gợi ý:</strong> ${word.vietnamese}</p>
                <p class="text-secondary"><small>Pinyin: ${word.pinyin}</small></p>
            </div>
        </div>
    `;
    
    // Add event listener
    setTimeout(() => {
        const playBtn = document.getElementById('writingPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => speakWord(word.pinyin || word.traditional));
        }
    }, 100);
    
    optionsArea.innerHTML = `
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <label class="form-label fw-bold">Nhập chữ Đài (繁體字):</label>
                    <input type="text" 
                           class="form-control form-control-lg text-center" 
                           id="writingInput" 
                           placeholder="Gõ chữ Hán ở đây..."
                           autocomplete="off"
                           style="font-size: 2rem; font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;">
                    <div class="mt-3 text-center">
                        <button class="btn btn-success btn-lg" onclick="checkWritingAnswer()">
                            <i class="fas fa-check"></i> Kiểm Tra
                        </button>
                        <button class="btn btn-outline-secondary btn-lg ms-2" onclick="showWritingHint()">
                            <i class="fas fa-lightbulb"></i> Gợi ý
                        </button>
                    </div>
                    <div id="writingFeedback" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;
    
    // Auto-play pronunciation
    setTimeout(() => speakWord(word.pinyin || word.traditional), 800);
    
    // Focus input
    setTimeout(() => document.getElementById('writingInput')?.focus(), 900);
    
    // Store correct answer
    window.currentCorrectAnswer = word.traditional;
}

// ===== SPEAKING MODE =====
function showSpeakingQuestion(word, questionArea, optionsArea) {
    questionArea.innerHTML = `
        <div class="speaking-mode-container">
            <div class="speaking-header ">
                <h4 class="speaking-title">
                    <i class="fas fa-microphone-alt me-2"></i>
                    Hãy phát âm từ này
                </h4>
                <p class="speaking-subtitle">Nhìn vào từ và đọc theo tiếng Đài</p>
            </div>
            
            <div class="word-showcase">
                <div class="word-main-display">
                    <div class="word-traditional-large">${word.traditional}</div>
                    ${word.simplified ? `<div class="word-simplified-display">${word.simplified}</div>` : ''}
                </div>
                
                <div class="word-info-panel">
                    <div class="info-item">
                        <i class="fas fa-language"></i>
                        <span class="info-label">Nghĩa:</span>
                        <span class="info-value">${word.vietnamese}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-spell-check"></i>
                        <span class="info-label">Pinyin:</span>
                        <span class="info-value pinyin-text">${word.pinyin}</span>
                    </div>
                </div>
                
                <div class="speaking-buttons-row">
                    <button class="btn-listen-sample" id="listenSampleBtn">
                        <i class="fas fa-volume-up"></i>
                        <span>Nghe mẫu phát âm</span>
                    </button>
                    
                    <button class="btn-record" id="recordBtn" onclick="startRecording()">
                        <i class="fas fa-microphone"></i>
                        <span>Bắt đầu ghi âm</span>
                    </button>
                </div>
                
               
            </div>
            <div class = "btn-backspeaking-question"> 
                <button class="btn-prev-fixed" id="prevQuestionBtn" disabled >
                    <i class="fas fa-arrow-left"></i>
                    <span>Câu trước</span>
                </button>
            </div>
        </div>
          
    `;
    
    // Add event listener for listen button
    setTimeout(() => {
        const listenBtn = document.getElementById('listenSampleBtn');
        if (listenBtn) {
            listenBtn.addEventListener('click', () => {
                speakWord(word.pinyin || word.traditional);
            });
        }
    }, 100);
    
    // Store correct answer
    window.currentCorrectPinyin = word.pinyin;
    window.currentCorrectTraditional = word.traditional;
    
    // Auto-play pronunciation when showing new word
    setTimeout(() => {
        speakWord(word.pinyin || word.traditional);
        console.log('🔊 Auto-playing pronunciation:', word.pinyin);
    }, 800);
}

// Show speaking feedback
function showSpeakingFeedback(isCorrect, message) {
    const feedbackArea = document.getElementById('speakingFeedback');
    if (feedbackArea) {
        feedbackArea.innerHTML = `
            <div class="feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

// ===== GENERATE OPTIONS =====
function generateOptions(correctWord, count) {
    const options = [correctWord];
    const availableWords = practiceWords.filter(w => w._id !== correctWord._id);
    
    while (options.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        options.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1);
    }
    
    return shuffleArray(options);
}

function generateMeaningOptions(correctWord, count) {
    const options = [{ meaning: correctWord.vietnamese, correct: true }];
    const availableWords = practiceWords.filter(w => 
        w._id !== correctWord._id && w.vietnamese !== correctWord.vietnamese
    );
    
    while (options.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        options.push({ meaning: availableWords[randomIndex].vietnamese, correct: false });
        availableWords.splice(randomIndex, 1);
    }
    
    return shuffleArray(options);
}

// ===== ATTACH LISTENERS =====
function attachOptionListeners(correctWordId) {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedWordId = btn.dataset.wordId;
            checkAnswer(selectedWordId === correctWordId, btn);
        });
    });
}

function attachMeaningListeners(correctMeaning) {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedMeaning = btn.dataset.meaning;
            checkAnswer(selectedMeaning === correctMeaning, btn);
        });
    });
}

// ===== CHECK ANSWER =====
function checkAnswer(isCorrect, btn) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (isCorrect) {
        btn.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
        btn.classList.add('btn-success');
        correctAnswers++;
        playSound('correct');
        
        // Auto-advance to next question after 1 second
        setTimeout(() => {
            if (currentQuestionIndex < practiceWords.length - 1) {
                nextQuestion();
            } else {
                finishPractice();
            }
        }, 1000);
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
    
    userAnswers.push({
        word: practiceWords[currentQuestionIndex],
        correct: isCorrect
    });
}

// ===== NAVIGATION =====
function nextQuestion() {
    // Stop any ongoing speech before moving to next question
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
    }
    
    currentQuestionIndex++;
    showQuestion();
}

function prevQuestion() {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
    }
    
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// ===== SHOW RESULTS =====
async function showResults() {
    document.getElementById('practiceScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
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
    
    // Show wrong answers
    const reviewList = document.getElementById('reviewList');
    const wrongAnswersList = userAnswers.filter(a => !a.correct);
    
    if (wrongAnswersList.length === 0) {
        reviewList.innerHTML = '<p class="text-success text-center">Bạn đã trả lời đúng tất cả! 🎉</p>';
    } else {
        reviewList.innerHTML = wrongAnswersList.map((ans, index) => `
            <div class="card mb-2 border-0">
                <div class="card-body bg-light">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h5 class="mb-0">${ans.word.traditional}</h5>
                            <small class="text-muted">${ans.word.simplified || ''}</small>
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
                            <button class="btn btn-sm btn-outline-primary review-play-btn" data-index="${index}">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for play buttons
        setTimeout(() => {
            document.querySelectorAll('.review-play-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const word = wrongAnswersList[index].word;
                    speakWord(word.pinyin || word.traditional);
                });
            });
        }, 100);
    }
    
    // Save to backend
    try {
        const result = await apiRequest('/progress/practice', {
            method: 'POST',
            body: JSON.stringify({
                mode: currentMode,
                category: categorySlug,
                totalQuestions: totalQuestions,
                correctAnswers: correctAnswers,
                wrongAnswers: wrongAnswers,
                timeSpent: 0,
                answers: userAnswers.map(ans => ({
                    wordId: ans.word._id,
                    correct: ans.correct
                }))
            })
        });
        console.log('✅ Practice session saved');
        
        // Check for new achievements
        if (result.data && result.data.newAchievements && result.data.newAchievements.length > 0) {
            showAchievementNotifications(result.data.newAchievements);
        }
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('exitPracticeBtn').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.')) {
            // Cleanup speech synthesis
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            isSpeaking = false;
            
            // Cleanup speech recognition
            if (recognition && isRecording) {
                recognition.stop();
                isRecording = false;
            }
            
            history.back();
        }
    });
    
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }
    
    const finishBtn = document.getElementById('finishPracticeBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', showResults);
    }
    
    // Prev button will be added dynamically in each mode
    document.addEventListener('click', (e) => {
        if (e.target.closest('#prevQuestionBtn')) {
            prevQuestion();
        }
    });
    
    const practiceAgainBtn = document.getElementById('practiceAgainBtn');
    if (practiceAgainBtn) {
        practiceAgainBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // Return to mode selection button
    const returnBtn = document.getElementById('returnToModesBtn');
    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            window.location.href = `learning-practice-new.html?category=${categorySlug}&name=${encodeURIComponent(categoryName)}`;
        });
    }
}

// ===== UTILITIES =====
let isSpeaking = false;
let lastSpeakTime = 0;
const SPEAK_DEBOUNCE = 500; // ms

window.speakWord = function(text) {
    console.log('🔊 Attempting to speak:', text);
    
    if (!('speechSynthesis' in window)) {
        console.error('❌ Speech synthesis not supported');
        alert('Trình duyệt không hỗ trợ phát âm. Vui lòng dùng Chrome hoặc Edge.');
        return;
    }
    
    // Debounce - tránh spam clicks
    const now = Date.now();
    if (now - lastSpeakTime < SPEAK_DEBOUNCE) {
        console.log('⏱️ Too soon, debouncing...');
        return;
    }
    lastSpeakTime = now;
    
    try {
        // Only cancel if actually speaking
        if (window.speechSynthesis.speaking) {
            console.log('🛑 Cancelling previous speech');
            window.speechSynthesis.cancel();
            // Wait a bit for cancel to complete
            setTimeout(() => startSpeaking(text), 100);
        } else {
            startSpeaking(text);
        }
        
    } catch (error) {
        console.error('❌ Error in speakWord:', error);
        // Don't alert for interrupted errors
        if (error.message && !error.message.includes('interrupted')) {
            alert('Lỗi phát âm: ' + error.message);
        }
    }
}

function startSpeaking(text) {
    if (isSpeaking) {
        console.log('⚠️ Already speaking, skipping');
        return;
    }
    
    isSpeaking = true;
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
        console.log('✅ Speech started:', text);
    };
    
    utterance.onend = () => {
        console.log('✅ Speech ended');
        isSpeaking = false;
    };
    
    utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        isSpeaking = false;
        
        // Only show alerts for critical errors
        if (event.error === 'not-allowed') {
            alert('Vui lòng cho phép trình duyệt phát âm thanh.');
        } else if (event.error === 'synthesis-failed') {
            console.warn('⚠️ Synthesis failed, will retry on next click');
        }
        // Ignore 'interrupted' and 'cancelled' errors (normal behavior)
    };
    
    // Speak
    window.speechSynthesis.speak(utterance);
    console.log('🎤 Speech synthesis started');
}

function playSound(type) {
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

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===== WRITING MODE HANDLERS =====
window.checkWritingAnswer = function() {
    const input = document.getElementById('writingInput');
    const userAnswer = input.value.trim();
    const correctAnswer = window.currentCorrectAnswer;
    const feedback = document.getElementById('writingFeedback');
    
    if (!userAnswer) {
        feedback.innerHTML = '<div class="alert alert-warning">Vui lòng nhập câu trả lời!</div>';
        return;
    }
    
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> Chính xác! 
                <strong>${correctAnswer}</strong>
            </div>
        `;
        playSound('correct');
        input.disabled = true;
        correctAnswers++;
    } else {
        feedback.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-times-circle"></i> Sai rồi! 
                <br>Bạn viết: <strong>${userAnswer}</strong>
                <br>Đáp án đúng: <strong>${correctAnswer}</strong>
            </div>
        `;
        playSound('wrong');
        wrongAnswers++;
    }
    
    userAnswers.push({
        word: practiceWords[currentQuestionIndex],
        correct: isCorrect
    });
}

window.showWritingHint = function() {
    const correctAnswer = window.currentCorrectAnswer;
    const input = document.getElementById('writingInput');
    const currentValue = input.value.trim();
    
    if (currentValue.length < correctAnswer.length) {
        input.value = correctAnswer.substring(0, currentValue.length + 1);
        input.focus();
    } else {
        alert('Đã hiển thị đầy đủ gợi ý!');
    }
}

// ===== SPEAKING MODE HANDLERS =====
let recognition = null;
let isRecording = false;

window.startRecording = async function() {
    console.log('🎙️ Starting recording...');
    
    const recordBtn = document.getElementById('recordBtn');
    const feedback = document.getElementById('speakingFeedback');
    
    if (!recordBtn) {
        console.error('❌ Record button not found');
        return;
    }
    
    if (!feedback) {
        console.error('❌ Feedback element not found');
        return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('❌ Speech recognition not supported');
        feedback.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.
            </div>
        `;
        return;
    }
    
    if (isRecording) {
        stopRecording();
        return;
    }
    
    // Request microphone permission first
    try {
        feedback.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Đang yêu cầu quyền microphone...</div>';
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed to get permission
        stream.getTracks().forEach(track => track.stop());
        
        feedback.innerHTML = '<div class="alert alert-success"><i class="fas fa-check"></i> Đã cấp quyền! Bắt đầu nhận diện...</div>';
        
    } catch (error) {
        console.error('Microphone permission error:', error);
        feedback.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> 
                <strong>Không thể truy cập microphone!</strong>
                <br><br>
                <strong>Hướng dẫn cấp quyền:</strong>
                <ol class="text-start mt-2 mb-0">
                    <li>Nhấn vào biểu tượng 🔒 hoặc <i class="fas fa-info-circle"></i> trên thanh địa chỉ</li>
                    <li>Tìm mục "Microphone" hoặc "Mic"</li>
                    <li>Chọn "Allow" hoặc "Cho phép"</li>
                    <li>Tải lại trang và thử lại</li>
                </ol>
                <small class="text-muted mt-2 d-block">Lỗi: ${error.message}</small>
            </div>
        `;
        return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW'; // Taiwanese Mandarin
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        isRecording = true;
        recordBtn.innerHTML = `
            <i class="fas fa-stop-circle fa-2x"></i>
            <div class="mt-2">Đang nghe...</div>
        `;
        recordBtn.classList.remove('btn-danger');
        recordBtn.classList.add('btn-warning');
        feedback.innerHTML = '<div class="alert alert-info"><i class="fas fa-microphone"></i> Đang lắng nghe... Hãy nói rõ ràng!</div>';
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        const confidence = event.results[0][0].confidence;
        
        console.log('🎤 Recognized:', transcript, 'Confidence:', confidence);
        
        checkSpeechResult(transcript, confidence);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = '';
        let showAlert = true;
        
        switch(event.error) {
            case 'not-allowed':
            case 'permission-denied':
                errorMessage = `
                    <strong>Quyền microphone bị từ chối!</strong>
                    <br><br>
                    <strong>Hướng dẫn cấp quyền:</strong>
                    <ol class="text-start mt-2 mb-0">
                        <li>Nhấn vào biểu tượng 🔒 trên thanh địa chỉ</li>
                        <li>Tìm "Microphone" và chọn "Allow"</li>
                        <li>Tải lại trang (F5) và thử lại</li>
                    </ol>
                `;
                break;
            case 'aborted':
                // User stopped it, don't show error
                console.log('⚠️ Recognition aborted by user');
                showAlert = false;
                break;
            case 'no-speech':
                errorMessage = 'Không nghe thấy giọng nói. Vui lòng nói rõ hơn và thử lại!';
                break;
            case 'audio-capture':
                errorMessage = 'Không tìm thấy microphone. Vui lòng kiểm tra thiết bị!';
                break;
            case 'network':
                errorMessage = 'Lỗi kết nối mạng. Nhận diện giọng nói cần internet. Vui lòng kiểm tra kết nối!';
                break;
            default:
                errorMessage = `Lỗi nhận diện: ${event.error}`;
                // Don't show alerts for minor errors
                if (event.error === 'service-not-allowed' || event.error === 'language-not-supported') {
                    showAlert = true;
                } else {
                    console.warn('⚠️ Minor recognition error:', event.error);
                    showAlert = false;
                }
        }
        
        if (showAlert && feedback) {
            feedback.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> 
                    ${errorMessage}
                </div>
            `;
        }
        
        stopRecording();
    };
    
    recognition.onend = () => {
        stopRecording();
    };
    
    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start recognition:', error);
        feedback.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> 
                Không thể khởi động nhận diện giọng nói: ${error.message}
            </div>
        `;
    }
}

function stopRecording() {
    isRecording = false;
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
        recordBtn.innerHTML = `
            <i class="fas fa-microphone fa-2x"></i>
            <div class="mt-2">Nhấn để nói</div>
        `;
        recordBtn.classList.remove('btn-warning');
        recordBtn.classList.add('btn-danger');
    }
    if (recognition) {
        recognition.stop();
    }
}

function checkSpeechResult(transcript, confidence) {
    const feedback = document.getElementById('speakingFeedback');
    const correctAnswer = window.currentCorrectTraditional;
    const correctPinyin = window.currentCorrectPinyin;
    
    // Check if transcript matches the traditional Chinese or pinyin
    const isCorrect = transcript.includes(correctAnswer) || 
                     transcript.toLowerCase().includes(correctPinyin.toLowerCase());
    
    const confidencePercent = Math.round(confidence * 100);
    
    if (isCorrect || confidencePercent > 60) {
        feedback.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> Tuyệt vời! 
                <br>Bạn nói: <strong>${transcript}</strong>
                <br><small class="text-muted mt-2 d-block">Đang chuyển sang từ tiếp theo...</small>
            </div>
        `;
        playSound('correct');
        correctAnswers++;
        
        userAnswers.push({
            word: practiceWords[currentQuestionIndex],
            correct: true
        });
        
        // Auto next question after 1.5 seconds if correct
        setTimeout(() => {
            if (currentQuestionIndex < practiceWords.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                // Show finish button if this is the last question
                showResults();
            }
        }, 1500);
        
    } else {
        // Disable record button temporarily
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.disabled = true;
            recordBtn.classList.add('disabled');
            
            // Countdown from 3 to 1
            let countdown = 3;
            recordBtn.innerHTML = `
                <i class="fas fa-lock fa-2x"></i>
                <div class="mt-2">Chờ ${countdown}s...</div>
            `;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    recordBtn.innerHTML = `
                        <i class="fas fa-lock fa-2x"></i>
                        <div class="mt-2">Chờ ${countdown}s...</div>
                    `;
                } else {
                    clearInterval(countdownInterval);
                    recordBtn.disabled = false;
                    recordBtn.classList.remove('disabled');
                    recordBtn.innerHTML = `
                        <i class="fas fa-microphone fa-2x"></i>
                        <div class="mt-2">Nhấn để nói</div>
                    `;
                }
            }, 1000);
        }
        
        feedback.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-info-circle"></i> Thử lại!
                <br>Bạn nói: <strong>${transcript}</strong>
                <br>Đáp án đúng: <strong>${correctAnswer}</strong> (${correctPinyin})
                <br><small class="text-success mt-2 d-block">💡 Nghe lại phát âm mẫu và thử lần nữa sau 3 giây!</small>
            </div>
        `;
        playSound('wrong');
        wrongAnswers++;
        
        userAnswers.push({
            word: practiceWords[currentQuestionIndex],
            correct: false
        });
        
        // Play the correct pronunciation again to help user
        setTimeout(() => {
            speakWord(correctPinyin || correctAnswer);
        }, 1000);
    }
}

// ===== ACHIEVEMENT NOTIFICATIONS =====
function showAchievementNotifications(achievements) {
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-content">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-details">
                        <div class="achievement-title">🎉 Thành tích mới!</div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                        <div class="achievement-rarity rarity-${achievement.rarity}">${getRarityText(achievement.rarity)}</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }, index * 6000); // Stagger notifications
    });
}

function getRarityText(rarity) {
    const rarityMap = {
        common: 'Phổ Biến',
        rare: 'Hiếm',
        epic: 'Sử Thi',
        legendary: 'Huyền Thoại'
    };
    return rarityMap[rarity] || rarity;
}
