// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Vercel 환경변수에서 키를 가져옵니다 (코드에 노출 X)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 2. 프론트엔드에서 보낸 메시지를 받습니다.
  // POST 요청의 body에서 prompt를 꺼냅니다.
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. 결과를 프론트엔드로 돌려줍니다.
    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing request" });
  }
}