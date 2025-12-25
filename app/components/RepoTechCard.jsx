"use client";

export default function RepoTechCard({ repo }) {
  if (!repo?.tech || repo.tech.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-400">
        <h3 className="text-lg font-semibold">{repo.name}</h3>
        <p className="text-sm mt-2">
          No tech stack data available for this repository.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{repo.name}</h3>
        {repo.description && (
          <p className="text-sm text-gray-400">{repo.description}</p>
        )}
      </div>

    <div className="space-y-2">
  {repo.tech.slice(0, 5).map((t, index) => (
    <div key={`${t.name}-${index}`}>
      <div className="flex justify-between text-sm">
        <span>{t.name}</span>
        <span>{t.percent}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full">
        <div
          className="h-2 rounded-full bg-indigo-500"
          style={{ width: `${t.percent}%` }}
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
