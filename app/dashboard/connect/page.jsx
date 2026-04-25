'use client'

import { useState, useEffect, useContext, useCallback } from 'react'
import { DashboardContext } from '../layout'
import { useRouter } from 'next/navigation'

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📷' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1DA1F2', icon: '𝕏' },
  { id: 'facebook',  label: 'Facebook',   color: '#1877F2', icon: 'f' },
  { id: 'linkedin',  label: 'LinkedIn',   color: '#0A66C2', icon: 'in' },
  { id: 'tiktok',    label: 'TikTok',     color: '#FF0050', icon: '♪' },
  { id: 'youtube',   label: 'YouTube',    color: '#FF0000', icon: '▶' },
  { id: 'threads',   label: 'Threads',    color: '#555555', icon: '@' },
  { id: 'pinterest', label: 'Pinterest',  color: '#E60023', icon: 'P' },
]
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#D97706', icon: '?' }

export default function ConnectPage() {
  const { selectedGroup } = useContext(DashboardContext)
  const router = useRouter()
  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [connectPlatform, setConnectPlatform] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectMsg, setConnectMsg] = useState({ type: '', text: '' })
  const [planInfo, setPlanInfo] = useState(null)

  const fetchProfiles = useCallback(async (groupId) => {
    setLoadingProfiles(true)
    const res = await fetch(`/api/profiles?groupId=${groupId}`)
    const data = await res.json()
    setProfiles(Array.isArray(data) ? data : [])
    setLoadingProfiles(false)
  }, [])

  const fetchPlan = useCallback(async () => {
    const res = await fetch('/api/user-plan')
    const data = await res.json()
    setPlanInfo(data)
  }, [])

  useEffect(() => {
    if (!selectedGroup) return
    setProfiles([])
    setConnectPlatform('')
    setConnectMsg({ type: '', text: '' })
    fetchProfiles(selectedGroup.id)
    fetchPlan()
  }, [selectedGroup?.id])

  const atProfileLimit = planInfo && planInfo.limits.maxProfiles !== null &&
    planInfo.limits.maxProfiles !== Infinity &&
    profiles.length >= planInfo.limits.maxProfiles

  async function handleConnect() {
    if (!connectPlatform || !selectedGroup) return
    if (atProfileLimit) return
    setConnecting(true)
    setConnectMsg({ type: '', text: '' })
    const redirectUrl = `${window.location.origin}/dashboard/connect?connected=true&groupId=${selectedGroup.id}`
    const res = await fetch('/api/connect-platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: selectedGroup.id, platform: connectPlatform, redirectUrl }),
    })
    const data = await res.json()
    setConnecting(false)
    if (!res.ok) {
      if (data.limitReached) {
        setConnectMsg({ type: 'limit', text: data.error })
      } else {
        setConnectMsg({ type: 'error', text: data.error || 'Error' })
      }
      return
    }
    if (data.url) {
      const popup = window.open(data.url, 'oauth', 'width=640,height=720')
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer)
          setConnectPlatform('')
          fetchProfiles(selectedGroup.id)
          fetchPlan()
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
    fetchPlan()
  }

  if (!selectedGroup) return null

  const connectedIds = profiles.map(p => p.platform)
  const selectedInfo = PLATFORMS.find(p => p.id === connectPlatform)
  const profileCount = profiles.length
  const maxProfiles = planInfo?.limits?.maxProfiles
  const showLimit = maxProfiles && maxProfiles !== Infinity

  return (
    <div style={{ animation: 'fadeIn 0.25s ease', background: '#FFFBF0', minHeight: '100%', padding: 2 }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
        .sk { background: linear-gradient(90deg,#FEF3C7 0%,#FDE68A 50%,#FEF3C7 100%); background-size:400% 100%; animation:shimmer 1.8s ease infinite; }
        .ptile { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); border: 1.5px solid transparent; cursor: pointer; background: none; }
        .ptile:not(.is-connected):not(.is-locked):hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(217,119,6,0.15); }
        .ptile.is-selected { animation: pop 0.22s ease; }
        .ptile.is-locked { opacity: 0.45; cursor: not-allowed; }
        .prow { transition: all 0.15s ease; }
        .prow:hover { background: #FFFBEB !important; border-color: #FCD34D !important; }
        .disc-btn { opacity: 0; transition: opacity 0.15s; }
        .prow:hover .disc-btn { opacity: 1; }
        .conn-btn { transition: all 0.2s ease; }
        .conn-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(217,119,6,0.25); }
        .upgrade-pulse { animation: upgradePulse 2.5s ease infinite; }
        @keyframes upgradePulse { 0%,100%{box-shadow:0 4px 20px rgba(217,119,6,0.15)} 50%{box-shadow:0 8px 32px rgba(217,119,6,0.3)} }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '1.5px solid #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>⟡</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1C1200', letterSpacing: '-0.03em', margin: 0 }}>Connect Platforms</h1>
        </div>
        <p style={{ fontSize: 13, color: '#B45309', margin: 0, fontWeight: 500 }}>
          Link your social accounts to <span style={{ color: '#D97706', fontWeight: 700 }}>{selectedGroup.name}</span>
        </p>
      </div>

      {/* Profile usage bar */}
      {showLimit && (
        <div style={{
          marginBottom: 16, padding: '14px 18px', borderRadius: 14,
          background: atProfileLimit ? 'linear-gradient(135deg,#fff7ed,#fef3c7)' : '#ffffff',
          border: `1.5px solid ${atProfileLimit ? '#FCD34D' : '#FDE68A'}`,
          boxShadow: atProfileLimit ? '0 4px 20px rgba(217,119,6,0.12)' : '0 2px 10px rgba(217,119,6,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1C1200' }}>Connected Profiles</span>
              <span style={{
                fontSize: 11, fontWeight: 800, padding: '2px 9px', borderRadius: 100,
                background: atProfileLimit ? '#FEF3C7' : '#f0fdf4',
                color: atProfileLimit ? '#D97706' : '#16a34a',
                border: `1.5px solid ${atProfileLimit ? '#FCD34D' : '#bbf7d0'}`,
              }}>{profileCount} / {maxProfiles}</span>
            </div>
            {atProfileLimit && (
              <button onClick={() => router.push('/dashboard/pricing')} style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg,#D97706,#B45309)',
                border: 'none', color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Upgrade →</button>
            )}
          </div>
          <div style={{ height: 6, borderRadius: 6, background: '#FEF3C7', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6, transition: 'width 0.5s ease',
              width: `${Math.min((profileCount / maxProfiles) * 100, 100)}%`,
              background: atProfileLimit
                ? 'linear-gradient(90deg,#D97706,#F59E0B)'
                : 'linear-gradient(90deg,#4ade80,#16a34a)',
            }} />
          </div>
          {atProfileLimit && (
            <p style={{ fontSize: 12, color: '#B45309', margin: '10px 0 0', lineHeight: 1.6, fontWeight: 500 }}>
              You've reached your profile limit. Upgrade your plan to connect more social accounts.
            </p>
          )}
        </div>
      )}

      {/* Limit-reached upgrade banner */}
      {connectMsg.type === 'limit' && (
        <div className="upgrade-pulse" style={{
          marginBottom: 16, padding: '18px 20px', borderRadius: 16,
          background: 'linear-gradient(135deg,#FFFBF0,#FEF3C7)',
          border: '2px solid #FCD34D',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,#D97706,#B45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1C1200', marginBottom: 4 }}>Profile Limit Reached</div>
              <p style={{ fontSize: 13, color: '#B45309', margin: '0 0 12px', lineHeight: 1.6 }}>{connectMsg.text}</p>
              <button onClick={() => router.push('/pricing')} style={{
                padding: '9px 20px', borderRadius: 10,
                background: 'linear-gradient(135deg,#D97706,#B45309)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(217,119,6,0.3)',
              }}>View Upgrade Options →</button>
            </div>
          </div>
        </div>
      )}

      {/* Platform selector card */}
      <div style={{ background: '#ffffff', border: '1.5px solid #FDE68A', borderRadius: 18, padding: 28, marginBottom: 16, boxShadow: '0 2px 20px rgba(217,119,6,0.07)' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1200', margin: '0 0 4px' }}>Select a Platform</h2>
          <p style={{ fontSize: 13, color: '#B45309', margin: 0 }}>
            {atProfileLimit
              ? 'Upgrade your plan to connect additional platforms'
              : 'Click a platform tile to begin the OAuth connection flow'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))', gap: 10, marginBottom: 24 }}>
          {PLATFORMS.map(p => {
            const isConnected = connectedIds.includes(p.id)
            const isSelected = connectPlatform === p.id
            const isLocked = atProfileLimit && !isConnected
            return (
              <button
                key={p.id}
                onClick={() => !isConnected && !isLocked && setConnectPlatform(isSelected ? '' : p.id)}
                className={`ptile${isConnected ? ' is-connected' : ''}${isSelected ? ' is-selected' : ''}${isLocked ? ' is-locked' : ''}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '20px 10px 16px', borderRadius: 14,
                  borderColor: isSelected && !isConnected ? '#D97706' : isConnected ? '#FCD34D' : '#FDE68A',
                  background: isLocked ? '#FFFDF5' : isSelected && !isConnected ? '#FFFBEB' : isConnected ? '#FFFDF5' : '#FFFBF0',
                  cursor: isConnected || isLocked ? 'default' : 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isSelected && !isConnected && !isLocked ? '0 0 0 2px rgba(217,119,6,0.2), 0 8px 20px rgba(0,0,0,0.08)' : isConnected ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                }}
              >
                {isConnected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 17, height: 17, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 900, boxShadow: '0 2px 6px rgba(34,197,94,0.4)' }}>✓</div>
                )}
                {isLocked && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 17, height: 17, borderRadius: '50%', background: '#FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#B45309', fontWeight: 900 }}>🔒</div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color + '14', border: `1.5px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: p.color, opacity: isLocked ? 0.5 : 1 }}>{p.icon}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: isConnected ? '#15803d' : isSelected ? '#D97706' : isLocked ? '#B45309' : '#1C1200', lineHeight: 1.3 }}>{p.label}</div>
                  <div style={{ fontSize: 9, marginTop: 2, letterSpacing: '0.05em', fontWeight: 700, color: isConnected ? '#86efac' : isSelected ? '#B45309' : isLocked ? '#FCD34D' : '#D97706' }}>
                    {isConnected ? 'CONNECTED' : isLocked ? 'LOCKED' : isSelected ? 'SELECTED' : 'CLICK TO ADD'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {connectMsg.type === 'error' && (
          <div style={{ marginBottom: 16, padding: '11px 15px', borderRadius: 11, background: '#fee2e2', border: '1.5px solid #fca5a5', fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <span>⚠</span> {connectMsg.text}
          </div>
        )}

        {atProfileLimit ? (
          <button onClick={() => router.push('/pricing')} style={{
            width: '100%', padding: '14px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg,#D97706,#B45309)',
            color: '#fff', border: 'none',
            fontWeight: 800, fontSize: 14, cursor: 'pointer',
            fontFamily: 'inherit', letterSpacing: '0.01em',
            boxShadow: '0 8px 24px rgba(217,119,6,0.3)',
          }}>
            ⚡ Upgrade to Connect More Platforms
          </button>
        ) : (
          <button
            className="conn-btn"
            onClick={handleConnect}
            disabled={connecting || !connectPlatform}
            style={{
              width: '100%', padding: '14px 24px', borderRadius: 12,
              background: connectPlatform
                ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                : '#FEF3C7',
              color: connectPlatform ? '#fff' : '#D97706',
              border: `1.5px solid ${connectPlatform ? 'transparent' : '#FDE68A'}`,
              fontWeight: 800, fontSize: 14, cursor: connectPlatform ? 'pointer' : 'default',
              fontFamily: 'inherit', opacity: connecting ? 0.7 : 1, letterSpacing: '0.01em',
            }}
          >
            {connecting ? '⟳  Opening OAuth…' : connectPlatform ? `Connect ${selectedInfo?.label} →` : 'Select a platform above to connect'}
          </button>
        )}
      </div>

      {/* Connected accounts */}
      {(loadingProfiles || profiles.length > 0) && (
        <div style={{ background: '#ffffff', border: '1.5px solid #FDE68A', borderRadius: 18, padding: 28, boxShadow: '0 2px 20px rgba(217,119,6,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1200', margin: '0 0 3px' }}>Connected Accounts</h2>
              <p style={{ fontSize: 12, color: '#B45309', margin: 0, fontWeight: 500 }}>{profiles.length} account{profiles.length !== 1 ? 's' : ''} linked</p>
            </div>
            <button
              onClick={() => { fetchProfiles(selectedGroup.id); fetchPlan() }}
              style={{ background: '#FFFBF0', border: '1.5px solid #FDE68A', borderRadius: 9, padding: '8px 14px', fontSize: 12, color: '#B45309', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
            >
              ↻ Refresh
            </button>
          </div>

          {loadingProfiles ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3].map(i => <div key={i} className="sk" style={{ height: 64, borderRadius: 12 }} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {profiles.map(profile => {
                const info = getPlatformInfo(profile.platform)
                const isActive = profile.status === 'active'
                const isExpired = profile.status === 'expired'
                const statusColor = isActive ? '#15803d' : isExpired ? '#a16207' : '#dc2626'
                const statusBg   = isActive ? '#dcfce7' : isExpired ? '#fef9c3' : '#fee2e2'
                const statusBorder = isActive ? '#bbf7d0' : isExpired ? '#fde68a' : '#fca5a5'
                return (
                  <div key={profile.id} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 13, background: '#FFFBF0', border: '1.5px solid #FEF3C7' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: info.color + '14', border: `1.5px solid ${info.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: info.color }}>{info.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1200', marginBottom: 2 }}>{info.label}</div>
                      <div style={{ fontSize: 12, color: '#B45309', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{profile.name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 100, background: statusBg, border: `1.5px solid ${statusBorder}` }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                      <span style={{ fontSize: 11, color: statusColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{profile.status}</span>
                    </div>
                    <button className="disc-btn" onClick={() => handleDisconnect(profile.id)} style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit', fontWeight: 700 }}>Disconnect</button>
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