/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PagesPart1 } from './components/PagesPart1';
import { PagesPart2 } from './components/PagesPart2';
import { PagesPart3 } from './components/PagesPart3';
import { downloadCompleteSqlInjectionPdf } from './utils/generatePdfReport';
import {
  Download,
  CheckCircle2,
  ArrowUp,
  Loader2,
  Shield,
  BookOpen,
  Database,
  ShieldAlert,
  Layers,
  Terminal,
  FileCode2,
  Play,
  AlertTriangle,
  ShieldCheck,
  Lock,
  CheckSquare,
  Award,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const SIDEBAR_GROUPS: NavGroup[] = [
  {
    groupTitle: 'OVERVIEW & THEORY',
    items: [
      { id: 'cover-page', label: 'Cover & Student Details', icon: Shield },
      { id: 'table-of-contents', label: 'Table of Contents', icon: BookOpen },
      { id: 'sec-1', label: 'Project Overview', icon: Layers },
      { id: 'sec-3', label: 'Database Fundamentals', icon: Database },
      { id: 'sec-5', label: 'How SQL Injection Works', icon: ShieldAlert },
      { id: 'sec-6', label: 'Types of SQL Injection', icon: AlertTriangle },
    ],
  },
  {
    groupTitle: 'PRACTICAL LAB & ATTACK',
    items: [
      { id: 'sec-7', label: 'Laboratory Environment', icon: Terminal },
      { id: 'sec-8', label: 'Vulnerable Login Code', icon: FileCode2 },
      { id: 'sec-9', label: 'Practical Attack Demo', icon: Play },
      { id: 'sec-10', label: 'Attack Results & Risks', icon: ShieldAlert },
    ],
  },
  {
    groupTitle: 'PREVENTION & FIX',
    items: [
      { id: 'sec-12', label: 'SQL Injection Prevention', icon: ShieldCheck },
      { id: 'sec-13', label: 'Secure Login Code', icon: Lock },
      { id: 'sec-14', label: 'Testing & Verification', icon: CheckSquare },
      { id: 'sec-16', label: 'Conclusion & References', icon: Award },
    ],
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('cover-page');
  const [instructor, setInstructor] = useState('Shah Muhammad Sab');
  const [university, setUniversity] = useState('Department of Computer Science & Cybersecurity');
  const [submissionDate, setSubmissionDate] = useState('November 2026');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await downloadCompleteSqlInjectionPdf({
        instructor,
        university,
        submissionDate,
      });
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 5000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT (HIDDEN ON PDF PRINT)
      ===================================================================== */}
      <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#070B14]/95 backdrop-blur border-b border-slate-800/90">
        {/* Zone 1: Brand Title, One Line */}
        <a
          href="#cover-page"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('cover-page');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
        >
          SQLi Security Lab Report
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#cover-page"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('cover-page');
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Cover &amp; Details
          </a>
          <a
            href="#sec-5"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('sec-5');
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            How SQLi Works
          </a>
          <a
            href="#sec-8"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('sec-8');
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Vulnerable Code
          </a>
          <a
            href="#sec-9"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('sec-9');
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Attack Demo
          </a>
          <a
            href="#sec-12"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('sec-12');
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Prevention &amp; Fix
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : pdfDownloaded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PDF Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE: STYLISH EXECUTIVE SIDEBAR + REPORT DOCUMENT
      ===================================================================== */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start flex-1">
        {/* Stylish Left Sidebar */}
        <aside className="no-print hidden xl:flex xl:col-span-3 sticky top-20 bg-[#0B1120] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl flex-col max-h-[calc(100vh-6rem)]">
          {/* Stylish Top Student & Instructor Profile Header */}
          <div className="p-4 bg-gradient-to-b from-slate-900 via-[#0E172A] to-[#0B1120] border-b border-slate-800/90 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-sky-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono text-sky-400 tracking-wider">
                  CYBERSECURITY LAB
                </div>
                <div className="text-sm font-bold text-white font-display truncate">
                  SQL Injection (SQLi)
                </div>
              </div>
            </div>

            {/* Student Name Cards */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-lg bg-[#070B14]/90 border border-slate-800/90 flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-bold font-mono text-emerald-300 shrink-0">
                  MR
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    Mutayyab Rehman
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    Roll No: 2672
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#070B14]/90 border border-slate-800/90 flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs font-bold font-mono text-sky-300 shrink-0">
                  MM
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    Muhammad Meeran
                  </div>
                  <div className="text-[11px] font-mono text-sky-400">
                    Roll No: 2680
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Showcase Strip */}
            <div className="px-3 py-2 rounded-lg bg-emerald-950/25 border border-emerald-500/30 flex items-center gap-2 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Instructor: </span>
                <span className="text-emerald-300 font-semibold">{instructor}</span>
              </div>
            </div>
          </div>

          {/* Categorized Navigation Links (Scrollable Middle Area) */}
          <div className="p-3.5 overflow-y-auto space-y-4 flex-1">
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.groupTitle} className="space-y-1">
                <div className="px-2.5 text-[10px] font-mono font-semibold text-slate-400 tracking-wider">
                  {group.groupTitle}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`group w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                          isActive
                            ? 'bg-sky-500/15 text-white font-semibold border-sky-500/40 shadow-sm'
                            : 'border-transparent text-slate-300 hover:bg-slate-900/90 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive
                                ? 'text-sky-400'
                                : 'text-slate-500 group-hover:text-sky-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isActive
                              ? 'text-sky-400 translate-x-0.5'
                              : 'text-slate-600 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Dock */}
          <div className="p-3.5 bg-[#070B14] border-t border-slate-800/90">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="w-full py-2.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Complete PDF Report</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Report Stream */}
        <main className="xl:col-span-9 min-w-0">
          <PagesPart1
            onNavigateSection={scrollToSection}
            instructor={instructor}
            setInstructor={setInstructor}
            university={university}
            setUniversity={setUniversity}
            submissionDate={submissionDate}
            setSubmissionDate={setSubmissionDate}
          />
          <PagesPart2 />
          <PagesPart3 />
        </main>
      </div>

      {/* Quiet Footer (Hidden on Print) */}
      <footer className="no-print border-t border-slate-800/80 bg-[#050811] py-6 px-6 text-xs text-slate-400">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            SQL Injection (SQLi) — Practical Web Application Attack and Prevention Laboratory ·
            Submitted by Mutayyab Rehman (Roll No: 2672) &amp; Muhammad Meeran (Roll No: 2680) ·
            Instructor: {instructor}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('cover-page')}
              className="text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Download PDF File
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
