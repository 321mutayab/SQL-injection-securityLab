import React, { useState } from 'react';
import { ReportPage } from './ReportPrimitives';
import { Database, ArrowRight } from 'lucide-react';

interface PagesPart1Props {
  onNavigateSection: (sectionId: string) => void;
  instructor: string;
  setInstructor: (val: string) => void;
  university: string;
  setUniversity: (val: string) => void;
  submissionDate: string;
  setSubmissionDate: (val: string) => void;
}

export const PagesPart1: React.FC<PagesPart1Props> = ({
  onNavigateSection,
  instructor,
  setInstructor,
  university,
  setUniversity,
  submissionDate,
  setSubmissionDate,
}) => {
  const [coverImageError, setCoverImageError] = useState(false);
  const [attackFlowImageError, setAttackFlowImageError] = useState(false);

  const tocItems = [
    { title: 'Project Overview', id: 'sec-1', desc: 'What this project is and why SQL Injection matters' },
    { title: 'Introduction to SQL Injection & Architecture', id: 'sec-2', desc: 'How a website login form talks to a database using SQL' },
    { title: 'SQL & Database Fundamentals', id: 'sec-3', desc: 'Tables, rows, columns, and our sample users table' },
    { title: 'How SQL Injection Is Created & Works', id: 'sec-5', desc: 'How joining strings creates SQLi and how the bypass works step by step' },
    { title: 'Types of SQL Injection', id: 'sec-6', desc: 'Authentication Bypass, Error-Based, UNION-Based, and Blind SQLi' },
    { title: 'Laboratory Environment & Setup', id: 'sec-7', desc: 'Setting up Python, Flask, and SQLite locally' },
    { title: 'Vulnerable Login Application', id: 'sec-8', desc: 'Complete vulnerable Flask login code and simple explanation' },
    { title: 'Practical Attack Demonstration & Results', id: 'sec-9', desc: "Testing normal login vs. ' OR '1'='1' -- login bypass" },
    { title: 'SQL Injection Prevention & Secure Code', id: 'sec-12', desc: 'Stopping SQL Injection using Parameterized Queries (?)' },
    { title: 'Testing, Checklist, Conclusion & References', id: 'sec-14', desc: 'Verifying the secure app, security checklist, and references' },
  ];

  return (
    <>
      {/* =====================================================================
          COVER PAGE: PROJECT NAME -> STUDENT DETAILS -> STYLISH COVER VISUAL
      ===================================================================== */}
      <section
        id="cover-page"
        className="report-page relative bg-[#0B1120] border border-slate-800 rounded-xl p-6 sm:p-10 mb-8 shadow-2xl overflow-hidden scroll-mt-20"
      >
        {/* 1. PROJECT NAME FIRST */}
        <div className="pb-6 mb-6 border-b border-slate-800">
          <div className="text-xs sm:text-sm font-mono text-sky-400 tracking-wider mb-2">
            CYBERSECURITY PRACTICAL PROJECT DOCUMENTATION
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-tight"
            style={{ textWrap: 'balance' }}
          >
            SQL INJECTION (SQLi)
          </h1>
          <p className="mt-2.5 text-lg sm:text-2xl text-emerald-400 font-display font-medium">
            Practical Web Application Attack and Prevention Laboratory
          </p>
        </div>

        {/* 2. STUDENT & INSTRUCTOR DETAILS SECOND */}
        <div className="mb-8 bg-[#070B14] border border-emerald-500/40 rounded-xl p-6">
          <div className="text-xs font-mono text-emerald-400 font-semibold mb-4">
            STUDENT &amp; INSTRUCTOR DETAILS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-mono text-xs">STUDENT NAME:</span>
                <span className="text-white font-bold tracking-wide">
                  Mutayyab Rehman (Roll No: 2672)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-mono text-xs">STUDENT NAME:</span>
                <span className="text-white font-bold tracking-wide">
                  Muhammad Meeran (Roll No: 2680)
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-mono text-xs">COURSE:</span>
                <span className="text-slate-100 font-semibold">Cybersecurity</span>
              </div>
              <div className="flex items-baseline justify-between pb-1">
                <span className="text-slate-400 font-mono text-xs">PROJECT TYPE:</span>
                <span className="text-sky-300 font-medium">Web Application Security Practical</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">
                  INSTRUCTOR NAME:
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full bg-slate-900/70 border-b border-slate-700 focus:border-sky-400 focus:outline-none px-2.5 py-1 text-emerald-300 font-bold rounded-t text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">
                  DEPARTMENT / UNIVERSITY:
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-slate-900/70 border-b border-slate-700 focus:border-sky-400 focus:outline-none px-2.5 py-1 text-slate-100 font-medium rounded-t text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">
                  SUBMISSION DATE:
                </label>
                <input
                  type="text"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="w-full bg-slate-900/70 border-b border-slate-700 focus:border-sky-400 focus:outline-none px-2.5 py-1 text-slate-100 font-medium rounded-t text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. STYLISH CYBERSECURITY COVER PICTURE */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12] relative">
          {!coverImageError ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src="/src/assets/images/sqli_cyber_cover_illustration_1794985563374.jpg"
                alt="Cybersecurity relational database server architecture and defense shield nodes"
                referrerPolicy="no-referrer"
                onError={() => setCoverImageError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/25 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-emerald-400">
                    WEB APPLICATION &amp; DATABASE SECURITY ARCHITECTURE
                  </div>
                  <div className="text-sm font-semibold text-white">
                    How SQL Injection Is Created, Demonstrated &amp; Prevented
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
                  Instructor: {instructor}
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-[#0B1528] to-emerald-950/30 text-center">
              <Database className="w-14 h-14 text-sky-400 mb-3" />
              <div className="text-lg font-bold text-white font-display">
                Relational Database Security &amp; Parameterized Query Architecture
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          TABLE OF CONTENTS (NO INTEGER CLUTTER)
      ===================================================================== */}
      <ReportPage
        sectionId="table-of-contents"
        chapterLabel="DOCUMENTATION INDEX"
        title="Table of Contents"
        subtitle="Logical overview of the sections included in this SQL Injection practical documentation."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tocItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateSection(item.id)}
              className="group w-full text-left p-4 rounded-lg bg-[#070B14] hover:bg-slate-900/90 border border-slate-800/90 hover:border-sky-500/40 transition-colors flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{item.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors shrink-0 no-print" />
            </button>
          ))}
        </div>
      </ReportPage>

      {/* =====================================================================
          PROJECT OVERVIEW & INTRODUCTION TO SQL INJECTION
      ===================================================================== */}
      <ReportPage
        sectionId="sec-1"
        chapterLabel="PROJECT OVERVIEW & INTRODUCTION"
        title="Project Overview & Introduction to SQL Injection"
        subtitle="A clear, logical explanation of what SQL Injection is, how a website communicates with its database, and what this practical demonstrates."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-lg bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-sky-300 font-display">
              What This Project Demonstrates
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              This project demonstrates <strong>SQL Injection (SQLi)</strong> in a practical,
              easy-to-understand way. We build a local login website using <strong>Python</strong>,{' '}
              <strong>Flask</strong>, and a <strong>SQLite database</strong>. First, we show how a
              login page becomes vulnerable when user input is joined directly into a SQL query.
              Second, we show how to fix the vulnerability permanently using{' '}
              <strong>Parameterized Queries (<code>?</code>)</strong>.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-emerald-300 font-display">
              What SQL and SQL Injection Mean
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>SQL (Structured Query Language)</strong> is the standard language used by web
              servers to read and write data inside a database. <strong>SQL Injection</strong>{' '}
              happens when a user enters special SQL characters (such as a single quote{' '}
              <code>&apos;</code>) into a login box, tricking the database into running unintended
              commands and bypassing the password check.
            </p>
          </div>
        </div>

        {/* Web Application Architecture Diagram */}
        <div id="sec-2" className="p-6 rounded-xl bg-[#070B14] border border-slate-800 scroll-mt-20">
          <div className="text-xs font-mono text-sky-400 mb-1">
            WEB APPLICATION LOGIN ARCHITECTURE
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white font-display mb-4">
            How User Input Travels From Browser to Database
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
            {[
              {
                title: 'User / Browser',
                detail: 'User opens the login page on localhost.',
                color: 'border-slate-700 bg-slate-900/80',
              },
              {
                title: 'Login Form',
                detail: 'User types Username & Password and clicks Login.',
                color: 'border-sky-500/40 bg-sky-950/20',
              },
              {
                title: 'Backend Server',
                detail: 'Python Flask receives the submitted form text.',
                color: 'border-indigo-500/40 bg-indigo-950/20',
              },
              {
                title: 'SQL Query',
                detail: 'Backend creates a SELECT query to check credentials.',
                color: 'border-amber-500/40 bg-amber-950/20',
              },
              {
                title: 'Database',
                detail: 'SQLite checks the users table for a matching row.',
                color: 'border-emerald-500/40 bg-emerald-950/20',
              },
              {
                title: 'Response',
                detail: 'If a row matches, login succeeds; otherwise rejected.',
                color: 'border-slate-700 bg-slate-900/80',
              },
            ].map((node) => (
              <div
                key={node.title}
                className={`p-3.5 rounded-lg border ${node.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="text-sm font-bold font-display text-white mb-1">
                    {node.title}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{node.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReportPage>

      {/* =====================================================================
          SQL AND DATABASE FUNDAMENTALS
      ===================================================================== */}
      <ReportPage
        sectionId="sec-3"
        chapterLabel="DATABASE FUNDAMENTALS"
        title="SQL and Database Fundamentals"
        subtitle="Essential database concepts and the fictional users table used in our laboratory."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              term: 'Database & Table',
              def: 'A database file (local_lab_users.db) stores organized grids of data called tables (such as our users table).',
            },
            {
              term: 'Row & Column',
              def: 'Each horizontal Row stores one complete user account. Each vertical Column stores one field (username, password, role).',
            },
            {
              term: 'SELECT & WHERE',
              def: 'SELECT retrieves data from a table, while WHERE filters the rows so only accounts matching the condition are returned.',
            },
            {
              term: 'INSERT, UPDATE, DELETE',
              def: 'SQL commands used to add a new account (INSERT), modify an existing record (UPDATE), or remove a row (DELETE).',
            },
          ].map((item) => (
            <div
              key={item.term}
              className="p-4 rounded-lg bg-[#070B14] border border-slate-800/90"
            >
              <div className="text-sm font-bold text-sky-300 font-display mb-1">
                {item.term}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>

        {/* Example Users Table */}
        <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 mb-1">
            SAMPLE DATABASE TABLE
          </div>
          <h3 className="text-base font-bold text-white font-display mb-3">
            Laboratory Table: <code className="text-sky-300 font-mono">users</code>
          </h3>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
              <thead>
                <tr className="bg-slate-900 text-sky-300 border-b border-slate-800">
                  <th className="py-2.5 px-4">id</th>
                  <th className="py-2.5 px-4">username</th>
                  <th className="py-2.5 px-4">password</th>
                  <th className="py-2.5 px-4">role</th>
                  <th className="py-2.5 px-4">department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-[#050811]">
                <tr>
                  <td className="py-2.5 px-4 text-slate-400">1</td>
                  <td className="py-2.5 px-4 text-white font-semibold">admin</td>
                  <td className="py-2.5 px-4 text-amber-300">LabAdmin#2026</td>
                  <td className="py-2.5 px-4 text-emerald-300">System Administrator</td>
                  <td className="py-2.5 px-4 text-slate-300">Security Operations</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-400">2</td>
                  <td className="py-2.5 px-4 text-white font-semibold">m.rehman</td>
                  <td className="py-2.5 px-4 text-amber-300">Rehman#2672</td>
                  <td className="py-2.5 px-4 text-sky-300">Security Researcher (Roll 2672)</td>
                  <td className="py-2.5 px-4 text-slate-300">Cybersecurity Lab</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-400">3</td>
                  <td className="py-2.5 px-4 text-white font-semibold">m.meeran</td>
                  <td className="py-2.5 px-4 text-amber-300">Meeran#2680</td>
                  <td className="py-2.5 px-4 text-sky-300">Security Researcher (Roll 2680)</td>
                  <td className="py-2.5 px-4 text-slate-300">Cybersecurity Lab</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ReportPage>

      {/* =====================================================================
          HOW SQL INJECTION IS CREATED & WORKS (WITH GENERATED DIAGRAM PICTURE)
      ===================================================================== */}
      <ReportPage
        sectionId="sec-5"
        chapterLabel="HOW SQL INJECTION IS CREATED"
        title="How SQL Injection Is Created and How It Works"
        subtitle="Visualizing how joining user input directly into a SQL string allows an attacker to rewrite the query logic."
      >
        {/* Stylish Generated Visual Diagram */}
        <figure className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12]">
          {!attackFlowImageError ? (
            <img
              src="/src/assets/images/sqli_attack_flow_diagram_1794988687830.jpg"
              alt="Diagram comparing Normal Login Flow versus SQL Injection Attack Flow"
              referrerPolicy="no-referrer"
              onError={() => setAttackFlowImageError(true)}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="p-6 text-center text-sm text-slate-300">
              Normal Login Flow vs. SQL Injection Attack Flow Diagram
            </div>
          )}
          <figcaption className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-300 text-center">
            Architectural Comparison: Normal Login Flow (Left) vs. SQL Injection Login Bypass Flow (Right)
          </figcaption>
        </figure>

        {/* Logical Explanation of How SQL Injection Is Created */}
        <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-display">
            How SQL Injection Is Created in Code
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            A developer creates a SQL Injection vulnerability when they build a SQL query by pasting
            (concatenating) raw user input directly inside the query string:
          </p>
          <div className="p-3 rounded bg-[#050811] border border-rose-500/40 font-mono text-xs text-rose-300 overflow-x-auto">
            query = f&quot;SELECT * FROM users WHERE username = &apos;&#123;username&#125;&apos; AND password = &apos;&#123;password&#125;&apos;&quot;
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Because the user&apos;s text is pasted directly inside the single quotes, typing a{' '}
            <strong>single quote (<code>&apos;</code>)</strong> closes the username early. Anything
            typed after that quote is treated by the database as a real SQL command instead of a
            normal username.
          </p>
        </div>

        {/* Side-by-Side Comparison: Normal Input vs SQL Injection Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-2.5">
            <div className="text-xs font-mono text-emerald-400 font-semibold">
              NORMAL USER INPUT
            </div>
            <div className="p-3 rounded bg-[#050811] border border-slate-800 font-mono text-xs space-y-1">
              <div>Username: <span className="text-emerald-300">m.rehman</span></div>
              <div>Password: <span className="text-emerald-300">Rehman#2672</span></div>
            </div>
            <div className="p-3 rounded bg-[#050811] border border-slate-800 font-mono text-xs text-sky-300">
              SELECT * FROM users WHERE username = &apos;m.rehman&apos; AND password = &apos;Rehman#2672&apos;
            </div>
            <p className="text-xs text-slate-300">
              Checks if both username and password match. Only logs in if the password is correct.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-rose-950/15 border border-rose-500/30 space-y-2.5">
            <div className="text-xs font-mono text-rose-400 font-semibold">
              SQL INJECTION INPUT
            </div>
            <div className="p-3 rounded bg-[#050811] border border-slate-800 font-mono text-xs space-y-1">
              <div>Username: <span className="text-rose-300 font-bold">&apos; OR &apos;1&apos;=&apos;1&apos; -- </span></div>
              <div>Password: <span className="text-slate-400">anything</span></div>
            </div>
            <div className="p-3 rounded bg-[#050811] border border-slate-800 font-mono text-xs">
              <span className="text-sky-300">SELECT * FROM users WHERE username = &apos;&apos; </span>
              <span className="text-rose-400 font-bold">OR &apos;1&apos;=&apos;1&apos; -- </span>
              <span className="line-through text-slate-600">&apos; AND password = &apos;anything&apos;</span>
            </div>
            <p className="text-xs text-slate-300">
              <code>&apos;1&apos;=&apos;1&apos;</code> is always TRUE, and <code>--</code> comments
              out the password check! The database logs in as <code>admin</code>.
            </p>
          </div>
        </div>
      </ReportPage>

      {/* =====================================================================
          TYPES OF SQL INJECTION (CONCISE & LOGICAL)
      ===================================================================== */}
      <ReportPage
        sectionId="sec-6"
        chapterLabel="TYPES OF SQL INJECTION"
        title="Main Types of SQL Injection"
        subtitle="Clear classification of how SQL Injection attacks operate across different web application scenarios."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-rose-300 font-display">
              Authentication Bypass
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Uses boolean logic like <code>&apos; OR &apos;1&apos;=&apos;1&apos; --</code> in a
              login form so the <code>WHERE</code> clause always evaluates to <code>TRUE</code> and
              ignores the password check, logging the user into the first account (usually{' '}
              <code>admin</code>).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-amber-300 font-display">
              Error-Based SQL Injection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Submits malformed quotes (<code>&apos;</code>) to trigger database syntax errors. If
              the website prints raw SQL errors on the screen, it reveals table names and column
              structures.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-sky-300 font-display">
              UNION-Based SQL Injection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Uses the SQL <code>UNION SELECT</code> operator to combine results from another table
              onto the data shown on a search or profile page.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-emerald-300 font-display">
              Blind SQL Injection (Boolean &amp; Time-Based)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Occurs when a website hides database errors. The tester sends <code>TRUE</code> and{' '}
              <code>FALSE</code> conditions and observes whether the page content changes
              (Boolean-Based) or takes extra seconds to reply (Time-Based).
            </p>
          </div>
        </div>
      </ReportPage>
    </>
  );
};
