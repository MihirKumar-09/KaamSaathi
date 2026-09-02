"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
  Users,
  Navigation,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Check,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  "Driver", "Electrician", "Plumber", "Carpenter", "Painter",
  "Cook", "Housekeeping", "Security Guard", "Delivery", "Gardener",
  "Mechanic", "Welder", "Mason", "Tailor", "Cleaner",
  "AC Technician", "Beautician", "Helper", "Other",
];

export default function PostJobForm({ onJobCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Driver",
    vacancy: 1,
    salary: {
      amount: "",
      type: "Monthly",
    },
    location: {
      state: "",
      city: "",
      address: "",
      pincode: "",
    },
    description: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      salary: { ...prev.salary, [field]: value },
    }));
  };

  const handleLocationChange = (field, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  // Geolocation with proper error handling
  const handleGetLocation = () => {
    if (typeof window === "undefined") return;
    if (!navigator || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Please enter location manually.");
      return;
    }

    setLocating(true);
    setError("");

    const onSuccess = async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "KaamSaathi/1.0",
            },
          }
        );

        if (!res.ok) throw new Error("Address lookup failed");

        const data = await res.json();
        const addr = data.address || {};

        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            state: addr.state || prev.location.state || "",
            city:
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              prev.location.city ||
              "",
            address:
              addr.suburb ||
              addr.neighbourhood ||
              addr.road ||
              prev.location.address ||
              "",
            pincode: addr.postcode || prev.location.pincode || "",
          },
        }));
      } catch (err) {
        console.error("Reverse geocode error:", err);
        setError("Could not fetch address from your location. Please fill in manually.");
      } finally {
        setLocating(false);
      }
    };

    const onError = (geoErr) => {
      setLocating(false);
      let msg = "Unable to get your location. Please enter it manually.";

      if (geoErr && typeof geoErr === "object") {
        switch (geoErr.code) {
          case 1: // PERMISSION_DENIED
            msg = "Location permission was denied. Please allow location access in your browser settings, or enter the address manually.";
            break;
          case 2: // POSITION_UNAVAILABLE
            msg = "Location information is currently unavailable. Please enter your address manually.";
            break;
          case 3: // TIMEOUT
            msg = "Location request timed out. Please try again or enter the address manually.";
            break;
        }
      }

      setError(msg);
    };

    try {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: false, // use network-based (faster, no GPS error)
        timeout: 10000,
        maximumAge: 60000,
      });
    } catch (err) {
      setLocating(false);
      setError("Could not access GPS. Please enter your location manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.title.trim()) {
      setError("Please provide a job title.");
      return;
    }
    if (formData.title.trim().length > 80) {
      setError("Job title cannot exceed 80 characters.");
      return;
    }
    if (!formData.category) {
      setError("Please select a job category.");
      return;
    }
    if (!formData.salary.amount || Number(formData.salary.amount) <= 0) {
      setError("Please enter a valid salary amount.");
      return;
    }
    if (!formData.location.state.trim() || !formData.location.city.trim()) {
      setError("Please enter the state and city for the job location.");
      return;
    }
    const cleanPin = formData.location.pincode.toString().trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please provide a job description.");
      return;
    }
    if (formData.description.trim().length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        vacancy: Math.max(1, Number(formData.vacancy) || 1),
        salary: {
          amount: Number(formData.salary.amount),
          type: formData.salary.type,
        },
        location: {
          state: formData.location.state.trim(),
          city: formData.location.city.trim(),
          address: formData.location.address.trim(),
          pincode: cleanPin,
        },
        description: formData.description.trim(),
        status: formData.status,
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data?.message || "Failed to post job. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (onJobCreated) onJobCreated(data.job);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back Button */}
      <button
        type="button"
        onClick={onCancel}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Job Listings
      </button>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <Briefcase size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Post a New Job</h2>
              <p className="text-sm text-slate-500">
                Fill in the details below to publish a job opening
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 py-6 sm:px-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={18} className="shrink-0 text-green-500" />
              <span>Job posted successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {formData.title.length}/80
                </span>
              </div>
              <input
                type="text"
                name="title"
                maxLength={80}
                placeholder="e.g. Experienced Electrician, Full-time Cook"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary + Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Salary (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 18000"
                    value={formData.salary.amount}
                    onChange={(e) => handleSalaryChange("amount", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Pay Period
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden">
                  {["Monthly", "Yearly"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSalaryChange("type", type)}
                      className={`flex-1 py-3 text-sm font-semibold transition cursor-pointer ${
                        formData.salary.type === type
                          ? "bg-orange-500 text-white"
                          : "bg-white text-slate-600 hover:bg-orange-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vacancies */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                Number of Vacancies
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        vacancy: Math.max(1, Number(prev.vacancy) - 1),
                      }))
                    }
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 transition cursor-pointer text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="px-5 py-3 text-sm font-bold text-slate-900 border-x border-slate-300 min-w-[48px] text-center">
                    {formData.vacancy}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        vacancy: Number(prev.vacancy) + 1,
                      }))
                    }
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 transition cursor-pointer text-lg font-medium"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-slate-500">workers needed</span>
              </div>
            </div>

            {/* Location Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-orange-600" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Job Location <span className="text-red-500">*</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 transition cursor-pointer disabled:opacity-50"
                >
                  {locating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation size={13} />
                      Use My Location
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    value={formData.location.state}
                    onChange={(e) => handleLocationChange("state", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange("city", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 110001"
                    value={formData.location.pincode}
                    onChange={(e) => handleLocationChange("pincode", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Address / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Metro Station"
                    value={formData.location.address}
                    onChange={(e) => handleLocationChange("address", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {formData.description.length}/2000
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={2000}
                placeholder="Describe duties, timings, requirements, and any benefits..."
                value={formData.description}
                onChange={(e) => {
                  setError("");
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 leading-relaxed"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Publish Status</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formData.status === "Open"
                    ? "Workers will see this job immediately"
                    : "Job will be saved but not visible to workers"}
                </p>
              </div>
              <div className="flex gap-2">
                {["Open", "Closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: st }))
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      formData.status === st
                        ? st === "Open"
                          ? "bg-green-500 text-white"
                          : "bg-slate-400 text-white"
                        : "bg-white border border-slate-300 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {st === "Open" ? "Active" : "Draft"}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || success}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publishing...
                  </>
                ) : success ? (
                  <>
                    <Check size={16} />
                    Published!
                  </>
                ) : (
                  "Publish Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
