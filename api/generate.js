export default function handler(req, res) {
  // ✅ CORS (important)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ DEBUG (remove later if you want)
  console.log("REQ BODY:", req.body);

  const {
    role,
    domain,
    objective,
    targetAudience,
    tone,
    constraints
  } = req.body;

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

  return res.status(200).json({ prompt });
}
