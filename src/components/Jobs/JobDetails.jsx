"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import PostJobForm from "@/components/Employer/post-jobs/PostJobForm";
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
  ArrowRight,
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
  Pencil,
  Trash2,
  Power,
  Phone,
  UploadCloud,
  Image as ImageIcon,
  FileText,
  XCircle,
  X,
  UserCheck,
  UserX,
  User,
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
  const { toast, confirmDialog } = useToast();

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applying, setApplying] = useState(false);
  const [applySuccessModal, setApplySuccessModal] = useState(false);
  const [loginPromptModal, setLoginPromptModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [feedbackBanner, setFeedbackBanner] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Application Modal Form States
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantImage, setApplicantImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [applicantExp, setApplicantExp] = useState("1 Year");
  const [customExp, setCustomExp] = useState("");
  const [applicantJoining, setApplicantJoining] = useState("Immediate");
  const [customJoining, setCustomJoining] = useState("");
  const [applicantNotes, setApplicantNotes] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [updatingApplicantId, setUpdatingApplicantId] = useState(null);

  // Owner management states
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ownerActionLoading, setOwnerActionLoading] = useState(false);

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
        setMyApplication(data.myApplication || null);
        setApplications(data.applications || []);
        setIsOwner(Boolean(data.isOwner));
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

  // Open Application Modal with pre-filled worker details
  const openApplyModal = () => {
    if (!user) {
      setLoginPromptModal(true);
      return;
    }

    if (user.role === "employer") {
      toast.warning(
        "Action Not Allowed",
        "Employers cannot apply for jobs. Please log in with a worker account."
      );
      return;
    }

    if (user.name && !applicantName) setApplicantName(user.name);
    if (user.phone && !applicantPhone) setApplicantPhone(user.phone);
    setFormErrors({});
    setApplyModalOpen(true);
  };

  // Handle Image File Selection (Convert to Base64 for Cloudinary upload)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", "Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      setApplicantImage(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setApplicantImage("");
    setImagePreview("");
  };

  // Submit Worker Application
  const handleSubmitApplication = async (e) => {
    e?.preventDefault();
    const errors = {};

    const cleanName = applicantName.trim();
    if (!cleanName) {
      errors.name = "Please enter your full name.";
    }

    const cleanPhone = applicantPhone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    const finalExp = applicantExp === "Custom" ? customExp.trim() : applicantExp;
    if (!finalExp) {
      errors.exp = "Please specify your work experience.";
    }

    const finalJoining = applicantJoining === "Custom" ? customJoining.trim() : applicantJoining;
    if (!finalJoining) {
      errors.joining = "Please specify your joining availability.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setApplying(true);
      setFormErrors({});

      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: cleanName,
          mobileNumber: cleanPhone,
          image: applicantImage,
          workExperience: finalExp,
          joiningDate: finalJoining,
          additionalNotes: applicantNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHasApplied(true);
        setApplicationStatus("Pending");
        setMyApplication(data.application);
        setApplyModalOpen(false);
        setApplySuccessModal(true);
        toast.success(
          "Application Submitted!",
          `You have successfully applied for "${job?.title}". The employer will review your profile.`
        );
      } else {
        if (data.applicationStatus) {
          setHasApplied(true);
          setApplicationStatus(data.applicationStatus);
        }
        toast.error("Application Failed", data.message || "Could not submit your application.");
      }
    } catch {
      toast.error("Network Error", "Error submitting application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  // Employer: Update applicant status (Accept / Reject)
  const handleUpdateApplicantStatus = async (applicationId, nextStatus) => {
    try {
      setUpdatingApplicantId(applicationId);
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicationId, status: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: nextStatus } : app
          )
        );
        toast.success(
          "Status Updated",
          `Applicant marked as ${nextStatus}.`
        );
      } else {
        toast.error("Update Failed", data.message || "Could not update applicant status.");
      }
    } catch {
      toast.error("Network Error", "Unable to reach server. Please try again.");
    } finally {
      setUpdatingApplicantId(null);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const effectiveIsOwner =
    isOwner ||
    Boolean(
      user &&
        job?.employerId &&
        ((user._id &&
          (user._id === job.employerId._id || user._id === job.employerId)) ||
          (user.userId &&
            (user.userId === job.employerId._id ||
              user.userId === job.employerId)) ||
          user.role === "admin")
    );

  const handleToggleStatus = async () => {
    try {
      setOwnerActionLoading(true);
      const nextStatus = job.status === "Open" ? "Closed" : "Open";
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJob((prev) => ({ ...prev, status: nextStatus }));
        toast.success(
          `Job marked as ${nextStatus}`,
          nextStatus === "Open"
            ? "Your listing is now live and accepting applications."
            : "Your listing is now closed to new applicants."
        );
      } else {
        toast.error("Status Update Failed", data.message || "Could not update job status.");
      }
    } catch {
      toast.error("Network Error", "Unable to reach server. Please try again.");
    } finally {
      setOwnerActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    const confirmed = await confirmDialog({
      title: "Delete Job Posting?",
      message: `Permanently delete "${job?.title}"? All worker applications will also be removed. This cannot be undone.`,
      confirmText: "Delete Job",
      cancelText: "Keep It",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setOwnerActionLoading(true);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          "Job Deleted",
          `"${job?.title}" has been permanently removed. Redirecting…`
        );
        setTimeout(() => router.push("/post-job"), 1400);
      } else {
        toast.error("Delete Failed", data.message || "Could not delete this job.");
      }
    } catch {
      toast.error("Network Error", "Could not complete deletion. Please try again.");
    } finally {
      setOwnerActionLoading(false);
    }
  };

  const CategoryIcon = job ? CATEGORY_ICONS[job.category] || Briefcase : Briefcase;
  const employerName = job?.employerId?.name || "Direct Employer";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role={user?.role === "employer" ? "employer" : "worker"} />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* ── BREADCRUMB & BACK NAVIGATION ── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-orange-200 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link
              href={user?.role === "employer" ? "/post-job" : "/worker/dashboard"}
              className="hover:text-orange-600 transition"
            >
              {user?.role === "employer" ? "Employer Dashboard" : "Home"}
            </Link>
            <span>/</span>
            <span>Jobs</span>
            <span>/</span>
            <span className="text-slate-700 font-bold">{job?.category || "Opening"}</span>
          </div>
        </div>

        {/* ── OWNER NOTICE & SHORTCUTS ── */}
        {!loading && job && effectiveIsOwner && (
          <div className="mb-6 rounded-3xl border border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50/50 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    You posted this job opening
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-900">
                    Employer
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  You can edit job details, toggle the open/closed status, or manage this listing anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <Pencil size={13} />
                <span>Edit Posting</span>
              </button>
              <Link
                href="/post-job"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <span>Manage All Jobs</span>
                <ArrowRight size={13} />
              </Link>
            </div>
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

                  {/* Owner Controls or Apply Button */}
                  {effectiveIsOwner ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
                      >
                        <Pencil size={15} />
                        <span>Edit Job</span>
                      </button>

                      <button
                        onClick={handleToggleStatus}
                        disabled={ownerActionLoading}
                        className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs disabled:opacity-50 ${
                          job.status === "Open"
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
                        }`}
                      >
                        {ownerActionLoading ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Power size={15} />
                        )}
                        <span>{job.status === "Open" ? "Close Job" : "Reopen Job"}</span>
                      </button>

                      <button
                        onClick={handleDeleteJob}
                        disabled={ownerActionLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-50"
                        title="Delete job posting"
                      >
                        <Trash2 size={15} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  ) : hasApplied ? (
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
                      onClick={openApplyModal}
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
                          onClick={openApplyModal}
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
                        onClick={openApplyModal}
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

            {/* ── WORKER VIEW: MY SUBMITTED APPLICATION SUMMARY ── */}
            {hasApplied && myApplication && (
              <div className="mt-8 rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50/60 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/70">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Your Submitted Application</h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Delivered to {employerName} • Status:{" "}
                        <span className={`font-bold ${
                          applicationStatus === "Accepted"
                            ? "text-emerald-700"
                            : applicationStatus === "Rejected"
                            ? "text-red-600"
                            : "text-amber-700"
                        }`}>
                          {applicationStatus || "Pending Review"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    applicationStatus === "Accepted"
                      ? "bg-emerald-200 text-emerald-900"
                      : applicationStatus === "Rejected"
                      ? "bg-red-200 text-red-900"
                      : "bg-amber-200 text-amber-900"
                  }`}>
                    {applicationStatus || "Pending"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {myApplication.image && (
                    <div className="sm:col-span-1 flex items-center justify-center">
                      <img
                        src={myApplication.image}
                        alt={myApplication.name || "Worker Photo"}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                  )}
                  <div className={`space-y-1.5 ${myApplication.image ? "sm:col-span-3" : "sm:col-span-4"}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant Name</span>
                        <span className="font-bold text-slate-800">{myApplication.name}</span>
                      </div>
                      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Number</span>
                        <span className="font-bold text-slate-800">+91 {myApplication.mobileNumber}</span>
                      </div>
                      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Experience</span>
                        <span className="font-bold text-slate-800">{myApplication.workExperience}</span>
                      </div>
                      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Joining Availability</span>
                        <span className="font-bold text-slate-800">{myApplication.joiningDate}</span>
                      </div>
                    </div>
                    {myApplication.additionalNotes && (
                      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 mt-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Notes / Skills</span>
                        <span className="text-slate-700 font-medium">{myApplication.additionalNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── EMPLOYER SECTION: APPLICANTS MANAGEMENT ── */}
            {effectiveIsOwner && (
              <section className="mt-12 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm shadow-orange-500/20">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900">
                          Worker Applications
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                          {applications.length} {applications.length === 1 ? "Applicant" : "Applicants"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Workers who submitted their direct profile and contact details for this job
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={fetchJobData}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Clock size={13} />
                    <span>Refresh</span>
                  </button>
                </div>

                {applications.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users size={26} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No applicants yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      As soon as workers apply for this opening, their contact number, photo, experience, and joining date will appear right here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => {
                      const isUpdating = updatingApplicantId === app._id;
                      return (
                        <div
                          key={app._id}
                          className="rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-200 p-5 transition-all shadow-2xs hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {app.image ? (
                                <img
                                  src={app.image}
                                  alt={app.name}
                                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                                />
                              ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 text-slate-700 font-black text-lg">
                                  {app.name?.charAt(0)?.toUpperCase() || "W"}
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <a
                                    href={`tel:${app.mobileNumber}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
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
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                              <span className="font-bold text-slate-800">{app.workExperience}</span>
                            </div>
                            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Joining Date</span>
                              <span className="font-bold text-slate-800">{app.joiningDate}</span>
                            </div>
                          </div>

                          {app.additionalNotes && (
                            <div className="mt-2.5 bg-white rounded-xl p-2.5 border border-slate-100 text-xs">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Worker Notes</span>
                              <p className="text-slate-600 font-medium mt-0.5 leading-relaxed">{app.additionalNotes}</p>
                            </div>
                          )}

                          {/* Employer Quick Action Buttons */}
                          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={`tel:${app.mobileNumber}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition shadow-2xs"
                            >
                              <Phone size={12} />
                              <span>Call Candidate</span>
                            </a>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateApplicantStatus(app._id, "Accepted")}
                                disabled={isUpdating || app.status === "Accepted"}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                              >
                                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                <span>Accept</span>
                              </button>

                              <button
                                onClick={() => handleUpdateApplicantStatus(app._id, "Rejected")}
                                disabled={isUpdating || app.status === "Rejected"}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold transition cursor-pointer disabled:opacity-40"
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
              </section>
            )}

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

      {/* ── WORKER APPLICATION MODAL (NAME, 1 IMAGE, EXPERIENCE, PHONE, JOINING DATE) ── */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Apply for {job?.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Hiring Employer: <span className="font-bold text-slate-700">{employerName}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setApplyModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="mt-5 space-y-4.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border text-sm font-semibold text-slate-900 focus:outline-hidden focus:bg-white transition ${
                      formErrors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number (Calling & WhatsApp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <Phone size={15} />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className={`w-full pl-16 pr-4 py-3 rounded-2xl bg-slate-50 border text-sm font-semibold text-slate-900 focus:outline-hidden focus:bg-white transition ${
                      formErrors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* 1 Image Upload (Cloudinary) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1 Worker Image / Photo <span className="text-slate-400 font-normal lowercase">(optional but recommended)</span>
                </label>
                
                {imagePreview ? (
                  <div className="relative flex items-center gap-3.5 p-3 rounded-2xl border border-orange-200 bg-orange-50/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-orange-200 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">Photo selected</p>
                      <p className="text-[11px] text-slate-500 font-medium">Ready to upload to Cloudinary</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl bg-slate-50/70 hover:bg-orange-50/30 transition cursor-pointer text-center">
                    <UploadCloud size={24} className="text-orange-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Click to upload 1 photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Profile picture or work photo (JPG, PNG under 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Work Experience */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Work Experience <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Fresher / No experience", "Less than 1 year", "1 Year", "2 Years", "3 - 5 Years", "5+ Years", "Custom"].map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => setApplicantExp(exp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        applicantExp === exp
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {applicantExp === "Custom" && (
                  <input
                    type="text"
                    value={customExp}
                    onChange={(e) => setCustomExp(e.target.value)}
                    placeholder="e.g. 4 years in residential plumbing"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500 transition"
                  />
                )}
                {formErrors.exp && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.exp}</p>
                )}
              </div>

              {/* Joining Date / Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Joining Date / Availability <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Immediate", "1 Week Later", "15 Days Later", "1 Month Later", "Custom"].map((timing) => (
                    <button
                      type="button"
                      key={timing}
                      onClick={() => setApplicantJoining(timing)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        applicantJoining === timing
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {timing}
                    </button>
                  ))}
                </div>
                {applicantJoining === "Custom" && (
                  <input
                    type="text"
                    value={customJoining}
                    onChange={(e) => setCustomJoining(e.target.value)}
                    placeholder="e.g. Can join from next Monday / Specific date"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500 transition"
                  />
                )}
                {formErrors.joining && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.joining}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Additional Details / Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  placeholder="Mention your tools, special skills, or past projects..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500 transition resize-none"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  disabled={applying}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* ── EDIT JOB MODAL (EMPLOYER CRUD) ── */}
      {isEditing && job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <PostJobForm
              initialData={job}
              onJobUpdated={(updatedJob) => {
                setJob(updatedJob);
                setIsEditing(false);
                toast.success(
                  "Job Updated Successfully!",
                  `Changes to "${updatedJob.title}" have been saved.`
                );
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}
