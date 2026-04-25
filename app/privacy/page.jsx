"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const sections = [
  {
    id: "information",
    title: "Information We Collect",
    icon: "📋",
    content: `We collect information you provide directly to us, such as when you create an account, connect your social media profiles, schedule posts, or contact us for support. This includes your name, email address, password, connected social account tokens, and any content you create or upload within the platform. We also automatically collect certain information about your device and how you interact with our services, including IP address, browser type, operating system, referring URLs, and activity logs.`,
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    icon: "⚙️",
    content: `We use the information we collect to provide, maintain, and improve Social Share Bay, including processing your scheduled posts, delivering analytics insights, and personalizing your experience. We may also use your information to send you technical notices, updates, security alerts, and support messages. With your consent, we may send promotional communications about new features, products, and offers. We use aggregated, anonymized data to understand usage trends and improve our AI scheduling models.`,
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: "🤝",
    content: `We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information with trusted service providers who assist in operating our platform, conducting our business, or serving our users — under strict confidentiality agreements. We may disclose information when required by law, to protect our rights, or in connection with a merger or acquisition. Social media platforms you connect to will receive content and commands as directed by your scheduled posts.`,
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: "🍪",
    content: `Social Share Bay uses cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze how our service is used. Essential cookies are required for the platform to function. Analytics cookies help us understand user behavior. You may control cookie settings through your browser preferences. Disabling certain cookies may affect the functionality of parts of our service. We honor browser Do Not Track signals where applicable.`,
  },
  {
    id: "security",
    title: "Data Security",
    icon: "🔒",
    content: `We take the security of your data seriously and implement industry-standard measures to protect your personal information. This includes encryption of data in transit and at rest, regular security audits, and access controls limiting who within our organization can view your data. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords, enable two-factor authentication, and keep your credentials confidential.`,
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: "🗓️",
    content: `We retain your personal information for as long as your account is active or as needed to provide you services. If you close your account, we will delete or anonymize your personal data within 90 days, except where we are required to retain it for legal compliance purposes. Scheduled posts that have already been published to social platforms cannot be recalled from those platforms. Analytics data may be retained in aggregated, anonymized form after account deletion.`,
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: "🛡️",
    content: `Depending on your location, you may have certain rights regarding your personal data, including the right to access the personal information we hold about you, to correct inaccuracies, to request deletion of your data, to object to or restrict certain processing activities, and to data portability. To exercise these rights, please contact us using the details below. We will respond to your request within 30 days. We do not discriminate against users who exercise their privacy rights.`,
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: "👶",
    content: `Social Share Bay is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information as quickly as possible.`,
  },
  {
    id: "contact-privacy",
    title: "Contact Us About Privacy",
    icon: "📬",
    content: `If you have questions, concerns, or requests related to this Privacy Policy or the handling of your personal information, please contact us at contactandquestions100@gmail.com. We are committed to working with you to resolve any privacy concerns promptly and transparently. You may also contact your local data protection authority if you believe your rights have not been adequately addressed.`,
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("information");
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
          font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.4rem; font-weight: 800;
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

        .hero-privacy {
          padding: 140px 5% 80px; background: white;
          position: relative; overflow: hidden; text-align: center;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(217,119,6,0.07) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(180,83,9,0.04) 0%, transparent 55%);
        }
        .hero-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%);
        }
        .hero-inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--border);
          border-radius: 100px; padding: 6px 14px 6px 8px;
          margin-bottom: 1.75rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .pill-badge {
          background: linear-gradient(135deg, #D97706, #F59E0B); color: white;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 100px;
        }
        .pill-text { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
        .page-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800;
          line-height: 1.05; color: var(--ink); letter-spacing: -0.04em; margin-bottom: 1.25rem;
        }
        .page-title em {
          font-style: normal; background: linear-gradient(135deg, #D97706, #F59E0B);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .page-sub { font-size: 1rem; color: var(--muted); line-height: 1.8; }
        .updated-badge {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 1.5rem;
          padding: 6px 14px; border-radius: 100px;
          background: var(--surface); border: 1px solid var(--border);
          font-size: 0.78rem; color: var(--muted); font-weight: 500;
        }

        .trust-strip {
          display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;
          padding: 2rem 5%; background: var(--surface);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.84rem; font-weight: 600; color: var(--muted);
        }
        .trust-icon { font-size: 1.1rem; }

        .content-layout {
          display: grid; grid-template-columns: 260px 1fr;
          gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 4rem 5% 6rem;
        }
        .sidebar {
          position: sticky; top: 90px; height: fit-content;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.5rem;
        }
        .sidebar-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.75rem; font-weight: 700; color: var(--muted2);
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem;
        }
        .sidebar-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.625rem 0.875rem; border-radius: 12px; margin-bottom: 4px;
          cursor: pointer; font-size: 0.84rem; font-weight: 500; color: var(--muted);
          transition: all 0.2s; text-decoration: none; border: 1px solid transparent;
        }
        .sidebar-item:hover { background: white; color: var(--ink); border-color: var(--border); }
        .sidebar-item.active { background: white; color: #D97706; border-color: #D9770630; font-weight: 600; }

        .privacy-content { max-width: 720px; }
        .privacy-section {
          margin-bottom: 2rem; padding: 2rem; border-radius: 20px;
          border: 1px solid var(--border); background: white;
          transition: all 0.3s; scroll-margin-top: 100px;
        }
        .privacy-section:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.06); border-color: #D9770630; }
        .section-header-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; }
        .section-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: 1px solid #D9770630;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; flex-shrink: 0;
        }
        .section-title-p {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.2rem; font-weight: 700; color: var(--ink); letter-spacing: -0.02em;
        }
        .section-body { font-size: 0.92rem; line-height: 1.85; color: var(--muted); padding-left: 56px; }

        .highlight-box {
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: 1px solid #D9770630; border-radius: 16px;
          padding: 1.25rem 1.5rem; margin-top: 1rem; margin-left: 56px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .highlight-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
        .highlight-text { font-size: 0.84rem; color: #B45309; font-weight: 500; line-height: 1.6; }

        .cta-box {
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: 1px solid #D9770630; border-radius: 20px;
          padding: 2rem; text-align: center; margin-top: 2rem;
        }
        .cta-box h3 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 0.5rem; }
        .cta-box p { font-size: 0.88rem; color: var(--muted); margin-bottom: 1.25rem; }
        .btn-amber {
          background: linear-gradient(135deg, #D97706, #F59E0B); color: white; border: none;
          padding: 0.7rem 1.5rem; border-radius: 100px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
          cursor: pointer; transition: all 0.3s;
          display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
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
          .section-body, .highlight-box { padding-left: 0; margin-left: 0; }
          .trust-strip { gap: 1rem; }
        }
      `}</style>

      <nav className={`nav${isScrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">Social Share Bay</Link>
      
        <Link href="/dashboard"><button className="nav-cta">Start Free →</button></Link>
      </nav>

      <section className="hero-privacy">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="pill-badge">Privacy</span>
            <span className="pill-text">Your data, your control</span>
          </div>
          <h1 className="page-title">Privacy <em>Policy</em></h1>
          <p className="page-sub">We believe privacy is a fundamental right. Here's exactly how we collect, use, and protect your personal information.</p>
          <div className="updated-badge">📅 Effective Date: January 1, 2025</div>
        </div>
      </section>

      <div className="trust-strip">
        {[
          { icon: "🔒", label: "End-to-end encrypted" },
          { icon: "🚫", label: "Never sold to advertisers" },
          { icon: "🌍", label: "GDPR compliant" },
          { icon: "✅", label: "SOC 2 Type II certified" },
        ].map((t) => (
          <div key={t.label} className="trust-item">
            <span className="trust-icon">{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>

      <div className="content-layout">
        <aside className="sidebar">
          <div className="sidebar-title">On this page</div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`sidebar-item${activeSection === s.id ? " active" : ""}`} onClick={() => setActiveSection(s.id)}>
              <span>{s.icon}</span>
              {s.title}
            </a>
          ))}
        </aside>

        <div className="privacy-content">
          {sections.map((s) => (
            <div key={s.id} id={s.id} className="privacy-section">
              <div className="section-header-row">
                <div className="section-icon">{s.icon}</div>
                <div className="section-title-p">{s.title}</div>
              </div>
              <p className="section-body">{s.content}</p>
              {s.id === "security" && (
                <div className="highlight-box">
                  <span className="highlight-icon">💡</span>
                  <span className="highlight-text">We recommend enabling two-factor authentication in your account settings for an added layer of protection.</span>
                </div>
              )}
            </div>
          ))}
          <div className="cta-box">
            <h3>Privacy questions?</h3>
            <p>Contact our dedicated privacy team for any concerns about your data.</p>
            <Link href="/contact" className="btn-amber">📬 Contact Privacy Team</Link>
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