"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ToastContext } from "@/context/ToastContext";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
  Loader2,
} from "lucide-react";

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES = {
  success: {
    bg: "bg-white/95 border-emerald-200/80 shadow-emerald-500/10",
    iconContainer: "bg-emerald-100/90 text-emerald-600 border border-emerald-200",
    accentBar: "bg-emerald-500",
    progress: "bg-emerald-500",
    title: "text-emerald-950",
  },
  error: {
    bg: "bg-white/95 border-rose-200/80 shadow-rose-500/10",
    iconContainer: "bg-rose-100/90 text-rose-600 border border-rose-200",
    accentBar: "bg-rose-500",
    progress: "bg-rose-500",
    title: "text-rose-950",
  },
  warning: {
    bg: "bg-white/95 border-amber-200/80 shadow-amber-500/10",
    iconContainer: "bg-amber-100/90 text-amber-600 border border-amber-200",
    accentBar: "bg-amber-500",
    progress: "bg-amber-500",
    title: "text-amber-950",
  },
  info: {
    bg: "bg-white/95 border-blue-200/80 shadow-blue-500/10",
    iconContainer: "bg-blue-100/90 text-blue-600 border border-blue-200",
    accentBar: "bg-blue-500",
    progress: "bg-blue-500",
    title: "text-blue-950",
  },
};

function ToastItem({ toast, onDismiss }) {
  const { id, type = "info", title, message, duration = 4000 } = toast;
  const Icon = TOAST_ICONS[type] || Info;
  const style = TOAST_STYLES[type] || TOAST_STYLES.info;

  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(id);
    }, remainingTimeRef.current);
  }, [id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`relative w-full overflow-hidden rounded-2xl border backdrop-blur-md shadow-2xl p-4 transition-all duration-300 transform translate-y-0 opacity-100 ${style.bg} pointer-events-auto`}
      role="alert"
    >
      {/* Accent left indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentBar}`} />

      <div className="flex items-start gap-3.5 pl-1.5 pr-2">
        {/* Glowing Icon Badge */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconContainer} shadow-xs`}
        >
          <Icon size={20} className="stroke-[2.2]" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pt-0.5">
          {title && (
            <h4 className={`text-sm font-black tracking-tight ${style.title}`}>
              {title}
            </h4>
          )}
          {message && (
            <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-0.5 whitespace-pre-line">
              {message}
            </p>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(id)}
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>

      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${style.progress} transition-all duration-linear`}
          style={{
            animation: `toastProgress ${duration}ms linear forwards`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmDialogState, setConfirmDialogState] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
      setToasts((prev) => [
        ...prev.slice(-4), // keep maximum 5 active toasts
        { id, type, title, message, duration },
      ]);
      return id;
    },
    []
  );

  const toast = {
    success: (title, message, duration = 4000) =>
      showToast({ type: "success", title, message, duration }),
    error: (title, message, duration = 4500) =>
      showToast({ type: "error", title, message, duration }),
    warning: (title, message, duration = 4000) =>
      showToast({ type: "warning", title, message, duration }),
    info: (title, message, duration = 4000) =>
      showToast({ type: "info", title, message, duration }),
    dismiss: removeToast,
  };

  // Promise-based confirmation popup
  const confirmDialog = useCallback(
    ({
      title = "Are you sure?",
      message = "This action cannot be undone.",
      confirmText = "Confirm",
      cancelText = "Cancel",
      type = "danger",
    }) => {
      return new Promise((resolve) => {
        setConfirmDialogState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          type,
          onConfirm: () => {
            setConfirmDialogState(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmDialogState(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, confirmDialog }}>
      {children}

      {/* ── FLOATING TOAST NOTIFICATION STACK ── */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-9999 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onDismiss={removeToast} />
        ))}
      </div>

      {/* ── CONFIRMATION MODAL POPUP ── */}
      {confirmDialogState && confirmDialogState.isOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={confirmDialogState.onCancel}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative gradient bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                confirmDialogState.type === "danger"
                  ? "bg-linear-to-r from-red-500 to-rose-600"
                  : "bg-linear-to-r from-orange-500 to-amber-500"
              }`}
            />

            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  confirmDialogState.type === "danger"
                    ? "bg-red-100 text-red-600 border border-red-200"
                    : "bg-amber-100 text-amber-600 border border-amber-200"
                } shadow-xs`}
              >
                {confirmDialogState.type === "danger" ? (
                  <Trash2 size={24} className="stroke-[2.2]" />
                ) : (
                  <AlertTriangle size={24} className="stroke-[2.2]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {confirmDialogState.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {confirmDialogState.message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={confirmDialogState.onCancel}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                {confirmDialogState.cancelText}
              </button>

              <button
                type="button"
                onClick={confirmDialogState.onConfirm}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-md transition-all cursor-pointer ${
                  confirmDialogState.type === "danger"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                }`}
              >
                {confirmDialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
