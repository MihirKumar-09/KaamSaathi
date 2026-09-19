"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import PostJobForm from "@/components/Employer/post-jobs/PostJobForm";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Building2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Eye,
  Check,
  X,
  Calendar,
  RefreshCw,
  Search,
  Power,
  ShieldCheck,
  Layers,
  FileText,
  UserCheck,
  XCircle,
  SlidersHorizontal,
  CircleDot,
  CheckCircle,
} from "lucide-react";

function formatRelativeTime(dateString) {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export default function EmployerDashboard() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [appFilter, setAppFilter] = useState("All"); // "All" | "Pending" | "Accepted"
  const [isCreating, setIsCreating] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch employer's jobs and received applications
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs?my=true", { credentials: "include" }),
        fetch("/api/applications", { credentials: "include" }),
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setMyJobs(jobsData.success && Array.isArray(jobsData.jobs) ? jobsData.jobs : []);
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.success && Array.isArray(appsData.applications) ? appsData.applications : []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fast application decision
  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      setActionLoading(appId);
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        toast.success(
          `Application ${newStatus}`,
          `Candidate application marked as ${newStatus}.`
        );
      } else {
        toast.error("Action Failed", data.message || "Could not update status.");
      }
    } catch {
      toast.error("Network Error", "Unable to update application status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle job created from inline form
  const handleJobCreated = (newJob) => {
    setMyJobs((prev) => [newJob, ...prev]);
    setIsCreating(false);
    setEditingJob(null);
    toast.success(
      "Job Published Successfully!",
      `"${newJob.title}" is now live and accepting applications.`
    );
  };

  const handleJobUpdated = (updatedJob) => {
    setMyJobs((prev) =>
      prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
    );
    setEditingJob(null);
    setIsCreating(false);
    toast.success(
      "Job Updated Successfully!",
      `Changes to "${updatedJob.title}" have been saved.`
    );
  };

  // Metrics calculation
  const totalJobs = myJobs.length;
  const activeJobs = myJobs.filter((j) => j.status === "Open").length;
  const totalVacancies = myJobs
    .filter((j) => j.status === "Open")
    .reduce((acc, j) => acc + (Number(j.vacancy) || 1), 0);

  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === "Pending").length;
  const acceptedApplications = applications.filter((a) => a.status === "Accepted").length;
  const rejectedApplications = applications.filter((a) => a.status === "Rejected").length;

  const filteredApplications = applications.filter((app) => {
    if (appFilter === "All") return true;
    return app.status === appFilter;
  });

  const recentApplications = filteredApplications.slice(0, 5);
  const recentJobs = myJobs.slice(0, 4);

  const employerName = user?.name || "Employer";
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-500 selection:text-white">
      <NavbarLayout role="employer" />

      {/* Inline Post Job Form Overlay */}
      {(isCreating || editingJob) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="w-full max-w-3xl animate-in fade-in slide-in-from-top-4 duration-300">
            <PostJobForm
              initialData={editingJob}
              onJobCreated={handleJobCreated}
              onJobUpdated={handleJobUpdated}
              onCancel={() => {
                setIsCreating(false);
                setEditingJob(null);
              }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
        {/* ── PREMIUM COMPATIBLE HERO HEADER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 shadow-xl shadow-slate-950/20 text-white p-6 sm:p-8 lg:p-10">
          {/* Subtle Background Glows */}
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Top Row: Eyebrow + Live Status & Date */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Employer Command Center</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/50 px-3.5 py-1 rounded-full border border-slate-700/50">
              <Calendar size={13} className="text-slate-400" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Middle Row: Greeting & Aligned Action Toolbar */}
          <div className="relative z-10 pt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Welcome back,{" "}
                <span className="bg-linear-to-r from-orange-400 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                  {employerName}
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                Review candidate applications, manage your active trade postings, and source verified workers across India.
              </p>
            </div>

            {/* Structured Action Toolbar (Consistent Heights & Harmonious Layout) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => { setEditingJob(null); setIsCreating(true); }}
                className="h-11 inline-flex items-center gap-2 px-5 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus size={18} className="stroke-[3]" />
                <span>Post a Job</span>
              </button>

              <Link
                href="/applications"
                className="h-11 inline-flex items-center gap-2.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                <Users size={16} />
                <span>Applications</span>
                {pendingApplications > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                    {pendingApplications} new
                  </span>
                )}
              </Link>

              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing || loading}
                title="Refresh Dashboard Data"
                className="h-11 w-11 inline-flex items-center justify-center rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin text-orange-400" : ""} />
              </button>
            </div>
          </div>

          {/* Bottom Integrated Status Strip */}
          <div className="relative z-10 mt-8 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Active Postings:</span>
              <span className="text-white font-black">{activeJobs} Live</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Pending Review:</span>
              <span className="text-orange-400 font-black">{pendingApplications} Candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Accepted Workers:</span>
              <span className="text-emerald-400 font-black">{acceptedApplications} Hired</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Open Vacancies:</span>
              <span className="text-blue-400 font-black">{totalVacancies} Slots</span>
            </div>
          </div>
        </div>

        {/* ── 4 COMPATIBLE EXECUTIVE METRIC CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Active Jobs */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Postings</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
                  <Briefcase size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{activeJobs}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              Out of {totalJobs} total created
            </p>
          </div>

          {/* 2. Total Applications */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidates Applied</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-blue-600">{totalApplications}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              <strong className="text-orange-600">{pendingApplications}</strong> awaiting your decision
            </p>
          </div>

          {/* 3. Hired Workers */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hired / Accepted</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <UserCheck size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-600">{acceptedApplications}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              Confirmed candidate hires
            </p>
          </div>

          {/* 4. Open Vacancies */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Vacancies</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <TrendingUp size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-purple-600">{totalVacancies}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              Slots to fill on projects
            </p>
          </div>
        </div>

        {/* ── TWO-COLUMN COMMAND CENTER LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: APPLICATIONS DOSSIER & ACTIVE JOBS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Candidate Applications */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Recent Candidate Applications</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Workers who applied to your open job vacancies</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Pills */}
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                    {["All", "Pending", "Accepted"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAppFilter(filter)}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          appFilter === filter
                            ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/applications"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline shrink-0 ml-2"
                  >
                    <span>View All ({totalApplications})</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Users size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {appFilter === "All"
                      ? "No applications received yet"
                      : `No ${appFilter.toLowerCase()} applications`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When trade workers submit applications for your openings, they will appear here for instant review.
                  </p>
                  <button
                    onClick={() => { setEditingJob(null); setIsCreating(true); }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create a Job Opening</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentApplications.map((app) => {
                    const isBusy = actionLoading === app._id;
                    return (
                      <div
                        key={app._id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Avatar with gradient */}
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white font-black text-sm shadow-xs">
                            {app.workerId?.name ? app.workerId.name.charAt(0).toUpperCase() : "W"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {app.workerId?.name || "Worker Candidate"}
                              </h4>
                              {app.status === "Pending" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                  <Clock size={10} />
                                  Pending
                                </span>
                              ) : app.status === "Accepted" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <Check size={10} />
                                  Hired
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                  <X size={10} />
                                  Rejected
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Briefcase size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px] text-slate-700 font-bold">
                                {app.jobId?.title || "Job Posting"}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span>{formatRelativeTime(app.createdAt)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {app.workerId?.phone && (
                            <a
                              href={`tel:${app.workerId.phone}`}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Call Candidate"
                            >
                              <Phone size={13} />
                            </a>
                          )}

                          {app.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateAppStatus(app._id, "Accepted")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <Check size={12} className="stroke-[3]" />
                                <span>Accept</span>
                              </button>

                              <button
                                onClick={() => handleUpdateAppStatus(app._id, "Rejected")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <X size={12} />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Your Active Job Postings */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Your Company Postings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Vacancies posted by your company</p>
                </div>
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  <span>Manage All Postings ({totalJobs})</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-700">No jobs posted yet</p>
                  <p className="text-xs text-slate-500 mt-1">Start recruiting skilled trade workers for your projects.</p>
                  <button
                    onClick={() => { setEditingJob(null); setIsCreating(true); }}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Post First Job</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                            {job.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 truncate">{job.title}</h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-3">
                          <span>₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}/{job.salary?.type === "Yearly" ? "yr" : "mo"}</span>
                          <span>•</span>
                          <span>{job.location?.city || "Local"}</span>
                          <span>•</span>
                          <span>{job.vacancy || 1} Openings</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {job.status === "Open" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                            Closed
                          </span>
                        )}
                        <Link
                          href={`/jobs/${job._id}`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Job"
                        >
                          <Eye size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: HIRING TOOLKIT & RECRUITMENT FUNNEL */}
          <div className="space-y-6">
            {/* Quick Actions Panel */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                <span>Hiring Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => { setEditingJob(null); setIsCreating(true); }}
                  className="flex w-full items-center justify-between p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 hover:bg-orange-500 hover:text-white text-slate-800 font-bold text-xs transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-white group-hover:text-orange-600 transition">
                      <Plus size={16} />
                    </div>
                    <span>Post New Job Vacancy</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-white" />
                </button>

                <Link
                  href="/post-job"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-800 font-bold text-xs transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Layers size={16} />
                    </div>
                    <span>Explore All Community Jobs</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>

                <Link
                  href="/applications"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-800 font-bold text-xs transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Users size={16} />
                    </div>
                    <span>Manage Candidate Applications</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-800 font-bold text-xs transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Building2 size={16} />
                    </div>
                    <span>Update Employer Profile</span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Application Funnel Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-4">Application Funnel</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Pending Review</span>
                    <span>{pendingApplications}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{
                        width: totalApplications > 0 ? `${(pendingApplications / totalApplications) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Accepted / Hired</span>
                    <span>{acceptedApplications}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: totalApplications > 0 ? `${(acceptedApplications / totalApplications) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Rejected</span>
                    <span>{rejectedApplications}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-500"
                      style={{
                        width: totalApplications > 0 ? `${(rejectedApplications / totalApplications) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Worker Guarantee Card */}
            <div className="rounded-3xl bg-linear-to-br from-orange-500 to-amber-500 p-6 text-white shadow-md shadow-orange-500/20">
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldCheck size={24} className="text-white shrink-0" />
                <h4 className="font-extrabold text-base">Verified Trade Network</h4>
              </div>
              <p className="text-xs text-orange-50/90 leading-relaxed">
                KaamSaathi verifies trade skills and experience for electricians, plumbers, carpenters, drivers, and blue-collar workers.
              </p>
              <Link
                href="/post-job"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-white bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition"
              >
                <span>View All Jobs</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <FooterLayout />
    </div>
  );
}
