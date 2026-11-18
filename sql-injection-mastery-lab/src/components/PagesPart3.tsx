import React, { useState } from 'react';
import { ReportPage, CodeBlock, BrowserMockup } from './ReportPrimitives';
import { CheckSquare, Square, ExternalLink, Award } from 'lucide-react';

const VULN_SNIPPET = `# ❌ VULNERABLE: User input is joined directly into the SQL command string
query = f"SELECT id, username, role FROM users WHERE username = '{username}' AND password = '{password}'"
cursor.execute(query)`;

const SECURE_SNIPPET = `# ✅ SECURE: Parameterized query (?) separates SQL structure from user data
query = "SELECT id, username, role FROM users WHERE username = ? AND password = ?"
cursor.execute(query, (username, password))`;

const SECURE_APP_CODE = `"""
secure_app.py — Corrected Secure Login Application (Parameterized SQL)
Students: Mutayyab Rehman (Roll No: 2672) & Muhammad Meeran (Roll No: 2680)
Instructor: Shah Muhammad Sab
"""
import sqlite3
import logging
from flask import Flask, request, render_template_string

app = Flask(__name__)
DATABASE_PATH = "local_lab_users.db"

@app.route("/", methods=["GET"])
@app.route("/login", methods=["GET", "POST"])
def login():
    message = None

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        if not username or not password or len(username) > 64:
            message = "Login Rejected: Please provide valid credentials."
        else:
            conn = None
            try:
                conn = sqlite3.connect(DATABASE_PATH)
                cursor = conn.cursor()

                # SECURE FIX: Parameterized SQL Query using '?' placeholders
                sql_statement = (
                    "SELECT id, username, role FROM users "
                    "WHERE username = ? AND password = ?"
                )
                cursor.execute(sql_statement, (username, password))
                user_row = cursor.fetchone()

                if user_row:
                    message = f"Login Accepted! Authenticated as: {user_row[1]} ({user_row[2]})"
                else:
                    message = "Login Rejected: Invalid username or password."
            except sqlite3.Error as db_err:
                logging.error("Database error: %s", db_err)
                message = "An internal error occurred."
            finally:
                if conn:
                    conn.close()

    return render_template_string(HTML_TEMPLATE, message=message)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)`;

export const PagesPart3: React.FC = () => {
  const [preventionImageError, setPreventionImageError] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const checklistItems = [
    {
      title: 'Parameterized queries (?) implemented',
      detail: 'All SQL statements bind user input safely as parameters.',
    },
    {
      title: 'SQL string concatenation removed',
      detail: 'No f-strings or + operators used to build SQL queries.',
    },
    {
      title: 'Server-side input validation added',
      detail: 'Checks for empty fields and maximum character length.',
    },
    {
      title: 'Least-privilege database permissions',
      detail: 'Application only uses required table access permissions.',
    },
    {
      title: 'Password hashing (Argon2id / bcrypt) for production',
      detail: 'Never store plaintext passwords in live production systems.',
    },
    {
      title: 'Generic error messages & debug=False',
      detail: 'Detailed SQL errors are hidden from users in the browser.',
    },
  ];

  return (
    <>
      {/* =====================================================================
          SQL INJECTION PREVENTION & SECURE LOGIN IMPLEMENTATION
      ===================================================================== */}
      <ReportPage
        sectionId="sec-12"
        chapterLabel="SQL INJECTION PREVENTION"
        title="SQL Injection Prevention & Secure Login Implementation"
        subtitle="How Parameterized Queries (?) separate SQL commands from user input and permanently stop SQL Injection."
      >
        {/* Stylish Generated Comparison Picture */}
        <figure className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12]">
          {!preventionImageError ? (
            <img
              src="/src/assets/images/sqli_vulnerable_vs_secure_visual_1794988690432.jpg"
              alt="Comparison between vulnerable string injection pipeline and fortified parameterized queries"
              referrerPolicy="no-referrer"
              onError={() => setPreventionImageError(true)}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="p-6 text-center text-sm text-slate-300">
              Vulnerable String Injection vs. Fortified Parameterized Queries
            </div>
          )}
          <figcaption className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-300 text-center">
            Visual Comparison: Vulnerable String Injection (Left) vs. Fortified Parameterized Queries (Right)
          </figcaption>
        </figure>

        {/* Simple Explanation of Prevention */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            How Parameterized Queries Stop SQL Injection
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Instead of pasting user input into the SQL string, we put a question mark placeholder (
            <code className="text-emerald-300 font-mono">?</code>) in the SQL query and pass the
            user input separately as a data tuple. SQLite compiles the SQL query structure{' '}
            <strong>first</strong>, and then places the user&apos;s input into the <code>?</code>{' '}
            slot strictly as plain text. Even if someone types{' '}
            <code className="text-rose-300 font-mono">&apos; OR &apos;1&apos;=&apos;1&apos; -- </code>,
            the database simply looks for a user literally named{' '}
            <code>&quot;&apos; OR &apos;1&apos;=&apos;1&apos; -- &quot;</code> and rejects the login!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock
              filename="Vulnerable: String Concatenation"
              language="python"
              code={VULN_SNIPPET}
              variant="vulnerable"
            />
            <CodeBlock
              filename="Secure: Parameterized Query (?)"
              language="python"
              code={SECURE_SNIPPET}
              variant="secure"
            />
          </div>
        </div>

        {/* Additional Defense-in-Depth Measures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#070B14] border border-slate-800">
            <strong className="text-sky-300 block mb-1 text-sm font-display">
              Input Validation &amp; Least Privilege
            </strong>
            <p className="text-xs text-slate-300 leading-relaxed">
              Validate input lengths and types on the server, and ensure the database account only
              has permissions for the tables it needs.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#070B14] border border-slate-800">
            <strong className="text-emerald-300 block mb-1 text-sm font-display">
              Password Hashing &amp; Safe Error Handling
            </strong>
            <p className="text-xs text-slate-300 leading-relaxed">
              In production, hash passwords using <strong>Argon2id</strong> or{' '}
              <strong>bcrypt</strong>, hide detailed SQL errors from users, and keep{' '}
              <code>debug=False</code>.
            </p>
          </div>
        </div>

        {/* Complete Secure Code */}
        <div id="sec-13" className="pt-2 scroll-mt-20">
          <h3 className="text-base font-bold text-white font-display mb-2">
            Complete Secure Login Application (<code className="text-emerald-300 font-mono">secure_app.py</code>)
          </h3>
          <CodeBlock
            filename="secure_app.py"
            language="python"
            code={SECURE_APP_CODE}
            variant="secure"
          />
        </div>
      </ReportPage>

      {/* =====================================================================
          TESTING THE SECURE APPLICATION, CHECKLIST, CONCLUSION & REFERENCES
      ===================================================================== */}
      <ReportPage
        sectionId="sec-14"
        chapterLabel="VERIFICATION, CONCLUSION & REFERENCES"
        title="Testing the Secure Application, Checklist, Conclusion & References"
        subtitle="Retesting the fixed application to confirm the SQL Injection attack is blocked, followed by our security checklist and conclusion."
      >
        {/* Retesting Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070B14]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-sky-300 border-b border-slate-800 font-mono">
                <th className="py-3 px-4">Test Scenario</th>
                <th className="py-3 px-4">Input Supplied</th>
                <th className="py-3 px-4">Result on Secure App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Valid Login</td>
                <td className="py-2.5 px-4 font-mono text-emerald-300">
                  m.rehman / Rehman#2672
                </td>
                <td className="py-2.5 px-4 text-emerald-300">Login Accepted (PASS)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Wrong Password</td>
                <td className="py-2.5 px-4 font-mono text-slate-300">
                  m.rehman / WrongPass
                </td>
                <td className="py-2.5 px-4 text-slate-300">Login Rejected (PASS)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Empty Fields</td>
                <td className="py-2.5 px-4 font-mono text-slate-300">
                  &quot;&quot; / &quot;&quot;
                </td>
                <td className="py-2.5 px-4 text-slate-300">Rejected by Validation (PASS)</td>
              </tr>
              <tr className="bg-emerald-950/15">
                <td className="py-2.5 px-4 font-semibold text-emerald-300">
                  SQL Injection Input
                </td>
                <td className="py-2.5 px-4 font-mono text-rose-300">
                  &apos; OR &apos;1&apos;=&apos;1&apos; --
                </td>
                <td className="py-2.5 px-4 text-emerald-300 font-semibold">
                  Treated as plain text &amp; Login Rejected (BLOCKED)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <BrowserMockup
          modeLabel="SECURE APP (secure_app.py)"
          usernameValue="' OR '1'='1' -- "
          passwordValue="any_password"
          statusType="error"
          statusTitle="Login Rejected: Invalid username or password."
          statusDetail="SQLite bound the input as harmless literal text into WHERE username = ?. Zero rows matched."
          executedQuery={`Prepared SQL: SELECT id, username, role FROM users WHERE username = ? AND password = ? | Bound Literal Params: ("' OR '1'='1' -- ", "[REDACTED]")`}
          caption="Retesting Result: The secure application treats ' OR '1'='1' -- as literal text and rejects the login."
        />

        {/* Security Checklist */}
        <div id="sec-15" className="space-y-3 scroll-mt-20">
          <h3 className="text-base font-bold text-white font-display">
            Security Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {checklistItems.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => toggleCheck(idx)}
                  className={`p-3 rounded-lg border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-[#070B14] border-emerald-500/35 text-slate-100'
                      : 'bg-[#070B14] border-slate-800 text-slate-400'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs sm:text-sm font-semibold">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conclusion */}
        <div id="sec-16" className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2 scroll-mt-20">
          <h3 className="text-base font-bold text-emerald-300 font-display">
            Conclusion
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            This practical project demonstrated how SQL Injection is created when untrusted user
            input is concatenated directly into a database SQL query, allowing{' '}
            <code>&apos; OR &apos;1&apos;=&apos;1&apos; --</code> to bypass login authentication. By
            replacing string concatenation with <strong>Parameterized Queries (<code>?</code>)</strong>{' '}
            in <code>secure_app.py</code>, the database treats all user input strictly as literal
            data and neutralizes the attack. All testing was conducted ethically inside an
            authorized localhost laboratory (<code>127.0.0.1</code>).
          </p>
        </div>

        {/* References */}
        <div id="sec-17" className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-3 scroll-mt-20">
          <h3 className="text-base font-bold text-sky-300 font-display">
            References
          </h3>
          <div className="space-y-2 text-xs font-mono">
            {[
              {
                title: 'OWASP SQL Injection Prevention Cheat Sheet',
                url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
              },
              {
                title: 'OWASP Web Security Testing Guide — Testing for SQL Injection',
                url: 'https://owasp.org/www-project-web-security-testing-guide/',
              },
              {
                title: 'Microsoft SQL Injection Documentation',
                url: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-injection',
              },
              {
                title: 'Python sqlite3 Official Documentation (Parameterized Queries)',
                url: 'https://docs.python.org/3/library/sqlite3.html',
              },
              {
                title: 'Flask Official Documentation — Using SQLite 3 with Flask',
                url: 'https://flask.palletsprojects.com/en/stable/patterns/sqlite3/',
              },
            ].map((ref) => (
              <div key={ref.title} className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-800/70">
                <span className="text-slate-200 font-sans font-medium">{ref.title}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
                >
                  <span>Official Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Final Sign-Off */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-mono text-emerald-400">
                CYBERSECURITY PRACTICAL PROJECT
              </div>
              <div className="text-sm font-bold text-white font-display">
                Mutayyab Rehman (Roll No: 2672) &amp; Muhammad Meeran (Roll No: 2680) · Instructor: Shah Muhammad Sab
              </div>
            </div>
          </div>
        </div>
      </ReportPage>
    </>
  );
};
