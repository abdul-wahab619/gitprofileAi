"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProfileModal({ open, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (open) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then(setData);
    }
  }, [open]);

  if (!open) return null;

  if (!data) {
    return <div className="fixed inset-0 bg-black/30">Loading...</div>;
  }

  const {
    user,
    plan,
    used,
    limit,
    resetInHours,
  } = data;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[380px] p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        {/* Profile */}
        <div className="flex flex-col items-center gap-3">
          <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full" />
          <h2 className="text-lg font-bold">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Plan */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="font-semibold">Plan: {plan.toUpperCase()}</p>
          <p className="text-sm mt-1">
            Usage: {used}/{limit}
          </p>

          {used >= limit && (
            <p className="text-red-600 text-sm mt-2">
              Limit reached. Resets in {resetInHours} hours.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
