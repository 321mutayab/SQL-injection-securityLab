import React, { useState } from 'react';
import { ReportPage, CodeBlock, BrowserMockup } from './ReportPrimitives';
import { InteractiveLabSimulator } from './InteractiveLabSimulator';
import { ShieldAlert } from 'lucide-react';

const SETUP_POWERSHELL_CODE = `# Create project folder and install Flask on Windows 10 / 11
mkdir C:\\CyberSec_SQLi_Lab
cd C:\\CyberSec_SQLi_Lab
python -m venv venv
.\\venv\\Scripts\\Activate.ps1
pip install Flask==3.0.3`;

const INIT_DB_CODE = `"""
init_db.py — Create Local SQLite Database & Sample Users
Students: Mutayyab Rehman (Roll No: 2672) & Muhammad Meeran (Roll No: 2680)
Instructor: Shah Muhammad Sab
"""
import sqlite3

conn = sqlite3.connect("local_lab_users.db")
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS users")
cursor.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT NOT NULL
    )
""")

sample_users = [
    ("admin", "LabAdmin#2026", "System Administrator", "Security Operations"),
    ("m.rehman", "Rehman#2672", "Security Researcher (Roll 2672)", "Cybersecurity Lab"),
    ("m.meeran", "Meeran#2680", "Security Researcher (Roll 2680)", "Cybersecurity Lab"),
]

cursor.executemany(
    "INSERT INTO users (username, password, role, department) VALUES (?, ?, ?, ?)",
    sample_users
)

conn.commit()
conn.close()
print("Local SQLite database local_lab_users.db created successfully!")`;

const VULNERABLE_APP_CODE = `"""
vulnerable_app.py — Intentionally Vulnerable Login Application (Localhost Only)
Students: Mutayyab Rehman (Roll No: 2672) & Muhammad Meeran (Roll No: 2680)
Instructor: Shah Muhammad Sab
"""
import sqlite3
from flask import Flask, request, render_template_string

app = Flask(__name__)
DATABASE_PATH = "local_lab_users.db"

@app.route("/", methods=["GET"])
@app.route("/login", methods=["GET", "POST"])
def login():
    message = None
    executed_query = None

    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        # VULNERABLE PATTERN: User input is joined directly into the SQL string
        executed_query = (
            f"SELECT id, username, role FROM users "
            f"WHERE username = '{username}' AND password = '{password}'"
        )

        cursor.execute(executed_query)
        user_row = cursor.fetchone()

        if user_row:
            message = f"Login Accepted! Authenticated as: {user_row[1]} ({user_row[2]})"
        else:
            message = "Login Rejected: Invalid username or password."

        conn.close()

    return render_template_string(HTML_TEMPLATE, message=message, executed_query=executed_query)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)`;

export const PagesPart2: React.FC = () => {
  const [labImageError, setLabImageError] = useState(false);

  return (
    <>
      {/* =====================================================================
          LABORATORY ENVIRONMENT SETUP (WITH LAB WORKSTATION PICTURE)
      ===================================================================== */}
      <ReportPage
        sectionId="sec-7"
        chapterLabel="LOCAL LABORATORY SETUP"
        title="Laboratory Environment Setup (Python, Flask & SQLite)"
        subtitle="Setting up a safe, local-only testing environment on Windows 10/11 to build and test our login application."
      >
        {/* Stylish Generated Lab Workstation Picture */}
        <figure className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12]">
          {!labImageError ? (
            <img
              src="/src/assets/images/sqli_local_lab_workstation_1794988688573.jpg"
              alt="Cybersecurity laboratory workstation displaying Python Flask code and local login portal"
              referrerPolicy="no-referrer"
              onError={() => setLabImageError(true)}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="p-6 text-center text-sm text-slate-300">
              Local Cybersecurity Testing Workstation (Python Flask + Browser Portal)
            </div>
          )}
          <figcaption className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-300 text-center">
            Local Laboratory Environment: Python Flask Backend Code Editor and Localhost Login Testing Portal
          </figcaption>
        </figure>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-white font-display">
            Installing Flask &amp; Creating the Local SQLite Database
          </h3>
          <p className="text-sm text-slate-300">
            First, we create a project folder in Windows PowerShell and install Flask. Next, we run{' '}
            <code>init_db.py</code> to create our SQLite database file (
            <code>local_lab_users.db</code>) with three sample accounts:
          </p>
          <CodeBlock
            filename="Windows PowerShell Commands"
            language="powershell"
            code={SETUP_POWERSHELL_CODE}
          />
          <CodeBlock
            filename="init_db.py"
            language="python"
            code={INIT_DB_CODE}
          />
        </div>
      </ReportPage>

      {/* =====================================================================
          VULNERABLE LOGIN APPLICATION
      ===================================================================== */}
      <ReportPage
        sectionId="sec-8"
        chapterLabel="VULNERABLE APPLICATION"
        title="Vulnerable Login Application"
        subtitle="Complete source code of the intentionally vulnerable Flask application and how it creates SQL Injection."
      >
        <div className="p-4 rounded-lg bg-rose-950/25 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-300 font-mono uppercase block mb-0.5">
              How This Code Creates SQL Injection
            </strong>
            Look at <code>executed_query = f&quot;SELECT ... WHERE username = &apos;&#123;username&#125;&apos; AND password = &apos;&#123;password&#125;&apos;&quot;</code>.
            Because it joins the user&apos;s raw text directly into the SQL command, typing a single
            quote (<code>&apos;</code>) breaks out of the username field and changes the SQL logic.
          </div>
        </div>

        <CodeBlock
          filename="vulnerable_app.py"
          language="python"
          code={VULNERABLE_APP_CODE}
          variant="vulnerable"
        />
      </ReportPage>

      {/* =====================================================================
          PRACTICAL ATTACK DEMONSTRATION & LIVE SIMULATOR
      ===================================================================== */}
      <ReportPage
        sectionId="sec-9"
        chapterLabel="PRACTICAL ATTACK DEMONSTRATION"
        title="Practical SQL Injection Attack Demonstration"
        subtitle="Testing normal login credentials versus the SQL Injection login bypass (' OR '1'='1' -- ) in our local lab."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2.5">
            <div className="text-xs font-mono text-emerald-400">
              PRACTICAL TEST A · NORMAL LOGIN
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Valid &amp; Invalid Credentials
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • When we enter username <code>m.rehman</code> and password <code>Rehman#2672</code>,
              the database finds the matching row and accepts the login.
              <br />• When we enter an incorrect password, no row matches and the login is rejected.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#070B14] border border-rose-500/40 space-y-2.5">
            <div className="text-xs font-mono text-rose-400">
              PRACTICAL TEST B · SQL INJECTION BYPASS
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Bypassing Login with <code>&apos; OR &apos;1&apos;=&apos;1&apos; -- </code>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • We type <code className="text-rose-300 font-bold">&apos; OR &apos;1&apos;=&apos;1&apos; -- </code>{' '}
              into the <strong>Username</strong> box and any dummy text in the Password box.
              <br />• <code>OR &apos;1&apos;=&apos;1&apos;</code> makes the query condition{' '}
              <strong>always TRUE</strong>, and <code>--</code> comments out the password check.
              SQLite returns the first row in the table (<code>admin</code>)!
            </p>
          </div>
        </div>

        <BrowserMockup
          modeLabel="VULNERABLE APP (vulnerable_app.py)"
          usernameValue="' OR '1'='1' -- "
          passwordValue="any_password"
          statusType="bypass"
          statusTitle="Login Accepted! Authenticated as: admin (System Administrator)"
          statusDetail="SQLite evaluated WHERE username = '' OR '1'='1' as TRUE and ignored the commented-out password check."
          executedQuery="SELECT id, username, role FROM users WHERE username = '' OR '1'='1' -- ' AND password = 'any_password'"
          caption="Visual Capture: Submitting ' OR '1'='1' -- in the local vulnerable login form logs in as admin."
        />

        {/* Interactive Simulator */}
        <InteractiveLabSimulator />

        {/* Attack Results Table & Security Risks */}
        <div id="sec-10" className="space-y-4 pt-2 scroll-mt-20">
          <h3 className="text-base font-bold text-white font-display">
            Attack Results Table &amp; Security Risks
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070B14]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-sky-300 border-b border-slate-800 font-mono">
                  <th className="py-3 px-4">Test</th>
                  <th className="py-3 px-4">Input</th>
                  <th className="py-3 px-4">Observed Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Valid Login</td>
                  <td className="py-3 px-4 font-mono text-xs text-emerald-300">
                    m.rehman / Rehman#2672
                  </td>
                  <td className="py-3 px-4 text-emerald-300">Login accepted normally</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Invalid Login</td>
                  <td className="py-3 px-4 font-mono text-xs text-amber-300">
                    m.rehman / WrongPass
                  </td>
                  <td className="py-3 px-4 text-amber-300">Login rejected</td>
                </tr>
                <tr className="bg-rose-950/15">
                  <td className="py-3 px-4 font-semibold text-rose-300">SQL Injection Test</td>
                  <td className="py-3 px-4 font-mono text-xs text-rose-300">
                    &apos; OR &apos;1&apos;=&apos;1&apos; --
                  </td>
                  <td className="py-3 px-4 text-rose-200">
                    Bypassed password check and logged in as <code>admin</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="sec-11" className="p-4 rounded-lg bg-[#070B14] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed scroll-mt-20">
            <strong className="text-rose-300 block mb-1">
              Why This Is Dangerous (Security Risks):
            </strong>
            If a real website has this vulnerability, attackers can bypass authentication, access
            administrator accounts, read private user data (confidentiality loss), modify or delete
            database records (integrity loss), and disrupt service availability.
          </div>
        </div>
      </ReportPage>
    </>
  );
};
