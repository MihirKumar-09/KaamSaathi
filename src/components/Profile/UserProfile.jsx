"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import NavbarLayout from "@/components/navbar/NavbarLayout";
import FooterLayout from "@/components/footer/FooterLayout";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Lock,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  LogOut,
  Sparkles,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function UserProfile() {
  const { user, refreshUser, logout } = useContext(AuthContext);
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  // Password Change States
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch complete profile and stats
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const u = data.user;
          setName(u.name || "");
          setPhone(u.phone || "");
          setGender(u.gender || "Male");
          setBio(u.bio || "");
          setProfileImage(u.profileImage || "");
          setImagePreview(u.profileImage || "");
          setLocation({
            state: u.location?.state || "",
            district: u.location?.district || "",
            city: u.location?.city || "",
            pincode: u.location?.pincode || "",
          });
          setStats(data.stats || {});
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handle Photo Picker
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", "Please select an image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Please choose an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProfileImage(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Save General Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Required Field", "Please enter your name.");
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Invalid Phone", "Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          gender,
          bio: bio.trim(),
          location,
          profileImage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profile Updated", "Your profile details have been saved.");
        await refreshUser();
      } else {
        toast.error("Update Failed", data.message || "Could not update profile.");
      }
    } catch {
      toast.error("Network Error", "Unable to save profile changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current Password", "Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New Password", "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mismatch", "New password and confirmation do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Password Changed", "Your password was successfully updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
      } else {
        toast.error("Failed", data.message || "Could not change password.");
      }
    } catch {
      toast.error("Network Error", "Unable to change password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const isEmployer = user?.role === "employer";
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <NavbarLayout role={isEmployer ? "employer" : "worker"} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ── BREADCRUMB ── */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link
            href={isEmployer ? "/employer/dashboard" : "/worker/dashboard"}
            className="hover:text-orange-600 transition"
          >
            {isEmployer ? "Employer Portal" : "Worker Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-bold">Profile</span>
        </div>

        {/* ── PROFILE HERO CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Profile Avatar with Upload Button */}
              <div className="relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={name || "User Avatar"}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md ring-2 ring-orange-100"
                  />
                ) : (
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-md ${
                      isEmployer
                        ? "bg-linear-to-br from-purple-600 via-indigo-600 to-purple-700"
                        : "bg-linear-to-br from-orange-500 via-amber-500 to-orange-600"
                    }`}
                  >
                    {userInitial}
                  </div>
                )}

                {/* Camera upload overlay button */}
                <label className="absolute bottom-0 right-0 translate-x-1 translate-y-1 p-2 rounded-2xl bg-white text-slate-700 hover:text-orange-600 hover:bg-orange-50 shadow-md border border-slate-200 cursor-pointer transition">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User Identity Details */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                    {user?.name || "User Profile"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      isEmployer
                        ? "bg-purple-100 text-purple-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {isEmployer ? <Building2 size={12} /> : <Briefcase size={12} />}
                    <span>{isEmployer ? "Employer" : "Worker"}</span>
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Mail size={13} className="text-slate-400" />
                    <span>{user?.email}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Phone size={13} className="text-slate-400" />
                    <span>+91 {user?.phone || "No phone"}</span>
                  </span>
                  {user?.createdAt && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar size={13} />
                      <span>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  )}
                </div>

                {bio && (
                  <p className="mt-2.5 text-xs text-slate-600 font-medium max-w-lg leading-relaxed">
                    &ldquo;{bio}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action / Logout */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <Link
                href="/applications"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-2xs"
              >
                <span>Applications</span>
                <ArrowRight size={13} />
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ROW (CONDITIONAL BASED ON ROLE) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {isEmployer ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Posted Jobs</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalPostedJobs || 0}</p>
                <span className="text-xs text-slate-500 font-medium">All vacancies</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Open Openings</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{stats.openJobs || 0}</p>
                <span className="text-xs text-emerald-600 font-medium">Accepting applicants</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-purple-600 block">Candidates Received</span>
                <p className="text-2xl font-black text-purple-700 mt-1">{stats.totalApplicationsReceived || 0}</p>
                <span className="text-xs text-purple-600 font-medium">Worker submissions</span>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Applied Jobs</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalApplied || 0}</p>
                <span className="text-xs text-slate-500 font-medium">Applications submitted</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Under Review</span>
                <p className="text-2xl font-black text-amber-700 mt-1">{stats.pendingReview || 0}</p>
                <span className="text-xs text-amber-600 font-medium">Awaiting employer decision</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Accepted / Selected</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{stats.acceptedCount || 0}</p>
                <span className="text-xs text-emerald-600 font-medium">Positions shortlisted</span>
              </div>
            </>
          )}
        </div>

        {/* ── TWO COLUMN MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN: EDIT PERSONAL & LOCATION DETAILS (2 Cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                <User size={18} className="text-orange-500" />
                <span>Personal & Contact Information</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Update your basic details, contact number, and geographical location.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Full Name & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:bg-white focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:bg-white focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Email (Read-Only) & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-[10px] text-slate-400 lowercase">(read only)</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                      <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGender(g)}
                          className={`py-3 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                            gender === g
                              ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio / About */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Bio / Short Description <span className="text-[10px] text-slate-400 lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe yourself or your trade background..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:border-orange-500 transition resize-none"
                  />
                </div>

                {/* Location Section */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-500" />
                    <span>Location Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
                      <input
                        type="text"
                        value={location.state}
                        onChange={(e) => setLocation((prev) => ({ ...prev, state: e.target.value }))}
                        placeholder="State"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
                      <input
                        type="text"
                        value={location.district}
                        onChange={(e) => setLocation((prev) => ({ ...prev, district: e.target.value }))}
                        placeholder="District"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                      <input
                        type="text"
                        value={location.city}
                        onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={location.pincode}
                        onChange={(e) =>
                          setLocation((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, "") }))
                        }
                        placeholder="6-digit pincode"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SECURITY & PASSWORD + QUICK SHORTCUTS (1 Col) ── */}
          <div className="space-y-6">
            {/* Password & Security Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <KeyRound size={16} className="text-orange-500" />
                  <span>Account Security</span>
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Protected
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium mb-4">
                Keep your login password strong and secure.
              </p>

              {!showPasswordSection ? (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock size={13} />
                  <span>Change Password</span>
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Navigation Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quick Shortcuts
              </h3>

              <div className="space-y-2">
                <Link
                  href="/applications"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:border-orange-200 border border-slate-100 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Briefcase size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition">
                        Job Applications
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {isEmployer ? "Review candidates" : "Track applied jobs"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-orange-500 transition" />
                </Link>

                {isEmployer ? (
                  <Link
                    href="/post-job"
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Building2 size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                          Post New Job
                        </p>
                        <p className="text-[10px] text-slate-500">Create hiring listing</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-blue-500 transition" />
                  </Link>
                ) : (
                  <Link
                    href="/jobs"
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Briefcase size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          Browse Open Jobs
                        </p>
                        <p className="text-[10px] text-slate-500">Discover active vacancies</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-emerald-500 transition" />
                  </Link>
                )}
              </div>
            </div>

            {/* Trust & Verification Badge */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs mb-1">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Verified KaamSaathi Member</span>
              </div>
              <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                Your account is authenticated. Never share your password or one-time passwords with anyone.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterLayout />
    </div>
  );
}
