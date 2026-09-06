"use client";

import { useState, useEffect, useCallback, useContext, useRef } from "react";
import NavbarLayout from "../navbar/NavbarLayout";
import FooterLayout from "../footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import {
  MapPin,
  Users,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Clock,
  Building2,
  CheckCircle2,
  X,
  IndianRupee,
  SearchX,
  Eye,
  ShieldCheck,
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
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
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

// Helper to format relative time
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

export default function WorkerDashboard() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const scrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Fetch active jobs from the backend API
  const fetchJobs = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      if (cityFilter.trim()) {
        params.set("city", cityFilter.trim());
      }
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      const queryStr = params.toString();
      const url = queryStr ? `/api/jobs?${queryStr}` : "/api/jobs";

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data.success && Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, cityFilter, searchQuery]);

  // Initial fetch and on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 250); // slight debounce for search input

    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setCityFilter("");
  };

  const handleCopyPhone = (phoneNumber) => {
    if (!phoneNumber) return;
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role="worker" />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-orange-500/15 mb-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Job Openings
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Namaste, {user?.name ? user.name.split(" ")[0] : "Saathi"}! 👷‍♂️
            </h1>

            <p className="mt-2 text-sm sm:text-base text-orange-100 font-medium max-w-2xl">
              Explore verified active jobs posted by direct employers in your area. Contact employers immediately without any middlemen.
            </p>

            {/* Quick search input */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by job title, skills, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-sm focus:outline-hidden focus:ring-2 focus:ring-white/80"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative sm:w-56">
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Filter by City..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-sm focus:outline-hidden focus:ring-2 focus:ring-white/80"
                />
                {cityFilter && (
                  <button
                    onClick={() => setCityFilter("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Decorative subtle circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>
        </section>

        {/* ── MODERN CATEGORY FILTER BAR ── */}
        <section className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Browse by Category & Trade
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {CATEGORIES.length} Categories
                  </span>
                </h2>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Click a trade to filter active job openings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(selectedCategory !== "All" || cityFilter || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/70 transition cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}

              {/* Scroll buttons for desktop */}
              <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  onClick={() => scrollCategories("left")}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  title="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollCategories("right")}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  title="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Track */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const IconComponent = CATEGORY_ICONS[cat] || Briefcase;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.03] ring-2 ring-orange-400/40"
                        : "bg-slate-50/80 text-slate-700 border border-slate-200/80 hover:border-orange-300 hover:bg-white hover:text-orange-600 hover:shadow-xs"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 border border-slate-200/50 shadow-2xs"
                      }`}
                    >
                      <IconComponent size={13} />
                    </span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── LISTINGS HEADER BAR ── */}
        <section className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Active Jobs
            </h2>
            {!loading && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                {jobs.length} Available
              </span>
            )}
          </div>

          <button
            onClick={() => fetchJobs(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            title="Refresh job listings"
          >
            <RefreshCw
              size={14}
              className={`${refreshing ? "animate-spin text-orange-500" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </section>

        {/* ── JOB FEED CONTENT ── */}
        {loading ? (
          /* Loading Skeletons - 2 Cards per Row */
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
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <div className="h-10 w-28 bg-slate-200 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-xs">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <SearchX size={36} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              No Active Jobs Found
            </h3>

            <p className="mt-2 max-w-md mx-auto text-sm text-slate-500">
              {searchQuery || selectedCategory !== "All" || cityFilter
                ? "No active job listings match your current filters. Try changing or clearing your search criteria."
                : "There are currently no active job postings available. Please check back shortly as employers post new vacancies frequently."}
            </p>

            {(searchQuery || selectedCategory !== "All" || cityFilter) && (
              <button
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition cursor-pointer"
              >
                <RefreshCw size={16} />
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* Modern 2-Column Job Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const employerName = job.employerId?.name || "Direct Employer";
              const employerPhone = job.employerId?.phone;
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
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Hiring Now
                            </span>
                          </div>

                          <p className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                            <Building2 size={13} className="text-slate-400" />
                            <span>{employerName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Time pill */}
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

                    {/* Modern Highlights Grid: Salary, Location, Vacancy */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Salary */}
                      <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <IndianRupee size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-emerald-700/80">Salary</p>
                          <p className="text-xs sm:text-sm font-black text-emerald-950 truncate">
                            ₹{job.salary?.amount?.toLocaleString("en-IN")}
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
                          <p className="text-xs sm:text-sm font-black text-blue-950 truncate" title={`${job.location?.city}, ${job.location?.state}`}>
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
                            {job.vacancy} {job.vacancy > 1 ? "Openings" : "Opening"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description preview */}
                    <div className="mt-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Direct Opportunity
                    </span>

                    <div className="flex items-center gap-2">
                      {employerPhone && (
                        <a
                          href={`tel:${employerPhone}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer"
                          title="Call Employer directly"
                        >
                          <Phone size={14} />
                          <span>Call</span>
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-orange-500/25 cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── JOB DETAILS MODAL ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
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
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} />
                  Active / Open
                </span>
                <span className="text-xs text-slate-400 font-medium ml-auto pr-8">
                  {formatRelativeTime(selectedJob.createdAt)}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {selectedJob.title}
              </h2>

              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                Posted by {selectedJob.employerId?.name || "Direct Employer"}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">Offered Salary</p>
                <p className="mt-1 text-base font-black text-slate-900">
                  ₹{selectedJob.salary?.amount?.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedJob.salary?.type || "Monthly"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">Total Vacancies</p>
                <p className="mt-1 text-base font-black text-slate-900">
                  {selectedJob.vacancy} {selectedJob.vacancy > 1 ? "Workers" : "Worker"}
                </p>
                <p className="text-xs text-slate-500 font-medium">Urgent requirement</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-400">City & State</p>
                <p className="mt-1 text-base font-black text-slate-900 truncate">
                  {selectedJob.location?.city}
                </p>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {selectedJob.location?.state} ({selectedJob.location?.pincode})
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
                    {selectedJob.location?.city}, {selectedJob.location?.state} -{" "}
                    {selectedJob.location?.pincode}
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

            {/* Employer Contact Card */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Direct Employer Contact
                  </h4>
                </div>
                <span className="text-xs text-emerald-700 font-medium">
                  Verified Contact
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                Connect directly with <strong>{selectedJob.employerId?.name}</strong> to apply and discuss work details. No middleman charges.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {selectedJob.employerId?.phone ? (
                  <>
                    <a
                      href={`tel:${selectedJob.employerId.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-sm cursor-pointer"
                    >
                      <Phone size={16} />
                      Call {selectedJob.employerId.phone}
                    </a>

                    <button
                      onClick={() => handleCopyPhone(selectedJob.employerId.phone)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition cursor-pointer"
                    >
                      {copiedPhone ? "Copied!" : "Copy Number"}
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    Phone contact not provided.
                  </p>
                )}

                {selectedJob.employerId?.email && (
                  <a
                    href={`mailto:${selectedJob.employerId.email}?subject=Job Application for ${encodeURIComponent(selectedJob.title)}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end">
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
