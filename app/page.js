"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Testimonials"];

const SOCIAL_PLATFORMS = [
  { name: "Instagram", color: "#E1306C", icon: "📸", followers: "2.4M" },
  { name: "Twitter/X",  color: "#1DA1F2", icon: "𝕏",  followers: "890K" },
  { name: "LinkedIn",  color: "#0A66C2", icon: "in", followers: "345K" },
  { name: "TikTok",    color: "#FF0050", icon: "♪",  followers: "5.1M" },
  { name: "Facebook",  color: "#1877F2", icon: "f",  followers: "1.2M" },
  { name: "YouTube",   color: "#FF0000", icon: "▶",  followers: "780K" },
  { name: "Pinterest", color: "#E60023", icon: "P",  followers: "220K" },
  { name: "Threads",   color: "#aaaaaa", icon: "@",  followers: "410K" },
];

const FEATURES = [
  { icon: "⚡", title: "One-Click Scheduling", desc: "Publish to all platforms simultaneously with a single click. No more tab-switching madness.", accent: "#FFD700" },
  { icon: "🧠", title: "AI Content Brain", desc: "Let AI rewrite your caption for each platform's unique tone, character limit, and audience.", accent: "#FF6B6B" },
  { icon: "📊", title: "Unified Analytics", desc: "See every like, share, click, and follower gain across all channels in one gorgeous dashboard.", accent: "#4ECDC4" },
  { icon: "🗓️", title: "Visual Calendar", desc: "Drag-and-drop your content queue on a beautiful calendar. Reschedule in seconds.", accent: "#A8FF78" },
  { icon: "🔔", title: "Smart Alerts", desc: "Get notified when posts go viral so you can ride the wave with instant engagement.", accent: "#FFC3A0" },
  { icon: "🔒", title: "Bank-Level Security", desc: "OAuth-secured connections, zero password storage, and end-to-end encrypted scheduling.", accent: "#C9FFBF" },
];

const STEPS = [
  {
    num: "01", emoji: "🔗", title: "Connect Your World",
    desc: "Link all your social accounts in under 2 minutes. We handle every API handshake securely.",
    accent: "#4ECDC4",
    detail: "Instagram · TikTok · LinkedIn · X · Facebook · YouTube · Pinterest · Threads",
  },
  {
    num: "02", emoji: "✍️", title: "Create Once",
    desc: "Write your post, upload your media, and let AI optimize it for every platform automatically.",
    accent: "#FFD700",
    detail: "Text · Images · Videos · Reels · Stories · Shorts",
  },
  {
    num: "03", emoji: "🚀", title: "Schedule & Forget",
    desc: "Pick your time, hit publish, and watch SyncPost deliver everywhere — perfectly.",
    accent: "#FF6B6B",
    detail: "Instant · Scheduled · Queue · Draft · Auto-optimize times",
  },
];

const PLANS = [
  { name: "Starter", price: "$0", period: "forever", features: ["3 Social Accounts", "30 Scheduled Posts/mo", "Basic Analytics", "1 User"], cta: "Start Free", highlight: false },
  { name: "Creator", price: "$19", period: "per month", features: ["10 Social Accounts", "Unlimited Scheduling", "Advanced Analytics", "AI Captions", "3 Users"], cta: "Go Creator", highlight: true },
  { name: "Agency", price: "$69", period: "per month", features: ["Unlimited Accounts", "Unlimited Scheduling", "White-Label Reports", "AI Captions", "25 Users", "Priority Support"], cta: "Scale Up", highlight: false },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Lifestyle Creator · 1.8M followers", quote: "SyncPost cut my content workflow from 3 hours to 15 minutes. I post more, stress less.", avatar: "PS", color: "#FF6B6B" },
  { name: "Marcus Wei", role: "Social Media Manager · Agency Owner", quote: "Managing 22 client accounts used to be chaos. Now it's basically a one-person job.", avatar: "MW", color: "#4ECDC4" },
  { name: "Aisha Nkosi", role: "Brand Strategist · Fortune 500", quote: "The analytics dashboard alone is worth 10x the price. Absolute game-changer for our team.", avatar: "AN", color: "#FFD700" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #05050A; }
  ::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 2px; }
  .glow-text { background: linear-gradient(135deg, #FFD700 0%, #FF6B6B 50%, #4ECDC4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .card-hover { transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease; }
  .card-hover:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 24px 60px rgba(255,215,0,0.12); }
  .btn-primary { background: linear-gradient(135deg, #FFD700, #FF8C42); color: #05050A; font-weight: 700; font-family: 'Syne', sans-serif; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.02em; }
  .btn-primary:hover { transform: scale(1.04); box-shadow: 0 12px 40px rgba(255,215,0,0.4); }
  .btn-ghost { background: transparent; color: #F0EDE8; font-weight: 600; font-family: 'Syne', sans-serif; border: 1.5px solid rgba(240,237,232,0.25); cursor: pointer; transition: border-color 0.2s, background 0.2s; }
  .btn-ghost:hover { border-color: #FFD700; background: rgba(255,215,0,0.06); }
  .platform-pill { transition: transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s, filter 0.25s; }
  .platform-pill:hover { transform: scale(1.1) translateY(-3px); filter: brightness(1.2); }
  @keyframes float-hub { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.04)} }
  @keyframes pulse-ring { 0%{transform:translate(-50%,-50%) scale(0.85);opacity:0.6} 100%{transform:translate(-50%,-50%) scale(1.8);opacity:0} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-2%)} 30%{transform:translate(2%,-1%)} 50%{transform:translate(-1%,2%)} 70%{transform:translate(2%,1%)} 90%{transform:translate(-2%,1%)} }
  @keyframes step-glow { 0%,100%{box-shadow:0 0 0 rgba(255,215,0,0)} 50%{box-shadow:0 0 40px rgba(255,215,0,0.3)} }
  @keyframes connector-flow { 0%{background-position:-100% 0} 100%{background-position:200% 0} }
  @keyframes badge-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes compose-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes platform-tag-in { from{opacity:0;transform:translateY(6px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes progress-fill { from{width:0%} to{width:var(--pw)} }
  @keyframes icon-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .float-hub { position:absolute; top:50%; left:50%; animation:float-hub 4s ease-in-out infinite; }
  .noise-overlay { position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:256px;animation:grain 0.5s steps(1) infinite; }
  .grid-bg { background-image:linear-gradient(rgba(255,215,0,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(255,215,0,0.04) 1px, transparent 1px);background-size:60px 60px; }
  .cursor-blink { animation: cursor-blink 1s ease-in-out infinite; }
  .compose-glow { box-shadow: 0 0 0 1px rgba(255,215,0,0.15), 0 40px 120px rgba(0,0,0,0.7), 0 0 100px rgba(255,215,0,0.08); }
  @media (max-width:768px) { .hide-mobile{display:none!important} .mobile-col{flex-direction:column!important} }
`;

export default function LandingPage() {
  const [activeNav, setActiveNav]     = useState(null);
  const [scrollY, setScrollY]         = useState(0);
  const [orbiting, setOrbiting]       = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [mounted, setMounted]         = useState(false);
  const [activeStep, setActiveStep]   = useState(0);
  const [hubPulse, setHubPulse]       = useState(false);
  const [schedulingAnim, setSchedulingAnim] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([0,1,2,3,4,5]);
  const [postText, setPostText] = useState("🚀 Excited to share our latest update! We've been working hard on something special...");
  const [scheduleTime, setScheduleTime] = useState("Today, 3:00 PM");

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleResize); };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => setOrbiting(prev => (prev + 0.25) % 360), 16);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    const interval = setInterval(() => setActiveStep(s => (s + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { setHubPulse(true); setTimeout(() => setHubPulse(false), 600); }, 2500);
    return () => clearInterval(interval);
  }, []);

  const navBg = scrollY > 60 ? "rgba(5,5,10,0.95)" : "transparent";
  const orbitRadius = Math.min(220, (Math.min(windowWidth * 0.9, 560) * 0.88) / 2 - 36);

  const togglePlatform = (i) => {
    setSelectedPlatforms(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const handleSchedule = () => {
    setSchedulingAnim(true);
    setTimeout(() => setSchedulingAnim(false), 2500);
  };

  return (
    <div style={{ background: "#05050A", color: "#F0EDE8", fontFamily: "'Syne', sans-serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="noise-overlay" />

      {/* NAV */}
      <nav style={{  top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", background: navBg, backdropFilter: scrollY > 60 ? "blur(20px)" : "none", transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFD700, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#05050A" }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>SyncPost</span>
        </div>
        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} style={{ color: activeNav === link ? "#FFD700" : "rgba(240,237,232,0.65)", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "color 0.2s", letterSpacing: "0.04em" }} onMouseEnter={() => setActiveNav(link)} onMouseLeave={() => setActiveNav(null)}>{link}</a>
          ))}
        </div>
        <div className="hide-mobile" style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" style={{ padding: "10px 22px", borderRadius: 10, fontSize: 14 }}>Log In</button>
          <button className="btn-primary" style={{ padding: "10px 22px", borderRadius: 10, fontSize: 14 }}>Start Free →</button>
        </div>
      </nav>

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="grid-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 5% 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none", transform: `translateY(${scrollY * 0.1}px)` }} />
        <div style={{ position: "absolute", bottom: "5%", right: "2%", width: 500, height: 500, background: "radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", padding: "8px 18px", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#FFD700", marginBottom: 32, letterSpacing: "0.08em", animation: "fadeSlideUp 0.6s ease forwards" }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#FFD700", boxShadow: "0 0 8px #FFD700", animation: "badge-float 2s ease-in-out infinite" }} />
          NOW SUPPORTING 8+ PLATFORMS
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(44px, 7.5vw, 92px)", lineHeight: 0.95, letterSpacing: "-0.03em", textAlign: "center", maxWidth: 960, marginBottom: 26, animation: "fadeSlideUp 0.7s ease 0.1s both forwards" }}>
          All Your Social.<br />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
            <span className="glow-text">One Click</span>
          </span>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}> Away.</span>
        </h1>

        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(240,237,232,0.5)", maxWidth: 520, textAlign: "center", lineHeight: 1.65, marginBottom: 44, animation: "fadeSlideUp 0.7s ease 0.2s both forwards" }}>
          Connect every social account, create once, and schedule everywhere — in the time it takes to make coffee.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeSlideUp 0.7s ease 0.3s both forwards" }}>
          <Link href="/connection">
            <button className="btn-primary" style={{ padding: "16px 36px", borderRadius: 14, fontSize: 16 }}>Start Posting Free — No Card Needed</button>
          </Link>
          <button className="btn-ghost" style={{ padding: "16px 28px", borderRadius: 14, fontSize: 16 }}>▶ Watch Demo</button>
        </div>

        {/* ORBIT VISUALIZATION */}
        {mounted && (
          <div style={{ position: "relative", width: "min(560px, 88vw)", height: "min(560px, 88vw)", marginTop: 70, animation: "fadeSlideUp 0.8s ease 0.4s both forwards", flexShrink: 0 }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 560 560">
              <defs>
                <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                </radialGradient>
                {SOCIAL_PLATFORMS.map((p, i) => (
                  <linearGradient key={i} id={`lineGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={p.color} stopOpacity="0" />
                    <stop offset="50%" stopColor={p.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={p.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              <circle cx="280" cy="280" r="80" fill="url(#hubGlow)" opacity="0.6" />
              <circle cx="280" cy="280" r={orbitRadius} fill="none" stroke="rgba(255,215,0,0.07)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="280" cy="280" r={orbitRadius * 0.6} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              {SOCIAL_PLATFORMS.map((platform, i) => {
                const angle = ((i / SOCIAL_PLATFORMS.length) * 360 + orbiting) * (Math.PI / 180);
                const px = 280 + Math.cos(angle) * orbitRadius;
                const py = 280 + Math.sin(angle) * orbitRadius;
                return <line key={i} x1="280" y1="280" x2={px} y2={py} stroke={platform.color} strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 6" />;
              })}
            </svg>

            {/* Hub — icon only, no text */}
            <div className="float-hub" style={{
              width: 110, height: 110, borderRadius: "50%",
              background: hubPulse
                ? "linear-gradient(135deg, #FFE44D, #FF9C4A)"
                : "linear-gradient(135deg, #FFD700, #FF8C42)",
              boxShadow: hubPulse
                ? "0 0 80px rgba(255,215,0,0.7), 0 0 120px rgba(255,215,0,0.3)"
                : "0 0 50px rgba(255,215,0,0.5), 0 0 100px rgba(255,215,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 44, zIndex: 10,
              transition: "box-shadow 0.4s ease, background 0.4s ease",
              border: "2px solid rgba(255,255,255,0.35)",
            }}>
              ⚡
            </div>

            {[1, 2, 3].map(i => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 110, height: 110, borderRadius: "50%",
                border: `2px solid rgba(255,215,0,${0.4 - i * 0.1})`,
                animation: `pulse-ring 2.5s ease-out ${i * 0.7}s infinite`,
              }} />
            ))}

            {SOCIAL_PLATFORMS.map((platform, i) => {
              const angle = ((i / SOCIAL_PLATFORMS.length) * 360 + orbiting) * (Math.PI / 180);
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              return (
                <div key={platform.name} className="platform-pill" style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  background: "rgba(8,8,18,0.95)",
                  border: `1.5px solid ${platform.color}55`,
                  borderRadius: 14, padding: "9px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                  backdropFilter: "blur(16px)",
                  whiteSpace: "nowrap", cursor: "pointer",
                  boxShadow: `0 4px 24px ${platform.color}30, inset 0 0 0 1px ${platform.color}15`,
                  zIndex: 5,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: `linear-gradient(135deg, ${platform.color}30, ${platform.color}15)`,
                    border: `1.5px solid ${platform.color}70`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: platform.color,
                    boxShadow: `0 0 12px ${platform.color}40`,
                  }}>{platform.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#F0EDE8", letterSpacing: "0.02em" }}>{platform.name}</div>
                    <div style={{ fontSize: 10, color: platform.color, fontWeight: 600, marginTop: 1 }}>{platform.followers}</div>
                  </div>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: platform.color, boxShadow: `0 0 6px ${platform.color}`, marginLeft: 2, flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center", marginTop: 56, padding: "24px 48px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, backdropFilter: "blur(10px)" }}>
          {[
            { num: "500K+", label: "Active Creators" },
            { num: "8",     label: "Platforms Connected" },
            { num: "12M+",  label: "Posts Scheduled" },
            { num: "99.9%", label: "Uptime SLA" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#FFD700", lineHeight: 1 }}>{stat.num}</div>
              <div style={{ fontSize: 13, color: "rgba(240,237,232,0.4)", marginTop: 6, letterSpacing: "0.06em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: "#FFD700", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "inline-flex", animation: "ticker 20s linear infinite" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {["Instagram","Twitter","LinkedIn","TikTok","Facebook","YouTube","Pinterest","Threads"].map(p => (
                <span key={p} style={{ fontSize: 13, fontWeight: 700, color: "#05050A", padding: "0 32px", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                  {p} <span style={{ opacity: 0.4 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES ══════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "120px 5%", position: "relative" }}>
        <div style={{ position: "absolute", top: "30%", right: 0, width: 300, height: 600, background: "radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#4ECDC4", marginBottom: 16 }}>WHAT MAKES US DIFFERENT</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'Playfair Display', serif" }}>
            Built for creators who<br />
            <span className="glow-text" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>mean business</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.accent}, transparent)` }} />
              <div style={{ width: 52, height: 52, background: f.accent + "18", border: `1px solid ${f.accent}40`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: "rgba(240,237,232,0.5)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "120px 5%", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,215,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ textAlign: "center", marginBottom: 80, position: "relative" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#FFD700", marginBottom: 12 }}>THE PROCESS</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.0, fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>From zero to everywhere</h2>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 24px)", color: "rgba(240,237,232,0.35)" }}>in three effortless moves</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto 80px", position: "relative" }}>
          <div style={{ position: "absolute", top: 52, left: "16.66%", right: "16.66%", height: 2, background: "rgba(255,215,0,0.1)", borderRadius: 2 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 2, background: "linear-gradient(90deg, transparent, #FFD700, transparent)", backgroundSize: "200% 100%", animation: "connector-flow 3s linear infinite" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, position: "relative" }}>
            {STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div key={step.num} onClick={() => setActiveStep(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "all 0.3s ease" }}>
                  <div style={{ width: 104, height: 104, borderRadius: "50%", marginBottom: 28, background: isActive ? `linear-gradient(135deg, ${step.accent}40, ${step.accent}20)` : "rgba(255,255,255,0.04)", border: `2px solid ${isActive ? step.accent : "rgba(255,255,255,0.1)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, position: "relative", boxShadow: isActive ? `0 0 40px ${step.accent}40, 0 0 80px ${step.accent}20` : "none", transition: "all 0.4s ease" }}>
                    {isActive && <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid ${step.accent}30`, animation: "pulse-ring 2s ease-out infinite" }} />}
                    <span style={{ fontSize: 32, lineHeight: 1, filter: isActive ? "none" : "grayscale(0.5) opacity(0.6)", transition: "filter 0.4s" }}>{step.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: isActive ? step.accent : "rgba(255,255,255,0.25)", transition: "color 0.4s" }}>{step.num}</span>
                  </div>
                  <div style={{ textAlign: "center", maxWidth: 300 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em", color: isActive ? "#F0EDE8" : "rgba(240,237,232,0.55)", transition: "color 0.4s" }}>{step.title}</h3>
                    <p style={{ fontSize: 15, color: isActive ? "rgba(240,237,232,0.7)" : "rgba(240,237,232,0.3)", lineHeight: 1.65, marginBottom: 16, transition: "color 0.4s" }}>{step.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0)" : "translateY(8px)", transition: "all 0.4s ease" }}>
                      {step.detail.split(" · ").map(tag => (
                        <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: step.accent + "18", border: `1px solid ${step.accent}35`, color: step.accent, letterSpacing: "0.04em" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 48 }}>
            {STEPS.map((step, i) => (
              <div key={i} onClick={() => setActiveStep(i)} style={{ width: activeStep === i ? 28 : 8, height: 8, borderRadius: 100, background: activeStep === i ? step.accent : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.35s ease", boxShadow: activeStep === i ? `0 0 12px ${step.accent}70` : "none" }} />
            ))}
          </div>
        </div>

        {/* ══ REDESIGNED COMPOSE UI ══════════════════════════════════════════ */}
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>

          {/* Outer glow halo */}
          <div style={{ position: "absolute", inset: -40, background: "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.07) 0%, transparent 70%)", pointerEvents: "none", borderRadius: 40 }} />

          <div className="compose-glow" style={{
            background: "rgba(6,6,16,0.98)",
            border: "1px solid rgba(255,215,0,0.14)",
            borderRadius: 28, overflow: "hidden",
            position: "relative",
          }}>

            {/* Top gradient bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)", backgroundSize: "200% 100%", animation: "connector-flow 4s linear infinite" }} />

            {/* Window chrome */}
            <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, margin: "0 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 28, display: "flex", alignItems: "center", paddingLeft: 12, fontSize: 12, color: "rgba(240,237,232,0.3)", gap: 8 }}>
                <span style={{ fontSize: 10, color: "rgba(255,215,0,0.4)" }}>🔒</span>
                app.syncpost.io/compose
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(40,200,64,0.1)", border: "1px solid rgba(40,200,64,0.25)", borderRadius: 20, padding: "4px 10px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#28C840", boxShadow: "0 0 6px #28C840" }} />
                <span style={{ fontSize: 11, color: "#28C840", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE</span>
              </div>
            </div>

            {/* App body */}
            <div style={{ display: "flex", minHeight: 520 }}>

              {/* Sidebar */}
              <div style={{ width: 180, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", flexShrink: 0, background: "rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.18)", marginBottom: 14, paddingLeft: 4 }}>NAVIGATION</div>
                {[
                  { icon: "◈", label: "Dashboard", active: false },
                  { icon: "✦", label: "Compose",   active: true  },
                  { icon: "▦", label: "Calendar",  active: false },
                  { icon: "◎", label: "Analytics", active: false },
                  { icon: "⊞", label: "Accounts",  active: false },
                ].map(item => (
                  <div key={item.label} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 2, background: item.active ? "rgba(255,215,0,0.1)" : "transparent", border: item.active ? "1px solid rgba(255,215,0,0.18)" : "1px solid transparent", fontSize: 12, color: item.active ? "#FFD700" : "rgba(240,237,232,0.35)", fontWeight: item.active ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                  </div>
                ))}

                {/* Mini stats */}
                <div style={{ marginTop: 28, padding: "14px 12px", background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.08)", borderRadius: 12 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,215,0,0.4)", marginBottom: 12 }}>THIS MONTH</div>
                  {[
                    { label: "Posts sent", value: "47", color: "#FFD700" },
                    { label: "Reach", value: "284K", color: "#4ECDC4" },
                    { label: "Engagements", value: "12.4K", color: "#FF6B6B" },
                  ].map(s => (
                    <div key={s.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: "rgba(240,237,232,0.35)" }}>{s.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: s.label === "Posts sent" ? "65%" : s.label === "Reach" ? "80%" : "45%", background: s.color, borderRadius: 2, boxShadow: `0 0 6px ${s.color}` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main compose area */}
              <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2 }}>New Post</h3>
                    <p style={{ fontSize: 12, color: "rgba(240,237,232,0.35)" }}>Compose once, publish everywhere</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(240,237,232,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Save Draft</button>
                    <button style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)", fontSize: 11, color: "#4ECDC4", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>✨ AI Assist</button>
                  </div>
                </div>

                {/* Platform selector */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>PUBLISHING TO</div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {SOCIAL_PLATFORMS.map((p, i) => {
                      const sel = selectedPlatforms.includes(i);
                      return (
                        <div key={p.name} onClick={() => togglePlatform(i)} style={{ padding: "6px 12px", background: sel ? p.color + "22" : "rgba(255,255,255,0.03)", border: `1.5px solid ${sel ? p.color + "70" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, fontSize: 11, fontWeight: 700, color: sel ? p.color : "rgba(240,237,232,0.3)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s", boxShadow: sel ? `0 0 12px ${p.color}25` : "none" }}>
                          <span style={{ fontSize: 13 }}>{p.icon}</span>
                          <span>{p.name}</span>
                          {sel && <span style={{ fontSize: 9, width: 14, height: 14, background: p.color, color: "#000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Text area */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,215,0,0.1)", borderRadius: 14, padding: "14px 16px", position: "relative" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,215,0,0.4)", marginBottom: 10 }}>CAPTION</div>
                  <div style={{ fontSize: 14, color: "rgba(240,237,232,0.75)", lineHeight: 1.65, minHeight: 60 }}>
                    {postText}<span className="cursor-blink" style={{ color: "#FFD700", fontWeight: 300 }}>|</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["😊","#","@","🖼️","🔗"].map(e => (
                        <button key={e} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", opacity: 0.5, transition: "opacity 0.2s", padding: "2px 4px" }} onMouseEnter={ev => ev.target.style.opacity=1} onMouseLeave={ev => ev.target.style.opacity=0.5}>{e}</button>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>{postText.length} / 280</span>
                  </div>
                </div>

                {/* Media drop zone */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1.5px dashed rgba(255,215,0,0.15)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,66,0.1))", border: "1px solid rgba(255,215,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🖼️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,237,232,0.6)", marginBottom: 2 }}>Drop media here or browse</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>JPG, PNG, MP4, MOV · Max 500MB</div>
                  </div>
                  <button style={{ padding: "8px 16px", borderRadius: 9, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", color: "rgba(255,215,0,0.8)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s" }}>Browse Files</button>
                </div>

                {/* Schedule row */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>🕐</span>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", marginBottom: 2 }}>SCHEDULE FOR</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,237,232,0.7)" }}>{scheduleTime}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 11, background: "rgba(168,255,120,0.1)", border: "1px solid rgba(168,255,120,0.2)", color: "#A8FF78", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>OPTIMAL</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", marginBottom: 2 }}>PLATFORMS</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,237,232,0.7)" }}>{selectedPlatforms.length} selected</div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="btn-primary"
                  onClick={handleSchedule}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14, fontSize: 15,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    position: "relative", overflow: "hidden",
                    background: schedulingAnim
                      ? "linear-gradient(135deg, #28C840, #4ECDC4)"
                      : "linear-gradient(135deg, #FFD700, #FF8C42)",
                    transition: "background 0.4s ease",
                  }}
                >
                  {schedulingAnim ? (
                    <>
                      <span style={{ fontSize: 18 }}>✓</span>
                      <span>Scheduled to {selectedPlatforms.length} Platforms!</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 18 }}>⚡</span>
                      <span>Schedule to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""} Now</span>
                      <span style={{ fontSize: 12, opacity: 0.7, marginLeft: 4 }}>→</span>
                    </>
                  )}
                  {/* Shimmer overlay */}
                  {!schedulingAnim && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "compose-shimmer 3s ease-in-out infinite" }} />
                  )}
                </button>

                {/* Trust strip */}
                <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                  {["🔒 End-to-end encrypted", "⚡ Posts in < 2 seconds", "✦ 99.9% delivery rate"].map(t => (
                    <span key={t} style={{ fontSize: 11, color: "rgba(240,237,232,0.25)", fontWeight: 600 }}>{t}</span>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "120px 5%", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#FF6B6B", marginBottom: 16 }}>PRICING PLANS</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'Playfair Display', serif" }}>
            Simple, honest pricing.<br />
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: "rgba(240,237,232,0.4)" }}>No hidden surprises.</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 24, maxWidth: 1000, margin: "0 auto", alignItems: "stretch", flexWrap: "wrap", justifyContent: "center" }}>
          {PLANS.map(plan => (
            <div key={plan.name} className="card-hover" style={{ flex: "1 1 280px", maxWidth: 320, background: plan.highlight ? "linear-gradient(145deg, rgba(255,215,0,0.12), rgba(255,140,66,0.08))" : "rgba(255,255,255,0.03)", border: plan.highlight ? "1.5px solid rgba(255,215,0,0.35)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 36, position: "relative", overflow: "hidden" }}>
              {plan.highlight && <div style={{ position: "absolute", top: 20, right: 20, background: "#FFD700", color: "#05050A", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.08em" }}>POPULAR</div>}
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(240,237,232,0.5)", marginBottom: 12 }}>{plan.name.toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", color: plan.highlight ? "#FFD700" : "#F0EDE8" }}>{plan.price}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(240,237,232,0.35)", marginBottom: 32 }}>{plan.period}</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, marginBottom: 28 }}>
                {plan.features.map(feat => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(240,237,232,0.65)", marginBottom: 12 }}>
                    <span style={{ color: plan.highlight ? "#FFD700" : "#4ECDC4", fontSize: 16, fontWeight: 800 }}>✓</span>{feat}
                  </div>
                ))}
              </div>
              <button className={plan.highlight ? "btn-primary" : "btn-ghost"} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 15 }}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding: "120px 5%", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#4ECDC4", marginBottom: 16 }}>LOVED BY CREATORS</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "'Playfair Display', serif" }}>
            Don't take our word for it.<br />
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: "rgba(240,237,232,0.4)" }}>Take theirs.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, position: "relative" }}>
              <div style={{ fontSize: 52, lineHeight: 1, color: t.color, opacity: 0.25, fontFamily: "Georgia, serif", marginBottom: 8 }}>"</div>
              <p style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "rgba(240,237,232,0.75)", lineHeight: 1.65, marginBottom: 24 }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: t.color + "33", border: `1.5px solid ${t.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: t.color }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)", marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "120px 5%", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "-10%", width: "120%", height: "160%", background: "radial-gradient(ellipse at center, rgba(255,215,0,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,215,0,0.14)", borderRadius: 32, padding: "72px 48px", backdropFilter: "blur(20px)" }}>
          <div style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
            Ready to post<br />
            <span className="glow-text" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>like a pro?</span>
          </div>
          <p style={{ fontSize: 18, color: "rgba(240,237,232,0.5)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: 40, lineHeight: 1.5 }}>
            Join 500,000+ creators who've already made the switch. Free forever, no credit card needed.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "18px 44px", borderRadius: 14, fontSize: 17 }}>Get Started — It's Free</button>
            <button className="btn-ghost" style={{ padding: "18px 30px", borderRadius: 14, fontSize: 17 }}>Talk to Sales</button>
          </div>
          <div style={{ marginTop: 28, fontSize: 13, color: "rgba(240,237,232,0.3)", display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <span>✦ No credit card</span><span>✦ Cancel anytime</span><span>✦ Setup in 2 minutes</span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer style={{ padding: "56px 5% 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFD700, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#05050A" }}>S</div>
              <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>SyncPost</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(240,237,232,0.4)", lineHeight: 1.65 }}>The all-in-one social scheduling platform for creators who move fast and create things worth sharing.</p>
          </div>
          {[
            { title: "Product", links: ["Features","Pricing","Changelog","API Docs"] },
            { title: "Company", links: ["About","Blog","Careers","Press Kit"] },
            { title: "Support", links: ["Help Center","Status","Privacy","Terms"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(240,237,232,0.35)", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: 14, color: "rgba(240,237,232,0.55)", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "#FFD700"} onMouseLeave={e => e.target.style.color = "rgba(240,237,232,0.55)"}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(240,237,232,0.3)" }}>© 2025 SyncPost. Made with ♥ for creators.</div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter","LinkedIn","Instagram","YouTube"].map(s => (
              <a key={s} href="#" style={{ fontSize: 13, color: "rgba(240,237,232,0.35)", textDecoration: "none" }} onMouseEnter={e => e.target.style.color = "#FFD700"} onMouseLeave={e => e.target.style.color = "rgba(240,237,232,0.35)"}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}