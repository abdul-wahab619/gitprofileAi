import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { repoDetails, username } = await req.json();

    if (!repoDetails) {
      return NextResponse.json({ error: "Repo details are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Aapka customized prompt (Specific to the Repository)
    const prompt = `
      You are a Senior Open Source Maintainer and Career Mentor. 
      Analyze this specific GitHub repository:
      
      Repo Name: ${repoDetails.name}
      Owner: ${username}
      Description: ${repoDetails.description || "No description"}
      Main Language: ${repoDetails.language}
      Stars: ${repoDetails.stars} | Forks: ${repoDetails.forks}
      Topics: ${repoDetails.topics?.join(", ") || "None"}

      Generate a BRUTALLY HONEST report in Markdown format with these sections:
      1. REPOSITORY SCORE (0-10): Based on production-readiness.
      2. TECH STACK EVALUATION: Is it modern? Any missing essential tools?
      3. README QUALITY: (Poor / Average / Good / Excellent).
      4. IMPROVEMENT CHECKLIST:
         - [ ] Performance optimizations
         - [ ] Tests/CI/CD
         - [ ] License/Docs
      5. ACTIONABLE ROADMAP: 3 clear steps to improve this repo in the next 7 days.

      Tone: Professional, mentor-like, and specific. Return clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 });
  }
}