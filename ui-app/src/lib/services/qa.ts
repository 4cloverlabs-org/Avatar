import { ResearchBrief } from "./research";
import { GeneratedScriptPayload } from "./generation";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "MOCK_KEY";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface QAResult {
  passed: boolean;
  feedback: string | null; // Null if passed, contains reason if failed
}

export async function runScriptQA(brief: ResearchBrief, script: GeneratedScriptPayload): Promise<QAResult> {
  console.log(`Running QA gate for script...`);

  if (GROQ_API_KEY === "MOCK_KEY") {
    // For local dev without API key
    return { passed: true, feedback: null };
  }

  const prompt = `
You are a strict QA evaluator for short-form video scripts.
Your job is to evaluate if the generated script is factually consistent with the provided research brief, and safe for platform publishing.

Research Brief (Ground Truth):
${JSON.stringify(brief, null, 2)}

Generated Script to Evaluate:
${JSON.stringify(script, null, 2)}

Checks:
1. Factual Consistency: Does the script invent any claims not present in the research brief? Even minor hallucinated numbers or dates are a failure.
2. Platform Safety: Does it contain profanity, restricted topics, or policy violations?

Output strictly in JSON format matching this schema:
{
  "passed": boolean,
  "feedback": "If passed, output null. If failed, output the EXACT reason why so it can be fixed."
}
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a strict JSON-only QA gate evaluator." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Low temp for strict evaluation
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    return JSON.parse(content) as QAResult;
  } catch (error) {
    console.error("Failed to run QA:", error);
    // On API failure, default to failing QA to be safe
    return { passed: false, feedback: "QA Gate API evaluation failed. Requires manual review." };
  }
}
