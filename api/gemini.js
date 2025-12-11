import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // ----------------------------------------------------
  // 1. CORS 설정 (GitHub Pages 등 외부 요청 허용)
  // ----------------------------------------------------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 브라우저의 사전 확인(OPTIONS) 요청이면 바로 OK 응답
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ----------------------------------------------------
  // 2. [진단용] 로그 출력 (Vercel Logs 탭에서 확인 가능)
  // ----------------------------------------------------
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("========== [DIAGNOSIS START] ==========");
  console.log("1. Node Environment:", process.env.NODE_ENV);
  // 보안상 키 전체를 찍지 않고, 존재 여부와 길이만 확인합니다.
  if (apiKey) {
    console.log(`2. API Key Status: ✅ Found (Length: ${apiKey.length})`);
  } else {
    console.log("2. API Key Status: ❌ Missing / Undefined");
  }
  console.log("=======================================");

  // ----------------------------------------------------
  // 3. 에러 처리 및 AI 요청 로직
  // ----------------------------------------------------
  try {
    // 키가 없으면 여기서 강제로 에러를 발생시킵니다.
    if (!apiKey) {
      throw new Error("API Key is missing in Vercel Environment Variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 사용자가 지정한 모델 (gemini-2.5-flash-preview-09-2025)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const { prompt } = req.body;

    if (!prompt) {
      throw new Error("Prompt is missing in request body");
    }

    // 구글에게 질문 요청
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 성공 시 결과 반환
    res.status(200).json({ text });

  } catch (error) {
    console.error("API Processing Error:", error);
    
    // 에러 내용을 구체적으로 반환 (디버깅 용도)
    res.status(500).json({ 
      error: error.message || "Unknown Server Error",
      details: "Check Vercel Function Logs for more info."
    });
  }
}
