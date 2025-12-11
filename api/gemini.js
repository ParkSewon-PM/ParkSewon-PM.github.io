import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Vercel 금고(환경변수)에서 키를 꺼냅니다.
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  // 2. 질문자님이 쓰시던 모델(2.5 flash preview) 설정
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

  try {
    const { prompt } = req.body;
    
    // 3. 구글에게 질문
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. 결과 텍스트만 깔끔하게 프론트로 전달
    res.status(200).json({ text });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch response" });
  }
}
