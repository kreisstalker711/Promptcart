const express = require('express');
const cors = require('cors');
const promptsRouter = require('./routes/prompts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for Vercel
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
// Mounts the prompts router to /prompts (or /api/prompts depending on Vercel config)
app.use('/prompts', promptsRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'PromptCart API is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ PromptCart API Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;