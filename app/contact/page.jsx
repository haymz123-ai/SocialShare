"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const faqs = [
  { q: "What's your typical response time?", a: "We aim to respond to all inquiries within 24 hours on business days. Priority support customers receive responses within 4 hours." },
  { q: "Do you offer phone support?", a: "Phone support is available for Scale plan customers. All other plans are supported via email and our help center." },
  { q: "Can I request a product demo?", a: "Absolutely! Fill out the contact form and select 'Product Demo' as your subject — we'll schedule a personalized walkthrough." },
  { q: "Where can I find documentation?", a: "Our full documentation and guides are available in the Help Center. You can access it directly from your dashboard." },
];

const contactOptions = [
  { icon: "💬", title: "General Inquiry", desc: "Questions about Social Share Bay", color: "#D97706" },
  { icon: "🛠️", title: "Technical Support", desc: "Help with a bug or issue", color: "#F59E0B" },
  { icon: "💼", title: "Business & Sales", desc: "Enterprise or agency plans", color: "#B45309" },
  { icon: "🎯", title: "Product Demo", desc: "See the platform in action", color: "#92400E" },
];

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState("General Inquiry");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = mounted && scrollY > 30;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedOption = contactOptions.find((o) => o.title === subject);

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

        .hero-contact {
          padding: 140px 5% 80px; background: white;
          position: relative; overflow: hidden; text-align: center;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(217,119,6,0.08) 0%, transparent 65%),
                      radial-gradient(ellipse 40% 40% at 90% 60%, rgba(245,158,11,0.05) 0%, transparent 55%);
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
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 100px;
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

        .contact-layout {
          display: grid; grid-template-columns: 1fr 1.4fr;
          gap: 3rem; max-width: 1100px; margin: 0 auto; padding: 4rem 5% 6rem;
          align-items: start;
        }

        /* LEFT PANEL */
        .contact-info { display: flex; flex-direction: column; gap: 1.5rem; }
        .info-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.75rem;
        }
        .info-card-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.1rem; font-weight: 700; color: var(--ink);
          margin-bottom: 1rem; letter-spacing: -0.02em;
        }
        .email-link {
          display: flex; align-items: center; gap: 12px;
          padding: 1rem 1.25rem; border-radius: 14px;
          background: white; border: 1.5px solid #D9770630;
          text-decoration: none; transition: all 0.25s;
          margin-bottom: 0.75rem;
        }
        .email-link:hover { border-color: #D97706; transform: translateX(4px); box-shadow: 0 4px 20px rgba(217,119,6,0.1); }
        .email-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #D97706, #F59E0B);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(217,119,6,0.3);
        }
        .email-label { font-size: 0.72rem; color: var(--muted2); font-weight: 500; margin-bottom: 1px; }
        .email-address { font-size: 0.88rem; font-weight: 600; color: #D97706; font-family: monospace; }

        .response-times { display: flex; flex-direction: column; gap: 10px; }
        .rt-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: 12px;
          background: white; border: 1px solid var(--border);
        }
        .rt-left { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 500; color: var(--ink); }
        .rt-badge {
          font-size: 0.65rem; font-weight: 700; padding: 2px 8px;
          border-radius: 6px; letter-spacing: 0.04em;
        }

        .faq-mini { display: flex; flex-direction: column; gap: 8px; }
        .faq-mini-item {
          background: white; border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden; transition: border-color 0.2s;
        }
        .faq-mini-item:hover { border-color: #D9770650; }
        .faq-mini-q {
          padding: 1rem 1.25rem;
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; gap: 1rem;
          font-weight: 600; font-size: 0.84rem; color: var(--ink);
        }
        .faq-mini-icon { font-size: 1rem; transition: transform 0.3s; color: var(--muted); flex-shrink: 0; }
        .faq-mini-icon.open { transform: rotate(45deg); color: #D97706; }
        .faq-mini-a {
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.3s;
          font-size: 0.84rem; color: var(--muted); line-height: 1.7;
        }
        .faq-mini-a.open { max-height: 160px; padding: 0 1.25rem 1rem; }

        /* RIGHT PANEL - FORM */
        .form-card {
          background: white; border: 1px solid var(--border);
          border-radius: 24px; padding: 2.5rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.06);
          position: sticky; top: 90px;
        }
        .form-top { margin-bottom: 2rem; }
        .form-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.5rem; font-weight: 800; color: var(--ink);
          letter-spacing: -0.03em; margin-bottom: 0.375rem;
        }
        .form-sub { font-size: 0.88rem; color: var(--muted); }

        .subject-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.75rem; }
        .subject-btn {
          padding: 0.875rem 1rem; border-radius: 14px;
          border: 1.5px solid var(--border); background: var(--surface);
          cursor: pointer; transition: all 0.25s; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .subject-btn:hover { border-color: #D97706; background: #FFFBEB; }
        .subject-btn.active { border-color: #D97706; background: #FFFBEB; }
        .subj-icon { font-size: 1.1rem; margin-bottom: 4px; display: block; }
        .subj-title { font-size: 0.82rem; font-weight: 700; color: var(--ink); display: block; margin-bottom: 1px; }
        .subj-desc { font-size: 0.72rem; color: var(--muted); display: block; }

        .field { margin-bottom: 1.25rem; }
        .field-label {
          display: block; font-size: 0.82rem; font-weight: 600;
          color: var(--ink2); margin-bottom: 6px;
        }
        .field-input {
          width: 100%; padding: 0.75rem 1rem; border-radius: 12px;
          border: 1.5px solid var(--border); background: var(--surface);
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--ink);
          outline: none; transition: all 0.25s; resize: none;
        }
        .field-input:focus { border-color: #D97706; background: #FFFBEB; box-shadow: 0 0 0 4px rgba(217,119,6,0.08); }
        .field-input::placeholder { color: var(--muted2); }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .submit-btn {
          width: 100%; padding: 1rem; border-radius: 100px;
          background: linear-gradient(135deg, #D97706, #F59E0B);
          color: white; border: none; font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.3s; box-shadow: 0 6px 24px rgba(217,119,6,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 1.5rem;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(217,119,6,0.4); }

        .form-note {
          text-align: center; margin-top: 1rem;
          font-size: 0.78rem; color: var(--muted2);
        }

        .success-state {
          text-align: center; padding: 3rem 2rem;
        }
        .success-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #D97706, #F59E0B);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; margin: 0 auto 1.5rem;
          box-shadow: 0 8px 32px rgba(217,119,6,0.3);
          animation: bounceIn 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .success-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.75rem; font-weight: 800; color: var(--ink);
          letter-spacing: -0.03em; margin-bottom: 0.75rem;
        }
        .success-sub { font-size: 0.95rem; color: var(--muted); line-height: 1.75; margin-bottom: 2rem; }
        .btn-outline {
          padding: 0.7rem 1.5rem; border-radius: 100px;
          border: 1.5px solid var(--border); background: white;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s; color: var(--ink);
        }
        .btn-outline:hover { border-color: #D97706; color: #D97706; }

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

        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; }
          .form-card { position: static; }
          .nav-links { display: none; }
          .field-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .subject-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className={`nav${isScrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">Social Share Bay</Link>
        
        <Link href="/dashboard"><button className="nav-cta">Start Free →</button></Link>
      </nav>

      <section className="hero-contact">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="pill-badge">Contact</span>
            <span className="pill-text">We're here to help 👋</span>
          </div>
          <h1 className="page-title">Get in <em>Touch</em></h1>
          <p className="page-sub">Have a question, a feature idea, or need help? Drop us a message and we'll get back to you within 24 hours.</p>
        </div>
      </section>

      <div className="contact-layout">
        {/* LEFT */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-card-title">📬 Reach Us Directly</div>
            <a href="mailto:contactandquestions100@gmail.com" className="email-link">
              <div className="email-icon">✉️</div>
              <div>
                <div className="email-label">Email us at</div>
                <div className="email-address">contactandquestions100@gmail.com</div>
              </div>
            </a>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>
              This is our primary support channel. We monitor it daily and respond to every message personally.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-title">⏱️ Response Times</div>
            <div className="response-times">
              {[
                { plan: "🆓 Free Plan", time: "Within 48 hrs", bg: "#F3F4F6", color: "#6B7280" },
                { plan: "🚀 Growth Plan", time: "Within 24 hrs", bg: "#FEF3C7", color: "#D97706" },
                { plan: "⚡ Scale Plan", time: "Within 4 hrs", bg: "#DCFCE7", color: "#16A34A" },
              ].map((r) => (
                <div key={r.plan} className="rt-item">
                  <div className="rt-left">{r.plan}</div>
                  <span className="rt-badge" style={{ background: r.bg, color: r.color }}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-title">❓ Common Questions</div>
            <div className="faq-mini">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-mini-item">
                  <div className="faq-mini-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span className={`faq-mini-icon${activeFaq === i ? " open" : ""}`}>+</span>
                  </div>
                  <div className={`faq-mini-a${activeFaq === i ? " open" : ""}`}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div className="form-card">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon">✅</div>
              <div className="success-title">Message Sent!</div>
              <p className="success-sub">
                Thanks for reaching out, {form.name || "there"}! We've received your message and will get back to you at <strong>{form.email || "your email"}</strong> shortly.
              </p>
              <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", message: "" }); }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="form-top">
                <div className="form-title">Send us a message</div>
                <div className="form-sub">We read every message and respond personally.</div>
              </div>

              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted2)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                What can we help with?
              </div>
              <div className="subject-grid">
                {contactOptions.map((opt) => (
                  <button key={opt.title} className={`subject-btn${subject === opt.title ? " active" : ""}`} onClick={() => setSubject(opt.title)}>
                    <span className="subj-icon">{opt.icon}</span>
                    <span className="subj-title">{opt.title}</span>
                    <span className="subj-desc">{opt.desc}</span>
                  </button>
                ))}
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field-label">Your Name *</label>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className="field">
                  <label className="field-label">Email Address *</label>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Company / Brand <span style={{ color: "var(--muted2)", fontWeight: 400 }}>(optional)</span></label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Acme Inc."
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="field-label">Your Message *</label>
                <textarea
                  className="field-input"
                  rows={5}
                  placeholder={`Tell us about your ${subject.toLowerCase()} — the more detail, the better we can help!`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div style={{
                padding: "0.875rem 1rem", borderRadius: 12,
                background: "#FFFBEB", border: "1px solid #D9770630",
                fontSize: "0.82rem", color: "#B45309", display: "flex", gap: 8, alignItems: "flex-start"
              }}>
                <span>📨</span>
                <span>Your message will be sent directly to <strong>contactandquestions100@gmail.com</strong></span>
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!form.name || !form.email || !form.message}
                style={{ opacity: (!form.name || !form.email || !form.message) ? 0.6 : 1, cursor: (!form.name || !form.email || !form.message) ? "not-allowed" : "pointer" }}
              >
                <span>🚀</span> Send Message
              </button>
              <div className="form-note">🔒 Your information is secure and never shared.</div>
            </>
          )}
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