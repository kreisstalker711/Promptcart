const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * PROMPT BUILDER FUNCTION
 */
const buildPrompt = (data) => {
    const {
        role = "General Assistant",
        domain = "General Knowledge",
        objective,
        targetAudience = "General Audience",
        tone = "Professional",
        outputFormat = "Markdown",
        constraints = "None specific"
    } = data;

    return `You are a senior ${role} with expertise in ${domain}.

Objective:
${objective}

Context:
Target audience: ${targetAudience}

Requirements:
- Tone: ${tone}
- Constraints: ${constraints}

Output format:
${outputFormat}

Quality rules:
- Be precise and actionable
- Avoid vague language
- Follow industry best practices for ${domain}`;
};

// API Route
app.post('/generate', (req, res) => {
    try {
        const { role, domain, objective, targetAudience, tone, outputFormat, constraints } = req.body;

        if (!objective) {
            return res.status(400).json({ error: "Objective is required" });
        }

        const structuredPrompt = buildPrompt({
            role,
            domain,
            objective,
            targetAudience,
            tone,
            outputFormat,
            constraints
        });

        res.json({ success: true, prompt: structuredPrompt });

    } catch (error) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
