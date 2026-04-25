"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: "✅",
    content: `By accessing or using Social Share Bay ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions of this agreement, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    id: "use",
    title: "Use of Service",
    icon: "🔧",
    content: `You agree to use Social Share Bay only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates any applicable national or international law or regulation, to transmit unsolicited or unauthorized advertising or promotional material, or to impersonate or attempt to impersonate the Company, an employee, another user, or any other person or entity.`,
  },
  {
    id: "accounts",
    title: "User Accounts",
    icon: "👤",
    content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`,
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    icon: "🧠",
    content: `The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Social Share Bay and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Social Share Bay. User-generated content remains the property of the respective users.`,
  },
  {
    id: "termination",
    title: "Termination",
    icon: "🚫",
    content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or use the account deletion feature in your settings.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: "⚖️",
    content: `In no event shall Social Share Bay, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: "🔄",
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`,
  },
  {
    id: "governing",
    title: "Governing Law",
    icon: "🏛️",
    content: `These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will continue in effect.`,
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = mounted && scrollY > 30;

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --amber: #D97706; --amber2: #F59E0B; --amber3: #B45309; --amber4: #92400E;
          --ink: #0D0D14; --ink2: #1F1F2E; --muted: #6B7280; --muted2: #9CA3AF;
          --border: #E5E7EB; --surface: #FFFBF0; --white: #FFFFFF;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; color: var(--ink); overflow-x: hidden; }
        ::selection { background: #D9770622; color: var(--amber); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 5%; display: flex; align-items: center; justify-content: space-between;
          height: 68px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.95); backdrop-filter: blur(24px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06);
        }
        .nav-logo {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          background: linear-gradient(135deg, #D97706, #F59E0B);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-decoration: none; letter-spacing: -0.03em;
        }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--ink2); font-size: 0.88rem; font-weight: 500; opacity: 0.65; transition: opacity 0.2s; }
        .nav-links a:hover { opacity: 1; }
        .nav-cta {
          background: var(--ink); color: white; border: none;
          padding: 0.55rem 1.4rem; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem;
          cursor: pointer; transition: all 0.25s;
        }
        .nav-cta:hover { background: #D97706; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.35); }

        .hero-terms {
          padding: 140px 5% 80px;
          background: white;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(217,119,6,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(245,158,11,0.05) 0%, transparent 55%);
        }
        .hero-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%);
        }
        .hero-inner-terms { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--border);
          border-radius: 100px; padding: 6px 14px 6px 8px;
          margin-bottom: 1.75rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .pill-badge {
          background: linear-gradient(135deg, #D97706, #F59E0B);
          color: white; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 100px;
        }
        .pill-text { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
        .page-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.05; color: var(--ink);
          letter-spacing: -0.04em; margin-bottom: 1.25rem;
        }
        .page-title em {
          font-style: normal;
          background: linear-gradient(135deg, #D97706, #F59E0B);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .page-sub { font-size: 1rem; color: var(--muted); line-height: 1.8; }
        .updated-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 1.5rem; padding: 6px 14px; border-radius: 100px;
          background: var(--surface); border: 1px solid var(--border);
          font-size: 0.78rem; color: var(--muted); font-weight: 500;
        }

        .content-layout {
          display: grid; grid-template-columns: 260px 1fr;
          gap: 3rem; max-width: 1100px; margin: 0 auto;
          padding: 4rem 5% 6rem;
        }
        .sidebar {
          position: sticky; top: 90px; height: fit-content;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.5rem; overflow: hidden;
        }
        .sidebar-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.75rem; font-weight: 700; color: var(--muted2);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.625rem 0.875rem; border-radius: 12px;
          margin-bottom: 4px; cursor: pointer;
          font-size: 0.84rem; font-weight: 500; color: var(--muted);
          transition: all 0.2s; text-decoration: none;
          border: 1px solid transparent;
        }
        .sidebar-item:hover { background: white; color: var(--ink); border-color: var(--border); }
        .sidebar-item.active {
          background: white; color: #D97706;
          border-color: #D9770630;
          font-weight: 600;
        }
        .sidebar-icon { font-size: 0.9rem; flex-shrink: 0; }

        .terms-content { max-width: 720px; }
        .terms-section {
          margin-bottom: 3rem; padding: 2rem; border-radius: 20px;
          border: 1px solid var(--border); background: white;
          transition: all 0.3s; scroll-margin-top: 100px;
        }
        .terms-section:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.06); border-color: #D9770630; }
        .section-header-terms {
          display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem;
        }
        .section-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: 1px solid #D9770630;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; flex-shrink: 0;
        }
        .section-title-terms {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.2rem; font-weight: 700; color: var(--ink);
          letter-spacing: -0.02em;
        }
        .section-body {
          font-size: 0.92rem; line-height: 1.85; color: var(--muted);
          padding-left: 56px;
        }

        .cta-box {
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: 1px solid #D9770630; border-radius: 20px;
          padding: 2rem; text-align: center; margin-top: 2rem;
        }
        .cta-box h3 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.2rem; font-weight: 700; color: var(--ink);
          margin-bottom: 0.5rem;
        }
        .cta-box p { font-size: 0.88rem; color: var(--muted); margin-bottom: 1.25rem; }
        .btn-amber {
          background: linear-gradient(135deg, #D97706, #F59E0B);
          color: white; border: none; padding: 0.7rem 1.5rem;
          border-radius: 100px; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          transition: all 0.3s; display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
        }
        .btn-amber:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(217,119,6,0.35); }

        footer { background: var(--ink); padding: 2.5rem 5%; }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.2rem; font-weight: 800; background: linear-gradient(135deg, #FCD34D, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .footer-copy { font-size: 0.82rem; color: rgba(255,255,255,0.35); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: white; }

        @media (max-width: 768px) {
          .content-layout { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .nav-links { display: none; }
          .section-body { padding-left: 0; }
        }
      `}</style>

      <nav className={`nav${isScrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">Social Share Bay</Link>
       
        <Link href="/dashboard"><button className="nav-cta">Start Free →</button></Link>
      </nav>

      <section className="hero-terms">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner-terms">
          <div className="hero-pill">
            <span className="pill-badge">Legal</span>
            <span className="pill-text">Last updated January 2025</span>
          </div>
          <h1 className="page-title">Terms &amp; <em>Conditions</em></h1>
          <p className="page-sub">Please read these terms carefully before using Social Share Bay. By using our service, you agree to be bound by these terms.</p>
          <div className="updated-badge">📅 Effective Date: January 1, 2025</div>
        </div>
      </section>

      <div className="content-layout">
        <aside className="sidebar">
          <div className="sidebar-title">On this page</div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`sidebar-item${activeSection === s.id ? " active" : ""}`} onClick={() => setActiveSection(s.id)}>
              <span className="sidebar-icon">{s.icon}</span>
              {s.title}
            </a>
          ))}
        </aside>

        <div className="terms-content">
          {sections.map((s) => (
            <div key={s.id} id={s.id} className="terms-section">
              <div className="section-header-terms">
                <div className="section-icon">{s.icon}</div>
                <div className="section-title-terms">{s.title}</div>
              </div>
              <p className="section-body">{s.content}</p>
            </div>
          ))}
          <div className="cta-box">
            <h3>Questions about our terms?</h3>
            <p>We're happy to clarify anything. Reach out to our team anytime.</p>
            <Link href="/contact" className="btn-amber">📬 Contact Us</Link>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Social Share Bay</div>
            <div className="footer-copy" style={{ marginTop: 4 }}>© 2025 Social Share Bay. All rights reserved.</div>
          </div>
          <div className="footer-links">
            <Link href="/privacy" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms</Link>
            <Link href="/contact" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}