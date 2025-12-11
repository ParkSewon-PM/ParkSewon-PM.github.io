import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // ----------------------------------------------------
  // 1. CORS 설정 (GitHub Pages에서 오는 요청 허용)
  // ----------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 브라우저의 사전 확인 요청(OPTIONS)이면 바로 OK 하고 끝냄
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ----------------------------------------------------
  // 2. Gemini API 호출 로직 (Vercel 서버 내부 동작)
  // ----------------------------------------------------
  try {
    const apiKey = process.env.GEMINI_API_KEY; // 환경변수에서 키 가져옴
    
    // 키가 없는 경우 에러 처리 (안전장치)
    if (!apiKey) {
      throw new Error("API Key is missing in Vercel Environment Variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const { prompt } = req.body;

    // 구글에게 질문
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 프론트엔드에 결과 전달
    res.status(200).json({ text });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch response" });
  }
}
