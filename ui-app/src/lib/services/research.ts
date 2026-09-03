const GROQ_API_KEY = process.env.GROQ_API_KEY || "MOCK_KEY";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface ResearchBrief {
  topic: string;
  verified_facts: Array<{
    claim: string;
    confidence: "high" | "medium" | "low";
  }>;
  context: string;
  angle_suggestions: string[];
}

export async function generateResearchBrief(topicTitle: string, sourceUrl: string): Promise<ResearchBrief> {
  console.log(`Generating research brief for topic: ${topicTitle}...`);

  if (GROQ_API_KEY === "MOCK_KEY") {
    // Return mock brief if no API key is provided
    return {
      topic: topicTitle,
      verified_facts: [
        { claim: "This is a mock fact derived from the source.", confidence: "high" },
        { claim: "This is an unverified rumor.", confidence: "low" }
      ],
      context: "This is mock context about why this topic matters right now.",
      angle_suggestions: ["Educational breakdown", "Quick reaction"]
    };
  }

  const prompt = `
You are a lead researcher for a content creation agency. Your job is to analyze a trending topic and extract verifiable facts.

Topic: ${topicTitle}
Source: ${sourceUrl}

Extract discrete, verifiable claims from this topic.
Perform cross-source corroboration if possible (for this exercise, use your internal knowledge cutoff to verify if the claim is historically true or highly likely).
Apply confidence scoring: "high" (verified fact), "medium" (likely true, single source), "low" (rumor or unverified).

Output strictly in JSON format matching this schema:
{
  "topic": "...",
  "verified_facts": [
    {"claim": "...", "confidence": "high|medium|low"}
  ],
  "context": "Why this matters / background",
  "angle_suggestions": ["angle 1", "angle 2"]
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
          { role: "system", content: "You are a helpful JSON-only research assistant." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    return JSON.parse(content) as ResearchBrief;
  } catch (error) {
    console.error("Failed to generate research brief:", error);
    throw error;
  }
}
