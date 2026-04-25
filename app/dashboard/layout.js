'use client'

import { useState, useEffect, useCallback, createContext } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import CrispChat from '../../components/CrispChat'

export const DashboardContext = createContext({})

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '◈', href: '/dashboard' },
  { id: 'connect',  label: 'Connect',  icon: '⟡', href: '/dashboard/connect' },
  { id: 'compose',  label: 'Compose',  icon: '✦', href: '/dashboard/compose' },
  { id: 'posts',    label: 'Posts',    icon: '▤', href: '/dashboard/posts' },
  { id: 'stats',    label: 'Stats',    icon: '◎', href: '/dashboard/stats' },
  { id: 'pricing',  label: 'Upgrade',  icon: '⚡', href: '/dashboard/pricing' },
]

export default function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()

  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [groupName, setGroupName] = useState('')
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [createError, setCreateError] = useState('')
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true)
    try {
      const res = await fetch('/api/profile-groups')
      const data = await res.json()
      const list = Array.isArray(data) ? data : []
      setGroups(list)
      return list
    } catch {
      return []
    } finally {
      setLoadingGroups(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !user) return
    fetchGroups().then(list => {
      if (list.length > 0) {
        setSelectedGroup(prev =>
          prev && list.find(g => g.id === prev.id) ? prev : list[0]
        )
      } else {
        setSelectedGroup(null)
        setSidebarCollapsed(false)
        setShowNewGroup(true)
      }
    })
  }, [isLoaded, user])

  async function handleCreateGroup(e) {
    e.preventDefault()
    setCreateError('')
    if (!groupName.trim()) return
    setCreatingGroup(true)
    try {
      const res = await fetch('/api/profile-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.limitReached) {
          setCreateError(`⚡ ${data.error}`)
        } else {
          setCreateError(data.error || 'Failed to create group')
        }
        return
      }
      setGroupName('')
      setShowNewGroup(false)
      const newList = await fetchGroups()
      const created = newList.find(g => g.id === data.id)
      if (created) setSelectedGroup(created)
    } finally {
      setCreatingGroup(false)
    }
  }

  async function handleDeleteGroup(e, id) {
    e.stopPropagation()
    if (!confirm('Delete this profile group?')) return
    const res = await fetch(`/api/profile-groups?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Could not delete group'); return }
    const newList = await fetchGroups()
    if (selectedGroup?.id === id) setSelectedGroup(newList[0] || null)
  }

  const activeTab = pathname === '/dashboard' ? 'overview'
    : pathname.includes('/connect') ? 'connect'
    : pathname.includes('/compose') ? 'compose'
    : pathname.includes('/stats') ? 'stats'
    : pathname.includes('/posts') ? 'posts'
    : pathname.includes('/pricing') ? 'pricing'
    : 'overview'

  const isLimitError = createError && createError.includes('⚡')

  if (!isLoaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FFFFFF' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(217,119,6,0.15)', borderTop: '2px solid #D97706', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ color: 'rgba(217,119,6,0.6)', fontSize: 13, fontFamily: 'system-ui', letterSpacing: '0.08em' }}>LOADING</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #FFFBF0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.18); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(217,119,6,0.35); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(217,119,6,0.15)} 50%{box-shadow:0 0 0 6px rgba(217,119,6,0)} }
        .skeleton { background: linear-gradient(90deg, rgba(217,119,6,0.04) 0%, rgba(217,119,6,0.09) 50%, rgba(217,119,6,0.04) 100%); background-size: 400% 100%; animation: shimmer 2s ease infinite; }
        .nav-item { transition: all 0.18s ease; text-decoration: none; display: block; }
        .nav-item:hover .nav-inner { background: rgba(217,119,6,0.06) !important; }
        .nav-item:hover .nav-icon { color: #D97706 !important; }
        .nav-item:hover .nav-label { color: #1C1200 !important; }
        .nav-item.active .nav-inner { background: rgba(217,119,6,0.09) !important; }
        .nav-item.active .nav-icon { color: #D97706 !important; }
        .nav-item.active .nav-label { color: #1C1200 !important; }
        .group-item { transition: all 0.15s ease; cursor: pointer; }
        .group-item:hover { background: rgba(217,119,6,0.05) !important; border-color: rgba(217,119,6,0.18) !important; }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .group-item:hover .del-btn { opacity: 1; }
        .sidebar-inp { outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .sidebar-inp:focus { border-color: rgba(217,119,6,0.45) !important; box-shadow: 0 0 0 3px rgba(217,119,6,0.08) !important; }
        .new-ws-btn { transition: all 0.15s; }
        .new-ws-btn:hover:not(:disabled) { background: rgba(217,119,6,0.12) !important; }
        .collapse-btn { transition: all 0.15s; }
        .collapse-btn:hover { background: rgba(217,119,6,0.07) !important; color: #D97706 !important; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#FFFBF0', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1200' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: sidebarCollapsed ? 68 : 256, flexShrink: 0,
          background: '#FFFFFF',
          borderRight: '1px solid rgba(217,119,6,0.12)',
          boxShadow: '2px 0 20px rgba(217,119,6,0.06)',
          display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
          transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden', zIndex: 50,
        }}>

          {/* Logo row */}
          <div style={{
            height: 64, padding: sidebarCollapsed ? '0 16px' : '0 20px',
            borderBottom: '1px solid rgba(217,119,6,0.08)',
            display: 'flex', alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, overflow: 'hidden' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(217,119,6,0.3)',
              }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', fontFamily: "'Bricolage Grotesque', sans-serif" }}>S</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1C1200', letterSpacing: '-0.03em', fontFamily: "'Bricolage Grotesque', sans-serif", whiteSpace: 'nowrap', lineHeight: 1.1 }}>Social Share Bay</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(217,119,6,0.5)', letterSpacing: '0.15em', marginTop: 1 }}>PUBLISHER</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button className="collapse-btn" onClick={() => setSidebarCollapsed(true)} style={{
                width: 28, height: 28, borderRadius: 8, background: 'none',
                border: '1px solid rgba(217,119,6,0.15)', cursor: 'pointer',
                color: 'rgba(217,119,6,0.4)', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>‹</button>
            )}
          </div>

          {sidebarCollapsed && (
            <button className="collapse-btn" onClick={() => setSidebarCollapsed(false)} style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(217,119,6,0.04)',
              border: '1px solid rgba(217,119,6,0.1)', cursor: 'pointer',
              color: 'rgba(217,119,6,0.4)', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '12px auto 4px', flexShrink: 0,
            }}>›</button>
          )}

          {/* Nav */}
          <div style={{ padding: sidebarCollapsed ? '16px 10px 0' : '20px 10px 0', flexShrink: 0 }}>
            {!sidebarCollapsed && (
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(217,119,6,0.45)', padding: '0 10px', marginBottom: 6 }}>MENU</div>
            )}
            {NAV_ITEMS.map(item => (
              <Link key={item.id} href={item.href} className={`nav-item${activeTab === item.id ? ' active' : ''}`}>
                <div className="nav-inner" style={{
                  display: 'flex', alignItems: 'center',
                  gap: sidebarCollapsed ? 0 : 12,
                  padding: sidebarCollapsed ? '11px 0' : '10px 12px',
                  borderRadius: 10, marginBottom: 2,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  borderLeft: activeTab === item.id && !sidebarCollapsed ? '2px solid #D97706' : '2px solid transparent',
                  background: activeTab === item.id ? 'rgba(217,119,6,0.08)' : 'transparent',
                }}>
                  {sidebarCollapsed && activeTab === item.id && (
                    <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#D97706' }} />
                  )}
                  <span className="nav-icon" style={{ fontSize: 16, color: activeTab === item.id ? '#D97706' : 'rgba(28,18,0,0.3)', lineHeight: 1, flexShrink: 0, transition: 'color 0.18s' }}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="nav-label" style={{ fontSize: 13, fontWeight: 600, color: activeTab === item.id ? '#1C1200' : 'rgba(28,18,0,0.45)', transition: 'color 0.18s' }}>{item.label}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(217,119,6,0.08)', margin: '16px 10px' }} />

          {/* Workspaces — KEY FIX: flex column with proper overflow */}
          {!sidebarCollapsed ? (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

              {/* Workspace header — never scrolls away */}
              <div style={{ padding: '0 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(217,119,6,0.45)', paddingLeft: 2 }}>WORKSPACES</span>
                <button className="new-ws-btn" onClick={() => { setShowNewGroup(v => !v); setCreateError('') }} style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: showNewGroup ? 'rgba(217,119,6,0.12)' : 'rgba(217,119,6,0.05)',
                  border: `1px solid ${showNewGroup ? 'rgba(217,119,6,0.3)' : 'rgba(217,119,6,0.12)'}`,
                  cursor: 'pointer', color: '#D97706', fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>+</button>
              </div>

              {/* New workspace input — also never scrolls away */}
              {showNewGroup && (
                <div style={{ padding: '0 10px 10px', flexShrink: 0, animation: 'fadeIn 0.2s ease' }}>
                  <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: 6 }}>
                    <input className="sidebar-inp" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Workspace name…" autoFocus style={{
                      flex: 1, padding: '7px 10px',
                      background: 'rgba(217,119,6,0.03)',
                      border: '1px solid rgba(217,119,6,0.18)', borderRadius: 8, color: '#1C1200', fontSize: 12, fontFamily: 'inherit',
                    }} />
                    <button type="submit" disabled={creatingGroup || !groupName.trim()} style={{
                      padding: '7px 10px',
                      background: groupName.trim() ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.03)',
                      border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, color: '#D97706', fontSize: 13,
                      cursor: 'pointer', fontWeight: 700, opacity: (!groupName.trim() || creatingGroup) ? 0.4 : 1, transition: 'all 0.15s',
                    }}>{creatingGroup ? '…' : '✓'}</button>
                  </form>
                  {/* Inline non-limit errors only */}
                  {createError && !isLimitError && (
                    <p style={{ fontSize: 11, color: '#DC2626', marginTop: 5, paddingLeft: 2 }}>{createError}</p>
                  )}
                </div>
              )}

              {/* Limit-reached upgrade banner — shown ABOVE the scrollable list, never overlaps */}
              {isLimitError && (
                <div style={{
                  margin: '0 10px 10px', flexShrink: 0,
                  padding: '10px 12px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  border: '1.5px solid #FCD34D',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, marginBottom: 6, lineHeight: 1.5 }}>
                    {createError.replace('⚡ ', '')}
                  </div>
                  <a href="/dashboard/pricing" style={{
                    display: 'block', textAlign: 'center',
                    padding: '6px 10px', borderRadius: 7,
                    background: 'linear-gradient(135deg, #D97706, #B45309)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    textDecoration: 'none', letterSpacing: '0.02em',
                  }}>Upgrade Plan →</a>
                </div>
              )}

              {/* Scrollable workspace list */}
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 10px 10px' }}>
                {loadingGroups ? (
                  [1,2].map(i => <div key={i} className="skeleton" style={{ height: 46, borderRadius: 10, marginBottom: 6 }} />)
                ) : groups.length === 0 ? (
                  <div style={{ padding: '10px 4px' }}>
                    <p style={{ fontSize: 12, color: 'rgba(28,18,0,0.35)', marginBottom: 4, lineHeight: 1.6 }}>No workspaces yet.</p>
                    <p style={{ fontSize: 11, color: 'rgba(28,18,0,0.22)', lineHeight: 1.6 }}>Create one to get started.</p>
                  </div>
                ) : groups.map(g => {
                  const isActive = selectedGroup?.id === g.id
                  const initials = g.name.slice(0,2).toUpperCase()
                  return (
                    <div key={g.id} className="group-item" onClick={() => setSelectedGroup(g)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4,
                      background: isActive ? 'rgba(217,119,6,0.07)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(217,119,6,0.2)' : 'transparent'}`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: isActive ? 'linear-gradient(135deg, rgba(217,119,6,0.2) 0%, rgba(245,158,11,0.15) 100%)' : 'rgba(217,119,6,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, color: isActive ? '#D97706' : 'rgba(28,18,0,0.3)',
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        border: isActive ? '1px solid rgba(217,119,6,0.25)' : '1px solid rgba(217,119,6,0.08)',
                      }}>{initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#1C1200' : 'rgba(28,18,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{g.name}</div>
                      </div>
                      <button className="del-btn" onClick={e => handleDeleteGroup(e, g.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,38,38,0.5)', fontSize: 12, padding: '2px 4px', borderRadius: 4, lineHeight: 1, flexShrink: 0,
                      }}>✕</button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {/* User footer */}
          <div style={{
            padding: sidebarCollapsed ? '14px 0' : '14px 16px',
            borderTop: '1px solid rgba(217,119,6,0.08)',
            display: 'flex', alignItems: 'center',
            gap: sidebarCollapsed ? 0 : 10,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start', flexShrink: 0,
            background: 'rgba(217,119,6,0.02)',
          }}>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
            {!sidebarCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(28,18,0,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                  {user?.firstName || user?.username || 'User'}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(28,18,0,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                  {user?.emailAddresses?.[0]?.emailAddress}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN AREA */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 64, padding: '0 32px',
            background: 'rgba(255,251,240,0.94)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(217,119,6,0.1)',
            boxShadow: '0 1px 20px rgba(217,119,6,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(28,18,0,0.35)', fontWeight: 500 }}>Workspace</span>
              <span style={{ color: 'rgba(28,18,0,0.2)', fontSize: 14 }}>›</span>
              {selectedGroup ? (
                <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>{selectedGroup.name}</span>
              ) : loadingGroups ? (
                <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4 }} />
              ) : (
                <span style={{ fontSize: 13, color: 'rgba(28,18,0,0.3)' }}>No workspace</span>
              )}
            </div>

            {!loadingGroups && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 100,
                background: 'rgba(217,119,6,0.06)',
                border: '1px solid rgba(217,119,6,0.14)',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 6,
                  background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(245,158,11,0.15))',
                  border: '1px solid rgba(217,119,6,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: '#D97706',
                }}>◈</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(28,18,0,0.55)', letterSpacing: '0.02em' }}>
                  {groups.length} workspace{groups.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {loadingGroups && (
              <div className="skeleton" style={{ width: 110, height: 32, borderRadius: 100 }} />
            )}
          </header>

          <main style={{ flex: 1, padding: '32px', overflowY: 'auto', animation: 'fadeIn 0.25s ease' }}>
            {!loadingGroups && !selectedGroup ? (
              <EmptyState onAdd={() => { setSidebarCollapsed(false); setShowNewGroup(true) }} />
            ) : (
              <DashboardContext.Provider value={{ selectedGroup, refreshGroups: fetchGroups }}>
                {children}
              </DashboardContext.Provider>
            )}
          </main>
        </div>
      </div>
      <CrispChat />
    </>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(245,158,11,0.05) 100%)',
          border: '1px solid rgba(217,119,6,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
          color: '#D97706',
          boxShadow: '0 0 40px rgba(217,119,6,0.08)',
        }}>◈</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1C1200', marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
          Create your first workspace
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(28,18,0,0.45)', lineHeight: 1.75, marginBottom: 28 }}>
          Workspaces hold your connected social accounts. Create one to start connecting profiles and scheduling posts.
        </p>
        <button onClick={onAdd} style={{
          padding: '12px 28px', borderRadius: 100,
          background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
          color: '#FFFFFF', fontWeight: 700, fontSize: 14,
          border: 'none', cursor: 'pointer', fontFamily: "'Bricolage Grotesque', sans-serif",
          boxShadow: '0 8px 24px rgba(217,119,6,0.3)', transition: 'transform 0.15s, box-shadow 0.15s',
        }}>+ New Workspace</button>
      </div>
    </div>
  )
}