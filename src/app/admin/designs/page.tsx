"use client";

import { useState, useEffect, useCallback } from "react";

interface Design {
  id: string;
  template: string;
  palette: string | null;
  font: string | null;
  content: {
    name1?: string;
    name2?: string;
    date?: string;
    venue?: string;
    [key: string]: unknown;
  } | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  access_codes: {
    code: string;
    couple_names: string | null;
  } | null;
}

const TEMPLATE_OPTIONS = [
  { value: "", label: "All Templates" },
  { value: "classic-elegance", label: "Classic Elegance" },
  { value: "modern-minimalist", label: "Modern Minimalist" },
  { value: "romantic-garden", label: "Romantic Garden" },
  { value: "rustic-charm", label: "Rustic Charm" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [templateFilter, setTemplateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (templateFilter) params.set("template", templateFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/designs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch designs");

      const data = await res.json();
      setDesigns(data.designs);
      setTotal(data.total);
    } catch {
      setError("Failed to load designs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, templateFilter, search]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  useEffect(() => {
    setPage(1);
  }, [templateFilter, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Designs</h2>
        <p className="text-slate-500 text-sm mt-1">
          Browse all invitation designs created by customers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by names..."
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="w-52">
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {TEMPLATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
                <th className="text-left px-4 py-3 font-medium">Design ID</th>
                <th className="text-left px-4 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Palette</th>
                <th className="text-left px-4 py-3 font-medium">Font</th>
                <th className="text-left px-4 py-3 font-medium">Names</th>
                <th className="text-left px-4 py-3 font-medium">PDF</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Loading designs...
                  </td>
                </tr>
              ) : designs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No designs found. Try adjusting your search or filter criteria.
                  </td>
                </tr>
              ) : (
                designs.map((design) => (
                  <tbody key={design.id}>
                    <tr
                      onClick={() =>
                        setExpandedId(expandedId === design.id ? null : design.id)
                      }
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-700">
                          {design.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {design.template || (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {design.palette || (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {design.font || (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {design.content?.name1 && design.content?.name2 ? (
                          <span>
                            {design.content.name1} &amp; {design.content.name2}
                          </span>
                        ) : design.content?.name1 ? (
                          design.content.name1
                        ) : (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {design.pdf_url ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                            Generated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-300">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(design.created_at)}
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedId === design.id && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50 px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-900">
                                Design Details
                              </h4>
                              <div className="space-y-1.5">
                                <p>
                                  <span className="font-medium text-slate-600">Full ID:</span>{" "}
                                  <code className="text-xs font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                    {design.id}
                                  </code>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">Template:</span>{" "}
                                  <span className="text-slate-700">{design.template || "N/A"}</span>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">Palette:</span>{" "}
                                  <span className="text-slate-700">{design.palette || "N/A"}</span>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">Font:</span>{" "}
                                  <span className="text-slate-700">{design.font || "N/A"}</span>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">Created:</span>{" "}
                                  <span className="text-slate-700">{formatDateTime(design.created_at)}</span>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">Updated:</span>{" "}
                                  <span className="text-slate-700">{formatDateTime(design.updated_at)}</span>
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-900">Content</h4>
                              {design.content ? (
                                <pre className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 overflow-auto max-h-48">
                                  {JSON.stringify(design.content, null, 2)}
                                </pre>
                              ) : (
                                <p className="text-slate-400">No content data</p>
                              )}

                              {design.access_codes && (
                                <div className="space-y-1.5">
                                  <h4 className="font-semibold text-slate-900">Access Code</h4>
                                  <p>
                                    <span className="font-medium text-slate-600">Code:</span>{" "}
                                    <code className="text-xs font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      {design.access_codes.code}
                                    </code>
                                  </p>
                                  {design.access_codes.couple_names && (
                                    <p>
                                      <span className="font-medium text-slate-600">Couple:</span>{" "}
                                      <span className="text-slate-700">{design.access_codes.couple_names}</span>
                                    </p>
                                  )}
                                </div>
                              )}

                              {design.pdf_url && (
                                <p>
                                  <span className="font-medium text-slate-600">PDF URL:</span>{" "}
                                  <a
                                    href={design.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 underline text-xs break-all"
                                  >
                                    {design.pdf_url}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
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
