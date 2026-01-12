"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import Layout from "@/app/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/Card";

import RepoTechCard from "../../../../components/RepoTechCard";
import RepoCommitAnalytics from "../../../../components/RepoCommitAnalytics";

import {
  ArrowLeft,
  Code,
  TrendingUp,
  CheckCircle,
  Loader2,
} from "lucide-react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RepoDetailPage() {
  const { repo } = useParams();
  const router = useRouter();

  const [repoData, setRepoData] = useState(null);
  const [scores, setScores] = useState(null);
  const [sections, setSections] = useState(null);
  const [commitWeeks, setCommitWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Commits
  // -------------------------------
  const fetchCommits = async (repoName, username) => {
    try {
      const res = await fetch(`/api/repo-commits/${repoName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const json = await res.json();
      if (json.pending) {
        setTimeout(() => fetchCommits(repoName, username), 3000);
        return;
      }

      setCommitWeeks(Array.isArray(json.weeks) ? json.weeks : []);
    } catch {
      setCommitWeeks([]);
    }
  };

  // -------------------------------
  // AI
  // -------------------------------
  const fetchAI = async (repoDetails) => {
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoDetails }),
      });

      if (!res.ok) throw new Error("AI failed");

      const data = await res.json();
      if (!data?.scores) throw new Error("Invalid AI response");

      setScores(data.scores);
      setSections(data.sections);

      localStorage.setItem(
        `analysis-${repoDetails.name}`,
        JSON.stringify(data)
      );
    } catch {
      setSections({
        verdict:
          "AI analysis is temporarily unavailable due to rate limits. Showing repository data only.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // INIT
  // -------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const saved = localStorage.getItem("githubData");
        if (!saved) return router.push("/");

        const parsed = JSON.parse(saved);
        const repoDetails = parsed.repos?.find((r) => r.name === repo);
        if (!repoDetails) return router.push("/projects");

        fetchCommits(repoDetails.name, parsed.profile.username);

        const techRes = await fetch(`/api/repo-tech/${repoDetails.name}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: parsed.profile.username }),
        });

        const techJson = await techRes.json();
        setRepoData({
          ...repoDetails,
          tech: Array.isArray(techJson?.tech) ? techJson.tech : [],
        });

        const cacheKey = `analysis-${repoDetails.name}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          setScores(data.scores);
          setSections(data.sections);
          setLoading(false);
          return;
        }

        fetchAI(repoDetails);
      } catch {
        setLoading(false);
      }
    };

    init();
  }, [repo, router]);

  // -------------------------------
  // Loading
  // -------------------------------
  if (loading && !repoData) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  // -------------------------------
  // Scores
  // -------------------------------
  const scoreEntries = scores ? Object.entries(scores) : [];

  const RadarData =
    scores && {
      labels: scoreEntries.map(([k]) =>
        k.replace(/([A-Z])/g, " $1").trim()
      ),
      datasets: [
        {
          data: scoreEntries.map(([, v]) => v),
          fill: true,
          backgroundColor: "rgba(16,185,129,0.15)",
          borderColor: "#10b981",
        },
      ],
    };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Repo Header */}
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold flex gap-2 items-center">
              <Code /> {repoData.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {repoData.description || "No description"}
            </p>
          </CardContent>
        </Card>

        {/* Score Grid */}
        {scores && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {scoreEntries.map(([k, v]) => (
              <Card key={k}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold">{v}/10</div>
                  <div className="text-sm capitalize text-gray-500">
                    {k.replace(/([A-Z])/g, " $1")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Radar */}
        {RadarData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <TrendingUp /> Project Health Radar
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Radar data={RadarData} />
            </CardContent>
          </Card>
        )}

        {/* Verdict */}
        {sections?.verdict && (
          <Card>
            <CardHeader>
              <CardTitle>Overall Verdict</CardTitle>
            </CardHeader>
            <CardContent>{sections.verdict}</CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {sections?.areasForImprovement?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.areasForImprovement.map((item, i) => (
                <div key={i}>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 48 Hour Plan */}
        {sections?.fixPlan48h?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>48-Hour Fix Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.fixPlan48h.map((step, i) => (
                <div key={i}>
                  <span className="font-semibold text-emerald-600">
                    {step.time}:
                  </span>{" "}
                  {step.task}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Career Impact */}
        {sections?.careerImpact && (
          <Card>
            <CardHeader>
              <CardTitle>Career Impact Advice</CardTitle>
            </CardHeader>
            <CardContent>{sections.careerImpact}</CardContent>
          </Card>
        )}

        <RepoTechCard repo={repoData} />
        <RepoCommitAnalytics weeks={commitWeeks} />
      </div>
    </Layout>
  );
}
