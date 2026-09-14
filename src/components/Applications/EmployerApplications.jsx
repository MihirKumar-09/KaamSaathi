"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Users,
  Search,
  Phone,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Loader2,
  RefreshCw,
  ArrowRight,
  Eye,
  AlertCircle,
  Building2,
  Send,
  Plus,
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
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
}

export default function EmployerApplications() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch("/api/applications", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(Array.isArray(data.applications) ? data.applications : []);
      } else {
        setApplications([]);
        if (isManualRefresh) {
          toast.error("Failed to load", data.message || "Could not fetch applications.");
        }
      }
    } catch {
      setApplications([]);
      if (isManualRefresh) {
        toast.error("Network Error", "Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        toast.success(
          "Status Updated",
          `Applicant marked as ${newStatus}.`
        );
      } else {
        toast.error("Update Failed", data.message || "Could not update status.");
      }
    } catch {
      toast.error("Network Error", "Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalCount = applications.length;
  const pendingCount = applications.filter((app) => app.status === "Pending").length;
  const acceptedCount = applications.filter((app) => app.status === "Accepted").length;
  const rejectedCount = applications.filter((app) => app.status === "Rejected").length;

  const filteredApplications = applications.filter((app) => {
    const job = app.jobId || {};
    const matchesStatus =
      statusFilter === "All" ? true : app.status === statusFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      app.name?.toLowerCase().includes(query) ||
      app.mobileNumber?.includes(query) ||
      job.title?.toLowerCase().includes(query) ||
      job.category?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role="employer" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8">
        {/* ── HEADER BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-10 text-white shadow-xl shadow-blue-500/15 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold mb-3">
                <Users size={14} />
                <span>Employer Hiring Panel</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Received Job Applications
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium max-w-xl">
                Review candidate photos, experience, call workers directly, and shortlist candidates for your job openings.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => fetchApplications(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition backdrop-blur-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>

              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-black transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Plus size={16} />
                <span>Post New Job</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setStatusFilter("All")}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              statusFilter === "All"
                ? "bg-white border-blue-400 shadow-md ring-2 ring-blue-200"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Candidates</span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Users size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</p>
            <span className="text-[11px] font-semibold text-slate-500">Total received</span>
          </div>

          <div
            onClick={() => setStatusFilter("Pending")}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              statusFilter === "Pending"
                ? "bg-white border-amber-400 shadow-md ring-2 ring-amber-200"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Needs Review</span>
              <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{pendingCount}</p>
            <span className="text-[11px] font-semibold text-amber-600">Pending review</span>
          </div>

          <div
            onClick={() => setStatusFilter("Accepted")}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              statusFilter === "Accepted"
                ? "bg-white border-emerald-400 shadow-md ring-2 ring-emerald-200"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Shortlisted</span>
              <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{acceptedCount}</p>
            <span className="text-[11px] font-semibold text-emerald-600">Accepted candidates</span>
          </div>

          <div
            onClick={() => setStatusFilter("Rejected")}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              statusFilter === "Rejected"
                ? "bg-white border-rose-400 shadow-md ring-2 ring-rose-200"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Rejected</span>
              <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{rejectedCount}</p>
            <span className="text-[11px] font-semibold text-rose-500">Declined</span>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, mobile, job title..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start sm:self-auto overflow-x-auto">
            {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  statusFilter === tab
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab === "Pending" ? "Reviewing" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── APPLICANTS LIST ── */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm font-bold text-slate-600">Loading received applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-10 sm:p-14 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Applications Received Yet</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              When workers apply to your active job listings, their photos, experience, and contact numbers will appear here.
            </p>
            <div className="mt-6">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-600/25 transition"
              >
                <Plus size={16} />
                <span>Post or Manage Jobs</span>
              </Link>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
            <h4 className="text-base font-bold text-slate-800">No candidates match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting your status filter or clearing your search term.</p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApplications.map((app) => {
              const job = app.jobId || {};
              const isUpdating = updatingId === app._id;

              return (
                <div
                  key={app._id}
                  className="rounded-3xl border border-slate-200 bg-white hover:border-blue-300 p-5 sm:p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Candidate photo + info + Status badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {app.image ? (
                          <img
                            src={app.image}
                            alt={app.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700 font-black text-lg">
                            {app.name?.charAt(0)?.toUpperCase() || "W"}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-black text-slate-900">{app.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${app.mobileNumber}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              <Phone size={12} />
                              <span>+91 {app.mobileNumber}</span>
                            </a>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Applied {formatRelativeTime(app.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          app.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.status === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Applied Job Info */}
                    <div className="mt-4 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Applied Position</span>
                      <Link
                        href={`/jobs/${job._id}`}
                        className="font-bold text-xs text-slate-800 hover:text-blue-600 transition flex items-center gap-1 mt-0.5"
                      >
                        <span>{job.title || "Job Listing"}</span>
                        <span className="text-slate-400 text-[10px]">({job.category})</span>
                      </Link>
                    </div>

                    {/* Highlights: Experience + Joining Date */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                        <span className="font-bold text-slate-800">{app.workExperience}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Joining Date</span>
                        <span className="font-bold text-slate-800">{app.joiningDate}</span>
                      </div>
                    </div>

                    {app.additionalNotes && (
                      <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Worker Notes</span>
                        <p className="text-slate-600 font-medium mt-0.5 leading-relaxed">{app.additionalNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Controls Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`tel:${app.mobileNumber}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition shadow-2xs"
                    >
                      <Phone size={12} />
                      <span>Call Candidate</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(app._id, "Accepted")}
                        disabled={isUpdating || app.status === "Accepted"}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                      >
                        {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(app._id, "Rejected")}
                        disabled={isUpdating || app.status === "Rejected"}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                      >
                        {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <FooterLayout />
    </div>
  );
}
