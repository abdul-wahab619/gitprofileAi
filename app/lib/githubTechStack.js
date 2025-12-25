// app/lib/githubTechStack.js
export async function fetchUserTechStack(username) {
  if (!username) throw new Error("Username is required");

  const GITHUB_HEADERS = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "gitprofile-ai",
  };

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers: GITHUB_HEADERS }
  );

  if (!reposRes.ok) {
    console.error("Repo fetch failed:", reposRes.status);
    throw new Error("Failed to fetch repositories");
  }

  const repos = await reposRes.json();
  const techTotals = {};

  for (const repo of repos) {
    if (!repo.languages_url) continue;

    try {
      const langRes = await fetch(repo.languages_url, {
        headers: GITHUB_HEADERS,
      });
      if (!langRes.ok) continue;

      const languages = await langRes.json();

      for (const [lang, bytes] of Object.entries(languages)) {
        techTotals[lang] = (techTotals[lang] || 0) + bytes;
      }

      const name = repo.name.toLowerCase();
      const desc = (repo.description || "").toLowerCase();

      if (name.includes("react") || desc.includes("react"))
        techTotals["React"] = (techTotals["React"] || 0) + 5000;

      if (name.includes("next") || desc.includes("next"))
        techTotals["Next.js"] = (techTotals["Next.js"] || 0) + 5000;

      if (name.includes("node") || desc.includes("node"))
        techTotals["Node.js"] = (techTotals["Node.js"] || 0) + 4000;

      if (name.includes("express") || desc.includes("express"))
        techTotals["Express"] = (techTotals["Express"] || 0) + 4000;
    } catch {
      continue;
    }
  }

  return techTotals;
}

export async function fetchRepoWiseTech(owner, repo) {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
    };

    // OPTIONAL but RECOMMENDED (to avoid rate limit)
    if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
    }

    const reposRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!reposRes.ok) {
      console.log("GitHub API Error:", reposRes.status);
      return null; // ❗ crash mat hone do
    }

    const repoData = await reposRes.json();

    // Language API
    const langRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers }
    );

    const languages = langRes.ok ? await langRes.json() : {};

    return {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      languages: Object.keys(languages),
    };
  } catch (error) {
    console.error("fetchRepoWiseTech error:", error);
    return null;
  }
}
