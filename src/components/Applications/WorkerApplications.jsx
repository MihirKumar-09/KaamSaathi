"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Briefcase,
  Search,
  MapPin,
  IndianRupee,
  Calendar,
  Phone,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
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
  Users,
  Send,
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
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
}

export default function WorkerApplications() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
          toast.error("Failed to load", data.message || "Could not fetch your applications.");
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

  // Calculations for stats
  const totalCount = applications.length;
  const pendingCount = applications.filter((app) => app.status === "Pending").length;
  const acceptedCount = applications.filter((app) => app.status === "Accepted").length;
  const rejectedCount = applications.filter((app) => app.status === "Rejected").length;

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const job = app.jobId || {};
    const matchesStatus =
      statusFilter === "All" ? true : app.status === statusFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      job.title?.toLowerCase().includes(query) ||
      job.category?.toLowerCase().includes(query) ||
      job.employerId?.name?.toLowerCase().includes(query) ||
      job.location?.city?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role="worker" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8">
        {/* ── HEADER BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-10 text-white shadow-xl shadow-orange-500/15 mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold mb-3">
                <Briefcase size={14} />
                <span>Worker Job Applications</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                My Job Applications
              </h1>
              <p className="mt-2 text-sm sm:text-base text-orange-100 font-medium max-w-xl">
                Track status, review submitted details, and connect directly with employers for all your job applications.
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
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 text-xs sm:text-sm font-black transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Find More Jobs</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── STATS OVERVIEW CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => setStatusFilter("All")}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              statusFilter === "All"
                ? "bg-white border-orange-400 shadow-md ring-2 ring-orange-200"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applied</span>
              <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Send size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</p>
            <span className="text-[11px] font-semibold text-slate-500">All submissions</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Under Review</span>
              <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{pendingCount}</p>
            <span className="text-[11px] font-semibold text-amber-600">Employer reviewing</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Accepted</span>
              <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{acceptedCount}</p>
            <span className="text-[11px] font-semibold text-emerald-600">Shortlisted / Hired</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Not Selected</span>
              <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{rejectedCount}</p>
            <span className="text-[11px] font-semibold text-rose-500">Position filled</span>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, category, city..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 transition shadow-2xs"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start sm:self-auto overflow-x-auto">
            {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  statusFilter === tab
                    ? "bg-orange-500 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab === "Pending" ? "Reviewing" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── APPLICATIONS LIST ── */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <p className="mt-4 text-sm font-bold text-slate-600">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty state: User hasn't applied to anything */
          <div className="rounded-3xl border border-slate-200/90 bg-white p-10 sm:p-14 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Applications Yet</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven&apos;t applied to any job postings yet. Explore active openings in your area and apply with your profile in seconds!
            </p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 transition"
              >
                <span>Browse Available Jobs</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          /* Filter produced 0 results */
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
            <h4 className="text-base font-bold text-slate-800">No applications match your filter</h4>
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
          /* Card list of applications */
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const job = app.jobId || {};
              const CategoryIcon = CATEGORY_ICONS[job.category] || Briefcase;
              const employer = job.employerId || {};
              const employerPhone = employer.phone || "";

              return (
                <div
                  key={app._id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-orange-200 transition-all"
                >
                  {/* Top Row: Job Title, Category, Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-2xs">
                        <CategoryIcon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {job.category || "General"}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            Applied {formatRelativeTime(app.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {job.title || "Job Listing"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                          <Building2 size={13} className="text-slate-400" />
                          <span>{employer.name || "Direct Employer"}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <ShieldCheck size={12} />
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="self-start sm:self-center shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          app.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : app.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {app.status === "Accepted" ? (
                          <>
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>Accepted by Employer</span>
                          </>
                        ) : app.status === "Rejected" ? (
                          <>
                            <XCircle size={14} className="text-rose-600" />
                            <span>Not Selected</span>
                          </>
                        ) : (
                          <>
                            <Clock size={14} className="text-amber-600" />
                            <span>Pending Review</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid: Salary, Location, Submitted Experience & Availability */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Salary Offered</span>
                      <p className="font-black text-slate-900 mt-0.5">
                        ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                        <span className="text-[10px] text-slate-500 font-semibold ml-0.5">
                          /{job.salary?.type === "Yearly" ? "yr" : "mo"}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Job Location</span>
                      <p className="font-black text-slate-900 mt-0.5 truncate" title={`${job.location?.city}, ${job.location?.state}`}>
                        {job.location?.city || "Local"}, {job.location?.state || ""}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Experience</span>
                      <p className="font-black text-slate-900 mt-0.5 truncate">
                        {app.workExperience || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Joining Availability</span>
                      <p className="font-black text-slate-900 mt-0.5 truncate">
                        {app.joiningDate || "Immediate"}
                      </p>
                    </div>
                  </div>

                  {/* Submitted Profile Details Row (Photo + Notes) */}
                  <div className="mt-4 rounded-2xl bg-linear-to-r from-orange-50/60 via-amber-50/40 to-slate-50 p-3.5 border border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {app.image ? (
                        <img
                          src={app.image}
                          alt={app.name}
                          className="w-11 h-11 rounded-xl object-cover border border-orange-200 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm shrink-0">
                          {app.name?.charAt(0) || "W"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">
                          Submitted as: <span className="text-orange-700">{app.name}</span> (+91 {app.mobileNumber})
                        </p>
                        {app.additionalNotes ? (
                          <p className="text-[11px] text-slate-600 truncate max-w-md mt-0.5">
                            Notes: &ldquo;{app.additionalNotes}&rdquo;
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 mt-0.5">Direct contact submitted to employer</p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {/* Call Employer button if Accepted or employer has contact */}
                      {employerPhone && (
                        <a
                          href={`tel:${employerPhone}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition shadow-2xs"
                        >
                          <Phone size={12} />
                          <span>Call Employer</span>
                        </a>
                      )}

                      {job._id && (
                        <Link
                          href={`/jobs/${job._id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 text-xs font-bold transition shadow-2xs"
                        >
                          <Eye size={12} />
                          <span>View Job</span>
                        </Link>
                      )}
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
