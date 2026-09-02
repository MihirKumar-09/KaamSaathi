"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import PostJobForm from "./PostJobForm";
import { AuthContext } from "@/context/AuthContext";
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  SearchX,
  Trash2,
  Power,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function PostJob() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [banner, setBanner] = useState(null);

  // Fetch employer's jobs
  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs?my=true", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.success && Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setJobs([]);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const showBanner = (text, type = "success") => {
    setBanner({ text, type });
    setTimeout(() => setBanner(null), 4000);
  };

  // Toggle Open / Closed
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      setActionLoading(jobId);
      const newStatus = currentStatus === "Open" ? "Closed" : "Open";
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
        showBanner(`Job marked as "${newStatus}"`);
      } else {
        showBanner(data.message || "Failed to update job status", "error");
      }
    } catch {
      showBanner("Error updating job", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      setActionLoading(jobId);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        showBanner("Job deleted successfully.");
      } else {
        showBanner(data.message || "Failed to delete", "error");
      }
    } catch {
      showBanner("Error deleting job", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setIsCreating(false);
    showBanner(`"${newJob.title}" published successfully!`);
  };

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Open").length;
  const totalVacancies = jobs
    .filter((j) => j.status === "Open")
    .reduce((acc, j) => acc + (Number(j.vacancy) || 1), 0);

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.category?.toLowerCase().includes(q) ||
      job.location?.city?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" || job.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <NavbarLayout role="employer" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Banner */}
        {banner && (
          <div
            className={`mb-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              banner.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{banner.text}</span>
            </div>
            <button
              onClick={() => setBanner(null)}
              className="text-xs opacity-60 hover:opacity-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {isCreating ? (
          /* ── FORM VIEW ── */
          <PostJobForm
            onJobCreated={handleJobCreated}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <>
            {/* ── PAGE HEADER ── */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Job Postings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your job listings and recruit skilled workers
                </p>
              </div>

              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition-all cursor-pointer"
              >
                <Plus size={18} />
                Post New Job
              </button>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                    <Briefcase size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Total Posted</p>
                    <p className="text-2xl font-black text-slate-900">{totalJobs}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Active Listings</p>
                    <p className="text-2xl font-black text-green-600">{activeJobs}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Open Vacancies</p>
                    <p className="text-2xl font-black text-blue-600">{totalVacancies}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LOADING ── */}
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <Loader2 size={30} className="animate-spin text-orange-500 mb-3" />
                <p className="text-sm text-slate-500">Loading your job postings...</p>
              </div>
            ) : jobs.length === 0 ? (
              /* ── EMPTY STATE ── */
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100">
                  <SearchX size={36} className="text-orange-500" />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  No Jobs Posted Yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                  You haven&apos;t posted any jobs yet. Post your first job opening
                  and start receiving applications from skilled workers in your area.
                </p>

                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition cursor-pointer"
                >
                  <Plus size={18} />
                  Post Your First Job
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              /* ── JOB LISTINGS ── */
              <div className="space-y-5">
                {/* Search & Filter */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by title, category, city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex rounded-xl border border-slate-300 bg-white overflow-hidden">
                      {["All", "Open", "Closed"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                            statusFilter === st
                              ? "bg-orange-500 text-white"
                              : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={fetchMyJobs}
                      title="Refresh"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-orange-600 hover:border-orange-300 transition cursor-pointer"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>

                {/* No Filter Match */}
                {filteredJobs.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    <SearchX size={28} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      No jobs match your search
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try different keywords or clear the filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => {
                      const isOpen = job.status === "Open";
                      const isBusy = actionLoading === job._id;

                      return (
                        <div
                          key={job._id}
                          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-orange-200"
                        >
                          {/* Card Header */}
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                <Briefcase size={12} />
                                {job.category}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  isOpen
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isOpen ? "bg-green-500" : "bg-slate-400"
                                  }`}
                                />
                                {job.status}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                              {job.title}
                            </h3>

                            {/* Salary & Vacancy */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                                  Salary
                                </p>
                                <p className="text-sm font-bold text-orange-600">
                                  ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                                  <span className="text-xs font-normal text-slate-400">
                                    /{job.salary?.type === "Yearly" ? "yr" : "mo"}
                                  </span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                                  Vacancies
                                </p>
                                <p className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1">
                                  <Users size={13} className="text-blue-500" />
                                  {job.vacancy || 1}
                                </p>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin size={13} className="shrink-0 text-orange-400" />
                              <span className="truncate">
                                {job.location?.city}, {job.location?.state} – {job.location?.pincode}
                              </span>
                            </div>

                            {/* Description preview */}
                            <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                              {job.description}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Calendar size={12} />
                              {new Date(job.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleStatus(job._id, job.status)}
                                disabled={isBusy}
                                title={isOpen ? "Close job" : "Reopen job"}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                  isOpen
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                <Power size={12} />
                                {isOpen ? "Close" : "Open"}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                disabled={isBusy}
                                title="Delete"
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <FooterLayout />
    </div>
  );
}
