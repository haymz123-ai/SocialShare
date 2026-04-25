// app/page.js  (or pages/index.js)
// app/page.js


"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
const platforms = [
  { name: "Instagram", icon: "📸", color: "#E1306C", handle: "@yourbrand", posts: 142, reach: "48K" },
  { name: "Twitter / X", icon: "🐦", color: "#1DA1F2", handle: "@yourbrand", posts: 389, reach: "92K" },
  { name: "LinkedIn", icon: "💼", color: "#0A66C2", handle: "Your Brand", posts: 67, reach: "21K" },
  { name: "Facebook", icon: "📘", color: "#1877F2", handle: "Your Page", posts: 203, reach: "61K" },
  { name: "TikTok", icon: "🎵", color: "#FF0050", handle: "@yourbrand", posts: 95, reach: "130K" },
  { name: "Pinterest", icon: "📌", color: "#E60023", handle: "yourbrand", posts: 312, reach: "37K" },
];

const features = [
  {
    icon: "🗓️",
    title: "Smart Scheduling",
    desc: "AI picks the perfect posting time per platform based on your audience's live activity patterns.",
    accent: "#D97706",
    light: "#FFFBEB",
    tag: "AI-Powered",
    stat: "3× more reach",
    visual: "schedule",
    number: "01",
  },
  {
    icon: "✍️",
    title: "Content Studio",
    desc: "Write once, adapt for every platform automatically — captions, hashtags, and formats included.",
    accent: "#F59E0B",
    light: "#FEF3C7",
    tag: "Multi-platform",
    stat: "6 platforms",
    visual: "studio",
    number: "02",
  },
  {
    icon: "📊",
    title: "Unified Analytics",
    desc: "One dashboard to track reach, engagement, and growth across all your social channels in real time.",
    accent: "#B45309",
    light: "#FEF9EE",
    tag: "Real-time",
    stat: "+84% insight",
    visual: "analytics",
    number: "03",
  }
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "For creators just getting started",
    features: ["3 Social Accounts", "8 Scheduled Posts/mo", "Basic Analytics", "Email Support"],
    accent: "#D97706",
    popular: false,
  },
  {
    name: "Growth",
    price: "$24",
    period: "/mo",
    desc: "For growing brands and agencies",
    features: ["15 Social Accounts", "Unlimited Posts", "Advanced Analytics", "AI Caption Writer", "Team Collaboration", "Priority Support"],
    accent: "#F59E0B",
    popular: true,
  },
  {
    name: "Scale",
    price: "$49",
    period: "/mo",
    desc: "For large teams and enterprises",
    features: ["Unlimited Accounts", "Unlimited Posts", "White-label Reports", "Custom AI Training", "Dedicated Manager", "API Access"],
    accent: "#B45309",
    popular: false,
  },
];



const howItWorks = [
  {
    step: "01",
    title: "Connect Your Accounts",
    desc: "Link all your social media profiles in one click. Social Share Bay handles the OAuth securely.",
    icon: "🔌",
    color: "#D97706",
  },
  {
    step: "02",
    title: "Create Your Content",
    desc: "Use our AI-powered studio to write and adapt content for every platform at once.",
    icon: "✨",
    color: "#F59E0B",
  },
  {
    step: "03",
    title: "Schedule & Automate",
    desc: "Set it and forget it. AI picks the best times; your content goes live automatically.",
    icon: "🚀",
    color: "#B45309",
  },
  {
    step: "04",
    title: "Track & Optimize",
    desc: "Monitor performance across all channels and double down on what's working.",
    icon: "📈",
    color: "#92400E",
  },
];

const logos = ["Shopify", "Notion", "Figma", "Slack", "HubSpot", "Stripe", "Webflow", "Canva"];

const scheduledPosts = [
  { id: 1, platform: "Instagram", icon: "📸", color: "#E1306C", time: "9:00 AM", day: "Mon", content: "New collection drop! 🔥", img: "🌅", status: "live", engagement: "4.2K" },
  { id: 2, platform: "Twitter", icon: "🐦", color: "#1DA1F2", time: "10:30 AM", day: "Mon", content: "Hot take: consistency beats virality every time 🧵", img: "💬", status: "scheduled", engagement: "—" },
  { id: 3, platform: "LinkedIn", icon: "💼", color: "#0A66C2", time: "12:00 PM", day: "Tue", content: "We hit $1M ARR. Here's what we learned.", img: "📈", status: "scheduled", engagement: "—" },
  { id: 4, platform: "TikTok", icon: "🎵", color: "#FF0050", time: "6:00 PM", day: "Tue", content: "POV: when the algorithm finally loves you ✨", img: "🎬", status: "scheduled", engagement: "—" },
  { id: 5, platform: "Facebook", icon: "📘", color: "#1877F2", time: "8:00 AM", day: "Wed", content: "Behind the scenes of our new campaign 👀", img: "🎨", status: "scheduled", engagement: "—" },
  { id: 6, platform: "Pinterest", icon: "📌", color: "#E60023", time: "3:00 PM", day: "Wed", content: "Mood board for spring 2025 🌸", img: "🌸", status: "scheduled", engagement: "—" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];

function ScheduleVisual({ accent }) {
  const times = ["9:00 AM", "12:30 PM", "5:00 PM", "8:00 PM"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {times.map((t, i) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 1 ? accent : "#E5E7EB", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 7, borderRadius: 4, background: i === 1 ? `${accent}22` : "#F3F4F6", position: "relative", overflow: "hidden" }}>
            {i === 1 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "70%", background: `linear-gradient(90deg, ${accent}, ${accent}99)`, borderRadius: 4 }} />}
          </div>
          <span style={{ fontSize: 10, color: i === 1 ? accent : "#9CA3AF", fontWeight: i === 1 ? 700 : 400, fontFamily: "monospace", minWidth: 55 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function StudioVisual({ accent }) {
  const plats = ["IG", "TW", "LI", "FB", "TK"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "white", borderRadius: 10, padding: "10px 12px", fontSize: 11, color: "#374151", lineHeight: 1.6, border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        ✨ "Excited to share our latest drop! 🔥 #NewRelease..."
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {plats.map((p, i) => (
          <div key={p} style={{ flex: 1, background: i < 3 ? accent : "#E5E7EB", borderRadius: 7, padding: "5px 0", textAlign: "center", fontSize: 9, color: i < 3 ? "white" : "#9CA3AF", fontWeight: 700 }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsVisual({ accent }) {
  const bars = [30, 55, 40, 70, 85, 60, 90];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ height: `${h}%`, borderRadius: "5px 5px 0 0", background: i === bars.length - 1 ? accent : `${accent}33`, transition: "height 0.3s" }} />
        </div>
      ))}
    </div>
  );
}

function AIVisual({ accent }) {
  const words = ["Engaging", "Viral", "On-brand", "Converting"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {words.map((w, i) => (
        <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: `${50 + i * 12}%`, height: 9, borderRadius: 5, background: i === 2 ? accent : `${accent}${i === 1 ? "44" : "18"}` }} />
          <span style={{ fontSize: 9, color: i === 2 ? accent : "#9CA3AF", fontWeight: 600 }}>{w}</span>
        </div>
      ))}
    </div>
  );
}

function CollabVisual({ accent }) {
  const members = ["AK", "SM", "PR", "JD"];
  const colors = ["#D97706", "#F59E0B", "#B45309", "#92400E"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex" }}>
        {members.map((m, i) => (
          <div key={m} style={{ width: 30, height: 30, borderRadius: "50%", background: colors[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700, border: "2px solid white", marginLeft: i > 0 ? -8 : 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{m}</div>
        ))}
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9CA3AF", border: "2px solid white", marginLeft: -8 }}>+3</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["Draft", "Review", "Approved"].map((s, i) => (
          <div key={s} style={{ flex: 1, background: i === 2 ? accent : "#F3F4F6", borderRadius: 8, padding: "4px 0", textAlign: "center", fontSize: 8, fontWeight: 700, color: i === 2 ? "white" : "#9CA3AF" }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

function RepublishVisual({ accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[{ label: "Jan post", val: 89, star: false }, { label: "Feb post", val: 67, star: false }, { label: "Mar post", val: 96, star: true }].map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: "#9CA3AF", width: 44, flexShrink: 0 }}>{item.label}</span>
          <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${item.val}%`, height: "100%", background: item.star ? accent : `${accent}44`, borderRadius: 4 }} />
          </div>
          {item.star && <span style={{ fontSize: 12 }}>🔁</span>}
        </div>
      ))}
    </div>
  );
}

function FeatureVisual({ visual, accent }) {
  if (visual === "schedule") return <ScheduleVisual accent={accent} />;
  if (visual === "studio") return <StudioVisual accent={accent} />;
  if (visual === "analytics") return <AnalyticsVisual accent={accent} />;
  if (visual === "ai") return <AIVisual accent={accent} />;
  if (visual === "collab") return <CollabVisual accent={accent} />;
  if (visual === "republish") return <RepublishVisual accent={accent} />;
  return null;
}

function SchedulingShowcase() {
  const [activePost, setActivePost] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const aiTimes = [
    { time: "9:00 AM", score: 98, label: "Peak" },
    { time: "12:30 PM", score: 84, label: "High" },
    { time: "5:00 PM", score: 76, label: "Good" },
    { time: "8:00 PM", score: 61, label: "Low" },
  ];

  const post = scheduledPosts[activePost];

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActivePost((p) => (p + 1) % scheduledPosts.length);
      setAnimating(false);
    }, 300);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "stretch" }}>
      <div style={{ background: "white", borderRadius: 24, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)" }}>
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0D0D14", letterSpacing: "-0.02em" }}>April 2025</div>
            <div style={{ fontSize: "0.72rem", color: "#9CA3AF", fontWeight: 500, marginTop: 2 }}>12 posts scheduled this week</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>
            <button style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0.75rem 1rem 0.25rem", gap: 4 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: "0.65rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0.25rem 1rem 1rem", gap: 4 }}>
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 1;
            const postsOnDay = [3, 7, 10, 14, 17, 20, 22, 24, 27].includes(day);
            const multiPost = [7, 14, 22].includes(day);
            const isToday = day === 14;
            const dotColors = ["#D97706", "#F59E0B", "#B45309", "#92400E"];
            return (
              <div key={i} onClick={() => postsOnDay && setDragOver(day)} style={{ aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: isToday ? 800 : postsOnDay ? 600 : 400, color: isToday ? "white" : day <= 0 || day > 30 ? "#D1D5DB" : postsOnDay ? "#0D0D14" : "#6B7280", background: isToday ? "linear-gradient(135deg, #D97706, #F59E0B)" : dragOver === day ? "#FFFBEB" : postsOnDay ? "#FAFAFA" : "transparent", border: isToday ? "none" : dragOver === day ? "1.5px dashed #D97706" : postsOnDay ? "1px solid #F3F4F6" : "none", cursor: postsOnDay ? "pointer" : "default", transition: "all 0.2s", position: "relative", gap: 2, boxShadow: isToday ? "0 4px 16px rgba(217,119,6,0.3)" : "none" }}>
                <span>{day > 0 && day <= 30 ? day : ""}</span>
                {postsOnDay && day > 0 && !isToday && (
                  <div style={{ display: "flex", gap: 2 }}>
                    {(multiPost ? [0, 1, 2] : [0]).map((dot) => (
                      <div key={dot} style={{ width: 4, height: 4, borderRadius: "50%", background: dotColors[dot % dotColors.length] }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: "1px solid #F3F4F6", padding: "0.875rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Upcoming Today</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {scheduledPosts.slice(0, 3).map((p, i) => (
              <div key={p.id} onClick={() => setActivePost(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 10, background: activePost === i ? `${p.color}10` : "#FAFAFA", border: `1px solid ${activePost === i ? p.color + "30" : "#F3F4F6"}`, cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#0D0D14", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.content}</div>
                  <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{p.time}</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.status === "live" ? "#22C55E" : "#D1D5DB", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", flex: 1, opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.3s, transform 0.3s" }}>
          <div style={{ padding: "0.875rem 1.25rem", background: post.color, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.1rem" }}>{post.icon}</span>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{post.platform}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)" }}>{post.day} · {post.time}</div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: "0.65rem", fontWeight: 700, color: "white", backdropFilter: "blur(8px)" }}>
              {post.status === "live" ? "🟢 Live" : "⏳ Scheduled"}
            </div>
          </div>
          <div style={{ padding: "1.25rem" }}>
            <div style={{ height: 80, borderRadius: 14, background: `linear-gradient(135deg, ${post.color}15, ${post.color}08)`, border: `1px solid ${post.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>{post.img}</div>
            <div style={{ fontSize: "0.88rem", color: "#0D0D14", fontWeight: 500, lineHeight: 1.6, marginBottom: "0.875rem" }}>{post.content}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.875rem" }}>
              {["#trending", "#brand", "#viral"].map(tag => (
                <span key={tag} style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6, background: `${post.color}12`, color: post.color, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Est. reach: <strong style={{ color: "#0D0D14" }}>{post.engagement === "—" ? "~8.4K" : post.engagement}</strong></div>
              <button onClick={handleNext} style={{ background: post.color, color: "white", border: "none", borderRadius: 10, padding: "5px 12px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}>Next Post →</button>
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 20, border: "1px solid #E5E7EB", padding: "1.25rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #D97706, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>✨</div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0D0D14" }}>AI Best Times</div>
              <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>Based on your audience activity</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {aiTimes.map((t, i) => (
              <div key={t.time} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#22C55E" : i === 1 ? "#D97706" : i === 2 ? "#F59E0B" : "#D1D5DB", flexShrink: 0 }} />
                <span style={{ fontSize: "0.72rem", color: "#6B7280", fontFamily: "monospace", minWidth: 60 }}>{t.time}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#F3F4F6", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.score}%`, borderRadius: 3, background: i === 0 ? "linear-gradient(90deg, #22C55E, #86EFAC)" : i === 1 ? "linear-gradient(90deg, #D97706, #FCD34D)" : i === 2 ? "linear-gradient(90deg, #F59E0B, #FDE68A)" : "#E5E7EB", transition: "width 1s ease" }} />
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: i === 0 ? "#22C55E" : i === 1 ? "#D97706" : i === 2 ? "#F59E0B" : "#9CA3AF", minWidth: 28, textAlign: "right" }}>{t.score}%</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: i === 0 ? "#DCFCE7" : i === 1 ? "#FFFBEB" : i === 2 ? "#FEF3C7" : "#F3F4F6", color: i === 0 ? "#16A34A" : i === 1 ? "#D97706" : i === 2 ? "#B45309" : "#9CA3AF" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueStrip() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 1) % (scheduledPosts.length * 120)), 30);
    return () => clearInterval(id);
  }, []);
  const items = [...scheduledPosts, ...scheduledPosts, ...scheduledPosts];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", gap: 12, transition: "none" }}>
        {items.map((p, i) => (
          <div key={i} style={{ flexShrink: 0, background: "white", border: `1.5px solid ${p.color}25`, borderRadius: 16, padding: "0.875rem 1.125rem", display: "flex", alignItems: "center", gap: 10, minWidth: 220, boxShadow: `0 4px 16px ${p.color}10`, transition: "transform 0.2s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{p.icon}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0D0D14", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.platform}</div>
              <div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{p.day} · {p.time}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.status === "live" ? "#22C55E" : p.color, flexShrink: 0, boxShadow: `0 0 0 3px ${p.status === "live" ? "#DCFCE7" : p.color + "20"}` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [mounted]);

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };
  const isVisible = (id) => visibleSections[id];
  const isScrolled = mounted && scrollY > 30;
  const navLinks = ["Features", "Platforms", "Pricing", "Testimonials"];

  const faqs = [
    { q: "Can I try Social Share Bay for free?", a: "Yes! Our free plan includes 3 social accounts and 8 posts per month — no credit card needed." },
    { q: "Which platforms are supported?", a: "Instagram, Twitter/X, LinkedIn, Facebook, TikTok, Pinterest, YouTube Shorts, and more." },
    { q: "Can I cancel anytime?", a: "Absolutely. Cancel with one click, no questions asked. You keep access until the billing period ends." },
    { q: "Is there a team plan?", a: "Yes! The Growth plan supports up to 5 seats. Need more? Scale plan is unlimited." },
  ];

  return (
    <>
      <style suppressHydrationWarning>{`
     @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --violet: #D97706;
  --pink: #F59E0B;
  --green: #B45309;
  --amber: #92400E;
  --ink: #0D0D14;
  --ink2: #1F1F2E;
  --muted: #6B7280;
  --muted2: #9CA3AF;
  --border: #E5E7EB;
  --surface: #FFFBF0;
  --white: #FFFFFF;
  --radius: 20px;
}
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: #fff; color: var(--ink); overflow-x: hidden; }
.display { font-family: 'Bricolage Grotesque', sans-serif; }
::selection { background: #D9770622; color: var(--violet); }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 5%;
  display: flex; align-items: center; justify-content: space-between;
  height: 68px;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.nav.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(24px);
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
  background: var(--ink);
  color: white; border: none;
  padding: 0.55rem 1.4rem; border-radius: 100px;
  font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem;
  cursor: pointer; transition: all 0.25s;
  display: flex; align-items: center; gap: 6px;
}
.nav-cta:hover { background: #D97706; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.35); }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
.hamburger span { width: 22px; height: 2px; background: var(--ink); border-radius: 2px; display: block; transition: all 0.3s; }
.mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: white; padding: 2rem 5%; flex-direction: column; gap: 1.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.12); z-index: 99; border-top: 1px solid var(--border); }
.mobile-menu.open { display: flex; }
.mobile-menu a { text-decoration: none; color: var(--ink); font-size: 1rem; font-weight: 500; }

.hero {
  min-height: 100vh;
  padding: 0 5%;
  display: flex; align-items: center;
  position: relative; overflow: hidden;
  background: #ffffff;
}
.hero-noise {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.025;
}
.hero-aurora {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 60% 30%, rgba(217,119,6,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(245,158,11,0.07) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(180,83,9,0.05) 0%, transparent 55%);
  animation: auroraShift 8s ease-in-out infinite alternate;
}
@keyframes auroraShift {
  0% { opacity: 0.7; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.04); }
}
.hero-grid-lines {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%);
}
.hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 5rem; align-items: center;
  max-width: 1200px; margin: 0 auto; width: 100%;
  padding: 130px 0 80px;
}
.hero-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 100px; padding: 6px 14px 6px 8px;
  margin-bottom: 1.75rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.pill-badge {
  background: linear-gradient(135deg, #D97706, #F59E0B);
  color: white; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 100px;
}
.pill-text { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.hero-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(3rem, 5.5vw, 5.25rem);
  font-weight: 800; line-height: 1.02;
  color: var(--ink); letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
}
.hero-title em {
  font-style: normal;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 60%, #92400E 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { font-size: 1.05rem; color: var(--muted); line-height: 1.8; margin-bottom: 2.5rem; max-width: 460px; font-weight: 400; }
.hero-actions { display: flex; gap: 0.875rem; flex-wrap: wrap; align-items: center; margin-bottom: 2.75rem; }
.btn-primary {
  background: linear-gradient(135deg, #D97706, #F59E0B);
  color: white; border: none; padding: 0.875rem 1.875rem;
  border-radius: 100px; font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 8px 32px rgba(217,119,6,0.3);
  transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px;
  position: relative; overflow: hidden;
}
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  opacity: 0; transition: opacity 0.3s; border-radius: 100px;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(217,119,6,0.4); }
.btn-primary:hover::after { opacity: 1; }
.btn-primary span { position: relative; z-index: 1; }
.btn-ghost {
  background: white; color: var(--ink);
  border: 1.5px solid var(--border);
  padding: 0.875rem 1.875rem; border-radius: 100px;
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
  display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.btn-ghost:hover { border-color: #D97706; color: #D97706; box-shadow: 0 6px 20px rgba(217,119,6,0.12); }
.hero-trust { display: flex; align-items: center; gap: 12px; }
.trust-avatars { display: flex; }
.trust-av { width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; margin-left: -8px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: white; }
.trust-av:first-child { margin-left: 0; }
.trust-text { font-size: 0.82rem; color: var(--muted); font-weight: 500; }
.trust-text strong { color: var(--ink); }
.stars { color: #F59E0B; font-size: 0.75rem; }

.hero-metrics {
  display: flex; gap: 0; margin-top: 3rem;
  border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden;
  background: var(--surface);
}
.hero-metric {
  flex: 1; padding: 1rem 1.25rem;
  border-right: 1px solid var(--border);
  transition: background 0.25s;
  cursor: default;
}
.hero-metric:last-child { border-right: none; }
.hero-metric:hover { background: white; }
.hm-val {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem; font-weight: 800; line-height: 1;
  margin-bottom: 3px; letter-spacing: -0.03em;
}
.hm-lbl { font-size: 0.68rem; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

.hero-visual { position: relative; }
.dash-outer {
  position: relative;
  filter: drop-shadow(0 32px 64px rgba(217,119,6,0.12));
}
.dash-wrap {
  background: white;
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 32px 80px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);
  position: relative; overflow: hidden;
}
.dash-wrap::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #D97706, #F59E0B, #FBBF24);
}
.dash-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.window-dots { display: flex; gap: 5px; }
.wd { width: 10px; height: 10px; border-radius: 50%; }
.wd-r { background: #FF5F57; } .wd-y { background: #FEBC2E; } .wd-g { background: #28C840; }
.dash-label { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 0.88rem; color: var(--ink2); }
.dash-live {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.65rem; color: var(--muted2); font-weight: 500;
}
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; animation: pulse 2s infinite; }
.plat-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 12px;
  margin-bottom: 6px; background: var(--surface);
  transition: all 0.25s; cursor: pointer;
}
.plat-item:hover { background: #FFFBEB; transform: translateX(3px); }
.plat-emoji { font-size: 1.1rem; }
.plat-info { flex: 1; }
.plat-name-d { font-size: 0.82rem; font-weight: 600; color: var(--ink2); }
.plat-handle { font-size: 0.72rem; color: var(--muted2); }
.plat-reach { font-size: 0.8rem; font-weight: 700; }
.plat-progress { width: 64px; height: 4px; background: #E5E7EB; border-radius: 2px; overflow: hidden; }
.plat-progress-fill { height: 100%; border-radius: 2px; }
.float-badge {
  position: absolute; background: white;
  border: 1px solid var(--border); border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  animation: floatUp 3s ease-in-out infinite;
  z-index: 10;
}
.fb-top { top: -20px; right: -24px; animation-delay: 0s; }
.fb-bot { bottom: -20px; left: -24px; animation-delay: 1.5s; }
@keyframes floatUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.fb-label { font-size: 0.65rem; color: var(--muted); font-weight: 500; margin-bottom: 2px; }
.fb-value { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.1rem; font-weight: 700; }

.marquee-section {
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 1.5rem 0; overflow: hidden; background: white;
}
.marquee-track {
  display: flex; gap: 3rem;
  animation: marquee 20s linear infinite;
  width: max-content;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 0.9rem; font-weight: 700;
  color: var(--muted2); white-space: nowrap; padding: 4px 0;
  transition: color 0.2s; cursor: default;
}
.marquee-logo:hover { color: #D97706; }
.marquee-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); }

.scheduling-section {
  padding: 120px 5%;
  background: white;
  position: relative;
  overflow: hidden;
}
.scheduling-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 0% 50%, rgba(217,119,6,0.05) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 100% 50%, rgba(245,158,11,0.04) 0%, transparent 60%);
}
.scheduling-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

.sched-bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.25rem;
  margin-top: 4rem;
}

.sched-queue {
  grid-column: 1 / -1;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  overflow: hidden;
}
.queue-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}
.queue-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.88rem; font-weight: 700; color: #0D0D14;
  display: flex; align-items: center; gap: 8px;
}
.queue-live-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 20px;
  background: #DCFCE7; color: #16A34A;
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
}
.queue-count {
  font-size: 0.72rem; color: #9CA3AF; font-weight: 500;
}

.sched-stats-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.sched-stat-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 18px;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
}
.sched-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
}
.ssc-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; margin-bottom: 0.875rem;
}
.ssc-val {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.75rem; font-weight: 800; line-height: 1;
  margin-bottom: 3px; letter-spacing: -0.03em;
}
.ssc-lbl { font-size: 0.72rem; color: #9CA3AF; font-weight: 500; }
.ssc-trend {
  position: absolute; top: 1rem; right: 1rem;
  font-size: 0.65rem; font-weight: 700;
  padding: 2px 7px; border-radius: 6px;
}

.sched-timeline {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  position: relative; overflow: hidden;
}
.timeline-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
}
.timeline-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.95rem; font-weight: 700; color: #0D0D14;
}
.timeline-sub { font-size: 0.7rem; color: #9CA3AF; margin-top: 2px; }
.timeline-grid {
  display: grid;
  grid-template-columns: 48px repeat(7, 1fr);
  gap: 4px;
}
.tg-time {
  font-size: 0.6rem; color: #9CA3AF; font-weight: 600;
  display: flex; align-items: center;
  font-family: monospace;
}
.tg-day-head {
  text-align: center; font-size: 0.62rem; font-weight: 700;
  color: #9CA3AF; padding-bottom: 6px;
  letter-spacing: 0.04em;
}
.tg-cell {
  height: 28px; border-radius: 6px;
  position: relative; cursor: pointer;
  transition: all 0.2s;
}
.tg-cell.empty { background: #F9FAFB; border: 1px dashed #E5E7EB; }
.tg-cell.empty:hover { background: #FFFBEB; border-color: #D9770650; }
.tg-cell.has-post { display: flex; align-items: center; justify-content: center; font-size: 0.6rem; }
.tg-cell.has-post:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.tg-tooltip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: #0D0D14; color: white; font-size: 0.6rem;
  padding: 4px 8px; border-radius: 6px; white-space: nowrap;
  opacity: 0; pointer-events: none; transition: opacity 0.2s;
  z-index: 10;
}
.tg-cell:hover .tg-tooltip { opacity: 1; }

.sched-optimizer {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}
.opt-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 1.25rem;
}
.opt-icon {
  width: 44px; height: 44px; border-radius: 14px;
  background: linear-gradient(135deg, #D97706, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(217,119,6,0.3);
}
.opt-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 700; color: #0D0D14;
}
.opt-sub { font-size: 0.72rem; color: #9CA3AF; margin-top: 2px; }

.sched-approve {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}
.approve-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
}
.approve-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.95rem; font-weight: 700; color: #0D0D14;
}
.approve-badge {
  background: #FEF3C7; color: #D97706;
  font-size: 0.65rem; font-weight: 700;
  padding: 3px 8px; border-radius: 8px;
}
.approve-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 12px;
  margin-bottom: 8px;
  border: 1.5px solid;
  transition: all 0.25s; cursor: pointer;
  position: relative; overflow: hidden;
}
.approve-item:hover { transform: translateX(3px); }
.approve-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.approve-content { flex: 1; overflow: hidden; }
.approve-plat { font-size: 0.68rem; font-weight: 700; margin-bottom: 1px; }
.approve-text {
  font-size: 0.75rem; color: #6B7280;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.approve-time { font-size: 0.65rem; color: #9CA3AF; font-family: monospace; flex-shrink: 0; }
.approve-actions { display: flex; gap: 5px; flex-shrink: 0; }
.approve-btn {
  width: 28px; height: 28px; border-radius: 8px; border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; cursor: pointer; transition: all 0.2s;
}
.approve-btn:hover { transform: scale(1.15); }

.features-section { padding: 100px 5%; background: white; }
.features-inner { max-width: 1200px; margin: 0 auto; }
.section-header { margin-bottom: 4rem; }
.section-tag-new {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: #D97706;
  margin-bottom: 1rem;
}
.tag-line { width: 24px; height: 2px; background: #D97706; border-radius: 1px; }
.section-title-new {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800;
  color: var(--ink); line-height: 1.1; letter-spacing: -0.03em;
  margin-bottom: 0.875rem;
}
.section-sub-new { color: var(--muted); font-size: 1rem; line-height: 1.75; max-width: 520px; }
.feat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
}
.feat-card-new {
  border: 1px solid var(--border);
  border-radius: 20px; overflow: hidden;
  background: white;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  cursor: pointer; position: relative;
}
.feat-card-new:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 64px rgba(0,0,0,0.09);
  border-color: transparent;
}
.feat-preview-new {
  padding: 1.5rem; border-bottom: 1px solid var(--border);
  position: relative; min-height: 110px;
}
.feat-number {
  position: absolute; top: 1rem; right: 1rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 2rem; font-weight: 800; opacity: 0.06; color: var(--ink);
  line-height: 1;
}
.feat-tag-new {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 100px;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  border: 1px solid; margin-bottom: 1rem;
}
.feat-body-new { padding: 1.25rem 1.5rem 1.5rem; }
.feat-icon-row-new { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.625rem; }
.feat-emoji-new { font-size: 1.5rem; }
.feat-stat-new {
  font-size: 0.72rem; font-weight: 700;
  padding: 0.25rem 0.7rem; border-radius: 100px;
}
.feat-title-card {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.1rem; font-weight: 700; color: var(--ink);
  margin-bottom: 0.5rem; letter-spacing: -0.02em;
}
.feat-desc-card { font-size: 0.85rem; line-height: 1.7; color: var(--muted); }

.how-section { padding: 100px 5%; background: var(--surface); }
.how-inner { max-width: 1100px; margin: 0 auto; }
.how-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
  position: relative;
}
.how-grid::before {
  content: '';
  position: absolute; top: 40px; left: 10%; right: 10%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
  z-index: 0;
}
.how-card {
  position: relative; z-index: 1;
  background: white; border: 1px solid var(--border);
  border-radius: 20px; padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.how-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
.how-step-wrap {
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem; font-size: 1.5rem;
  border: 2px solid var(--border);
  background: white;
  position: relative;
}
.how-step-num {
  position: absolute; top: -6px; right: -6px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--ink); color: white;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.55rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.how-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 700; color: var(--ink);
  margin-bottom: 0.5rem; letter-spacing: -0.02em;
}
.how-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.65; }

.platforms-section { background: white; padding: 100px 5%; }
.platforms-wrap-new { max-width: 1200px; margin: 0 auto; }
.platforms-tabs-new { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 2.5rem; }
.plat-tab-btn {
  padding: 0.55rem 1.25rem; border-radius: 100px;
  border: 1.5px solid var(--border); background: white;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
  display: flex; align-items: center; gap: 6px;
  color: var(--muted);
}
.plat-tab-btn.active { color: white; border-color: transparent; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.plat-tab-btn:not(.active):hover { border-color: #D97706; color: #D97706; }
.platform-detail-new {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
  background: var(--surface); border-radius: 24px; padding: 2.5rem;
  border: 1px solid var(--border);
}
.pd-overline { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; display: block; }
.pd-title-new {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.875rem; font-weight: 800; margin-bottom: 0.875rem;
  color: var(--ink); letter-spacing: -0.03em; line-height: 1.15;
}
.pd-desc-new { color: var(--muted); line-height: 1.75; margin-bottom: 1.75rem; font-size: 0.95rem; }
.pd-stats-row { display: flex; gap: 1rem; }
.pd-stat-new {
  flex: 1; background: white; border-radius: 16px;
  padding: 1.125rem 1.25rem;
  border: 1px solid var(--border);
}
.pd-stat-v { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.75rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
.pd-stat-l { font-size: 0.78rem; color: var(--muted); font-weight: 500; }
.mock-new {
  background: white; border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  border: 1px solid var(--border);
}
.mock-bar-new { display: flex; gap: 5px; margin-bottom: 1rem; }
.mock-dot-new { width: 10px; height: 10px; border-radius: 50%; }
.cal-header { font-size: 0.78rem; font-weight: 600; color: var(--muted); margin-bottom: 0.875rem; }
.cal-grid-new { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cal-day-label { text-align: center; font-size: 0.62rem; font-weight: 700; color: var(--muted2); padding-bottom: 4px; }
.cal-day-new {
  aspect-ratio: 1; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.68rem; font-weight: 500; color: var(--muted2);
  background: var(--surface);
}
.cal-day-new.post { color: white; font-weight: 700; }
.cal-day-new.today { border: 2px solid #D97706; color: #D97706; background: white; font-weight: 700; }

.pricing-section { padding: 100px 5%; background: var(--surface); }
.pricing-wrap { max-width: 1100px; margin: 0 auto; }
.pricing-grid-new { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; align-items: start; }
.price-card {
  background: white; border-radius: 24px;
  padding: 2rem; border: 1.5px solid var(--border);
  position: relative; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.price-card:hover:not(.popular-card) { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
.popular-card {
  border-color: #D97706;
  transform: scale(1.04);
  box-shadow: 0 24px 80px rgba(217,119,6,0.15);
}
.popular-card:hover { transform: scale(1.04) translateY(-4px); box-shadow: 0 32px 80px rgba(217,119,6,0.2); }
.popular-label {
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: linear-gradient(135deg, #D97706, #F59E0B);
  color: white; font-size: 0.65rem; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.price-accent-bar { height: 3px; border-radius: 2px; margin-bottom: 1.75rem; }
.price-plan { font-family: 'Bricolage Grotesque', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--muted); margin-bottom: 0.25rem; letter-spacing: 0.04em; text-transform: uppercase; }
.price-amount { font-family: 'Bricolage Grotesque', sans-serif; font-size: 3.25rem; font-weight: 800; color: var(--ink); line-height: 1; letter-spacing: -0.04em; display: flex; align-items: baseline; gap: 2px; }
.price-period { font-size: 1rem; color: var(--muted); font-family: 'DM Sans', sans-serif; font-weight: 500; }
.price-desc { font-size: 0.85rem; color: var(--muted); margin: 0.625rem 0 1.5rem; }
.price-divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
.price-feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; color: var(--ink2); margin-bottom: 0.875rem; line-height: 1.4; }
.price-check { font-size: 0.75rem; margin-top: 1px; flex-shrink: 0; }
.price-btn {
  width: 100%; padding: 0.875rem; border-radius: 100px;
  font-family: 'DM Sans', sans-serif; font-size: 0.925rem; font-weight: 700;
  cursor: pointer; border: none; transition: all 0.3s; margin-top: 1.5rem;
}
.price-btn-fill {
  background: linear-gradient(135deg, #D97706, #F59E0B);
  color: white; box-shadow: 0 6px 24px rgba(217,119,6,0.3);
}
.price-btn-fill:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(217,119,6,0.4); }
.price-btn-outline {
  background: white; border: 1.5px solid var(--border) !important;
  color: var(--ink);
}
.price-btn-outline:hover { border-color: #D97706 !important; color: #D97706; }

.testimonials-section { padding: 100px 5%; background: white; }
.testi-wrap { max-width: 1100px; margin: 0 auto; }
.testi-grid-new { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.testi-card-new {
  background: var(--surface); border-radius: 20px;
  padding: 2rem; border: 1px solid var(--border);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  position: relative;
}
.testi-card-new:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(0,0,0,0.08); background: white; }
.testi-stars { display: flex; gap: 2px; margin-bottom: 1.25rem; }
.testi-star { font-size: 0.875rem; }
.testi-text-new { font-size: 0.95rem; line-height: 1.8; color: var(--ink2); margin-bottom: 1.5rem; }
.testi-footer-new { display: flex; align-items: center; gap: 10px; }
.testi-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: white; flex-shrink: 0; }
.testi-name-new { font-weight: 700; font-size: 0.88rem; color: var(--ink); }
.testi-role-new { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }
.testi-accent-strip { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }

.faq-section { padding: 100px 5%; background: var(--surface); }
.faq-wrap { max-width: 720px; margin: 0 auto; }
.faq-item {
  background: white; border: 1px solid var(--border);
  border-radius: 16px; margin-bottom: 10px;
  overflow: hidden; transition: all 0.3s;
}
.faq-item:hover { border-color: #FCD34D; }
.faq-q {
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; gap: 1rem;
  font-weight: 600; font-size: 0.95rem; color: var(--ink);
}
.faq-icon { font-size: 1.1rem; transition: transform 0.3s; flex-shrink: 0; color: var(--muted); }
.faq-icon.open { transform: rotate(45deg); color: #D97706; }
.faq-answer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.3s;
  font-size: 0.9rem; color: var(--muted); line-height: 1.75;
}
.faq-answer.open { max-height: 200px; padding: 0 1.5rem 1.25rem; }

.cta-section-new {
  padding: 100px 5%;
  background: white;
  position: relative; overflow: hidden;
}
.cta-bg-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, #E5E7EB 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
  opacity: 0.5;
}
.cta-inner-new {
  position: relative; z-index: 1;
  max-width: 680px; margin: 0 auto; text-align: center;
}
.cta-badge-new {
  display: inline-flex; align-items: center; gap: 8px;
  background: white; border: 1px solid var(--border);
  border-radius: 100px; padding: 6px 16px 6px 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  font-size: 0.82rem; color: var(--muted); font-weight: 500;
}
.cta-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.75); } }
.cta-title-new {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 800; color: var(--ink); line-height: 1.08;
  letter-spacing: -0.04em; margin-bottom: 1.25rem;
}
.cta-title-new em { font-style: normal; background: linear-gradient(135deg, #D97706, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.cta-sub-new { color: var(--muted); font-size: 1.05rem; line-height: 1.75; margin-bottom: 2.5rem; }
.cta-actions-new { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.cta-note { font-size: 0.8rem; color: var(--muted2); }

footer {
  background: var(--ink); padding: 2.5rem 5%;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.footer-inner-new {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
}
.footer-logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.2rem; font-weight: 800; background: linear-gradient(135deg, #FCD34D, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.footer-copy { font-size: 0.82rem; color: rgba(255,255,255,0.35); }
.footer-links-new { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.footer-links-new a { font-size: 0.82rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
.footer-links-new a:hover { color: white; }

.ani { opacity: 0; transform: translateY(32px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.ani.visible { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.08s; } .d2 { transition-delay: 0.16s; } .d3 { transition-delay: 0.24s; } .d4 { transition-delay: 0.32s; }

@media (max-width: 1024px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; padding: 120px 0 60px; }
  .hero-sub { margin: 0 auto 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-trust { justify-content: center; }
  .hero-visual { display: none; }
  .hero-metrics { max-width: 480px; margin: 3rem auto 0; }
  .feat-grid { grid-template-columns: repeat(2,1fr); }
  .how-grid { grid-template-columns: repeat(2,1fr); }
  .how-grid::before { display: none; }
  .platform-detail-new { grid-template-columns: 1fr; }
  .pricing-grid-new { grid-template-columns: 1fr; }
  .popular-card { transform: none; }
  .popular-card:hover { transform: translateY(-4px); }
  .testi-grid-new { grid-template-columns: 1fr; }
  .sched-bento { grid-template-columns: 1fr; }
  .sched-queue { grid-column: 1; }
  .sched-stats-row { grid-template-columns: repeat(2,1fr); grid-column: 1; }
}
@media (max-width: 640px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
  .feat-grid { grid-template-columns: 1fr; }
  .hero-metrics { flex-wrap: wrap; }
  .hero-metric { min-width: 50%; border-bottom: 1px solid var(--border); }
  .how-grid { grid-template-columns: 1fr; }
  .sched-stats-row { grid-template-columns: 1fr 1fr; }
}
      `}</style>

      {/* NAV */}
      <nav className={`nav${isScrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo display">Social Share Bay</a>
        <ul className="nav-links">
          {navLinks.map(l => <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>)}
        </ul>
        <Link href='/dashboard'>
          <button className="nav-cta">Start Free →</button>
        </Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>)}
        <Link href='/dashboard'>
          <button className="btn-primary" style={{ justifyContent: "center" }}>Start Free →</button>
        </Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-aurora" />
        <div className="hero-grid-lines" />
        <div className="hero-inner">
          <div>
            <div className="hero-pill">
              <span className="pill-badge">New</span>
              <span className="pill-text">AI-powered scheduling is live ✨</span>
            </div>
            <h1 className="hero-title display">
              Schedule smarter.<br />
              Grow <em>every</em><br />
              social channel.
            </h1>
            <p className="hero-sub">
              One beautiful dashboard to plan, publish, and grow across Instagram, Twitter, LinkedIn, TikTok, and 8 more — powered by AI.
            </p>
            <div className="hero-actions">
              <Link href='/dashboard'>
                <button className="btn-primary"><span>🚀 Start for Free</span></button>
              </Link>
              <button className="btn-ghost">▶ Watch Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dash-outer">
              <div style={{ position: "relative" }}>
                <div className="float-badge fb-top">
                  <div className="fb-label">Today's Posts</div>
                  <div className="fb-value" style={{ color: "#F59E0B" }}>24 📅</div>
                </div>
                <div className="dash-wrap">
                  <div className="dash-topbar">
                    <div className="window-dots">
                      <div className="wd wd-r" /><div className="wd wd-y" /><div className="wd wd-g" />
                    </div>
                    <span className="dash-label">Platform Overview</span>
                    <div className="dash-live">
                      <span className="live-dot" />Live
                    </div>
                  </div>
                  {platforms.slice(0, 5).map(p => (
                    <div className="plat-item" key={p.name}>
                      <span className="plat-emoji">{p.icon}</span>
                      <div className="plat-info">
                        <div className="plat-name-d">{p.name}</div>
                        <div className="plat-handle">{p.handle}</div>
                      </div>
                      <div className="plat-progress">
                        <div className="plat-progress-fill" style={{ width: `${(p.posts / 400) * 100}%`, background: p.color }} />
                      </div>
                      <span className="plat-reach" style={{ color: p.color }}>{p.reach}</span>
                    </div>
                  ))}
                </div>
                <div className="float-badge fb-bot">
                  <div className="fb-label">Avg. Engagement</div>
                  <div className="fb-value" style={{ color: "#34D399" }}>+8.4% 📈</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...logos, ...logos].map((l, i) => (
            <span key={i} className="marquee-logo">
              {i > 0 && <span className="marquee-dot" />}
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* SCHEDULING SECTION */}
      <section className="scheduling-section" id="scheduling">
        <div className="scheduling-bg" />
        <div className="scheduling-inner">
          <div id="sched-hd" ref={setRef("sched-hd")} className={`ani${isVisible("sched-hd") ? " visible" : ""}`} style={{ maxWidth: 640, marginBottom: "1rem" }}>
            <div className="section-tag-new"><span className="tag-line" />Post Scheduling</div>
            <h2 className="section-title-new display">Your content, perfectly<br />timed. Every single time.</h2>
            <p className="section-sub-new">Drag, drop, and let AI handle the rest. Our intelligent scheduler learns your audience patterns and posts when they're most likely to engage.</p>
          </div>
          <div className="sched-bento">
            <div id="sched-queue" ref={setRef("sched-queue")} className={`sched-queue ani${isVisible("sched-queue") ? " visible" : ""}`}>
              <div className="queue-header">
                <div className="queue-title">
                  📡 Live Publishing Queue
                  <span className="queue-live-badge">
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                    LIVE
                  </span>
                </div>
                <span className="queue-count">18 posts in queue · Next: 9:00 AM</span>
              </div>
              <QueueStrip />
            </div>

            <div id="sched-main" ref={setRef("sched-main")} className={`ani d1${isVisible("sched-main") ? " visible" : ""}`}>
              <SchedulingShowcase />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div id="sched-timeline" ref={setRef("sched-timeline")} className={`sched-timeline ani d2${isVisible("sched-timeline") ? " visible" : ""}`}>
                <div className="timeline-header">
                  <div>
                    <div className="timeline-title">This Week's Schedule</div>
                    <div className="timeline-sub">Click a slot to add a post</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#9CA3AF" }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#E1306C" }} />IG</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#1DA1F2" }} />TW</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#0A66C2" }} />LI</div>
                  </div>
                </div>
                <div className="timeline-grid">
                  <div />
                  {weekDays.map(d => (<div key={d} className="tg-day-head">{d}</div>))}
                  {timeSlots.map((time, ti) => {
                    const postMap = {
                      "8 AM": { 0: { color: "#E1306C", icon: "📸" }, 2: { color: "#0A66C2", icon: "💼" } },
                      "10 AM": { 1: { color: "#1DA1F2", icon: "🐦" }, 4: { color: "#FF0050", icon: "🎵" } },
                      "12 PM": { 0: { color: "#1877F2", icon: "📘" }, 3: { color: "#E1306C", icon: "📸" } },
                      "2 PM": { 2: { color: "#1DA1F2", icon: "🐦" }, 5: { color: "#0A66C2", icon: "💼" } },
                      "4 PM": { 1: { color: "#FF0050", icon: "🎵" }, 6: { color: "#E60023", icon: "📌" } },
                      "6 PM": { 3: { color: "#1DA1F2", icon: "🐦" }, 4: { color: "#E1306C", icon: "📸" } },
                      "8 PM": { 0: { color: "#FF0050", icon: "🎵" }, 5: { color: "#1877F2", icon: "📘" } },
                    };
                    const rowPosts = postMap[time] || {};
                    return (
                      <>
                        <div key={`time-${ti}`} className="tg-time">{time}</div>
                        {weekDays.map((_, di) => {
                          const post = rowPosts[di];
                          return (
                            <div key={`cell-${ti}-${di}`} className={`tg-cell ${post ? "has-post" : "empty"}`} style={post ? { background: `${post.color}18`, border: `1.5px solid ${post.color}40` } : {}}>
                              {post && (<><span style={{ fontSize: "0.75rem" }}>{post.icon}</span><div className="tg-tooltip">{time} · {weekDays[di]}</div></>)}
                            </div>
                          );
                        })}
                      </>
                    );
                  })}
                </div>
              </div>

              <div id="sched-approve" ref={setRef("sched-approve")} className={`sched-approve ani d3${isVisible("sched-approve") ? " visible" : ""}`}>
                <div className="approve-header">
                  <div className="approve-title">⏳ Awaiting Approval</div>
                  <span className="approve-badge">3 pending</span>
                </div>
                {scheduledPosts.slice(1, 4).map((p) => (
                  <div key={p.id} className="approve-item" style={{ background: `${p.color}05`, borderColor: `${p.color}20` }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: p.color, borderRadius: "0 2px 2px 0" }} />
                    <div className="approve-icon" style={{ background: `${p.color}15` }}>{p.icon}</div>
                    <div className="approve-content">
                      <div className="approve-plat" style={{ color: p.color }}>{p.platform}</div>
                      <div className="approve-text">{p.content}</div>
                    </div>
                    <div className="approve-time">{p.day} {p.time}</div>
                    <div className="approve-actions">
                      <button className="approve-btn" style={{ background: "#DCFCE7", color: "#16A34A" }}>✓</button>
                      <button className="approve-btn" style={{ background: "#FEE2E2", color: "#DC2626" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="sched-stats" ref={setRef("sched-stats")} className={`sched-stats-row ani${isVisible("sched-stats") ? " visible" : ""}`}>
              {[
                { icon: "📅", val: "2.4M+", lbl: "Posts Scheduled", color: "#D97706", bg: "#FFFBEB", trend: "+12%", trendBg: "#FFFBEB", trendColor: "#D97706" },
                { icon: "⏱️", val: "3 hrs", lbl: "Saved Per Week", color: "#F59E0B", bg: "#FEF3C7", trend: "avg", trendBg: "#FEF3C7", trendColor: "#B45309" },
                { icon: "📈", val: "3.2×", lbl: "More Reach", color: "#B45309", bg: "#FEF9EE", trend: "vs manual", trendBg: "#FEF9EE", trendColor: "#B45309" },
                { icon: "🤖", val: "98%", lbl: "AI Accuracy", color: "#92400E", bg: "#FEF3C7", trend: "best time", trendBg: "#FEF3C7", trendColor: "#92400E" },
              ].map((s) => (
                <div key={s.lbl} className="sched-stat-card">
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "0 0 18px 18px" }} />
                  <div className="ssc-icon" style={{ background: s.bg }}><span>{s.icon}</span></div>
                  <div className="ssc-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="ssc-lbl">{s.lbl}</div>
                  <div className="ssc-trend" style={{ background: s.trendBg, color: s.trendColor }}>{s.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div id="feat-hd" ref={setRef("feat-hd")} className={`section-header ani${isVisible("feat-hd") ? " visible" : ""}`}>
            <div className="section-tag-new"><span className="tag-line" />Features</div>
            <h2 className="section-title-new display">Everything you need to<br />dominate social media</h2>
            <p className="section-sub-new">From AI scheduling to deep analytics, Social Share Bay gives you the tools to grow every channel — in one beautiful workspace.</p>
          </div>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div key={f.title} id={`feat-${i}`} ref={setRef(`feat-${i}`)} className={`feat-card-new ani d${(i % 3) + 1}${isVisible(`feat-${i}`) ? " visible" : ""}`} onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)}>
                <div className="feat-preview-new" style={{ background: hoveredFeature === i ? f.light : "var(--surface)" }}>
                  <div className="feat-number">{f.number}</div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="feat-tag-new" style={{ color: f.accent, borderColor: `${f.accent}35`, background: `${f.accent}10` }}>{f.tag}</div>
                    <FeatureVisual visual={f.visual} accent={f.accent} />
                  </div>
                </div>
                <div className="feat-body-new">
                  <div className="feat-icon-row-new">
                    <span className="feat-emoji-new">{f.icon}</span>
                    <div className="feat-stat-new" style={{ background: `${f.accent}12`, color: f.accent }}>{f.stat}</div>
                  </div>
                  <div className="feat-title-card display">{f.title}</div>
                  <div className="feat-desc-card">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-inner">
          <div id="how-hd" ref={setRef("how-hd")} className={`section-header ani${isVisible("how-hd") ? " visible" : ""}`} style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3.5rem" }}>
            <div className="section-tag-new" style={{ justifyContent: "center" }}><span className="tag-line" />How it Works<span className="tag-line" /></div>
            <h2 className="section-title-new display">Up and running<br />in 4 simple steps</h2>
            <p className="section-sub-new" style={{ margin: "0 auto" }}>No learning curve. Connect, create, schedule, and watch your audience grow.</p>
          </div>
          <div className="how-grid">
            {howItWorks.map((h, i) => (
              <div key={h.step} id={`how-${i}`} ref={setRef(`how-${i}`)} className={`how-card ani d${i + 1}${isVisible(`how-${i}`) ? " visible" : ""}`}>
                <div className="how-step-wrap" style={{ borderColor: `${h.color}30`, background: `${h.color}08` }}>
                  <span style={{ fontSize: "1.6rem" }}>{h.icon}</span>
                  <div className="how-step-num" style={{ background: h.color }}>{h.step}</div>
                </div>
                <div className="how-title display">{h.title}</div>
                <div className="how-desc">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="platforms-section" id="platforms">
        <div className="platforms-wrap-new">
          <div id="plat-hd" ref={setRef("plat-hd")} className={`section-header ani${isVisible("plat-hd") ? " visible" : ""}`}>
            <div className="section-tag-new"><span className="tag-line" />Platforms</div>
            <h2 className="section-title-new display">One tool,<br />every platform</h2>
            <p className="section-sub-new">Deep integrations built for serious creators and brands who want to grow everywhere.</p>
          </div>
          <div className="platforms-tabs-new">
            {platforms.map((p, i) => (
              <button key={p.name} className={`plat-tab-btn${activeTab === i ? " active" : ""}`} style={activeTab === i ? { background: p.color } : {}} onClick={() => setActiveTab(i)}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <div className="platform-detail-new" style={{ borderTop: `3px solid ${platforms[activeTab].color}` }}>
            <div>
              <span className="pd-overline" style={{ color: platforms[activeTab].color }}>{platforms[activeTab].name}</span>
              <h3 className="pd-title-new display">Grow your {platforms[activeTab].name} effortlessly</h3>
              <p className="pd-desc-new">Schedule posts at peak times, track your growth with rich analytics, auto-generate hashtags, and repurpose your top content — all from Social Share Bay.</p>
              <div className="pd-stats-row">
                <div className="pd-stat-new">
                  <div className="pd-stat-v" style={{ color: platforms[activeTab].color }}>{platforms[activeTab].posts}</div>
                  <div className="pd-stat-l">Posts Scheduled</div>
                </div>
                <div className="pd-stat-new">
                  <div className="pd-stat-v" style={{ color: platforms[activeTab].color }}>{platforms[activeTab].reach}</div>
                  <div className="pd-stat-l">Total Reach</div>
                </div>
              </div>
            </div>
            <div className="mock-new">
              <div className="mock-bar-new">
                <div className="mock-dot-new" style={{ background: "#FF5F57" }} />
                <div className="mock-dot-new" style={{ background: "#FEBC2E" }} />
                <div className="mock-dot-new" style={{ background: "#28C840" }} />
              </div>
              <div className="cal-header">{platforms[activeTab].name} Calendar — {new Date().toLocaleString("default", { month: "long", year: "numeric" })}</div>
              <div className="cal-grid-new">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <div key={d} className="cal-day-label">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 3;
                  const hasPost = [2, 5, 7, 11, 14, 16, 19, 21, 24, 26, 28].includes(day);
                  const isToday = day === 15;
                  return (
                    <div key={i} className={`cal-day-new${hasPost ? " post" : ""}${isToday ? " today" : ""}`} style={hasPost ? { background: platforms[activeTab].color } : {}}>
                      {day > 0 && day <= 30 ? day : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-wrap">
          <div id="price-hd" ref={setRef("price-hd")} className={`section-header ani${isVisible("price-hd") ? " visible" : ""}`} style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3.5rem" }}>
            <div className="section-tag-new" style={{ justifyContent: "center" }}><span className="tag-line" />Pricing<span className="tag-line" /></div>
            <h2 className="section-title-new display">Simple, honest pricing</h2>
            <p className="section-sub-new" style={{ margin: "0 auto" }}>Start free, scale as you grow. No hidden fees, no surprises.</p>
          </div>
          <div className="pricing-grid-new">
            {plans.map((plan, i) => (
              <div key={plan.name} id={`plan-${i}`} ref={setRef(`plan-${i}`)} className={`price-card${plan.popular ? " popular-card" : ""} ani d${i + 1}${isVisible(`plan-${i}`) ? " visible" : ""}`}>
                {plan.popular && <div className="popular-label">Most Popular</div>}
                <div className="price-accent-bar" style={{ background: plan.popular ? `linear-gradient(90deg, #D97706, #F59E0B)` : plan.accent }} />
                <div className="price-plan">{plan.name}</div>
                <div className="price-amount display">{plan.price}<span className="price-period">{plan.period}</span></div>
                <div className="price-desc">{plan.desc}</div>
                <div className="price-divider" />
                {plan.features.map(f => (
                  <div className="price-feature-item" key={f}>
                    <span className="price-check" style={{ color: plan.accent }}>✓</span>{f}
                  </div>
                ))}
                <button className={`price-btn ${plan.popular ? "price-btn-fill" : "price-btn-outline"}`}>
                  {plan.popular ? "Get Started →" : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-wrap">
          <div id="faq-hd" ref={setRef("faq-hd")} className={`section-header ani${isVisible("faq-hd") ? " visible" : ""}`} style={{ textAlign: "center", maxWidth: 480, margin: "0 auto 3rem" }}>
            <div className="section-tag-new" style={{ justifyContent: "center" }}><span className="tag-line" />FAQ<span className="tag-line" /></div>
            <h2 className="section-title-new display">Got questions?<br />We've got answers.</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className={`faq-icon${activeFaq === i ? " open" : ""}`}>+</span>
              </div>
              <div className={`faq-answer${activeFaq === i ? " open" : ""}`}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section-new">
        <div className="cta-bg-grid" />
        <div className="cta-inner-new">
          <div className="cta-badge-new">
            <span className="cta-badge-dot" />
            14-day free trial · No credit card required
          </div>
          <h2 className="cta-title-new display">Ready to own your<br /><em>social presence?</em></h2>
          <p className="cta-sub-new">Join 48,000+ creators and brands who schedule smarter, grow faster, and spend less time posting.</p>
          <div className="cta-actions-new">
            <button className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.25rem" }}>🚀 Start for Free</button>
            <button className="btn-ghost" style={{ fontSize: "1rem", padding: "1rem 2.25rem" }}>Talk to Sales</button>
          </div>
          <div className="cta-note">✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Cancel anytime</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner-new">
          <div>
            <div className="footer-logo">Social Share Bay</div>
            <div className="footer-copy" style={{ marginTop: 4 }}>© 2025 Social Share Bay. All rights reserved.</div>
          </div>
          <div className="footer-links-new">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Status</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

