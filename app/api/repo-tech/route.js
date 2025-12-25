import { fetchRepoWiseTech } from "@/app/lib/githubTechStack";

export async function POST(req) {
  try {
    const { username } = await req.json();
    if (!username) {
      return Response.json(
        { success: false, repos: [] },
        { status: 400 }
      );
    }

    const repos = await fetchRepoWiseTech(username);

    return Response.json({
      success: true,
      repos, // ✅ NEVER null
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      repos: [], // ✅ SAFE DEFAULT
    });
  }
}
