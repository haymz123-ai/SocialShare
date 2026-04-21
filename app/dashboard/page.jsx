'use client'

import { useState, useEffect, useContext, useCallback } from 'react'
import { DashboardContext } from './layout'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1DA1F2' },
  { id: 'facebook',  label: 'Facebook',   color: '#1877F2' },
  { id: 'linkedin',  label: 'LinkedIn',   color: '#0A66C2' },
  { id: 'tiktok',    label: 'TikTok',     color: '#FF0050' },
  { id: 'youtube',   label: 'YouTube',    color: '#FF0000' },
  { id: 'threads',   label: 'Threads',    color: '#888' },
  { id: 'pinterest', label: 'Pinterest',  color: '#E60023' },
]

const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#a78bfa' }

const PLATFORM_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.86 4.86 0 01-1-.07z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
  threads: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 011.947.048v-.776c0-.975-.023-1.894-.619-2.574-.485-.556-1.236-.838-2.234-.838l-.11.003c-1.327.055-2.21.558-2.704 1.538l-1.77-1.078c.727-1.567 2.251-2.434 4.346-2.522.06-.003.12-.004.18-.004 1.463 0 2.747.437 3.637 1.408 1.032 1.123 1.043 2.497 1.044 3.55v4.038c.032.136.066.272.108.406.3.974.992 1.674 2.05 2.08.728.276 1.583.418 2.542.424l-.001.039c-.01 2.168-1.078 4.15-2.955 5.48C17.236 23.27 14.944 24 12.186 24z"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
}

function PlatformIcon({ id, size = 14, color }) {
  const svg = PLATFORM_ICONS[id]
  if (!svg) return <span style={{ fontSize: size - 2, color }}>{id?.slice(0,2)?.toUpperCase()}</span>
  return <span dangerouslySetInnerHTML={{ __html: svg }} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }} />
}

function StatusBadge({ status }) {
  const map = {
    active:     { bg: 'rgba(34,197,94,0.1)',  color: '#4ade80', dot: '#4ade80' },
    expired:    { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', dot: '#fbbf24' },
    inactive:   { bg: 'rgba(239,68,68,0.1)',  color: '#f87171', dot: '#f87171' },
    published:  { bg: 'rgba(34,197,94,0.1)',  color: '#4ade80', dot: '#4ade80' },
    scheduled:  { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', dot: '#60a5fa' },
    draft:      { bg: 'rgba(255,255,255,0.05)',color: 'rgba(240,237,232,0.45)', dot: 'rgba(240,237,232,0.3)' },
    failed:     { bg: 'rgba(239,68,68,0.1)',  color: '#f87171', dot: '#f87171' },
    processing: { bg: 'rgba(167,139,250,0.12)',color: '#a78bfa', dot: '#a78bfa' },
  }
  const st = map[status] || map.processing
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
      background: st.bg, color: st.color,
      letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

const StatIcon = ({ children, color }) => (
  <div style={{
    width: 38, height: 38, borderRadius: 11,
    background: color + '15',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 17, flexShrink: 0,
  }}>{children}</div>
)

export default function OverviewPage() {
  const { selectedGroup } = useContext(DashboardContext)
  const [profiles, setProfiles] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchProfiles = useCallback(async (groupId) => {
    setLoadingProfiles(true)
    const res = await fetch(`/api/profiles?groupId=${groupId}`)
    const data = await res.json()
    setProfiles(Array.isArray(data) ? data : [])
    setLoadingProfiles(false)
  }, [])

  const fetchPosts = useCallback(async (groupId) => {
    setLoadingPosts(true)
    const res = await fetch(`/api/posts?groupId=${groupId}`)
    const data = await res.json()
    setPosts(data?.data?.slice(0, 5) || [])
    setLoadingPosts(false)
  }, [])

  // Only fetch once when group first selected, not on every render
  useEffect(() => {
    if (!selectedGroup) return
    setProfiles([])
    setPosts([])
    setHasLoaded(false)
    fetchProfiles(selectedGroup.id)
    fetchPosts(selectedGroup.id)
    setHasLoaded(true)
  }, [selectedGroup?.id])

  const handleRefresh = () => {
    if (!selectedGroup) return
    fetchProfiles(selectedGroup.id)
    fetchPosts(selectedGroup.id)
  }

  if (!selectedGroup) return null

  const connectedPlatforms = profiles.map(p => p.platform)
  const activeCount = profiles.filter(p => p.status === 'active').length
  const publishedCount = posts.filter(p => p.status === 'published' || p.status === 'processed').length

  const stats = [
    { label: 'Connected Profiles', value: profiles.length, icon: '◈', color: '#a78bfa', accent: '#7c3aed' },
    { label: 'Active Accounts', value: activeCount, icon: '⚡', color: '#4ade80', accent: '#16a34a' },
    { label: 'Total Posts', value: posts.length, icon: '▤', color: '#60a5fa', accent: '#2563eb' },
    { label: 'Platforms Covered', value: connectedPlatforms.length, icon: '✦', color: '#fb923c', accent: '#ea580c' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0}100%{background-position:400% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .ov-stat { animation: fadeUp 0.4s ease both; }
        .ov-stat:nth-child(2){animation-delay:0.06s}
        .ov-stat:nth-child(3){animation-delay:0.12s}
        .ov-stat:nth-child(4){animation-delay:0.18s}
        .ov-profile:hover { transform:translateY(-1px); border-color:rgba(167,139,250,0.25) !important; }
        .ov-profile { transition: transform 0.2s, border-color 0.2s; }
        .ov-plat:hover { transform:scale(1.03); }
        .ov-plat { transition: transform 0.15s, background 0.15s; }
        .ov-post:hover { background:rgba(255,255,255,0.05) !important; }
        .ov-post { transition: background 0.15s; }
        .ov-skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 75%); background-size:400% 100%; animation:shimmer 2s ease infinite; border-radius:12px; }
        .ov-dot-pulse { animation:pulse 2s ease infinite; }
        .ov-refresh:hover { border-color:rgba(167,139,250,0.3) !important; color:rgba(167,139,250,0.8) !important; background:rgba(167,139,250,0.06) !important; }
      `}</style>

      {/* Header greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F0EDE8', letterSpacing: '-0.03em', margin: 0, fontFamily: "'Syne',sans-serif" }}>
            Overview
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.35)', margin: '4px 0 0', fontWeight: 400 }}>
            {selectedGroup.name} · {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </p>
        </div>
        <button
          className="ov-refresh"
          onClick={handleRefresh}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(240,237,232,0.4)', fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight:500, transition:'all 0.15s' }}
        >
          <span style={{ fontSize:14 }}>↻</span> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className="ov-stat" style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '20px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${stat.color}, ${stat.accent}33)` }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
              {loadingProfiles ? (
                <div className="ov-skeleton" style={{ width:40, height:32 }} />
              ) : (
                <span style={{ fontSize:30, fontWeight:800, color:stat.color, letterSpacing:'-0.04em', lineHeight:1 }}>
                  {stat.value}
                </span>
              )}
            </div>
            <div style={{ fontSize:12, color:'rgba(240,237,232,0.38)', fontWeight:500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18 }}>

        {/* Connected Profiles */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'18px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h2 style={{ fontSize:14, fontWeight:700, color:'#F0EDE8', margin:0 }}>Connected Profiles</h2>
              {!loadingProfiles && <p style={{ fontSize:11, color:'rgba(240,237,232,0.3)', margin:'3px 0 0' }}>{activeCount} active · {profiles.length - activeCount} inactive</p>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {!loadingProfiles && profiles.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:100, background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.15)' }}>
                  <span className="ov-dot-pulse" style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80' }} />
                  <span style={{ fontSize:10, fontWeight:700, color:'#4ade80', letterSpacing:'0.05em' }}>{activeCount} LIVE</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
            {loadingProfiles ? (
              [1,2,3].map(i => <div key={i} className="ov-skeleton" style={{ height:62 }} />)
            ) : profiles.length === 0 ? (
              <div style={{ textAlign:'center', padding:'36px 24px' }}>
                <div style={{ fontSize:36, marginBottom:10, opacity:0.15 }}>◈</div>
                <p style={{ fontSize:13, color:'rgba(240,237,232,0.3)', margin:0 }}>No profiles connected yet</p>
                <p style={{ fontSize:11, color:'rgba(240,237,232,0.18)', margin:'4px 0 0' }}>Connect your social accounts to get started</p>
              </div>
            ) : profiles.map(profile => {
              const info = getPlatformInfo(profile.platform)
              return (
                <div key={profile.id} className="ov-profile" style={{
                  display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                  borderRadius:13, background:'rgba(255,255,255,0.025)',
                  border:'1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width:38, height:38, borderRadius:11, flexShrink:0,
                    background:info.color+'14', border:`1px solid ${info.color}28`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <PlatformIcon id={profile.platform} size={15} color={info.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#F0EDE8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{info.label}</div>
                    <div style={{ fontSize:11, color:'rgba(240,237,232,0.33)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{profile.name}</div>
                  </div>
                  <StatusBadge status={profile.status} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: Platform coverage + Recent Posts */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* Platform Coverage */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'18px 20px' }}>
            <h2 style={{ fontSize:14, fontWeight:700, color:'#F0EDE8', margin:'0 0 14px' }}>Platform Coverage</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {PLATFORMS.map(p => {
                const connected = connectedPlatforms.includes(p.id)
                return (
                  <div key={p.id} className="ov-plat" style={{
                    display:'flex', alignItems:'center', gap:7, padding:'6px 12px', borderRadius:100,
                    border:`1px solid ${connected ? p.color+'35' : 'rgba(255,255,255,0.06)'}`,
                    background: connected ? p.color+'0d' : 'rgba(255,255,255,0.015)',
                  }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background: connected ? p.color : 'rgba(255,255,255,0.15)', flexShrink:0 }} />
                    <span style={{ fontSize:11, fontWeight:600, color: connected ? '#F0EDE8' : 'rgba(240,237,232,0.25)' }}>{p.label}</span>
                    {connected && <span style={{ fontSize:9, color:'#4ade80', fontWeight:700 }}>✓</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Posts */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, overflow:'hidden', flex:1 }}>
            <div style={{ padding:'16px 20px 12px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h2 style={{ fontSize:14, fontWeight:700, color:'#F0EDE8', margin:0 }}>Recent Posts</h2>
              {!loadingPosts && posts.length > 0 && (
                <span style={{ fontSize:11, color:'rgba(240,237,232,0.28)' }}>{posts.length} shown</span>
              )}
            </div>
            <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
              {loadingPosts ? (
                [1,2,3].map(i => <div key={i} className="ov-skeleton" style={{ height:44 }} />)
              ) : posts.length === 0 ? (
                <div style={{ textAlign:'center', padding:'28px 16px' }}>
                  <div style={{ fontSize:28, opacity:0.15, marginBottom:8 }}>▤</div>
                  <p style={{ fontSize:12, color:'rgba(240,237,232,0.28)', margin:0 }}>No posts yet</p>
                </div>
              ) : posts.map(post => {
                const platforms = post.platforms || []
                return (
                  <div key={post.id} className="ov-post" style={{
                    padding:'10px 12px', borderRadius:11,
                    background:'rgba(255,255,255,0.02)',
                    border:'1px solid rgba(255,255,255,0.05)',
                    display:'flex', alignItems:'center', gap:10,
                  }}>
                    {platforms.length > 0 && (
                      <div style={{ display:'flex', gap:-4, flexShrink:0 }}>
                        {platforms.slice(0,3).map((pl,i) => {
                          const info = getPlatformInfo(pl.platform)
                          return (
                            <div key={pl.platform} style={{ width:20, height:20, borderRadius:6, background:info.color+'18', border:`1px solid ${info.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginLeft: i>0?-4:0, position:'relative', zIndex:3-i }}>
                              <PlatformIcon id={pl.platform} size={11} color={info.color} />
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <p style={{ fontSize:12, color:'rgba(240,237,232,0.5)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0, flex:1 }}>
                      {post.body || 'Media post'}
                    </p>
                    <StatusBadge status={post.status} />
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Quick Insights bar */}
      {!loadingProfiles && !loadingPosts && (profiles.length > 0 || posts.length > 0) && (
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[
            profiles.filter(p=>p.status==='active').length > 0 && { icon:'⚡', text:`${activeCount} profile${activeCount!==1?'s':''} ready to publish`, color:'#4ade80' },
            posts.filter(p=>p.status==='scheduled').length > 0 && { icon:'⏰', text:`${posts.filter(p=>p.status==='scheduled').length} post${posts.filter(p=>p.status==='scheduled').length!==1?'s':''} scheduled`, color:'#60a5fa' },
            posts.filter(p=>p.status==='draft').length > 0 && { icon:'◻', text:`${posts.filter(p=>p.status==='draft').length} draft${posts.filter(p=>p.status==='draft').length!==1?'s':''} waiting`, color:'rgba(240,237,232,0.4)' },
          ].filter(Boolean).map((insight, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:100, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize:12 }}>{insight.icon}</span>
              <span style={{ fontSize:12, color:insight.color, fontWeight:500 }}>{insight.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}