"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AccessCode {
  id: string;
  code: string;
  status: string;
  etsy_order_id: string | null;
  design_id: string | null;
  created_at: string;
  activated_at: string | null;
}

const STATUS_TABS = ["all", "unused", "active", "completed", "expired"] as const;

const STATUS_COLORS: Record<string, string> = {
  unused: "bg-slate-100 text-slate-600 border border-slate-300",
  active: "bg-blue-100 text-blue-700 border border-blue-300",
  completed: "bg-green-100 text-green-700 border border-green-300",
  expired: "bg-red-100 text-red-700 border border-red-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Generate codes panel state
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateCount, setGenerateCount] = useState("10");
  const [generating, setGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/codes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch codes");

      const data = await res.json();
      setCodes(data.codes);
      setTotal(data.total);
    } catch {
      setError("Failed to load access codes");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  async function handleGenerate() {
    setGenerating(true);
    setGeneratedCodes([]);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/codes/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: parseInt(generateCount, 10) || 10 }),
      });

      if (!res.ok) throw new Error("Failed to generate codes");

      const data = await res.json();
      setGeneratedCodes(data.codes);
      fetchCodes();
    } catch {
      setError("Failed to generate codes");
    } finally {
      setGenerating(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function copyAllGenerated() {
    navigator.clipboard.writeText(generatedCodes.join("\n"));
    setCopiedCode("__all__");
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Access Codes</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and generate access codes for customers
          </p>
        </div>
        <Button
          onClick={() => {
            setShowGenerate(true);
            setGeneratedCodes([]);
          }}
        >
          Generate Codes
        </Button>
      </div>

      {/* Generate Codes Panel */}
      {showGenerate && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Generate New Codes
            </h3>
            <button
              onClick={() => setShowGenerate(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-end gap-4">
            <div className="w-48">
              <Input
                label="Number of codes"
                type="number"
                value={generateCount}
                onChange={(e) => setGenerateCount(e.target.value)}
                placeholder="10"
              />
            </div>
            <Button onClick={handleGenerate} loading={generating}>
              Generate
            </Button>
          </div>

          {generatedCodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600 font-medium">
                  Generated {generatedCodes.length} codes successfully
                </p>
                <button
                  onClick={copyAllGenerated}
                  className="text-sm text-stone-600 hover:text-stone-900 font-medium transition"
                >
                  {copiedCode === "__all__" ? "Copied!" : "Copy All"}
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {generatedCodes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-1.5 text-sm"
                    >
                      <code className="text-slate-800 font-mono text-xs">
                        {code}
                      </code>
                      <button
                        onClick={() => copyCode(code)}
                        className="ml-2 text-slate-400 hover:text-slate-700 transition"
                      >
                        {copiedCode === code ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                statusFilter === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-xs">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Etsy Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Design ID</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-left px-4 py-3 font-medium">Activated</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No codes found
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr
                    key={code.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-slate-900 font-mono text-sm">
                        {code.code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_COLORS[code.status] || STATUS_COLORS.unused
                        }`}
                      >
                        {code.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {code.etsy_order_id || (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {code.design_id ? (
                        <span className="font-mono text-xs">
                          {code.design_id.slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDate(code.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {code.activated_at ? (
                        formatDate(code.activated_at)
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => copyCode(code.code)}
                        className="text-stone-500 hover:text-stone-800 transition text-xs font-medium"
                        title="Copy code"
                      >
                        {copiedCode === code.code ? (
                          <span className="text-green-600">Copied!</span>
                        ) : (
                          "Copy"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1}
              {"\u2013"}
              {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
