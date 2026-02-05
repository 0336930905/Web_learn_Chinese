# 🔌 API Design - Multi-User Architecture

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🔐 Auth Endpoints

### 1. Register
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "learner123",
  "displayName": "John Doe"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "learner123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "learner123",
      "displayName": "John Doe",
      "avatar": "https://..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Logout
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer <token>`

### 4. Refresh Token
```http
POST /api/auth/refresh
```
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Forgot Password
```http
POST /api/auth/forgot-password
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 6. Reset Password
```http
POST /api/auth/reset-password
```
**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

---

## 👤 User Endpoints

### 1. Get Current User
```http
GET /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "learner123",
    "displayName": "John Doe",
    "avatar": "https://...",
    "createdAt": "2026-02-01T10:00:00Z",
    "preferences": {
      "theme": "light",
      "language": "vi",
      "dailyGoal": 20,
      "notifications": true
    },
    "stats": {
      "totalWords": 150,
      "totalWordSets": 5,
      "studyStreak": 7,
      "level": "intermediate"
    }
  }
}
```

### 2. Update Profile
```http
PUT /api/users/me
```
**Request Body:**
```json
{
  "displayName": "John Smith",
  "preferences": {
    "theme": "dark",
    "dailyGoal": 30
  }
}
```

### 3. Change Password
```http
PUT /api/users/password
```
**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### 4. Upload Avatar
```http
POST /api/users/avatar
```
**Content-Type:** `multipart/form-data`
**Body:** `avatar` (file)

### 5. Delete Account
```http
DELETE /api/users/me
```
**Request Body:**
```json
{
  "password": "SecurePass123!",
  "confirmation": "DELETE"
}
```

---

## 📚 Word Sets Endpoints

### 1. Get All Word Sets (User's)
```http
GET /api/wordsets
```
**Query Params:**
- `page=1` (default)
- `limit=20` (default)
- `sort=createdAt` (or `name`, `wordCount`)
- `order=desc` (or `asc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "wordSets": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "HSK Level 1",
        "description": "Basic vocabulary for beginners",
        "category": "beginner",
        "isPublic": true,
        "wordCount": 150,
        "tags": ["hsk", "beginner"],
        "createdAt": "2026-02-01T10:00:00Z",
        "stats": {
          "totalWords": 150,
          "masteredWords": 45,
          "learningWords": 105
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 50,
      "limit": 20
    }
  }
}
```

### 2. Create Word Set
```http
POST /api/wordsets
```
**Request Body:**
```json
{
  "name": "Du lịch Đài Loan",
  "description": "Từ vựng cho chuyến đi Đài Loan",
  "category": "travel",
  "isPublic": false,
  "tags": ["travel", "taiwan", "beginner"]
}
```

### 3. Get Word Set Details
```http
GET /api/wordsets/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "HSK Level 1",
    "description": "Basic vocabulary",
    "category": "beginner",
    "isPublic": true,
    "wordCount": 150,
    "tags": ["hsk", "beginner"],
    "owner": {
      "id": "user123",
      "username": "learner123",
      "displayName": "John Doe"
    },
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-02T15:30:00Z",
    "stats": {
      "totalWords": 150,
      "masteredWords": 45,
      "learningWords": 105
    }
  }
}
```

### 4. Update Word Set
```http
PUT /api/wordsets/:id
```
**Request Body:**
```json
{
  "name": "HSK Level 1 - Updated",
  "description": "New description",
  "isPublic": true
}
```

### 5. Delete Word Set
```http
DELETE /api/wordsets/:id
```

### 6. Clone Word Set
```http
POST /api/wordsets/:id/clone
```
**Response:** Returns the newly created cloned word set

### 7. Get Public Word Sets
```http
GET /api/wordsets/public
```
**Query Params:**
- `search=hsk` (search in name/description)
- `category=beginner`
- `tags=hsk,beginner`
- `sort=popular` (or `recent`, `wordCount`)
- `page=1`
- `limit=20`

---

## 📝 Words Endpoints

### 1. Get Words in Word Set
```http
GET /api/wordsets/:wordSetId/words
```
**Query Params:**
- `page=1`
- `limit=50`
- `search=你好` (search in all fields)
- `difficulty=1-5` (range)

**Response:**
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "id": "word123",
        "traditional": "你好",
        "simplified": "你好",
        "pinyin": "nǐ hǎo",
        "zhuyin": "ㄋㄧˇ ㄏㄠˇ",
        "vietnamese": "xin chào",
        "english": "hello",
        "category": "greeting",
        "difficulty": 1,
        "examples": [
          {
            "sentence": "你好嗎？",
            "translation": "Bạn khỏe không?",
            "pinyin": "nǐ hǎo ma?"
          }
        ],
        "audio": "https://cdn.example.com/audio/nihao.mp3",
        "image": "https://cdn.example.com/images/hello.jpg",
        "notes": "Cách chào hỏi phổ biến nhất",
        "userProgress": {
          "masteryLevel": 75,
          "reviewCount": 10,
          "lastReviewed": "2026-02-02T10:00:00Z",
          "nextReview": "2026-02-05T10:00:00Z"
        }
      }
    ],
    "pagination": {...}
  }
}
```

### 2. Add Word to Word Set
```http
POST /api/wordsets/:wordSetId/words
```
**Request Body:**
```json
{
  "traditional": "謝謝",
  "simplified": "谢谢",
  "pinyin": "xiè xie",
  "zhuyin": "ㄒㄧㄝˋ ㄒㄧㄝ˙",
  "vietnamese": "cảm ơn",
  "english": "thank you",
  "category": "greeting",
  "difficulty": 1,
  "examples": [
    {
      "sentence": "謝謝你",
      "translation": "Cảm ơn bạn",
      "pinyin": "xiè xie nǐ"
    }
  ],
  "notes": "Dùng để cảm ơn"
}
```

### 3. Get Word Details
```http
GET /api/words/:id
```

### 4. Update Word
```http
PUT /api/words/:id
```

### 5. Delete Word
```http
DELETE /api/words/:id
```

### 6. Move Word to Another Set
```http
PUT /api/words/:id/move
```
**Request Body:**
```json
{
  "targetWordSetId": "507f1f77bcf86cd799439012"
}
```

### 7. Copy Word to Another Set
```http
POST /api/words/:id/copy
```
**Request Body:**
```json
{
  "targetWordSetId": "507f1f77bcf86cd799439012"
}
```

### 8. Bulk Import Words
```http
POST /api/wordsets/:wordSetId/words/import
```
**Content-Type:** `multipart/form-data`
**Body:** `file` (CSV, JSON, or Excel)

**CSV Format:**
```csv
traditional,simplified,pinyin,zhuyin,vietnamese,english,difficulty
你好,你好,nǐ hǎo,ㄋㄧˇ ㄏㄠˇ,xin chào,hello,1
謝謝,谢谢,xiè xie,ㄒㄧㄝˋ ㄒㄧㄝ˙,cảm ơn,thank you,1
```

### 9. Export Words
```http
GET /api/wordsets/:wordSetId/words/export
```
**Query Params:**
- `format=csv` (or `json`, `excel`)

---

## 📋 Tests Endpoints

### 1. Get User's Tests
```http
GET /api/tests
```
**Query Params:**
- `wordSetId=xxx` (filter by word set)
- `type=flashcard` (or `multiple-choice`, `writing`)
- `page=1`
- `limit=20`

### 2. Create Test
```http
POST /api/tests
```
**Request Body:**
```json
{
  "name": "HSK 1 - Practice Test",
  "description": "Test your HSK 1 knowledge",
  "wordSetId": "507f1f77bcf86cd799439011",
  "type": "multiple-choice",
  "settings": {
    "questionCount": 20,
    "timeLimit": 600,
    "passingScore": 70,
    "randomizeQuestions": true,
    "randomizeOptions": true,
    "showCorrectAnswers": true
  },
  "isPublic": false
}
```

### 3. Get Test Details
```http
GET /api/tests/:id
```

### 4. Update Test
```http
PUT /api/tests/:id
```

### 5. Delete Test
```http
DELETE /api/tests/:id
```

### 6. Start Test (Generate Questions)
```http
POST /api/tests/:id/start
```
**Response:**
```json
{
  "success": true,
  "data": {
    "testSessionId": "session123",
    "test": {
      "id": "test123",
      "name": "HSK 1 - Practice Test",
      "timeLimit": 600
    },
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "What is the meaning of '你好'?",
        "options": [
          "Hello",
          "Goodbye",
          "Thank you",
          "Sorry"
        ],
        "wordId": "word123"
      }
    ],
    "startedAt": "2026-02-02T10:00:00Z",
    "expiresAt": "2026-02-02T10:10:00Z"
  }
}
```

### 7. Submit Test
```http
POST /api/tests/:id/submit
```
**Request Body:**
```json
{
  "testSessionId": "session123",
  "answers": [
    {
      "questionId": "q1",
      "answer": "Hello"
    },
    {
      "questionId": "q2",
      "answer": "Thank you"
    }
  ],
  "timeSpent": 540
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resultId": "result123",
    "score": 85,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "incorrectAnswers": 3,
    "timeSpent": 540,
    "passed": true,
    "details": [
      {
        "questionId": "q1",
        "userAnswer": "Hello",
        "correctAnswer": "Hello",
        "isCorrect": true,
        "word": {
          "traditional": "你好",
          "vietnamese": "xin chào"
        }
      }
    ],
    "completedAt": "2026-02-02T10:09:00Z"
  }
}
```

### 8. Get Test Results
```http
GET /api/tests/:id/results
```
**Query Params:**
- `page=1`
- `limit=10`

### 9. Get Test Result Details
```http
GET /api/test-results/:resultId
```

### 10. Clone Public Test
```http
POST /api/tests/:id/clone
```

---

## 📊 Progress & Stats Endpoints

### 1. Get User Progress for Word Set
```http
GET /api/wordsets/:wordSetId/progress
```
**Response:**
```json
{
  "success": true,
  "data": {
    "wordSetId": "507f1f77bcf86cd799439011",
    "totalWords": 150,
    "wordsProgress": [
      {
        "wordId": "word123",
        "masteryLevel": 75,
        "reviewCount": 10,
        "correctCount": 8,
        "incorrectCount": 2,
        "lastReviewed": "2026-02-02T10:00:00Z",
        "nextReview": "2026-02-05T10:00:00Z"
      }
    ],
    "stats": {
      "masteredWords": 45,
      "learningWords": 85,
      "newWords": 20,
      "averageMastery": 58
    }
  }
}
```

### 2. Update Word Progress
```http
POST /api/progress/word
```
**Request Body:**
```json
{
  "wordId": "word123",
  "isCorrect": true,
  "reviewType": "flashcard"
}
```

### 3. Get User Statistics
```http
GET /api/users/me/stats
```
**Query Params:**
- `period=week` (or `month`, `year`, `all`)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalWords": 350,
      "totalWordSets": 8,
      "totalTests": 15,
      "studyStreak": 12,
      "level": "intermediate"
    },
    "thisWeek": {
      "wordsLearned": 25,
      "wordsReviewed": 120,
      "testsCompleted": 3,
      "studyTime": 320
    },
    "chartData": {
      "dailyProgress": [
        {
          "date": "2026-02-01",
          "wordsLearned": 5,
          "reviewCount": 20,
          "studyTime": 45
        }
      ]
    },
    "weakWords": [
      {
        "wordId": "word123",
        "traditional": "你好",
        "masteryLevel": 35,
        "incorrectCount": 8
      }
    ]
  }
}
```

### 4. Get Words Due for Review (SRS)
```http
GET /api/progress/due
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalDue": 25,
    "words": [
      {
        "wordId": "word123",
        "traditional": "你好",
        "wordSetName": "HSK Level 1",
        "dueAt": "2026-02-02T10:00:00Z",
        "masteryLevel": 65
      }
    ]
  }
}
```

### 5. Update Study Streak
```http
POST /api/progress/streak
```

---

## 🔔 Notifications Endpoints

### 1. Get Notifications
```http
GET /api/notifications
```

### 2. Mark as Read
```http
PUT /api/notifications/:id/read
```

### 3. Delete Notification
```http
DELETE /api/notifications/:id
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalidemail"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - 400
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `CONFLICT` - 409 (e.g., email already exists)
- `RATE_LIMIT_EXCEEDED` - 429
- `INTERNAL_ERROR` - 500

---

## Rate Limiting

- **Anonymous**: 20 requests/minute
- **Authenticated**: 100 requests/minute
- **Premium**: 500 requests/minute

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643875200
```

---

## Pagination

All list endpoints support pagination:

**Query Params:**
- `page=1` (default)
- `limit=20` (default, max: 100)

**Response:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "limit": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhooks (Future)

For premium users to receive real-time updates:
- User progress milestones
- New public word sets in followed categories
- Study reminders
- Achievement unlocked

---

**Version**: 2.0.0
**Last Updated**: 02/02/2026
