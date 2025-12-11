import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // [수정할 곳] 따옴표("") 안에 실제 API 키를 붙여넣으세요.
    // 예: const apiKey = "AIzaSyD-12345abcdefg..."; 
    const apiKey = AIzaSyAZVONXKfdHVXPM9oDqt72yR2ni-e5_jNk"; 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 키가 제대로 들어갔는지 확인 (비어있으면 에러)
    if (!apiKey || apiKey === "여기에_API키를_붙여넣으세요") {
      throw new Error("코드에 API 키가 입력되지 않았습니다.");
    }

    // 2. Gemini 모델 호출
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 모델 이름 설정 (가장 안정적인 모델 사용)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const { prompt } = req.body;
    if (!prompt) {
      throw new Error("요청 본문에 prompt가 없습니다.");
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. 결과 반환
    res.status(200).json({ text });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      error: error.message,
      details: "서버 내부 오류입니다." 
    });
  }
}
