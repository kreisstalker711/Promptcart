const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Pages
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/login", (_, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/settings", (_, res) => res.sendFile(path.join(__dirname, "settings.html")));
app.get("/templates", (_, res) => res.sendFile(path.join(__dirname, "templates.html")));
app.get("/generate", (_, res) => res.sendFile(path.join(__dirname, "generate.html")));

// API
app.post("/api/generate", (req, res) => {
  const { role, domain, objective, targetAudience, tone, constraints } = req.body;

  if (!objective) {
    return res.status(400).json({ error: "Objective is required" });
  }

  const prompt = `
Act as a world-class ${role || "Expert"}.

DOMAIN:
${domain || "General"}

OBJECTIVE:
${objective}

TARGET AUDIENCE:
${targetAudience || "General"}

STYLE:
Tone: ${tone || "Professional"}
Constraints: ${constraints || "None"}

RULES:
- Be clear and structured
- Avoid vague responses
- Follow industry best practices

OUTPUT:
Deliver the final result clearly and professionally.
`;

  res.json({ prompt });
});

app.listen(PORT, () => {
  console.log(`🚀 PromptCart running at http://localhost:${PORT}`);
});
