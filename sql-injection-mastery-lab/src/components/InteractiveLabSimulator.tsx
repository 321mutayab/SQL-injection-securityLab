import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Database,
  Terminal,
  Lock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export interface SampleUser {
  id: number;
  username: string;
  passwordPlain: string;
  passwordHashPreview: string;
  role: string;
  department: string;
}

export const SAMPLE_USERS: SampleUser[] = [
  {
    id: 1,
    username: 'admin',
    passwordPlain: 'LabAdmin#2026',
    passwordHashPreview: '$argon2id$v=19$m=65536,t=3,p=4$c2FsdDEyMw$9f8e...',
    role: 'System Administrator',
    department: 'Security Operations',
  },
  {
    id: 2,
    username: 'm.rehman',
    passwordPlain: 'Rehman#2672',
    passwordHashPreview: '$argon2id$v=19$m=65536,t=3,p=4$dXNlcnNhbHQ$4a1b...',
    role: 'Security Researcher (Roll 2672)',
    department: 'Cybersecurity Lab',
  },
  {
    id: 3,
    username: 'm.meeran',
    passwordPlain: 'Meeran#2680',
    passwordHashPreview: '$argon2id$v=19$m=65536,t=3,p=4$Ymx1ZXNhbHQ$7c2d...',
    role: 'Security Researcher (Roll 2680)',
    department: 'Cybersecurity Lab',
  },
];

interface PresetScenario {
  id: string;
  label: string;
  username: string;
  password: string;
  description: string;
}

const PRESETS: PresetScenario[] = [
  {
    id: 'valid',
    label: '1. Valid Credentials',
    username: 'admin',
    password: 'LabAdmin#2026',
    description: 'Standard authorized login with a valid sample username and matching password.',
  },
  {
    id: 'wrong_pass',
    label: '2. Incorrect Password',
    username: 'admin',
    password: 'WrongPassword123',
    description: 'Valid sample username paired with an invalid password.',
  },
  {
    id: 'wrong_user',
    label: '3. Non-Existent User',
    username: 'unknown_user',
    password: 'LabAdmin#2026',
    description: 'Username that does not exist in the local SQLite users table.',
  },
  {
    id: 'empty',
    label: '4. Empty Fields',
    username: '',
    password: '',
    description: 'Submitting blank credentials to verify input validation.',
  },
  {
    id: 'sqli_demo',
    label: "5. SQLi Lab String (' OR '1'='1' -- )",
    username: "' OR '1'='1' -- ",
    password: 'any_value',
    description:
      'Authorized local laboratory demonstration string testing tautology + SQL comment truncation.',
  },
  {
    id: 'unexpected',
    label: "6. Unexpected Quotes (admin' --)",
    username: "admin' --",
    password: 'none',
    description:
      'Testing how a single quote and inline comment marker behave in concatenated vs parameterized queries.',
  },
];

export const InteractiveLabSimulator: React.FC = () => {
  const [backendMode, setBackendMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [username, setUsername] = useState<string>("' OR '1'='1' -- ");
  const [password, setPassword] = useState<string>('any_value');
  const [activePreset, setActivePreset] = useState<string>('sqli_demo');

  const applyPreset = (preset: PresetScenario) => {
    setActivePreset(preset.id);
    setUsername(preset.username);
    setPassword(preset.password);
  };

  const evaluateSimulation = () => {
    const trimmedUser = username;
    const trimmedPass = password;

    if (!trimmedUser.trim() || !trimmedPass.trim()) {
      return {
        outcome: 'rejected' as const,
        statusHeading: '400 Bad Request — Missing Credentials',
        explanation:
          'Input validation rejected the request because Username or Password was empty before any database query was executed.',
        matchedUser: null,
        rawSqlDisplay:
          backendMode === 'vulnerable'
            ? `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`
            : `SELECT id, username, password_hash, role FROM users WHERE username = ?`,
        boundParams: backendMode === 'secure' ? [trimmedUser] : null,
        commentedOutPortion: null,
      };
    }

    if (backendMode === 'vulnerable') {
      const normalized = trimmedUser.toUpperCase();
      const isTautologyBypass =
        normalized.includes("' OR '1'='1'") ||
        normalized.includes("' OR 1=1") ||
        normalized.includes('" OR "1"="1"');

      const isAdminCommentBypass =
        trimmedUser.trim().toLowerCase().startsWith("admin'") &&
        trimmedUser.includes('--');

      if (isTautologyBypass) {
        return {
          outcome: 'bypassed' as const,
          statusHeading: 'VULNERABILITY TRIGGERED: Authentication Bypassed (Logged in as admin)',
          explanation:
            "Because user input was concatenated directly into the SQL command string, the single quote closed the username literal early, OR '1'='1' made the WHERE clause unconditionally TRUE for every row, and -- commented out the password check. SQLite returned the first row (id=1, admin).",
          matchedUser: SAMPLE_USERS[0],
          rawSqlDisplay: `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`,
          boundParams: null,
          commentedOutPortion: `' AND password = '${trimmedPass}'`,
        };
      }

      if (isAdminCommentBypass) {
        return {
          outcome: 'bypassed' as const,
          statusHeading: 'VULNERABILITY TRIGGERED: Password Check Truncated via SQL Comment',
          explanation:
            "The input closed the username string after 'admin' and injected the SQL comment marker (--), causing SQLite to ignore the entire AND password = '...' condition.",
          matchedUser: SAMPLE_USERS[0],
          rawSqlDisplay: `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`,
          boundParams: null,
          commentedOutPortion: `' AND password = '${trimmedPass}'`,
        };
      }

      // Check for unescaped single quote syntax error
      const quoteCount = (trimmedUser.match(/'/g) || []).length;
      if (quoteCount % 2 !== 0) {
        return {
          outcome: 'error' as const,
          statusHeading: 'sqlite3.OperationalError: unrecognized token / syntax error',
          explanation:
            'An unescaped single quote broke the SQL string literal structure, causing the SQLite parser to raise a syntax exception.',
          matchedUser: null,
          rawSqlDisplay: `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`,
          boundParams: null,
          commentedOutPortion: null,
        };
      }

      // Normal exact match check
      const match = SAMPLE_USERS.find(
        (u) => u.username === trimmedUser && u.passwordPlain === trimmedPass
      );

      if (match) {
        return {
          outcome: 'accepted' as const,
          statusHeading: `Login Accepted — Welcome, ${match.username} (${match.role})`,
          explanation:
            'Both the username and password matched row #' +
            match.id +
            ' in the local SQLite database.',
          matchedUser: match,
          rawSqlDisplay: `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`,
          boundParams: null,
          commentedOutPortion: null,
        };
      }

      return {
        outcome: 'rejected' as const,
        statusHeading: 'Login Rejected — Invalid Username or Password',
        explanation:
          'The concatenated SQL query executed normally, but zero rows satisfied both the username and password conditions.',
        matchedUser: null,
        rawSqlDisplay: `SELECT * FROM users WHERE username = '${trimmedUser}' AND password = '${trimmedPass}'`,
        boundParams: null,
        commentedOutPortion: null,
      };
    } else {
      // SECURE PARAMETERIZED MODE
      const match = SAMPLE_USERS.find(
        (u) => u.username === trimmedUser && u.passwordPlain === trimmedPass
      );

      if (match) {
        return {
          outcome: 'accepted' as const,
          statusHeading: `Secure Login Accepted — Welcome, ${match.username} (${match.role})`,
          explanation:
            'SQLite compiled the parameterized SQL statement first and bound the username strictly as a literal string parameter. The password hash was then verified safely.',
          matchedUser: match,
          rawSqlDisplay: `SELECT id, username, password_hash, role FROM users WHERE username = ?`,
          boundParams: [trimmedUser],
          commentedOutPortion: null,
        };
      }

      return {
        outcome: 'rejected' as const,
        statusHeading: 'Secure Login Rejected — Literal Parameter Did Not Match Any User',
        explanation: `With parameterized queries (?), SQLite searched for a user whose literal username string is "${trimmedUser}". Special characters like ' OR '1'='1' -- are treated strictly as harmless text data, never as executable SQL commands.`,
        matchedUser: null,
        rawSqlDisplay: `SELECT id, username, password_hash, role FROM users WHERE username = ?`,
        boundParams: [trimmedUser],
        commentedOutPortion: null,
      };
    }
  };

  const result = evaluateSimulation();

  return (
    <div className="rounded-xl border border-sky-500/30 bg-[#070C18] p-5 sm:p-7 shadow-xl my-6">
      {/* Top Bar of Simulator */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-sky-400">
            INTERACTIVE LOCAL SANDBOX SIMULATOR (127.0.0.1:5000)
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display mt-0.5">
            Live Vulnerable vs. Secure SQLite Query Inspector
          </h3>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setBackendMode('vulnerable')}
            className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              backendMode === 'vulnerable'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Vulnerable App (Concatenated)</span>
          </button>
          <button
            type="button"
            onClick={() => setBackendMode('secure')}
            className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              backendMode === 'secure'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure App (Parameterized ?)</span>
          </button>
        </div>
      </div>

      {/* Test Case Presets */}
      <div className="mb-6">
        <div className="text-xs font-mono text-slate-400 mb-2.5">
          SELECT A LABORATORY TEST VECTOR OR TYPE CUSTOM INPUT BELOW:
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                activePreset === preset.id
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-medium'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left Input Form, Right SQL AST & Database Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Simulated Local Browser Login Form */}
        <div className="lg:col-span-5 bg-[#0B1222] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 mb-4 border-b border-slate-800">
              <span>POST http://127.0.0.1:5000/login</span>
              <span className={backendMode === 'vulnerable' ? 'text-rose-400' : 'text-emerald-400'}>
                {backendMode === 'vulnerable' ? 'UNSAFE CONCAT' : 'SAFE BINDING'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username Input (<code className="text-sky-300">request.form['username']</code>)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setActivePreset('custom');
                  }}
                  placeholder="Enter username or lab test string..."
                  className="w-full px-3.5 py-2 rounded-md bg-[#050811] border border-slate-700 focus:border-sky-400 focus:outline-none font-mono text-xs text-sky-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password Input (<code className="text-sky-300">request.form['password']</code>)
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActivePreset('custom');
                  }}
                  placeholder="Enter password..."
                  className="w-full px-3.5 py-2 rounded-md bg-[#050811] border border-slate-700 focus:border-sky-400 focus:outline-none font-mono text-xs text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => applyPreset(PRESETS[0])}
              className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Normal</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setBackendMode(backendMode === 'vulnerable' ? 'secure' : 'vulnerable')
              }
              className="px-3.5 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                Compare in {backendMode === 'vulnerable' ? 'Secure Mode' : 'Vulnerable Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Backend SQL Execution & Result */}
        <div className="lg:col-span-7 bg-[#0B1222] border border-slate-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          {/* SQL Statement Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                SQLITE3 ENGINE EXECUTION PLAN
              </span>
              <span>
                {backendMode === 'vulnerable'
                  ? 'cursor.execute(f"SELECT ...")'
                  : 'cursor.execute("... WHERE username = ?", (username,))'}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#050811] border border-slate-800 font-mono text-xs leading-relaxed break-all">
              <div className="text-slate-400 text-[11px] mb-1">Constructed SQL Command:</div>
              <div className="text-sky-300">{result.rawSqlDisplay}</div>

              {result.commentedOutPortion && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-rose-400 font-semibold">
                    Ignored via SQL Comment (--):{' '}
                  </span>
                  <span className="line-through text-slate-500">
                    {result.commentedOutPortion}
                  </span>
                </div>
              )}

              {result.boundParams && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-300">
                  <span className="text-slate-400">Bound Data Parameter Tuple: </span>
                  <code>(&quot;{result.boundParams[0]}&quot;,)</code> — treated strictly as inert text
                </div>
              )}
            </div>

            {/* Outcome Banner */}
            <div
              className={`p-4 rounded-lg border ${
                result.outcome === 'bypassed'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                  : result.outcome === 'accepted'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase">
                {result.outcome === 'bypassed' && (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-rose-300">{result.statusHeading}</span>
                  </>
                )}
                {result.outcome === 'accepted' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">{result.statusHeading}</span>
                  </>
                )}
                {(result.outcome === 'rejected' || result.outcome === 'error') && (
                  <>
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-amber-300">{result.statusHeading}</span>
                  </>
                )}
              </div>
              <p className="text-xs mt-1.5 leading-relaxed opacity-95">{result.explanation}</p>
            </div>
          </div>

          {/* Mini Database Table Row Evaluation View */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>LOCAL SQLITE `users` TABLE EVALUATION:</span>
            </div>
            <div className="overflow-x-auto rounded border border-slate-800">
              <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <th className="py-1.5 px-2.5">id</th>
                    <th className="py-1.5 px-2.5">username</th>
                    <th className="py-1.5 px-2.5">role</th>
                    <th className="py-1.5 px-2.5">Query Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {SAMPLE_USERS.map((u) => {
                    const isMatched = result.matchedUser?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        className={
                          isMatched
                            ? result.outcome === 'bypassed'
                              ? 'bg-rose-500/15 text-rose-200'
                              : 'bg-emerald-500/15 text-emerald-200'
                            : 'bg-[#050811] text-slate-400'
                        }
                      >
                        <td className="py-1.5 px-2.5">{u.id}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{u.username}</td>
                        <td className="py-1.5 px-2.5">{u.role}</td>
                        <td className="py-1.5 px-2.5">
                          {isMatched ? (
                            <span className="font-semibold">
                              {result.outcome === 'bypassed'
                                ? 'RETURNED (TAUTOLOGY BYPASS)'
                                : 'RETURNED (VALID MATCH)'}
                            </span>
                          ) : (
                            <span className="text-slate-600">Not Returned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
