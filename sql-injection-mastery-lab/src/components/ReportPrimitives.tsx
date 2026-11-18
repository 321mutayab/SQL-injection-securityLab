import React, { useState } from 'react';
import { Check, Copy, Lock, ShieldAlert, ShieldCheck, Terminal, Globe } from 'lucide-react';

interface ReportPageProps {
  pageNumber?: number;
  totalPages?: number;
  sectionId?: string;
  chapterLabel: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  sectionId,
  chapterLabel,
  title,
  subtitle,
  children,
}) => {
  return (
    <section
      id={sectionId}
      className="report-page relative bg-[#0B1120] border border-slate-800/90 rounded-xl p-6 sm:p-10 mb-8 shadow-2xl scroll-mt-20"
    >
      {/* Clean Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-sky-400 font-medium">{chapterLabel}</span>
          <span aria-hidden="true">·</span>
          <span>CYBERSECURITY PRACTICAL DOCUMENTATION</span>
        </div>
        <div className="font-mono text-slate-300">
          Mutayyab Rehman &amp; Muhammad Meeran
        </div>
      </div>

      {/* Section Title Block */}
      <div className="mb-6">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50 font-display"
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Page Content */}
      <div className="space-y-6 text-slate-200 leading-relaxed text-[15px]">
        {children}
      </div>

      {/* Clean Bottom Footer */}
      <div className="mt-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <span>SQL INJECTION (SQLi) PRACTICAL LABORATORY</span>
        <span className="text-emerald-400">Instructor: Shah Muhammad Sab</span>
      </div>
    </section>
  );
};

interface CodeBlockProps {
  filename: string;
  language: string;
  code: string;
  highlightLines?: number[];
  variant?: 'neutral' | 'vulnerable' | 'secure';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename,
  language,
  code,
  variant = 'neutral',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const borderClass =
    variant === 'vulnerable'
      ? 'border-rose-500/40'
      : variant === 'secure'
      ? 'border-emerald-500/40'
      : 'border-slate-800';

  const headerBg =
    variant === 'vulnerable'
      ? 'bg-rose-950/30 border-rose-500/30'
      : variant === 'secure'
      ? 'bg-emerald-950/30 border-emerald-500/30'
      : 'bg-slate-900/90 border-slate-800';

  return (
    <div className={`rounded-lg border ${borderClass} bg-[#060A12] overflow-hidden my-4`}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${headerBg}`}>
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-slate-200 font-medium">{filename}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{language}</span>
          {variant === 'vulnerable' && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Vulnerable Code
              </span>
            </>
          )}
          {variant === 'secure' && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Code
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

interface BrowserMockupProps {
  url?: string;
  modeLabel: string;
  usernameValue: string;
  passwordValue: string;
  statusType: 'idle' | 'success' | 'error' | 'bypass';
  statusTitle: string;
  statusDetail: string;
  executedQuery: string;
  caption: string;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  url = 'http://127.0.0.1:5000/login',
  modeLabel,
  usernameValue,
  passwordValue,
  statusType,
  statusTitle,
  statusDetail,
  executedQuery,
  caption,
}) => {
  return (
    <figure className="my-5">
      <div className="rounded-xl border border-slate-700/80 bg-[#090E1A] overflow-hidden shadow-lg">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
          </div>
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1 rounded bg-[#050811] border border-slate-800 font-mono text-slate-300 text-xs">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
            {modeLabel}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#0B1324]">
          <div className="lg:col-span-6 bg-[#070B14] border border-slate-800 rounded-lg p-5">
            <div className="text-xs font-mono text-sky-400 mb-1">
              LOCAL LAB PORTAL
            </div>
            <h4 className="text-base font-semibold text-white mb-4 font-display">
              User Authentication Login
            </h4>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Username</label>
                <div className="px-3 py-2 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-sky-300 break-all">
                  {usernameValue || <span className="text-slate-600">(empty)</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Password</label>
                <div className="px-3 py-2 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300">
                  {passwordValue || <span className="text-slate-600">(empty)</span>}
                </div>
              </div>
              <div className="pt-1">
                <div className="w-full py-2 px-4 rounded bg-sky-600 text-white text-center text-xs font-semibold">
                  Sign In
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                statusType === 'bypass'
                  ? 'bg-rose-950/35 border-rose-500/50 text-rose-200'
                  : statusType === 'success'
                  ? 'bg-emerald-950/35 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1">
                {statusType === 'bypass' && (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-rose-400 font-semibold">
                      AUTHENTICATION BYPASSED
                    </span>
                  </>
                )}
                {statusType === 'success' && (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-semibold">
                      LOGIN ACCEPTED
                    </span>
                  </>
                )}
                {statusType === 'error' && (
                  <>
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-amber-400 font-semibold">
                      LOGIN REJECTED
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm font-semibold text-white">{statusTitle}</div>
              <p className="text-xs mt-1 opacity-90 leading-relaxed">{statusDetail}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#050811] border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-1.5">
                SQL QUERY EXECUTED:
              </div>
              <code className="block text-xs font-mono text-sky-300 break-all leading-relaxed">
                {executedQuery}
              </code>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-slate-400 font-mono text-center">
        {caption}
      </figcaption>
    </figure>
  );
};
