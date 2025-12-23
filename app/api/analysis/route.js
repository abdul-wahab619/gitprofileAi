import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { repoDetails, username } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-09-2025" });
+++++
    const prompt = `
      You are a Senior Open Source Maintainer and Career Mentor. 
      Analyze this specific GitHub repository brutally honestly.

      Repository Info:
      - Name: ${repoDetails.name}
      - Description: ${repoDetails.description || "No description provided"}
      - Tech Stack: ${repoDetails.language || "Unknown"}
      - Topics: ${repoDetails.topics?.join(", ") || "None"}
      - Stats: ${repoDetails.stars} Stars, ${repoDetails.forks} Forks

      Generate a FULL REPORT in clean Markdown with these sections:

      1. REPOSITORY OVERVIEW
      - Health Score (0-10)
      - Is it production-ready? (Yes / No / Almost)
      - Tech stack evaluation (Is it modern?)

      2. DOCUMENTATION & README QUALITY
      - Rating (Poor / Average / Good / Excellent)
      - Missing sections (Check for: Screenshots, Demo Link, Tests, CI/CD, License, CONTRIBUTING.md)

      3. CODE STRUCTURE & BRANDING
      - Predicted code quality (Beginner / Intermediate / Advanced)
      - Suggestions for better folder structure

      4. 48-HOUR ENHANCEMENT CHECKLIST
      [ ] List exactly what needs to be added first

      5. ACTIONABLE ROADMAP
      - Next 7 Days: Practical steps
      - Next 30 Days: High impact changes for career

      Tone: Honest, mentor-like, no fluff.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "AI model error. Try using 'gemini-pro' if flash is unavailable." },
      { status: 500 }
    );
  }
}