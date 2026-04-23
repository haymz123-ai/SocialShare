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
  { id: 'threads',   label: 'Threads',    color: '#555555' },
  { id: 'pinterest', label: 'Pinterest',  color: '#E60023' },
]
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#D97706' }

const STAT_ICONS = {
  impressions: '👁', likes: '♥', comments: '💬', shares: '↗',
  saved: '🔖', retweets: '🔁', quotes: '❝', reposts: '🔁',
  replies: '↩', clicks: '🖱', follows: '➕', profile_visits: '👤', outbound_clicks: '🔗',
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      background: '#FFFBF0', border: '1.5px solid #FEF3C7',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 16 }}>{icon || '📊'}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#1C1200', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : '—'}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
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
    <div
      style={{
        background: '#ffffff', border: '1.5px solid #FDE68A',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(217,119,6,0.06)',
        transition: 'border-color 0.18s, box-shadow 0.18s', cursor: 'pointer',
      }}
      className="psc"
      onClick={() => setOpen(v => !v)}
    >
      <style>{`.psc:hover { border-color: #F59E0B !important; box-shadow: 0 4px 20px rgba(217,119,6,0.14) !important; }`}</style>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 4, minHeight: 44, borderRadius: 4, flexShrink: 0, alignSelf: 'stretch',
          background: platforms.length > 0 ? 'linear-gradient(180deg, #D97706, #F59E0B)' : '#FDE68A',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 14, color: '#1C1200', margin: '0 0 8px', lineHeight: 1.65, fontWeight: 500,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {post.body || <em style={{ color: '#D97706', opacity: 0.6 }}>Media-only post</em>}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>
              👁 <strong style={{ color: '#1C1200' }}>{totalImpressions.toLocaleString()}</strong> impressions
            </span>
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>
              ♥ <strong style={{ color: '#1C1200' }}>{totalLikes.toLocaleString()}</strong> likes
            </span>
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>
              {platforms.length} platform{platforms.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: 13, color: '#D97706', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease', lineHeight: 1, marginTop: 2,
        }}>▾</span>
      </div>

      {open && platforms.length > 0 && (
        <div style={{
          borderTop: '1.5px solid #FEF3C7',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 18,
          background: '#FFFBF0', animation: 'fadeIn 0.18s ease',
        }}>
          {platforms.map((pl, i) => {
            const info = getPlatformInfo(pl.platform)
            const latest = pl.records?.[pl.records.length - 1]
            const stats = latest?.stats || {}
            const recordedAt = latest?.recorded_at
            const statKeys = Object.keys(stats).filter(k => stats[k] !== undefined && stats[k] !== null)
            return (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: info.color + '14', border: `1.5px solid ${info.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: info.color,
                  }}>{info.label.slice(0,2).toUpperCase()}</div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1C1200' }}>{info.label}</span>
                  {recordedAt && (
                    <span style={{ fontSize: 11, color: '#B45309', marginLeft: 'auto', fontWeight: 500 }}>
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
                  <p style={{ fontSize: 13, color: '#B45309', padding: '8px 0' }}>No stats available yet</p>
                )}
                {pl.records?.length > 1 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#D97706', letterSpacing: '0.1em', marginBottom: 8 }}>IMPRESSIONS OVER TIME</div>
                    <ImpressionsSparkline records={pl.records} color={info.color} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {open && platforms.length === 0 && (
        <div style={{ borderTop: '1.5px solid #FEF3C7', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#B45309' }}>No stats data available for this post</p>
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
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {vals.length > 1 && (
          <>
            <polyline points={pts + ` ${W - PAD},${H} ${PAD},${H}`} fill={`url(#grad-${color.replace('#','')})`} stroke="none" />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {vals.map((v, i) => {
          const pair = pts.split(' ')[i]?.split(',')
          return pair ? <circle key={i} cx={pair[0]} cy={pair[1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5" /> : null
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
    : posts.filter(p => statsMap[p.id]?.platforms?.some(pl => pl.platform === platformFilter))

  return (
    <div style={{ animation: 'fadeIn 0.25s ease', background: '#FFFBF0', minHeight: '100%', padding: 2 }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .sk { background: linear-gradient(90deg,#FEF3C7 0%,#FDE68A 50%,#FEF3C7 100%); background-size:400% 100%; animation:shimmer 1.8s ease infinite; }
        .refresh-btn-s { transition: all 0.15s ease; }
        .refresh-btn-s:hover { border-color: #D97706 !important; color: #D97706 !important; background: #FFFBEB !important; }
        .filter-pill { transition: all 0.15s ease; cursor: pointer; }
        .filter-pill:hover { transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '1.5px solid #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>◎</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1C1200', letterSpacing: '-0.03em', margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Analytics</h1>
          </div>
          <p style={{ fontSize: 13, color: '#B45309', margin: 0, fontWeight: 500 }}>
            Performance for <span style={{ color: '#D97706', fontWeight: 700 }}>{selectedGroup.name}</span>
          </p>
        </div>
        <button
          className="refresh-btn-s"
          onClick={() => fetchPostsAndStats(selectedGroup.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#ffffff', border: '1.5px solid #FDE68A', borderRadius: 10, padding: '9px 18px', fontSize: 13, color: '#B45309', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
        >
          <span style={{ fontSize: 14 }}>↻</span> Refresh
        </button>
      </div>

      {/* Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Impressions', value: totals.impressions, icon: '👁', color: '#D97706', grad: 'linear-gradient(135deg, #D97706, #F59E0B)' },
          { label: 'Total Likes',       value: totals.likes,       icon: '♥', color: '#B45309', grad: 'linear-gradient(135deg, #F59E0B, #B45309)' },
          { label: 'Total Comments',    value: totals.comments,    icon: '💬', color: '#92400E', grad: 'linear-gradient(135deg, #D97706, #92400E)' },
          { label: 'Shares / Retweets', value: totals.shares,      icon: '↗', color: '#059669', grad: 'linear-gradient(135deg, #4ade80, #059669)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '20px 22px', borderRadius: 18,
            background: '#ffffff', border: '1.5px solid #FDE68A',
            boxShadow: '0 2px 16px rgba(217,119,6,0.07)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.grad, borderRadius: '18px 18px 0 0' }} />
            <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {loadingStats ? '—' : s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#B45309', marginTop: 7, fontWeight: 700, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Platform filter pills */}
      {platformsInStats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['all', ...platformsInStats].map(pid => {
            const info = pid === 'all' ? { label: 'All Platforms', color: '#D97706' } : getPlatformInfo(pid)
            const isActive = platformFilter === pid
            return (
              <button key={pid} className="filter-pill" onClick={() => setPlatformFilter(pid)} style={{
                padding: '7px 15px', borderRadius: 100,
                background: isActive ? (pid === 'all' ? '#FEF3C7' : info.color + '15') : '#ffffff',
                border: `1.5px solid ${isActive ? (pid === 'all' ? '#FCD34D' : info.color + '55') : '#FDE68A'}`,
                color: isActive ? (pid === 'all' ? '#B45309' : info.color) : '#B45309',
                fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                boxShadow: isActive ? '0 2px 10px rgba(217,119,6,0.12)' : 'none',
              }}>
                {info.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Post list */}
      {loadingPosts ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 100, borderRadius: 16 }} />)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '72px 24px',
          background: '#ffffff', border: '1.5px solid #FDE68A', borderRadius: 20,
          boxShadow: '0 2px 16px rgba(217,119,6,0.07)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.25 }}>◎</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#B45309', marginBottom: 6 }}>No published posts yet</p>
          <p style={{ fontSize: 13, color: '#D97706', opacity: 0.7 }}>Stats appear once posts are published to platforms</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#D97706', letterSpacing: '0.1em', marginBottom: 4 }}>
            {filteredPosts.length} PUBLISHED POST{filteredPosts.length !== 1 ? 'S' : ''} · CLICK TO EXPAND
          </div>
          {filteredPosts.map(post => (
            <PostStatCard key={post.id} post={post} statsData={statsMap[post.id]} />
          ))}
        </div>
      )}
    </div>
  )
}