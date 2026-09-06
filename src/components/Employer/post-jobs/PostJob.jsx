"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import PostJobForm from "./PostJobForm";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
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
  IndianRupee,
  Clock,
  Building2,
  Eye,
  X,
  Layers,
  Car,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  ChefHat,
  Home,
  Shield,
  Package,
  Flower2,
  Flame,
  HardHat,
  Scissors,
  Sparkles,
  Wind,
  Heart,
  Pencil,
} from "lucide-react";

const CATEGORY_ICONS = {
  All: Layers,
  Driver: Car,
  Electrician: Zap,
  Plumber: Wrench,
  Carpenter: Hammer,
  Painter: Paintbrush,
  Cook: ChefHat,
  Housekeeping: Home,
  "Security Guard": Shield,
  Delivery: Package,
  Gardener: Flower2,
  Mechanic: Wrench,
  Welder: Flame,
  Mason: HardHat,
  Tailor: Scissors,
  Cleaner: Sparkles,
  "AC Technician": Wind,
  Beautician: Heart,
  Helper: Users,
  Other: Briefcase,
};

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

export default function PostJob() {
  const { user } = useContext(AuthContext);
  const { toast, confirmDialog } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

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
    const timer = setTimeout(() => {
      fetchMyJobs();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMyJobs]);

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
        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success(
          `Job marked as ${newStatus}`,
          newStatus === "Open"
            ? "Your job listing is now live and accepting worker applications."
            : "Your job listing is now closed to new applicants."
        );
      } else {
        toast.error("Failed to Update Status", data.message || "An error occurred.");
      }
    } catch {
      toast.error("Network Error", "Unable to reach the server. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Job with Premium Confirmation Modal
  const handleDeleteJob = async (jobId, jobTitle = "this job posting") => {
    const confirmed = await confirmDialog({
      title: "Delete Job Posting?",
      message: `Are you sure you want to permanently delete "${jobTitle}"? All associated worker applications will also be removed.`,
      confirmText: "Delete Job",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setActionLoading(jobId);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob(null);
        }
        toast.success(
          "Job Deleted Successfully",
          `"${jobTitle}" has been permanently removed.`
        );
      } else {
        toast.error("Delete Failed", data.message || "Could not delete this job.");
      }
    } catch {
      toast.error("Network Error", "Could not complete deletion. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setIsCreating(false);
    toast.success(
      "Job Published Successfully!",
      `"${newJob.title}" is now published and active.`
    );
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
    );
    if (selectedJob && selectedJob._id === updatedJob._id) {
      setSelectedJob(updatedJob);
    }
    setEditingJob(null);
    setIsCreating(false);
    toast.success(
      "Job Updated Successfully!",
      `Changes to "${updatedJob.title}" have been saved.`
    );
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
        {isCreating || editingJob ? (
          /* ── FORM VIEW (CREATE OR EDIT) ── */
          <PostJobForm
            initialData={editingJob}
            onJobCreated={handleJobCreated}
            onJobUpdated={handleJobUpdated}
            onCancel={() => {
              setIsCreating(false);
              setEditingJob(null);
            }}
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

            {/* ── LOADING SKELETONS ── */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between h-80"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-slate-200 rounded-2xl"></div>
                          <div className="space-y-1.5">
                            <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                            <div className="h-3.5 w-32 bg-slate-200 rounded-md"></div>
                          </div>
                        </div>
                        <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-slate-200 rounded-md my-4"></div>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="h-12 bg-slate-100 rounded-2xl"></div>
                        <div className="h-12 bg-slate-100 rounded-2xl"></div>
                        <div className="h-12 bg-slate-100 rounded-2xl"></div>
                      </div>
                      <div className="h-10 w-full bg-slate-100 rounded-2xl"></div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                      <div className="h-9 w-28 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-6">
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
                  /* ── 2 CARDS IN ONE ROW (Worker Card Style) ── */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => {
                      const isOpen = job.status === "Open";
                      const isBusy = actionLoading === job._id;
                      const CategoryIcon = CATEGORY_ICONS[job.category] || Briefcase;

                      return (
                        <div
                          key={job._id}
                          className="group relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-2xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        >
                          {/* Top accent line on hover */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-amber-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div>
                            {/* Header: Trade Icon + Trade Badges + Relative Time */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3.5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 group-hover:bg-linear-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/25 transition-all duration-300">
                                  <CategoryIcon size={22} />
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100/70 text-orange-800 border border-orange-200/60">
                                      {job.category}
                                    </span>
                                    {isOpen ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Open
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                        Closed
                                      </span>
                                    )}
                                  </div>

                                  <p className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                                    <Building2 size={13} className="text-slate-400" />
                                    <span>{job.employerId?.name || user?.name || "Your Job Posting"}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Relative Time pill */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 shrink-0">
                                <Clock size={12} />
                                <span>{formatRelativeTime(job.createdAt)}</span>
                              </div>
                            </div>

                            {/* Job Title */}
                            <h3
                              onClick={() => setSelectedJob(job)}
                              className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mt-4 line-clamp-1 cursor-pointer"
                              title={job.title}
                            >
                              {job.title}
                            </h3>

                            {/* Highlights Grid: Salary, Location, Vacancy */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {/* Salary */}
                              <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 px-3 py-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                  <IndianRupee size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] uppercase font-bold text-emerald-700/80">Salary</p>
                                  <p className="text-xs sm:text-sm font-black text-emerald-950 truncate">
                                    ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                                    <span className="text-[10px] font-medium text-emerald-800/70 ml-0.5">
                                      /{job.salary?.type === "Yearly" ? "yr" : "mo"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 px-3 py-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                  <MapPin size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] uppercase font-bold text-blue-700/80">Location</p>
                                  <p
                                    className="text-xs sm:text-sm font-black text-blue-950 truncate"
                                    title={`${job.location?.city || "Local"}, ${job.location?.state || ""}`}
                                  >
                                    {job.location?.city || "Local"}
                                  </p>
                                </div>
                              </div>

                              {/* Vacancy */}
                              <div className="flex items-center gap-2.5 rounded-2xl bg-purple-50/70 border border-purple-200/60 px-3 py-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                  <Users size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] uppercase font-bold text-purple-700/80">Vacancies</p>
                                  <p className="text-xs sm:text-sm font-black text-purple-950 truncate">
                                    {job.vacancy || 1} {(job.vacancy || 1) > 1 ? "Openings" : "Opening"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Description preview */}
                            <div className="mt-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3">
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                                {job.description || "No description provided."}
                              </p>
                            </div>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                              <Calendar size={13} className="text-slate-400" />
                              <span>
                                {new Date(job.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedJob(job)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                                title="View full job details"
                              >
                                <Eye size={13} />
                                <span>View</span>
                              </button>

                              {/* Edit Job */}
                              <button
                                onClick={() => setEditingJob(job)}
                                disabled={isBusy}
                                title="Edit job posting"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <Pencil size={13} />
                                <span>Edit</span>
                              </button>

                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleStatus(job._id, job.status)}
                                disabled={isBusy}
                                title={isOpen ? "Close job posting" : "Reopen job posting"}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer disabled:opacity-50 ${
                                  isOpen
                                    ? "bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-500"
                                    : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600"
                                }`}
                              >
                                {isBusy ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Power size={13} />
                                )}
                                <span>{isOpen ? "Close" : "Open"}</span>
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteJob(job._id, job.title)}
                                disabled={isBusy}
                                title="Delete job posting"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition-all duration-200 shadow-2xs cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 size={14} />
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

      {/* ── JOB DETAILS MODAL ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  {selectedJob.category}
                </span>
                {selectedJob.status === "Open" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active / Open
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    Closed
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium ml-auto pr-8">
                  {formatRelativeTime(selectedJob.createdAt)}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {selectedJob.title}
              </h2>

              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                Posted by {selectedJob.employerId?.name || user?.name || "You"}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">Offered Salary</p>
                <p className="mt-1 text-base font-black text-slate-900">
                  ₹{Number(selectedJob.salary?.amount || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedJob.salary?.type || "Monthly"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">Total Vacancies</p>
                <p className="mt-1 text-base font-black text-slate-900">
                  {selectedJob.vacancy || 1}{" "}
                  {(selectedJob.vacancy || 1) > 1 ? "Workers" : "Worker"}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedJob.status === "Open" ? "Open for applications" : "Posting closed"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">City & State</p>
                <p className="mt-1 text-base font-black text-slate-900 truncate">
                  {selectedJob.location?.city || "Local"}
                </p>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {selectedJob.location?.state || ""}{" "}
                  {selectedJob.location?.pincode ? `(${selectedJob.location.pincode})` : ""}
                </p>
              </div>
            </div>

            {/* Full Location details */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Exact Work Location
                  </h4>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedJob.location?.address
                      ? `${selectedJob.location.address}, `
                      : ""}
                    {selectedJob.location?.city}, {selectedJob.location?.state}{" "}
                    {selectedJob.location?.pincode ? `- ${selectedJob.location.pincode}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Job Description & Requirements
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedJob.description}
              </div>
            </div>

            {/* Footer Buttons with Action Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = selectedJob;
                    setSelectedJob(null);
                    setEditingJob(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition cursor-pointer"
                >
                  <Pencil size={14} />
                  <span>Edit Job</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleStatus(selectedJob._id, selectedJob.status);
                  }}
                  disabled={actionLoading === selectedJob._id}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                    selectedJob.status === "Open"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  }`}
                >
                  <Power size={14} />
                  <span>{selectedJob.status === "Open" ? "Close This Job" : "Reopen This Job"}</span>
                </button>

                <button
                  onClick={() => {
                    handleDeleteJob(selectedJob._id, selectedJob.title);
                  }}
                  disabled={actionLoading === selectedJob._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>Delete Job</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}
