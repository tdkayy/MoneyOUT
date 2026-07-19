import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Menu, ReceiptText, X } from "lucide-react";

const REPOSITORY_URL = "https://github.com/tdkayy/expense-management-dashboard";

export default function Layout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous || "";
    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [open]);

  const active = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-white">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold leading-tight">Expense Manager</div>
              <div className="text-[11px] text-slate-500">Transactions, imports and spending summaries</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/dashboard" current={active("/dashboard")}>Dashboard</NavLink>
            <NavLink to="/documentation" current={active("/documentation")}>Documentation</NavLink>
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              <Github className="h-4 w-4" />
              View code
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-950 text-white" role="dialog" aria-modal="true">
          <div className="flex h-full flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 font-semibold">
                <ReceiptText className="h-6 w-6" />
                Expense Manager
              </div>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-7 w-7" />
              </button>
            </div>

            <nav className="mt-16 space-y-6 text-2xl font-semibold">
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block hover:text-blue-300">
                Dashboard
              </Link>
              <Link to="/documentation" onClick={() => setOpen(false)} className="block hover:text-blue-300">
                Documentation
              </Link>
            </nav>

            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-slate-950"
            >
              <Github className="h-5 w-5" />
              View code
            </a>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        {children}
        <footer className="mt-auto border-t border-slate-200 bg-white/70 px-4 py-5 text-center text-sm text-slate-500">
          Portfolio demonstration of React and third-party API integration.
        </footer>
      </div>
    </div>
  );
}

function NavLink({ to, current, children }) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        current ? "text-blue-700" : "text-slate-600 hover:text-blue-700"
      }`}
    >
      {children}
    </Link>
  );
}
