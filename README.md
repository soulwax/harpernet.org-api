# HarperNet.org Quiz Results API

Backend API for collecting and analyzing anonymous quiz results from the HarperNet.org Metabolic Exploration Game.

## 🚀 Features

- **Anonymous Data Collection**: No personal information stored
- **Cognitive Function Analysis**: Track 8 MBTI cognitive functions (Ti, Te, Fi, Fe, Ni, Ne, Si, Se)
- **Metabolic Dynamics**: Monitor 4 metabolic principles (revision, conducting, density, expansion)
- **Statistical Analytics**: Comprehensive statistics and trends
- **Geographic Insights**: Country-level distribution analysis
- **Rate Limiting**: Prevent spam and abuse
- **Secure Database**: PostgreSQL with Sequelize ORM

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Aiven 5GB free tier recommended)
- npm or yarn

## 🛠️ Installation

1. **Clone and setup:**
```bash
cd api/
npm install
```

2. **Environment configuration:**
```bash
cp .env.example .env
# Edit .env with your Aiven PostgreSQL credentials
```

3. **Database setup:**
```bash
# The database will auto-sync on first run
npm run dev
```

## 🏗️ Database Schema

### QuizResult Table
```sql
quiz_results (
  id UUID PRIMARY KEY,
  questionsAnswered INTEGER NOT NULL,
  totalQuestions INTEGER NOT NULL,
  completionTimeSeconds INTEGER NOT NULL,
  
  -- Cognitive Function Scores
  tiScore FLOAT DEFAULT 0,
  teScore FLOAT DEFAULT 0,
  fiScore FLOAT DEFAULT 0,
  feScore FLOAT DEFAULT 0,
  niScore FLOAT DEFAULT 0,
  neScore FLOAT DEFAULT 0,
  siScore FLOAT DEFAULT 0,
  seScore FLOAT DEFAULT 0,
  
  -- Metabolic Dynamic Scores
  revisionScore FLOAT DEFAULT 0,
  conductingScore FLOAT DEFAULT 0,
  densityScore FLOAT DEFAULT 0,
  expansionScore FLOAT DEFAULT 0,
  
  -- Calculated Results
  dominantFunction VARCHAR(2) NOT NULL,
  dominantScore FLOAT NOT NULL,
  secondaryFunction VARCHAR(2) NOT NULL,
  secondaryScore FLOAT NOT NULL,
  dominantDynamic VARCHAR(20) NOT NULL,
  dominantDynamicScore FLOAT NOT NULL,
  
  -- Metadata
  sessionHash VARCHAR(64),
  userAgent TEXT,
  countryCode VARCHAR(2),
  quizVersion VARCHAR(20) DEFAULT '1.0.0',
  completedAt TIMESTAMP DEFAULT NOW(),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 📡 API Endpoints

### Submit Quiz Result
```http
POST /api/quiz-results
Content-Type: application/json

{
  "questionsAnswered": 30,
  "totalQuestions": 30,
  "completionTimeSeconds": 1200,
  "functionScores": {
    "Ti": 45.5,
    "Te": 32.1,
    "Fi": 28.3,
    "Fe": 41.2,
    "Ni": 52.8,
    "Ne": 35.7,
    "Si": 29.4,
    "Se": 33.9
  },
  "dynamicScores": {
    "revision": 48.2,
    "conducting": 35.7,
    "density": 52.1,
    "expansion": 41.3
  },
  "dominantFunction": "Ni",
  "dominantScore": 52.8,
  "secondaryFunction": "Ti",
  "secondaryScore": 45.5,
  "dominantDynamic": "density",
  "dominantDynamicScore": 52.1,
  "sessionHash": "abc123...",
  "countryCode": "US",
  "quizVersion": "1.9.11"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "submitted": true
  }
}
```

### Get Statistics
```http
GET /api/quiz-results/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCompletions": 1250,
      "recentCompletions24h": 23,
      "averageCompletionTime": 1185
    },
    "functionDistribution": [
      {
        "function": "Ni",
        "count": 189,
        "percentage": "15.12"
      }
    ],
    "dynamicDistribution": [
      {
        "dynamic": "density",
        "count": 342,
        "percentage": "27.36"
      }
    ],
    "averageFunctionScores": {
      "Ti": 38.5,
      "Te": 35.2,
      "Fi": 32.8,
      "Fe": 39.1,
      "Ni": 41.3,
      "Ne": 36.7,
      "Si": 33.4,
      "Se": 35.8
    },
    "geographicDistribution": [
      {
        "country": "US",
        "count": 487,
        "percentage": "38.96"
      }
    ]
  }
}
```

### Get Analytics
```http
GET /api/quiz-results/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "functionCombinations": [
      {
        "dominant": "Ni",
        "secondary": "Ti",
        "count": 45
      }
    ],
    "dynamicFunctionCorrelations": [
      {
        "dynamic": "density",
        "function": "Ni",
        "count": 78
      }
    ],
    "completionTrends": [
      {
        "month": "2025-01-01T00:00:00.000Z",
        "completions": 234
      }
    ]
  }
}
```

## 🚦 Rate Limiting

- **Quiz Submissions**: 3 per 15 minutes per IP
- **Statistics**: 30 per minute per IP  
- **General API**: 200 per 15 minutes per IP

## 🔒 Security Features

- **CORS Protection**: Only harpernet.org domains allowed
- **Rate Limiting**: Prevents abuse and spam
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Sequelize ORM protection
- **Helmet Security**: Security headers applied
- **Anonymous Data Only**: No personal information stored

## 🌍 Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3001
NODE_ENV=production

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_QUIZ_REQUESTS=3
LOG_LEVEL=info
```

## 🚀 Deployment

### Aiven PostgreSQL Setup
1. Create free 5GB PostgreSQL instance at [Aiven.io](https://aiven.io)
2. Get connection string from Aiven console
3. Add to `DATABASE_URL` environment variable

### Production Deployment
```bash
# Install dependencies
npm install --production

# Set environment variables
export DATABASE_URL="postgresql://..."
export NODE_ENV="production"
export PORT="3001"

# Start server
npm start
```

## 📊 Usage with Frontend

### JavaScript Integration
```javascript
// Submit quiz results from MetabolicExplorationGame.jsx
const submitQuizResult = async (profileData) => {
  try {
    const response = await fetch('https://your-api-domain.com/api/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionsAnswered: answers().length,
        totalQuestions: questions.length,
        completionTimeSeconds: Math.floor((Date.now() - startTime) / 1000),
        functionScores: profileData.functions,
        dynamicScores: profileData.dynamics,
        dominantFunction: profileData.dominant[0],
        dominantScore: profileData.dominant[1],
        secondaryFunction: profileData.secondary[0],
        secondaryScore: profileData.secondary[1],
        dominantDynamic: profileData.dynamic[0],
        dominantDynamicScore: profileData.dynamic[1],
        sessionHash: generateSessionHash(),
        quizVersion: '1.9.11'
      })
    });
    
    const result = await response.json();
    console.log('Quiz result submitted:', result);
  } catch (error) {
    console.error('Failed to submit quiz result:', error);
  }
};
```

## 🔍 Monitoring

Check logs in `logs/` directory:
- `error.log` - Error messages only
- `combined.log` - All log messages

## 📈 Analytics Examples

### Most Common Function Combinations
```sql
SELECT dominant_function, secondary_function, COUNT(*) as occurrences
FROM quiz_results 
GROUP BY dominant_function, secondary_function
ORDER BY occurrences DESC
LIMIT 10;
```

### Dynamic-Function Correlations
```sql
SELECT dominant_dynamic, dominant_function, COUNT(*) as count
FROM quiz_results
GROUP BY dominant_dynamic, dominant_function
ORDER BY dominant_dynamic, count DESC;
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

GPL-3.0 - See [LICENSE](../LICENSE) for details.

---

**Built for HarperNet.org - Jung's frameworks for modern practitioners** 🧠✨