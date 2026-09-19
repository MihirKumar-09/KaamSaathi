"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
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
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Check,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Driver",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cook",
  "Housekeeping",
  "Security Guard",
  "Delivery",
  "Gardener",
  "Mechanic",
  "Welder",
  "Mason",
  "Tailor",
  "Cleaner",
  "AC Technician",
  "Beautician",
  "Helper",
  "Other",
];

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

export default function PostJob({ initialScope = "all" }) {
  const { user } = useContext(AuthContext);
  const { toast, confirmDialog } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Filters & Controls
  const [scopeFilter, setScopeFilter] = useState(initialScope); // "all" | "my"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Open" | "Closed"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "salary_high" | "vacancies"
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Helper to test if a job belongs to current user
  const isMyJob = useCallback(
    (job) => {
      if (!user || !job) return false;
      const empId = job.employerId?._id || job.employerId;
      const currentUserId = user._id || user.id;
      return Boolean(empId && currentUserId && empId.toString() === currentUserId.toString());
    },
    [user]
  );

  // Fetch all jobs across the platform
  const fetchAllJobs = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const res = await fetch("/api/jobs?scope=all", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data.success && Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  // Toggle Open / Closed Status (Owner only)
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
            ? "Your job listing is now active and receiving worker applications."
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

  // Delete Job (Owner only)
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

  // Dynamic Overall Metrics
  const totalCommunityJobs = jobs.length;
  const activeCommunityJobs = jobs.filter((j) => j.status === "Open").length;
  const totalOpenVacancies = jobs
    .filter((j) => j.status === "Open")
    .reduce((acc, j) => acc + (Number(j.vacancy) || 1), 0);
  const myJobsCount = jobs.filter(isMyJob).length;

  // Filtered & Sorted Jobs
  const filteredJobs = jobs
    .filter((job) => {
      // Scope filter: "all" vs "my"
      if (scopeFilter === "my" && !isMyJob(job)) {
        return false;
      }

      // Status filter
      if (statusFilter !== "All" && job.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && job.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = job.title?.toLowerCase().includes(q);
        const catMatch = job.category?.toLowerCase().includes(q);
        const cityMatch = job.location?.city?.toLowerCase().includes(q);
        const stateMatch = job.location?.state?.toLowerCase().includes(q);
        const descMatch = job.description?.toLowerCase().includes(q);
        const empMatch = job.employerId?.name?.toLowerCase().includes(q);
        return titleMatch || catMatch || cityMatch || stateMatch || descMatch || empMatch;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "salary_high") {
        return (Number(b.salary?.amount) || 0) - (Number(a.salary?.amount) || 0);
      }
      if (sortBy === "vacancies") {
        return (Number(b.vacancy) || 1) - (Number(a.vacancy) || 1);
      }
      // default: newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    statusFilter !== "All" ||
    scopeFilter !== "all" ||
    sortBy !== "newest";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setStatusFilter("All");
    setScopeFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-500 selection:text-white">
      <NavbarLayout role="employer" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {isCreating || editingJob ? (
          /* ── CREATE / EDIT JOB FORM VIEW ── */
          <div className="animate-in fade-in duration-200">
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
        ) : (
          <>
            {/* ── HERO BANNER & PRIMARY ACTION ── */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-10 text-white shadow-xl shadow-slate-900/10 mb-8 border border-slate-700/50">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold mb-3 tracking-wide uppercase">
                    <Sparkles size={13} className="text-orange-400" />
                    <span>Employer Portal • All Jobs Hub</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                    Explore All <span className="text-orange-400">Posted Jobs</span>
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                    Browse all trade openings and worker listings across KaamSaathi, check market salaries, or publish your own vacancy.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setIsCreating(true);
                    }}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus size={18} className="stroke-[3]" />
                    <span>Post New Job</span>
                  </button>

                  <button
                    onClick={() => fetchAllJobs(true)}
                    disabled={refreshing || loading}
                    title="Refresh All Job Listings"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3.5 text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={refreshing ? "animate-spin text-orange-400" : ""} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── STATS METRIC CARDS ── */}
            <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Total Jobs */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Posted</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
                    <Briefcase size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalCommunityJobs}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Platform listings</p>
              </div>

              {/* Active Listings */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Openings</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">{activeCommunityJobs}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Accepting applications</p>
              </div>

              {/* Total Vacancies */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Vacancies</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Users size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-blue-600">{totalOpenVacancies}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Worker slots open</p>
              </div>

              {/* Your Jobs */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Listings</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
                    <Building2 size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-violet-600">{myJobsCount}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Posted by you</p>
              </div>
            </div>

            {/* ── SCOPE TABS & CONTROLS TOOLBAR ── */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
              {/* Row 1: Scope Switcher + Search Bar + Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Scope Switcher (All Jobs vs My Jobs) */}
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shrink-0 self-start">
                  <button
                    onClick={() => setScopeFilter("all")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      scopeFilter === "all"
                        ? "bg-white text-orange-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Layers size={15} />
                    <span>All Community Jobs</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        scopeFilter === "all" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {totalCommunityJobs}
                    </span>
                  </button>

                  <button
                    onClick={() => setScopeFilter("my")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      scopeFilter === "my"
                        ? "bg-white text-orange-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Building2 size={15} />
                    <span>My Job Postings</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        scopeFilter === "my" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {myJobsCount}
                    </span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by job title, trade, city, employer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-3 focus:ring-orange-500/15 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter & Sort */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Pills */}
                  <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
                    {["All", "Open", "Closed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          statusFilter === st
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {st === "Open" && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        )}
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 rounded-2xl border border-slate-200 bg-slate-50 px-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer appearance-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="salary_high">Highest Salary</option>
                      <option value="vacancies">Most Vacancies</option>
                    </select>
                    <SlidersHorizontal
                      size={12}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Category Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] || Briefcase;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25 scale-[1.02]"
                          : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={14} className={isSelected ? "text-white" : "text-slate-500"} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Reset if Active */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <span>
                    Showing <strong className="text-slate-800">{filteredJobs.length}</strong> of {totalCommunityJobs} jobs
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* ── JOBS FEED ── */}
            {loading ? (
              /* Loading Skeletons */
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
            ) : filteredJobs.length === 0 ? (
              /* Empty State */
              <div className="rounded-3xl border border-slate-200/80 bg-white px-8 py-16 text-center shadow-xs">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 border border-orange-100 text-orange-500">
                  <SearchX size={36} />
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {jobs.length === 0
                    ? "No Jobs Posted Yet"
                    : "No Job Listings Match Your Criteria"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                  {jobs.length === 0
                    ? "Be the first to publish a job vacancy on KaamSaathi and connect with skilled trade workers."
                    : "Try adjusting your search terms, switching to All Categories, or clearing the status filters."}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setIsCreating(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition cursor-pointer"
                  >
                    <Plus size={18} />
                    <span>Post a Job</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ── JOB CARDS GRID (2 CARDS PER ROW) ── */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => {
                  const isOpen = job.status === "Open";
                  const isBusy = actionLoading === job._id;
                  const CategoryIcon = CATEGORY_ICONS[job.category] || Briefcase;
                  const isOwner = isMyJob(job);

                  return (
                    <div
                      key={job._id}
                      className={`group relative rounded-3xl border bg-white p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                        isOwner
                          ? "border-orange-200/90 ring-1 ring-orange-500/10"
                          : "border-slate-200/80 hover:border-orange-300"
                      }`}
                    >
                      {/* Top Accent Gradient Bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1.5 transition-opacity duration-300 ${
                          isOwner
                            ? "bg-linear-to-r from-orange-500 via-amber-500 to-orange-400 opacity-100"
                            : "bg-linear-to-r from-orange-500 via-amber-500 to-orange-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />

                      <div>
                        {/* Header: Trade Icon + Badges + Relative Time */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 group-hover:bg-linear-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/25 transition-all duration-300">
                              <CategoryIcon size={22} />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100/70 text-orange-800 border border-orange-200/60">
                                  {job.category}
                                </span>

                                {isOpen ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Open
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                    Closed
                                  </span>
                                )}

                                {isOwner && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                    <Check size={10} className="stroke-[3]" />
                                    Your Post
                                  </span>
                                )}

                                {!isOwner && job.hasApplied && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={11} className="text-emerald-600" />
                                    {job.applicationStatus === "Accepted"
                                      ? "Applied • Accepted"
                                      : job.applicationStatus === "Rejected"
                                      ? "Applied • Rejected"
                                      : "Already Applied"}
                                  </span>
                                )}
                              </div>

                              <p className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                                <Building2 size={13} className="text-slate-400 shrink-0" />
                                <span className="truncate max-w-[200px]" title={job.employerId?.name || "Verified Employer"}>
                                  {job.employerId?.name || (isOwner ? user?.name || "Your Company" : "Verified Employer")}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Relative Time Pill */}
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 shrink-0">
                            <Clock size={11} />
                            <span>{formatRelativeTime(job.createdAt)}</span>
                          </div>
                        </div>

                        {/* Job Title */}
                        <h3
                          onClick={() => setSelectedJob(job)}
                          className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mt-4 line-clamp-1 cursor-pointer"
                          title={job.title}
                        >
                          {job.title}
                        </h3>

                        {/* Metric Highlights Grid */}
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

                        {/* Description Preview */}
                        <div className="mt-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3">
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            {job.description || "No job description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                          <Calendar size={13} className="text-slate-400" />
                          <span>
                            {new Date(job.createdAt || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                            title="View full job details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>

                          {/* Standalone Page Link */}
                          <Link
                            href={`/jobs/${job._id}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                            title="Open standalone job page"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          {/* Owner Specific Controls */}
                          {isOwner && (
                            <>
                              {/* Edit Job */}
                              <button
                                onClick={() => setEditingJob(job)}
                                disabled={isBusy}
                                title="Edit job listing"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <Pencil size={13} />
                                <span>Edit</span>
                              </button>

                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleStatus(job._id, job.status)}
                                disabled={isBusy}
                                title={isOpen ? "Close job listing" : "Re-open job listing"}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
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
                                className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── JOB DETAILS MODAL ── */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedJob(null)}
        >
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
              <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  {selectedJob.category}
                </span>

                {selectedJob.status === "Open" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active / Open
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    Closed
                  </span>
                )}

                {isMyJob(selectedJob) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-xs">
                    Your Listing
                  </span>
                )}

                <span className="text-xs text-slate-400 font-semibold ml-auto">
                  {formatRelativeTime(selectedJob.createdAt)}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {selectedJob.title}
              </h2>

              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                <span>
                  Posted by{" "}
                  <strong className="text-slate-800">
                    {selectedJob.employerId?.name || (isMyJob(selectedJob) ? user?.name || "You" : "Verified Employer")}
                  </strong>
                </span>
              </p>
            </div>

            {/* Highlight Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Salary</p>
                <p className="mt-1 text-lg font-black text-slate-900">
                  ₹{Number(selectedJob.salary?.amount || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  Per {selectedJob.salary?.type === "Yearly" ? "Year" : "Month"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Vacancies</p>
                <p className="mt-1 text-lg font-black text-slate-900">
                  {selectedJob.vacancy || 1} {(selectedJob.vacancy || 1) > 1 ? "Openings" : "Opening"}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  {selectedJob.status === "Open" ? "Open for candidates" : "Position filled"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</p>
                <p className="mt-1 text-lg font-black text-slate-900 truncate">
                  {selectedJob.location?.city || "Local"}
                </p>
                <p className="text-xs text-slate-500 font-semibold truncate">
                  {selectedJob.location?.state || ""} {selectedJob.location?.pincode ? `(${selectedJob.location.pincode})` : ""}
                </p>
              </div>
            </div>

            {/* Work Location Address */}
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Exact Work Location
                  </h4>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedJob.location?.address ? `${selectedJob.location.address}, ` : ""}
                    {selectedJob.location?.city}, {selectedJob.location?.state}{" "}
                    {selectedJob.location?.pincode ? `- ${selectedJob.location.pincode}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Employer Contact (if available) */}
            {(selectedJob.employerId?.phone || selectedJob.employerId?.email) && (
              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Employer Contact Information
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                  {selectedJob.employerId?.phone && (
                    <span>Phone: <strong>{selectedJob.employerId.phone}</strong></span>
                  )}
                  {selectedJob.employerId?.email && (
                    <span>Email: <strong>{selectedJob.employerId.email}</strong></span>
                  )}
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Job Description & Scope of Work
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedJob.description}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/jobs/${selectedJob._id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                <span>Open Dedicated Job Page</span>
                <ExternalLink size={13} />
              </Link>

              <div className="flex items-center gap-2">
                {isMyJob(selectedJob) && (
                  <>
                    <button
                      onClick={() => {
                        const j = selectedJob;
                        setSelectedJob(null);
                        setEditingJob(j);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Pencil size={13} />
                      <span>Edit Listing</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(selectedJob._id, selectedJob.status)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedJob.status === "Open"
                          ? "bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white"
                          : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white"
                      }`}
                    >
                      <Power size={13} />
                      <span>{selectedJob.status === "Open" ? "Close Job" : "Open Job"}</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}
