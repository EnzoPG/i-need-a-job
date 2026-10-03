"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "loading";

export type ToastOptions = {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastContextType = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: string }>>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      id = String(Date.now() + Math.random()),
      type = "info",
      title,
      message,
      duration = 4000,
    }: ToastOptions) => {
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0 && type !== "loading") {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          let icon = <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />;
          if (t.type === "success") {
            icon = (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            );
          } else if (t.type === "error") {
            icon = (
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            );
          } else if (t.type === "loading") {
            icon = (
              <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0 mt-0.5" />
            );
          }

          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-surface border border-border rounded-xl p-4 shadow-md flex items-start gap-3 transition-all"
            >
              {icon}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary leading-tight">
                  {t.title}
                </p>
                {t.message && (
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5 shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
