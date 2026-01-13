"use client";

import { signIn } from "next-auth/react";

export default function AuthRequiredModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">
          Login required
        </h2>
        <p className="text-gray-600 mb-4">
          Sign in with GitHub to analyze repositories
        </p>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-black text-white py-2 rounded"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
