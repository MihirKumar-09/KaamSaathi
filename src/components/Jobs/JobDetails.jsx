"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import {
  MapPin,
  Users,
  IndianRupee,
  Clock,
  Building2,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  Briefcase,
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
  ShieldCheck,
  Send,
  Loader2,
  ExternalLink,
  AlertCircle,
  Eye,
  Check,
  Lock,
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

export default function JobDetails({ jobId }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccessModal, setApplySuccessModal] = useState(false);
  const [loginPromptModal, setLoginPromptModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch Job details
  const fetchJobData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJob(data.job);
        setRelatedJobs(data.relatedJobs || []);
        setHasApplied(data.hasApplied || false);
        setApplicationStatus(data.applicationStatus || null);
      } else {
        setError(data.message || "Failed to load job details.");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("An unexpected error occurred while loading this job.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchJobData]);

  // Apply for Job
  const handleApply = async () => {
    if (!user) {
      setLoginPromptModal(true);
      return;
    }

    if (user.role === "employer") {
      setErrorMessage("Employers cannot apply for jobs. Please log in with a worker account.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    try {
      setApplying(true);
      setErrorMessage(null);

      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHasApplied(true);
        setApplicationStatus("Pending");
        setApplySuccessModal(true);
      } else {
        setErrorMessage(data.message || "Failed to submit application.");
        if (data.status) {
          setHasApplied(true);
          setApplicationStatus(data.status);
        }
      }
    } catch {
      setErrorMessage("Error submitting application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const CategoryIcon = job ? CATEGORY_ICONS[job.category] || Briefcase : Briefcase;
  const employerName = job?.employerId?.name || "Direct Employer";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role={user?.role || "worker"} />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* ── BREADCRUMB & BACK NAVIGATION ── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-orange-200 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={15} />
            <span>Back to Jobs</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/worker/dashboard" className="hover:text-orange-600 transition">
              Home
            </Link>
            <span>/</span>
            <span>Jobs</span>
            <span>/</span>
            <span className="text-slate-700 font-bold">{job?.category || "Opening"}</span>
          </div>
        </div>

        {/* ── ERROR ALERT ── */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── LOADING SKELETON ── */}
        {loading ? (
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-white border border-slate-200 animate-pulse p-8">
              <div className="h-6 w-32 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-10 w-2/3 bg-slate-200 rounded-xl mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-16 bg-slate-100 rounded-2xl"></div>
                <div className="h-16 bg-slate-100 rounded-2xl"></div>
                <div className="h-16 bg-slate-100 rounded-2xl"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-white border border-slate-200 rounded-3xl animate-pulse p-6"></div>
              <div className="h-96 bg-white border border-slate-200 rounded-3xl animate-pulse p-6"></div>
            </div>
          </div>
        ) : error || !job ? (
          /* ── NOT FOUND STATE ── */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Job Not Found</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {error || "The job posting you are looking for does not exist or has been removed."}
            </p>
            <Link
              href="/worker/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition"
            >
              <ArrowLeft size={16} />
              Browse Active Jobs
            </Link>
          </div>
        ) : (
          <>
            {/* ── JOB HERO CARD ── */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs mb-8">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-500 via-amber-500 to-orange-400" />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Category Trade Icon Box */}
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-orange-50 to-amber-100 text-orange-600 border border-orange-200/80 shadow-md shadow-orange-500/10">
                    <CategoryIcon size={34} />
                  </div>

                  <div>
                    {/* Pills Row */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {job.category}
                      </span>

                      {job.status === "Open" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Hiring Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200">
                          <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                          Closed
                        </span>
                      )}

                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <Clock size={12} />
                        <span>{formatRelativeTime(job.createdAt)}</span>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {job.title}
                    </h1>

                    {/* Employer Row */}
                    <p className="flex items-center gap-2 mt-2 text-sm font-semibold text-slate-600">
                      <Building2 size={16} className="text-slate-400" />
                      <span>Posted by <strong className="text-slate-900">{employerName}</strong></span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        <ShieldCheck size={12} className="text-blue-600" />
                        Verified Employer
                      </span>
                    </p>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    title="Share job link"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {/* Apply Now Primary Action */}
                  {hasApplied ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold shadow-xs">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span>Applied • {applicationStatus || "Pending Review"}</span>
                    </div>
                  ) : job.status !== "Open" ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 text-sm font-bold border border-slate-200">
                      <Lock size={16} />
                      <span>Job Closed</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-black transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                    >
                      {applying ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Apply Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* ── HIGHLIGHTS ROW: SALARY, LOCATION, VACANCIES ── */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-slate-100 pt-6">
                {/* Salary Card */}
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <IndianRupee size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">Salary Offered</p>
                    <p className="text-base sm:text-lg font-black text-emerald-950 truncate">
                      ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                      <span className="text-xs font-semibold text-emerald-800 ml-1">
                        /{job.salary?.type === "Yearly" ? "year" : "month"}
                      </span>
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700">Direct Employer Payout</span>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-3 rounded-2xl bg-blue-50/80 border border-blue-200/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase font-bold text-blue-700 tracking-wider">Work Location</p>
                    <p className="text-base sm:text-lg font-black text-blue-950 truncate" title={`${job.location?.city}, ${job.location?.state}`}>
                      {job.location?.city || "Local"}
                    </p>
                    <span className="text-[10px] font-semibold text-blue-700 truncate block">
                      {job.location?.state} {job.location?.pincode ? `– ${job.location.pincode}` : ""}
                    </span>
                  </div>
                </div>

                {/* Vacancy Card */}
                <div className="flex items-center gap-3 rounded-2xl bg-purple-50/80 border border-purple-200/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <Users size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase font-bold text-purple-700 tracking-wider">Total Vacancies</p>
                    <p className="text-base sm:text-lg font-black text-purple-950 truncate">
                      {job.vacancy || 1} {(job.vacancy || 1) > 1 ? "Open Positions" : "Open Position"}
                    </p>
                    <span className="text-[10px] font-semibold text-purple-700">Urgent Requirement</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── TWO COLUMN MAIN CONTENT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── LEFT COLUMN: DETAILS & DESCRIPTION (2 Cols) ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description Box */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-orange-500" />
                    <span>Job Description & Requirements</span>
                  </h3>

                  <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-5 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {job.description || "No specific description was provided by the employer."}
                  </div>

                  {/* Key Highlights Grid */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Trade Category</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">{job.category}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Compensation</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">
                        ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Payment Frequency</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">
                        {job.salary?.type || "Monthly"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Positions</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">
                        {job.vacancy || 1} Worker{(job.vacancy || 1) > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Job Status</p>
                      <p className="text-sm font-black text-emerald-700 mt-0.5">{job.status}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Posting Date</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Work Location Details */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-orange-500" />
                    <span>Exact Workplace Location</span>
                  </h3>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Site Address</p>
                      <p className="text-base font-bold text-slate-900 mt-1">
                        {job.location?.address ? `${job.location.address}, ` : ""}
                        {job.location?.city}, {job.location?.state}
                        {job.location?.pincode ? ` - ${job.location.pincode}` : ""}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Daily reporting on-site. Direct work with employer.
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${job.location?.address || ""} ${job.location?.city || ""} ${job.location?.state || ""} ${job.location?.pincode || ""}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
                    >
                      <ExternalLink size={14} />
                      <span>View on Google Maps</span>
                    </a>
                  </div>
                </div>

                {/* Bottom Callout: Ready to Apply */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                        Ready to start working with {employerName}?
                      </h4>
                      <p className="mt-1 text-sm text-orange-100 font-medium max-w-xl">
                        Submit your direct application immediately. No commissions, no agency deductions, 100% free for workers.
                      </p>
                    </div>

                    <div className="shrink-0">
                      {hasApplied ? (
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-800 text-sm font-black shadow-md">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span>Already Applied</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleApply}
                          disabled={applying || job.status !== "Open"}
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 text-sm font-black transition shadow-md hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-70"
                        >
                          {applying ? (
                            <>
                              <Loader2 size={16} className="animate-spin text-orange-600" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              <span>Apply Now</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: SIDEBAR (1 Col) ── */}
              <div className="space-y-6">
                {/* Employer Card */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white font-black text-lg shadow-sm shadow-orange-500/20">
                      {employerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{employerName}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Building2 size={13} className="text-slate-400" />
                        <span>Direct Hiring Employer</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 space-y-2.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Employer Status:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Job Reference ID:</span>
                      <span className="font-bold text-slate-700">{job._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Posting Type:</span>
                      <span className="font-bold text-slate-700">Direct Vacancy</span>
                    </div>
                  </div>

                  {/* Worker Guarantee */}
                  <div className="mt-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-4">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs mb-1">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      <span>KaamSaathi Trust & Safety</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                      KaamSaathi is completely <strong>free for all workers</strong>. Employers will directly call or review your profile. Never pay any upfront fee to anyone.
                    </p>
                  </div>
                </div>

                {/* Sticky Apply Action Card */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sticky top-24">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Take Action</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{Number(job.salary?.amount || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      /{job.salary?.type === "Yearly" ? "yr" : "mo"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    {job.vacancy || 1} open position{(job.vacancy || 1) > 1 ? "s" : ""} • Apply immediately
                  </p>

                  <div className="mt-5">
                    {hasApplied ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-200">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span>Applied ({applicationStatus || "Pending"})</span>
                      </div>
                    ) : job.status !== "Open" ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-100 text-slate-500 text-sm font-bold">
                        <Lock size={16} />
                        <span>Closed</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                      >
                        {applying ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Direct hire</span>
                    <span>No middlemen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BOTTOM SECTION: RELATED JOB POSTS (2 IN ONE ROW) ── */}
            <section className="mt-14 pt-10 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Related Job Openings
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Explore similar active vacancies in {job.category} and nearby locations
                  </p>
                </div>

                <Link
                  href="/worker/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                >
                  <span>View All Openings</span>
                  <span>→</span>
                </Link>
              </div>

              {relatedJobs.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                  <Briefcase size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No other related jobs found</p>
                  <p className="text-xs text-slate-400 mt-1">Check back later or browse other categories.</p>
                </div>
              ) : (
                /* ── 2 CARDS IN ONE ROW ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedJobs.map((relJob) => {
                    const RelCategoryIcon = CATEGORY_ICONS[relJob.category] || Briefcase;
                    const relEmployerName = relJob.employerId?.name || "Direct Employer";

                    return (
                      <div
                        key={relJob._id}
                        className="group relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-2xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Top accent line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-amber-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div>
                          {/* Header: Trade Icon + Trade Badges + Relative Time */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 group-hover:bg-linear-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/25 transition-all duration-300">
                                <RelCategoryIcon size={22} />
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100/70 text-orange-800 border border-orange-200/60">
                                    {relJob.category}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Hiring Now
                                  </span>
                                </div>

                                <p className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                                  <Building2 size={13} className="text-slate-400" />
                                  <span>{relEmployerName}</span>
                                </p>
                              </div>
                            </div>

                            {/* Time pill */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 shrink-0">
                              <Clock size={12} />
                              <span>{formatRelativeTime(relJob.createdAt)}</span>
                            </div>
                          </div>

                          {/* Job Title */}
                          <Link href={`/jobs/${relJob._id}`}>
                            <h4
                              className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mt-4 line-clamp-1 cursor-pointer"
                              title={relJob.title}
                            >
                              {relJob.title}
                            </h4>
                          </Link>

                          {/* Highlights Grid */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Salary */}
                            <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 px-3 py-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <IndianRupee size={15} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-emerald-700/80">Salary</p>
                                <p className="text-xs sm:text-sm font-black text-emerald-950 truncate">
                                  ₹{Number(relJob.salary?.amount || 0).toLocaleString("en-IN")}
                                  <span className="text-[10px] font-medium text-emerald-800/70 ml-0.5">
                                    /{relJob.salary?.type === "Yearly" ? "yr" : "mo"}
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
                                  title={`${relJob.location?.city || "Local"}, ${relJob.location?.state || ""}`}
                                >
                                  {relJob.location?.city || "Local"}
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
                                  {relJob.vacancy || 1} {(relJob.vacancy || 1) > 1 ? "Openings" : "Opening"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Description preview */}
                          <div className="mt-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3">
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                              {relJob.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              {new Date(relJob.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/jobs/${relJob._id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-orange-500/25 cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>View Details</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ── APPLICATION SUCCESS MODAL ── */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your application for <strong>{job?.title}</strong> has been successfully delivered to <strong>{employerName}</strong>. The employer can now review your profile and reach out directly.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Application Status:</span>
                <span className="font-bold text-emerald-600">Pending Review</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Position:</span>
                <span className="font-bold text-slate-800">{job?.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Employer:</span>
                <span className="font-bold text-slate-800">{employerName}</span>
              </div>
            </div>

            <button
              onClick={() => setApplySuccessModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition cursor-pointer"
            >
              Great, Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* ── LOGIN PROMPT MODAL ── */}
      {loginPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Lock size={32} />
            </div>

            <h3 className="text-xl font-black text-slate-900">Worker Login Required</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Please log in with your worker account on KaamSaathi to apply directly for <strong>{job?.title}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition"
              >
                Log In as Worker
              </Link>
              <Link
                href="/register"
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
              >
                Create Free Worker Account
              </Link>
              <button
                onClick={() => setLoginPromptModal(false)}
                className="mt-1 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}
