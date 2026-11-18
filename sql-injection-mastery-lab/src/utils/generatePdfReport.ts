import { jsPDF } from 'jspdf';

export interface PdfMetadata {
  instructor: string;
  university: string;
  submissionDate: string;
}

/**
 * Helper to load a local image URL into a base64 JPEG data URL so jsPDF can embed it cleanly.
 */
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1280;
        canvas.height = img.naturalHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function downloadCompleteSqlInjectionPdf(meta?: Partial<PdfMetadata>): Promise<void> {
  const instructor = meta?.instructor || 'Shah Muhammad Sab';
  const university = meta?.university || 'Department of Computer Science & Cybersecurity';
  const submissionDate = meta?.submissionDate || 'November 2026';

  // Preload our 4 stylish generated project pictures
  const [coverImg, attackFlowImg, labWorkstationImg, preventionImg] = await Promise.all([
    loadImageAsDataUrl('/src/assets/images/sqli_cyber_cover_illustration_1794985563374.jpg'),
    loadImageAsDataUrl('/src/assets/images/sqli_attack_flow_diagram_1794988687830.jpg'),
    loadImageAsDataUrl('/src/assets/images/sqli_local_lab_workstation_1794988688573.jpg'),
    loadImageAsDataUrl('/src/assets/images/sqli_vulnerable_vs_secure_visual_1794988690432.jpg'),
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const setupPage = (isFirstPage: boolean, sectionTag: string, title?: string, subtitle?: string): number => {
    if (!isFirstPage) {
      doc.addPage();
    }
    doc.setFillColor(11, 17, 32);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.3);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

    // Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(56, 189, 248);
    doc.text(sectionTag, margin, 15);

    doc.setFont('courier', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      'MUTAYYAB REHMAN (2672) & MUHAMMAD MEERAN (2680)',
      pageWidth - margin,
      15,
      { align: 'right' }
    );

    doc.setDrawColor(30, 41, 59);
    doc.line(margin, 17.5, pageWidth - margin, 17.5);

    // Footer
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('SQL INJECTION (SQLi) PRACTICAL DOCUMENTATION', margin, pageHeight - 11.5);
    doc.setTextColor(52, 211, 153);
    doc.text(`Instructor: ${instructor}`, pageWidth - margin, pageHeight - 11.5, {
      align: 'right',
    });

    let y = 25;
    if (title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(248, 250, 252);
      const titleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6.5 + 1;
    }
    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(148, 163, 184);
      const subLines = doc.splitTextToSize(subtitle, contentWidth);
      doc.text(subLines, margin, y);
      y += subLines.length * 4.5 + 4;
    }
    return y;
  };

  const drawBox = (
    y: number,
    heading: string,
    bodyText: string,
    accent: 'sky' | 'emerald' | 'rose' | 'amber' | 'slate' = 'slate'
  ): number => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(bodyText, contentWidth - 10);
    const boxHeight = lines.length * 4.5 + (heading ? 12 : 6);

    if (accent === 'rose') {
      doc.setFillColor(35, 12, 24);
      doc.setDrawColor(225, 29, 72);
    } else if (accent === 'emerald') {
      doc.setFillColor(8, 32, 28);
      doc.setDrawColor(16, 185, 129);
    } else if (accent === 'sky') {
      doc.setFillColor(10, 25, 47);
      doc.setDrawColor(56, 189, 248);
    } else if (accent === 'amber') {
      doc.setFillColor(36, 24, 10);
      doc.setDrawColor(245, 158, 11);
    } else {
      doc.setFillColor(7, 11, 20);
      doc.setDrawColor(30, 41, 59);
    }

    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

    let innerY = y + 6;
    if (heading) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.2);
      if (accent === 'rose') doc.setTextColor(251, 113, 133);
      else if (accent === 'emerald') doc.setTextColor(52, 211, 153);
      else if (accent === 'sky') doc.setTextColor(56, 189, 248);
      else if (accent === 'amber') doc.setTextColor(251, 191, 36);
      else doc.setTextColor(241, 245, 249);
      doc.text(heading, margin + 5, innerY);
      innerY += 5.5;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(226, 232, 240);
    doc.text(lines, margin + 5, innerY);

    return y + boxHeight + 4.5;
  };

  const drawCodeBlock = (
    y: number,
    label: string,
    codeLines: string[],
    variant: 'neutral' | 'vulnerable' | 'secure' = 'neutral'
  ): number => {
    const lineHeight = 3.9;
    const boxHeight = codeLines.length * lineHeight + 11;

    doc.setFillColor(5, 8, 17);
    if (variant === 'vulnerable') doc.setDrawColor(225, 29, 72);
    else if (variant === 'secure') doc.setDrawColor(16, 185, 129);
    else doc.setDrawColor(30, 41, 59);

    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFillColor(15, 23, 42);
    doc.rect(margin + 0.2, y + 0.2, contentWidth - 0.4, 6.5, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    if (variant === 'vulnerable') doc.setTextColor(251, 113, 133);
    else if (variant === 'secure') doc.setTextColor(52, 211, 153);
    else doc.setTextColor(56, 189, 248);
    doc.text(label, margin + 4, y + 4.6);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(226, 232, 240);

    let codeY = y + 10.5;
    codeLines.forEach((line) => {
      const clipped = line.length > 98 ? line.slice(0, 98) : line;
      doc.text(clipped, margin + 4, codeY);
      codeY += lineHeight;
    });

    return y + boxHeight + 4.5;
  };

  const drawEmbeddedImage = (y: number, dataUrl: string | null, heightMm: number, caption: string): number => {
    if (!dataUrl) return y;
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, heightMm, 'S');
    doc.addImage(dataUrl, 'JPEG', margin + 0.3, y + 0.3, contentWidth - 0.6, heightMm - 0.6);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(caption, pageWidth / 2, y + heightMm + 4, { align: 'center' });
    return y + heightMm + 8;
  };

  // =========================================================================
  // PAGE 1: PROJECT NAME -> STUDENT DETAILS -> COVER VISUAL & OVERVIEW
  // =========================================================================
  setupPage(true, 'CYBERSECURITY PROJECT  |  COVER & DETAILS');

  // 1. PROJECT NAME FIRST
  doc.setFillColor(10, 25, 47);
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, 22, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248);
  doc.text('CYBERSECURITY PRACTICAL PROJECT DOCUMENTATION', margin + 6, 29);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('SQL INJECTION (SQLi)', margin + 6, 40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(52, 211, 153);
  doc.text('Practical Web Application Attack and Prevention Laboratory', margin + 6, 49);

  // 2. STUDENT & INSTRUCTOR DETAILS SECOND
  doc.setFillColor(7, 11, 20);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 61, contentWidth, 66, 3, 3, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153);
  doc.text('STUDENT & INSTRUCTOR DETAILS', margin + 6, 69);

  const studentDetails: [string, string, boolean][] = [
    ['STUDENT NAME:', 'Mutayyab Rehman   (Roll No: 2672)', true],
    ['STUDENT NAME:', 'Muhammad Meeran   (Roll No: 2680)', true],
    ['INSTRUCTOR NAME:', instructor, true],
    ['COURSE:', 'Cybersecurity (Web Application Security Practical)', false],
    ['DEPARTMENT:', university, false],
    ['SUBMISSION DATE:', submissionDate, false],
  ];

  let detailY = 77;
  studentDetails.forEach(([label, val, highlight]) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(label, margin + 6, detailY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (highlight) doc.setTextColor(255, 255, 255);
    else doc.setTextColor(203, 213, 225);
    doc.text(val, margin + 55, detailY);

    doc.setDrawColor(30, 41, 59);
    doc.line(margin + 6, detailY + 2.2, pageWidth - margin - 6, detailY + 2.2);
    detailY += 8.2;
  });

  // 3. EMBEDDED COVER ILLUSTRATION & OVERVIEW
  let y = 133;
  y = drawEmbeddedImage(
    y,
    coverImg,
    82,
    'Architectural Overview: Relational Database Server and Cybersecurity Defense Perimeter'
  );

  y = drawBox(
    y,
    'Project Overview — What This Project Demonstrates',
    'This project explains how SQL Injection (SQLi) is created, how it works against a vulnerable login application, and how developers stop it completely using Parameterized Queries (?). We demonstrate a real local login app built with Python, Flask, and SQLite.',
    'sky'
  );

  // =========================================================================
  // PAGE 2: INTRODUCTION, ARCHITECTURE & HOW SQL INJECTION IS CREATED
  // =========================================================================
  y = setupPage(
    false,
    'HOW SQL INJECTION IS CREATED & WORKS',
    'How SQL Injection Is Created & How It Works',
    'Visualizing normal login flow versus a SQL Injection login bypass.'
  );

  y = drawEmbeddedImage(
    y,
    attackFlowImg,
    88,
    'Visual Diagram: Normal Login Flow (Left) vs. SQL Injection Attack Flow (Right)'
  );

  y = drawBox(
    y,
    'How SQL Injection Is Created in Code',
    "SQL Injection is created when a developer pastes (concatenates) raw user input directly inside a SQL command string:\n\nquery = f\"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'\"\n\nWhy this is dangerous: Because the user's input is pasted directly between single quotes, typing a single quote (') inside the username closes the username early! Anything typed after that quote is executed by the database as a real SQL command.",
    'rose'
  );

  y = drawBox(
    y,
    'Normal Input vs. SQL Injection Input',
    "• Normal Input (m.rehman / Rehman#2672):\n  SELECT * FROM users WHERE username = 'm.rehman' AND password = 'Rehman#2672'\n  Checks both username and password normally.\n\n• SQL Injection Input (' OR '1'='1' -- ):\n  SELECT * FROM users WHERE username = '' OR '1'='1' -- ' AND password = 'any'\n  Because '1'='1' is always TRUE and -- comments out the password check, the database returns the first row (admin)!",
    'emerald'
  );

  // =========================================================================
  // PAGE 3: LOCAL LABORATORY SETUP & VULNERABLE LOGIN CODE
  // =========================================================================
  y = setupPage(
    false,
    'LOCAL LABORATORY & VULNERABLE CODE',
    'Laboratory Setup & Vulnerable Login Application',
    'Local Python, Flask, and SQLite setup and the intentionally vulnerable login server.'
  );

  y = drawEmbeddedImage(
    y,
    labWorkstationImg,
    78,
    'Cybersecurity Laboratory Workstation: Python Flask Code Editor & Localhost Login Portal'
  );

  y = drawCodeBlock(
    y,
    'vulnerable_app.py — Intentionally Vulnerable Login Application (Localhost Only)',
    [
      '# Students: Mutayyab Rehman (2672) & Muhammad Meeran (2680) | Instructor: Shah Muhammad Sab',
      'import sqlite3',
      'from flask import Flask, request, render_template_string',
      '',
      'app = Flask(__name__)',
      'DB = "local_lab_users.db"',
      '',
      '@app.route("/login", methods=["GET", "POST"])',
      'def login():',
      '    message = ""',
      '    if request.method == "POST":',
      '        username = request.form.get("username", "")',
      '        password = request.form.get("password", "")',
      '        conn = sqlite3.connect(DB)',
      '        cursor = conn.cursor()',
      '',
      '        # VULNERABLE: User input is joined directly into the SQL query string',
      '        query = f"SELECT id, username, role FROM users WHERE username = \'{username}\' AND password = \'{password}\'"',
      '        cursor.execute(query)',
      '        row = cursor.fetchone()',
      '        if row:',
      '            message = f"Login Accepted! Logged in as: {row[1]} ({row[2]})"',
      '        else:',
      '            message = "Login Rejected: Invalid username or password."',
      '        conn.close()',
      '    return render_template_string(HTML_FORM, message=message)',
      '',
      'if __name__ == "__main__":',
      '    app.run(host="127.0.0.1", port=5000, debug=False)',
    ],
    'vulnerable'
  );

  // =========================================================================
  // PAGE 4: SQL INJECTION PREVENTION & SECURE LOGIN IMPLEMENTATION
  // =========================================================================
  y = setupPage(
    false,
    'PREVENTION & SECURE IMPLEMENTATION',
    'SQL Injection Prevention & Secure Login Code',
    'Using Parameterized Queries (?) to separate SQL structure from user data.'
  );

  y = drawEmbeddedImage(
    y,
    preventionImg,
    82,
    'Visual Comparison: Vulnerable String Injection (Left) vs. Fortified Parameterized Queries (Right)'
  );

  y = drawCodeBlock(
    y,
    'secure_app.py — Corrected Secure Login Application Using Parameterized Queries (?)',
    [
      '# Students: Mutayyab Rehman (2672) & Muhammad Meeran (2680) | Instructor: Shah Muhammad Sab',
      'import sqlite3',
      'from flask import Flask, request, render_template_string',
      '',
      'app = Flask(__name__)',
      'DB = "local_lab_users.db"',
      '',
      '@app.route("/login", methods=["GET", "POST"])',
      'def login():',
      '    message = ""',
      '    if request.method == "POST":',
      '        username = request.form.get("username", "").strip()',
      '        password = request.form.get("password", "")',
      '        conn = sqlite3.connect(DB)',
      '        cursor = conn.cursor()',
      '',
      '        # SECURE FIX: Parameterized Query using ? placeholders',
      '        sql = "SELECT id, username, role FROM users WHERE username = ? AND password = ?"',
      '        cursor.execute(sql, (username, password))',
      '        row = cursor.fetchone()',
      '        if row:',
      '            message = f"Login Accepted! Logged in as: {row[1]} ({row[2]})"',
      '        else:',
      '            message = "Login Rejected: Invalid username or password."',
      '        conn.close()',
      '    return render_template_string(HTML_FORM, message=message)',
    ],
    'secure'
  );

  y = drawBox(
    y,
    'Conclusion & Project Sign-Off',
    'By replacing string concatenation with Parameterized Queries (?), the database treats \' OR \'1\'=\'1\' -- strictly as plain text and rejects the login bypass.\n\nSubmitted to Instructor: ' +
      instructor +
      '  |  Students: Mutayyab Rehman (Roll No: 2672) & Muhammad Meeran (Roll No: 2680)',
    'emerald'
  );

  doc.save('SQL_Injection_Project_Mutayyab_2672_Meeran_2680.pdf');
}
