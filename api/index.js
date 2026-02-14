require("dotenv").config();

const express = require('express');
const cors = require('cors');
const promptsRouter = require('./routes/prompts');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); // 🔥 Connect DB

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/prompts', promptsRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'PromptCart API is running' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ PromptCart API Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
