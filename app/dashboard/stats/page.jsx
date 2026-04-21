'use client'

import { useState, useEffect, useContext, useCallback } from 'react'
import { DashboardContext } from '../layout'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1DA1F2' },
  { id: 'facebook',  label: 'Facebook',   color: '#1877F2' },
  { id: 'linkedin',  label: 'LinkedIn',   color: '#0A66C2' },
  { id: 'tiktok',    label: 'TikTok',     color: '#FF0050' },
  { id: 'youtube',   label: 'YouTube',    color: '#FF0000' },
  { id: 'threads',   label: 'Threads',    color: '#aaaaaa' },
  { id: 'pinterest', label: 'Pinterest',  color: '#E60023' },
]
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#FFD700' }

const STAT_ICONS = {
  impressions: '👁',
  likes: '♥',
  comments: '💬',
  shares: '↗',
  saved: '🔖',
  retweets: '🔁',
  quotes: '❝',
  reposts: '🔁',
  replies: '↩',
  clicks: '🖱',
  follows: '➕',
  profile_visits: '👤',
  outbound_clicks: '🔗',
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 16 }}>{icon || '📊'}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#F0EDE8', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : '—'}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function PostStatCard({ post, statsData }) {
  const [open, setOpen] = useState(false)
  const platforms = statsData?.platforms || []

  const totalImpressions = platforms.reduce((sum, pl) => {
    const latest = pl.records?.[pl.records.length - 1]
    return sum + (latest?.stats?.impressions || 0)
  }, 0)

  const totalLikes = platforms.reduce((sum, pl) => {
    const latest = pl.records?.[pl.records.length - 1]
    return sum + (latest?.stats?.likes || 0)
  }, 0)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, overflow: 'hidden',
      transition: 'border-color 0.18s', cursor: 'pointer',
    }} onClick={() => setOpen(v => !v)}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 3, minHeight: 44, borderRadius: 3, flexShrink: 0, alignSelf: 'stretch',
          background: platforms.length > 0 ? '#FFD700' : 'rgba(255,255,255,0.1)',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 14, color: '#E8E4DF', margin: '0 0 8px', lineHeight: 1.6,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {post.body || <em style={{ color: 'rgba(240,237,232,0.25)' }}>Media-only post</em>}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.35)' }}>
              👁 <strong style={{ color: '#E8E4DF' }}>{totalImpressions.toLocaleString()}</strong> impressions
            </span>
            <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.35)' }}>
              ♥ <strong style={{ color: '#E8E4DF' }}>{totalLikes.toLocaleString()}</strong> likes
            </span>
            <span style={{ fontSize: 12, color: 'rgba(240,237,232,0.35)' }}>
              {platforms.length} platform{platforms.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 11, color: 'rgba(240,237,232,0.2)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', lineHeight: 1,
        }}>▾</span>
      </div>

      {open && platforms.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16,
          background: 'rgba(255,255,255,0.01)', animation: 'fadeIn 0.18s ease',
        }}>
          {platforms.map((pl, i) => {
            const info = getPlatformInfo(pl.platform)
            const latest = pl.records?.[pl.records.length - 1]
            const stats = latest?.stats || {}
            const recordedAt = latest?.recorded_at
            const statKeys = Object.keys(stats).filter(k => stats[k] !== undefined && stats[k] !== null)

            return (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: info.color + '14', border: `1px solid ${info.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: info.color,
                  }}>{info.label.slice(0,2).toUpperCase()}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#F0EDE8' }}>{info.label}</span>
                  {recordedAt && (
                    <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.2)', marginLeft: 'auto' }}>
                      Updated {new Date(recordedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {statKeys.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                    {statKeys.map(k => (
                      <StatCard key={k} label={k.replace(/_/g, ' ')} value={stats[k]} icon={STAT_ICONS[k]} />
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.25)', padding: '8px 0' }}>No stats available yet</p>
                )}

                {pl.records?.length > 1 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.2)', letterSpacing: '0.1em', marginBottom: 8 }}>IMPRESSIONS OVER TIME</div>
                    <ImpressionsSparkline records={pl.records} color={info.color} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {open && platforms.length === 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.25)' }}>No stats data available for this post</p>
        </div>
      )}
    </div>
  )
}

function ImpressionsSparkline({ records, color }) {
  const vals = records.map(r => r.stats?.impressions || 0)
  const max = Math.max(...vals, 1)
  const W = 300, H = 48, PAD = 4

  const pts = vals.map((v, i) => {
    const x = PAD + (i / (vals.length - 1 || 1)) * (W - PAD * 2)
    const y = H - PAD - (v / max) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: W }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {vals.length > 1 && (
          <>
            <polyline
              points={pts + ` ${W - PAD},${H} ${PAD},${H}`}
              fill={`url(#grad-${color.replace('#','')})`}
              stroke="none"
            />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {vals.map((v, i) => {
          const [x, y] = pts.split(' ')[i]?.split(',') || []
          return x ? <circle key={i} cx={x} cy={y} r="2.5" fill={color} /> : null
        })}
      </svg>
    </div>
  )
}

export default function StatsPage() {
  const { selectedGroup } = useContext(DashboardContext)
  const [posts, setPosts] = useState([])
  const [statsMap, setStatsMap] = useState({})
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [platformFilter, setPlatformFilter] = useState('all')

  const fetchPostsAndStats = useCallback(async (groupId) => {
    setLoadingPosts(true)
    const res = await fetch(`/api/posts?groupId=${groupId}&per_page=50`)
    const data = await res.json()
    const allPosts = data?.data || []
    const publishedPosts = allPosts.filter(p => p.status === 'published' || p.status === 'processed')
    setPosts(publishedPosts)
    setLoadingPosts(false)

    if (publishedPosts.length === 0) return

    setLoadingStats(true)
    const ids = publishedPosts.slice(0, 50).map(p => p.id).join(',')
    const statsRes = await fetch(`/api/posts/stats?groupId=${groupId}&post_ids=${ids}`)
    const statsData = await statsRes.json()
    setStatsMap(statsData?.data || {})
    setLoadingStats(false)
  }, [])

  // Only fetch on group change (initial load), not on interval
  useEffect(() => {
    if (!selectedGroup) return
    setPosts([])
    setStatsMap({})
    fetchPostsAndStats(selectedGroup.id)
  }, [selectedGroup?.id])

  if (!selectedGroup) return null

  const totals = { impressions: 0, likes: 0, comments: 0, shares: 0 }
  Object.values(statsMap).forEach(postStats => {
    postStats?.platforms?.forEach(pl => {
      const latest = pl.records?.[pl.records.length - 1]?.stats || {}
      totals.impressions += latest.impressions || 0
      totals.likes += latest.likes || 0
      totals.comments += latest.comments || 0
      totals.shares += (latest.shares || latest.retweets || 0)
    })
  })

  const platformsInStats = [...new Set(
    Object.values(statsMap).flatMap(ps => ps?.platforms?.map(p => p.platform) || [])
  )]

  const filteredPosts = platformFilter === 'all'
    ? posts
    : posts.filter(p =>
        statsMap[p.id]?.platforms?.some(pl => pl.platform === platformFilter)
      )

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .sk { background: linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 100%); background-size:400% 100%; animation:shimmer 2s ease infinite; }
        .refresh-btn { transition: all 0.15s ease; }
        .refresh-btn:hover { border-color: rgba(255,215,0,0.2) !important; color: rgba(255,215,0,0.7) !important; background: rgba(255,215,0,0.05) !important; }
        .filter-pill { transition: all 0.15s ease; }
        .filter-pill:hover { border-color: rgba(255,215,0,0.25) !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,140,66,0.1) 100%)',
              border: '1px solid rgba(255,215,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>◎</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F0EDE8', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Analytics</h1>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.35)', margin: 0 }}>
            Performance for <span style={{ color: 'rgba(255,215,0,0.5)', fontWeight: 500 }}>{selectedGroup.name}</span>
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={() => fetchPostsAndStats(selectedGroup.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '9px 16px', fontSize: 13,
            color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 14 }}>↻</span> Refresh
        </button>
      </div>

      {/* Aggregate totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Impressions', value: totals.impressions, icon: '👁', color: '#FFD700' },
          { label: 'Total Likes', value: totals.likes, icon: '♥', color: '#f87171' },
          { label: 'Total Comments', value: totals.comments, icon: '💬', color: '#60a5fa' },
          { label: 'Shares / Retweets', value: totals.shares, icon: '↗', color: '#4ade80' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '20px 22px', borderRadius: 16,
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}70, transparent)` }} />
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {loadingStats ? '—' : s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.35)', marginTop: 6, fontWeight: 600, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Platform filter */}
      {platformsInStats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['all', ...platformsInStats].map(pid => {
            const info = pid === 'all' ? { label: 'All Platforms', color: '#FFD700' } : getPlatformInfo(pid)
            return (
              <button key={pid} className="filter-pill" onClick={() => setPlatformFilter(pid)} style={{
                padding: '6px 14px', borderRadius: 100,
                background: platformFilter === pid ? (pid === 'all' ? 'rgba(255,215,0,0.1)' : info.color + '15') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${platformFilter === pid ? (pid === 'all' ? 'rgba(255,215,0,0.28)' : info.color + '50') : 'rgba(255,255,255,0.07)'}`,
                color: platformFilter === pid ? (pid === 'all' ? '#FFD700' : info.color) : 'rgba(240,237,232,0.4)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {info.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Post list with stats */}
      {loadingPosts ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 100, borderRadius: 16 }} />)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '72px 24px',
          background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20,
        }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.3 }}>◎</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'rgba(240,237,232,0.4)', marginBottom: 6 }}>No published posts yet</p>
          <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.2)' }}>Stats appear once posts are published to platforms</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,237,232,0.25)', letterSpacing: '0.1em', marginBottom: 4 }}>
            {filteredPosts.length} PUBLISHED POST{filteredPosts.length !== 1 ? 'S' : ''} · CLICK TO EXPAND
          </div>
          {filteredPosts.map(post => (
            <PostStatCard
              key={post.id}
              post={post}
              statsData={statsMap[post.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}


