import { ResearchBrief } from "./research";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "MOCK_KEY";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GeneratedScriptPayload {
  hook: string;
  body: string[];
  cta: string;
  duration_estimate: number;
}

export async function generateScript(
  brief: ResearchBrief,
  style: string,
  durationValue: string,
  durationUnit: string,
  platforms: string[],
  qaFeedback?: string // Used during retries
): Promise<GeneratedScriptPayload> {
  console.log(`Generating script for topic: ${brief.topic}...`);

  if (GROQ_API_KEY === "MOCK_KEY") {
    return {
      hook: "Did you know this crazy fact?",
      body: [
        brief.verified_facts[0]?.claim || "Fact 1",
        "This changes everything about how we see the industry."
      ],
      cta: "Follow for more updates!",
      duration_estimate: 25
    };
  }

  let prompt = `
You are an expert short-form video scriptwriter. 
Generate a script constrained strictly to the facts provided in the research brief.

Research Brief:
${JSON.stringify(brief, null, 2)}

Style/Tone: ${style}
Target Platforms: ${platforms.join(", ")}
Target Campaign Length: ${durationValue} ${durationUnit} (This is the campaign length, but the video should be short-form, ~15-60s).

Output strictly in JSON format matching this schema:
{
  "hook": "first 2-3 seconds — the pattern-interrupt line",
  "body": ["segment 1 text", "segment 2 text", "segment 3 text"],
  "cta": "closing line / call to action",
  "duration_estimate": 30 // estimated seconds
}
  `;

  if (qaFeedback) {
    prompt += `\n\nCRITICAL FEEDBACK FROM PREVIOUS ATTEMPT:\nThe previous script failed QA. Reason: ${qaFeedback}\nDO NOT make the same mistake. Fix the issues mentioned above.`;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are a helpful JSON-only scriptwriter." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    return JSON.parse(content) as GeneratedScriptPayload;
  } catch (error) {
    console.error("Failed to generate script:", error);
    throw error;
  }
}
