import { GoogleGenAI, Type } from "@google/genai";
import { ApiProvider } from "../types";

export const checkOpenEndedAnswer = async (
  question: string,
  userAnswer: string,
  context: string,
  apiKey: string,
  provider: ApiProvider
): Promise<{ isCorrect: boolean; feedback: string }> => {
  
  if (!apiKey) {
    return {
      isCorrect: true,
      feedback: "API 키가 설정되지 않아 정답 처리되었습니다. (실제 운영 시 API Key를 입력해주세요.)"
    };
  }

  const systemPrompt = `
    Context: Database teaching material for beginners.
    Core Concept to match: ${context}
    Question: ${question}
    User Answer: "${userAnswer}"

    Task: Evaluate if the user's answer demonstrates understanding of the Core Concept.
    Output JSON only: { "isCorrect": boolean, "feedback": "Short constructive feedback in Korean (under 100 characters)" }
  `;

  try {
    if (provider === 'OPENAI') {
      return await callOpenAI(apiKey, systemPrompt);
    } else {
      return await callGemini(apiKey, systemPrompt);
    }
  } catch (error) {
    console.error("AI Service Error", error);
    return {
      isCorrect: true,
      feedback: "AI 분석 중 오류가 발생하여 정답 처리되었습니다."
    };
  }
};

async function callGemini(apiKey: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
        },
        required: ["isCorrect", "feedback"],
      },
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
}

async function callOpenAI(apiKey: string, prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Using a cost-effective model
      messages: [
        { role: "system", content: "You are a helpful database tutor. Response must be valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("No content from OpenAI");
  
  return JSON.parse(content);
}