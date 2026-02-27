"use client";

import { useState, useEffect } from "react";

export default function UsageCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => r.json())
      .then((d) => setCount(d.assessmentsCompleted || 0))
      .catch(() => setCount(0));
  }, []);

  if (count === null) return null;

  return (
    <span className="text-sm text-gray-400">
      {count > 0
        ? `${count.toLocaleString()} assessment${count !== 1 ? "s" : ""} completed`
        : "Now in early access"}
    </span>
  );
}
