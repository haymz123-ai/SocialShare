'use client'

import { useState, useEffect, useContext, useCallback } from 'react'
import { DashboardContext } from '../layout'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📷' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1DA1F2', icon: '𝕏' },
  { id: 'facebook',  label: 'Facebook',   color: '#1877F2', icon: 'f' },
  { id: 'linkedin',  label: 'LinkedIn',   color: '#0A66C2', icon: 'in' },
  { id: 'tiktok',    label: 'TikTok',     color: '#FF0050', icon: '♪' },
  { id: 'youtube',   label: 'YouTube',    color: '#FF0000', icon: '▶' },
  { id: 'threads',   label: 'Threads',    color: '#aaaaaa', icon: '@' },
  { id: 'pinterest', label: 'Pinterest',  color: '#E60023', icon: 'P' },
]
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#FFD700', icon: '?' }

export default function ConnectPage() {
  const { selectedGroup } = useContext(DashboardContext)
  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [connectPlatform, setConnectPlatform] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectMsg, setConnectMsg] = useState('')

  const fetchProfiles = useCallback(async (groupId) => {
    setLoadingProfiles(true)
    const res = await fetch(`/api/profiles?groupId=${groupId}`)
    const data = await res.json()
    setProfiles(Array.isArray(data) ? data : [])
    setLoadingProfiles(false)
  }, [])

  // Only fetch once on group change, no polling
  useEffect(() => {
    if (!selectedGroup) return
    setProfiles([])
    setConnectPlatform('')
    setConnectMsg('')
    fetchProfiles(selectedGroup.id)
  }, [selectedGroup?.id])

  async function handleConnect() {
    if (!connectPlatform || !selectedGroup) return
    setConnecting(true)
    setConnectMsg('')
    const redirectUrl = `${window.location.origin}/dashboard/connect?connected=true&groupId=${selectedGroup.id}`
    const res = await fetch('/api/connect-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: selectedGroup.id, platform: connectPlatform, redirectUrl }),
    })
    const data = await res.json()
    setConnecting(false)
    if (!res.ok) { setConnectMsg(data.error || 'Error'); return }
    if (data.url) {
      const popup = window.open(data.url, 'oauth', 'width=640,height=720')
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer)
          setConnectPlatform('')
          fetchProfiles(selectedGroup.id)
        }
      }, 1000)
    }
  }

  async function handleDisconnect(profileId) {
    if (!confirm('Disconnect this profile? This cannot be undone.')) return
    const res = await fetch(`/api/profiles?profileId=${profileId}&groupId=${selectedGroup.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || 'Failed to disconnect')
      return
    }
    fetchProfiles(selectedGroup.id)
  }

  if (!selectedGroup) return null

  const connectedIds = profiles.map(p => p.platform)
  const selectedInfo = PLATFORMS.find(p => p.id === connectPlatform)

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.06)} 100%{transform:scale(1)} }
        .sk { background: linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 100%); background-size:400% 100%; animation:shimmer 2s ease infinite; }
        .ptile { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); border: 1.5px solid transparent; }
        .ptile:not(.is-connected):hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
        .ptile.is-selected { animation: pop 0.25s ease; }
        .prow { transition: all 0.15s ease; }
        .prow:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(255,255,255,0.1) !important; }
        .disc-btn { opacity: 0; transition: opacity 0.15s; }
        .prow:hover .disc-btn { opacity: 1; }
        .conn-btn { transition: all 0.2s ease; }
        .conn-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .refresh-btn-connect { transition: all 0.15s ease; }
        .refresh-btn-connect:hover { border-color: rgba(255,215,0,0.2) !important; color: rgba(255,215,0,0.6) !important; background: rgba(255,215,0,0.04) !important; }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,140,66,0.1) 100%)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⟡</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F0EDE8', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Connect Platforms</h1>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.35)', margin: 0 }}>
          Link your social accounts to <span style={{ color: 'rgba(255,215,0,0.5)', fontWeight: 500 }}>{selectedGroup.name}</span>
        </p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28, marginBottom: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F0EDE8', margin: '0 0 4px', fontFamily: "'Syne', sans-serif" }}>Select a Platform</h2>
          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.3)', margin: 0 }}>Click a platform tile to begin the OAuth connection flow</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))', gap: 10, marginBottom: 24 }}>
          {PLATFORMS.map(p => {
            const isConnected = connectedIds.includes(p.id)
            const isSelected = connectPlatform === p.id
            return (
              <button
                key={p.id}
                onClick={() => !isConnected && setConnectPlatform(isSelected ? '' : p.id)}
                className={`ptile${isConnected ? ' is-connected' : ''}${isSelected ? ' is-selected' : ''}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '20px 10px 16px', borderRadius: 14,
                  borderColor: isSelected && !isConnected ? p.color + '55' : isConnected ? p.color + '28' : 'rgba(255,255,255,0.06)',
                  background: isSelected && !isConnected ? p.color + '10' : isConnected ? p.color + '07' : 'rgba(255,255,255,0.02)',
                  cursor: isConnected ? 'default' : 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isSelected && !isConnected ? `0 0 0 1px ${p.color}40, 0 8px 24px rgba(0,0,0,0.2)` : 'none',
                }}
              >
                {isConnected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#080810', fontWeight: 900, boxShadow: '0 2px 6px rgba(74,222,128,0.4)' }}>✓</div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 13, background: p.color + '15', border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: p.color, boxShadow: isSelected ? `0 4px 16px ${p.color}25` : 'none', transition: 'box-shadow 0.2s' }}>{p.icon}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isConnected ? '#4ade80' : isSelected ? p.color : 'rgba(240,237,232,0.65)', lineHeight: 1.3 }}>{p.label}</div>
                  <div style={{ fontSize: 9, marginTop: 2, letterSpacing: '0.04em', color: isConnected ? 'rgba(74,222,128,0.6)' : isSelected ? p.color + 'aa' : 'rgba(240,237,232,0.2)' }}>
                    {isConnected ? 'CONNECTED' : isSelected ? 'SELECTED' : 'CLICK TO ADD'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {connectMsg && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', fontSize: 13, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠</span> {connectMsg}
          </div>
        )}

        <button
          className="conn-btn"
          onClick={handleConnect}
          disabled={connecting || !connectPlatform}
          style={{
            width: '100%', padding: '14px 24px', borderRadius: 12,
            background: connectPlatform ? `linear-gradient(135deg, ${selectedInfo?.color || '#FFD700'} 0%, rgba(255,140,66,0.8) 100%)` : 'rgba(255,255,255,0.04)',
            color: connectPlatform ? '#fff' : 'rgba(240,237,232,0.25)',
            border: `1px solid ${connectPlatform ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
            fontWeight: 700, fontSize: 14, cursor: connectPlatform ? 'pointer' : 'default',
            fontFamily: 'inherit', opacity: (!connectPlatform || connecting) ? 0.6 : 1, letterSpacing: '0.01em',
          }}
        >
          {connecting ? '⟳ Opening OAuth…' : connectPlatform ? `Connect ${selectedInfo?.label} →` : 'Select a platform above to connect'}
        </button>
      </div>

      {(loadingProfiles || profiles.length > 0) && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F0EDE8', margin: '0 0 3px', fontFamily: "'Syne', sans-serif" }}>Connected Accounts</h2>
              <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.25)', margin: 0 }}>{profiles.length} account{profiles.length !== 1 ? 's' : ''} linked</p>
            </div>
            <button
              className="refresh-btn-connect"
              onClick={() => fetchProfiles(selectedGroup.id)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'rgba(240,237,232,0.35)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ↻ Refresh
            </button>
          </div>

          {loadingProfiles ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 62, borderRadius: 12 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {profiles.map(profile => {
                const info = getPlatformInfo(profile.platform)
                const isActive = profile.status === 'active'
                const isExpired = profile.status === 'expired'
                const statusColor = isActive ? '#4ade80' : isExpired ? '#fbbf24' : '#f87171'
                const statusBg = isActive ? 'rgba(74,222,128,0.08)' : isExpired ? 'rgba(251,191,36,0.08)' : 'rgba(248,113,113,0.08)'
                return (
                  <div key={profile.id} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 13, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: info.color + '14', border: `1px solid ${info.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: info.color }}>{info.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#E8E4DF', marginBottom: 2 }}>{info.label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 100, background: statusBg, border: `1px solid ${statusColor}25` }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}80` }} />
                      <span style={{ fontSize: 11, color: statusColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{profile.status}</span>
                    </div>
                    <button className="disc-btn" onClick={() => handleDisconnect(profile.id)} style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#f87171', fontFamily: 'inherit', fontWeight: 500 }}>Disconnect</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

