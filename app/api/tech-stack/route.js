// app/api/tech-stack/route.js
import { fetchUserTechStack } from "@/app/lib/githubTechStack";
import { convertToPercentage } from "@/app/lib/convertToPercentage";

export async function POST(req) {
  try {
    const { username } = await req.json();
    if (!username) {
      return Response.json({ error: "Username required" }, { status: 400 });
    }

    const techBytes = await fetchUserTechStack(username);
    const techPercentage = convertToPercentage(techBytes);

    return Response.json({
      success: true,
      techStack: techPercentage, // ✅ percentages
    });
  } catch (err) {
    console.error("Tech stack error:", err);
    return Response.json(
      { error: "Failed to fetch tech stack" },
      { status: 500 }
    );
  }
}
