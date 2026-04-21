'use client'

import { useState, useEffect, useCallback, createContext } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export const DashboardContext = createContext({})

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '◈', href: '/dashboard' },
  { id: 'connect',  label: 'Connect',  icon: '⟡', href: '/dashboard/connect' },
  { id: 'compose',  label: 'Compose',  icon: '✦', href: '/dashboard/compose' },
  { id: 'posts',    label: 'Posts',    icon: '▤', href: '/dashboard/posts' },
  { id: 'stats',    label: 'Stats',    icon: '◎', href: '/dashboard/stats' },
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
      if (!res.ok) { setCreateError(data.error || 'Failed to create group'); return }
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
    : 'overview'

  if (!isLoaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080810' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(255,215,0,0.15)', borderTop: '2px solid #FFD700', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ color: 'rgba(255,215,0,0.6)', fontSize: 13, fontFamily: 'system-ui', letterSpacing: '0.08em' }}>LOADING</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #080810; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.15); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,215,0,0.3); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,0.15)} 50%{box-shadow:0 0 0 6px rgba(255,215,0,0)} }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%); background-size: 400% 100%; animation: shimmer 2s ease infinite; }
        .nav-item { transition: all 0.18s ease; text-decoration: none; display: block; }
        .nav-item:hover .nav-inner { background: rgba(255,215,0,0.06) !important; }
        .nav-item:hover .nav-icon { color: #FFD700 !important; }
        .nav-item:hover .nav-label { color: rgba(240,237,232,0.85) !important; }
        .nav-item.active .nav-inner { background: rgba(255,215,0,0.09) !important; }
        .nav-item.active .nav-icon { color: #FFD700 !important; }
        .nav-item.active .nav-label { color: #F0EDE8 !important; }
        .group-item { transition: all 0.15s ease; cursor: pointer; }
        .group-item:hover { background: rgba(255,215,0,0.05) !important; border-color: rgba(255,215,0,0.12) !important; }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .group-item:hover .del-btn { opacity: 1; }
        .sidebar-inp { outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .sidebar-inp:focus { border-color: rgba(255,215,0,0.4) !important; box-shadow: 0 0 0 3px rgba(255,215,0,0.06) !important; }
        .new-ws-btn { transition: all 0.15s; }
        .new-ws-btn:hover:not(:disabled) { background: rgba(255,215,0,0.2) !important; }
        .collapse-btn { transition: all 0.15s; }
        .collapse-btn:hover { background: rgba(255,255,255,0.06) !important; color: rgba(240,237,232,0.6) !important; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#080810', fontFamily: "'Inter', system-ui, sans-serif", color: '#E8E4DF' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: sidebarCollapsed ? 68 : 256, flexShrink: 0,
          background: 'rgba(10,10,18,0.98)', borderRight: '1px solid rgba(255,215,0,0.06)',
          display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
          transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden', zIndex: 50,
        }}>
          {/* Logo row */}
          <div style={{
            height: 64, padding: sidebarCollapsed ? '0 16px' : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, overflow: 'hidden' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #FFD700 0%, #FF8C42 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255,215,0,0.25)',
              }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#08080F', fontFamily: "'Syne', sans-serif" }}>S</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#F0EDE8', letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", whiteSpace: 'nowrap', lineHeight: 1.1 }}>SyncPost</div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,215,0,0.45)', letterSpacing: '0.15em', marginTop: 1 }}>PUBLISHER</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button className="collapse-btn" onClick={() => setSidebarCollapsed(true)} style={{
                width: 28, height: 28, borderRadius: 8, background: 'none',
                border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                color: 'rgba(240,237,232,0.2)', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>‹</button>
            )}
          </div>

          {sidebarCollapsed && (
            <button className="collapse-btn" onClick={() => setSidebarCollapsed(false)} style={{
              width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
              color: 'rgba(240,237,232,0.3)', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '12px auto 4px', flexShrink: 0,
            }}>›</button>
          )}

          {/* Nav */}
          <div style={{ padding: sidebarCollapsed ? '16px 10px 0' : '20px 10px 0', flexShrink: 0 }}>
            {!sidebarCollapsed && (
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.18)', padding: '0 10px', marginBottom: 6 }}>MENU</div>
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
                  borderLeft: activeTab === item.id && !sidebarCollapsed ? '2px solid #FFD700' : '2px solid transparent',
                  background: activeTab === item.id ? 'rgba(255,215,0,0.09)' : 'transparent',
                }}>
                  {sidebarCollapsed && activeTab === item.id && (
                    <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#FFD700' }} />
                  )}
                  <span className="nav-icon" style={{ fontSize: 16, color: activeTab === item.id ? '#FFD700' : 'rgba(240,237,232,0.35)', lineHeight: 1, flexShrink: 0, transition: 'color 0.18s' }}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="nav-label" style={{ fontSize: 13, fontWeight: 500, color: activeTab === item.id ? '#F0EDE8' : 'rgba(240,237,232,0.45)', transition: 'color 0.18s' }}>{item.label}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '16px 10px' }} />

          {/* Workspaces */}
          {!sidebarCollapsed ? (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.18)', paddingLeft: 2 }}>WORKSPACES</span>
                <button className="new-ws-btn" onClick={() => { setShowNewGroup(v => !v); setCreateError('') }} style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: showNewGroup ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${showNewGroup ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer', color: '#FFD700', fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>+</button>
              </div>

              {showNewGroup && (
                <div style={{ padding: '0 10px 12px', animation: 'fadeIn 0.2s ease' }}>
                  <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: 6 }}>
                    <input className="sidebar-inp" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Workspace name…" autoFocus style={{
                      flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, color: '#E8E4DF', fontSize: 12, fontFamily: 'inherit',
                    }} />
                    <button type="submit" disabled={creatingGroup || !groupName.trim()} style={{
                      padding: '7px 10px', background: groupName.trim() ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, color: '#FFD700', fontSize: 13,
                      cursor: 'pointer', fontWeight: 700, opacity: (!groupName.trim() || creatingGroup) ? 0.4 : 1, transition: 'all 0.15s',
                    }}>{creatingGroup ? '…' : '✓'}</button>
                  </form>
                  {createError && <p style={{ fontSize: 11, color: '#f87171', marginTop: 5, paddingLeft: 2 }}>{createError}</p>}
                </div>
              )}

              <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
                {loadingGroups ? (
                  [1,2].map(i => <div key={i} className="skeleton" style={{ height: 46, borderRadius: 10, marginBottom: 6 }} />)
                ) : groups.length === 0 ? (
                  <div style={{ padding: '10px 4px' }}>
                    <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.3)', marginBottom: 4, lineHeight: 1.6 }}>No workspaces yet.</p>
                    <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.18)', lineHeight: 1.6 }}>Create one to get started.</p>
                  </div>
                ) : groups.map(g => {
                  const isActive = selectedGroup?.id === g.id
                  const initials = g.name.slice(0,2).toUpperCase()
                  return (
                    <div key={g.id} className="group-item" onClick={() => setSelectedGroup(g)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4,
                      background: isActive ? 'rgba(255,215,0,0.07)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(255,215,0,0.15)' : 'transparent'}`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: isActive ? 'linear-gradient(135deg, rgba(255,215,0,0.25) 0%, rgba(255,140,66,0.2) 100%)' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, color: isActive ? '#FFD700' : 'rgba(240,237,232,0.3)',
                        fontFamily: "'Syne', sans-serif",
                        border: isActive ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
                      }}>{initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#F0EDE8' : 'rgba(240,237,232,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{g.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.2)', marginTop: 1 }}>{g.profiles_count ?? 0} profile{g.profiles_count !== 1 ? 's' : ''}</div>
                      </div>
                      <button className="del-btn" onClick={e => handleDeleteGroup(e, g.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.2)', fontSize: 12, padding: '2px 4px', borderRadius: 4, lineHeight: 1, flexShrink: 0,
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
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center',
            gap: sidebarCollapsed ? 0 : 10,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start', flexShrink: 0,
          }}>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
            {!sidebarCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,237,232,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                  {user?.firstName || user?.username || 'User'}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.22)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
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
            background: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Left: workspace breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>Workspace</span>
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 14 }}>›</span>
              {selectedGroup ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#FFD700' }}>{selectedGroup.name}</span>
              ) : loadingGroups ? (
                <div className="skeleton" style={{ width: 100, height: 16, borderRadius: 4 }} />
              ) : (
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>No workspace</span>
              )}
            </div>

            {/* Right: total workspaces badge */}
            {!loadingGroups && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 100,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 6,
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,140,66,0.2))',
                  border: '1px solid rgba(255,215,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: '#FFD700',
                }}>◈</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(240,237,232,0.5)', letterSpacing: '0.02em' }}>
                  {groups.length} workspace{groups.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {loadingGroups && (
              <div className="skeleton" style={{ width: 110, height: 32, borderRadius: 100 }} />
            )}
          </header>

          <main style={{ flex: 1, padding: '32px', overflowY: 'auto', animation: 'fadeIn 0.25s ease' }}>
            {loadingGroups ? (
              <LoadingState />
            ) : !selectedGroup ? (
              <EmptyState onAdd={() => { setSidebarCollapsed(false); setShowNewGroup(true) }} />
            ) : (
              <DashboardContext.Provider value={{ selectedGroup, refreshGroups: fetchGroups }}>
                {children}
              </DashboardContext.Provider>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 42, height: 42, border: '2px solid rgba(255,215,0,0.1)', borderTop: '2px solid #FFD700', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.25)', fontFamily: 'inherit', letterSpacing: '0.04em' }}>Setting up your workspace…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,140,66,0.06) 100%)',
          border: '1px solid rgba(255,215,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
          boxShadow: '0 0 40px rgba(255,215,0,0.06)',
        }}>◈</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F0EDE8', marginBottom: 10, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
          Create your first workspace
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(240,237,232,0.35)', lineHeight: 1.75, marginBottom: 28 }}>
          Workspaces hold your connected social accounts. Create one to start connecting profiles and scheduling posts.
        </p>
        <button onClick={onAdd} style={{
          padding: '12px 28px', borderRadius: 12,
          background: 'linear-gradient(135deg, #FFD700 0%, #FF8C42 100%)',
          color: '#08080F', fontWeight: 700, fontSize: 14,
          border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif",
          boxShadow: '0 8px 24px rgba(255,215,0,0.2)', transition: 'transform 0.15s, box-shadow 0.15s',
        }}>+ New Workspace</button>
      </div>
    </div>
  )
}