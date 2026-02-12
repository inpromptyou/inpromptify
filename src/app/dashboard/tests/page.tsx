import Link from "next/link";
import { mockTests } from "@/lib/mockData";

export default function MyTestsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Tests</h1>
          <p className="text-gray-500 text-sm mt-1">Manage assessments and track performance</p>
        </div>
        <Link href="/dashboard/create" className="bg-[#1B5B7D] hover:bg-[#14455E] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Create New Test
        </Link>
      </div>

      <div className="space-y-3">
        {mockTests.map((test) => (
          <Link
            key={test.id}
            href={`/dashboard/tests/${test.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="font-semibold text-gray-900 text-sm">{test.name}</h3>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                    test.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : test.status === "draft"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{test.description}</p>
                <div className="flex flex-wrap gap-5 text-xs text-gray-400">
                  <span>{test.candidates} candidates</span>
                  <span>Avg score: {test.avgScore || "n/a"}</span>
                  <span>{test.completionRate}% completion</span>
                  <span>{test.model}</span>
                  <span>Created {test.createdAt}</span>
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0 ml-4 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
