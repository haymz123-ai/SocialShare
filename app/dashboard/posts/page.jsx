
'use client'

import { useState, useEffect, useContext, useCallback, useRef } from 'react'
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
const PLACEMENT_PLATFORMS = ['facebook', 'linkedin', 'pinterest']
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#D97706' }

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/mpeg'

const PLATFORM_FORMATS = {
  instagram: [
    { value:'post',  label:'Feed Post', icon:'🖼' },
    { value:'reel',  label:'Reel',      icon:'🎬' },
    { value:'story', label:'Story',     icon:'⭕' },
  ],
  facebook: [
    { value:'post',  label:'Feed Post', icon:'📝' },
    { value:'reel',  label:'Reel',      icon:'🎬' },
    { value:'story', label:'Story',     icon:'⭕' },
  ],
  tiktok: [
    { value:'video', label:'Video',  icon:'🎬' },
    { value:'image', label:'Images', icon:'🖼' },
  ],
  youtube: [{ value:'post', label:'Video Upload', icon:'▶' }],
  twitter:   [{ value:'post', label:'Tweet',  icon:'🐦' }],
  linkedin:  [{ value:'post', label:'Post',   icon:'💼' }],
  threads:   [{ value:'post', label:'Thread', icon:'🧵' }],
  pinterest: [{ value:'pin',  label:'Pin',    icon:'📌' }],
}

const PLATFORM_DEFAULTS = {
  youtube: { privacy_status: 'public' },
  tiktok:  { privacy_status: 'PUBLIC_TO_EVERYONE' },
}

const TIKTOK_PRIVACY = [
  { value:'PUBLIC_TO_EVERYONE',    label:'Everyone' },
  { value:'MUTUAL_FOLLOW_FRIENDS', label:'Mutual Followers' },
  { value:'FOLLOWER_OF_CREATOR',   label:'Followers Only' },
  { value:'SELF_ONLY',             label:'Only Me' },
]

const STATUS_CONFIG = {
  published:  { bg:'rgba(74,222,128,0.1)',   color:'#16a34a', border:'rgba(74,222,128,0.3)',   dot:'#4ade80',  calColor:'#16a34a' },
  processed:  { bg:'rgba(74,222,128,0.1)',   color:'#16a34a', border:'rgba(74,222,128,0.3)',   dot:'#4ade80',  calColor:'#16a34a' },
  scheduled:  { bg:'rgba(245,158,11,0.12)',  color:'#B45309', border:'rgba(245,158,11,0.3)',   dot:'#F59E0B',  calColor:'#D97706' },
  pending:    { bg:'rgba(217,119,6,0.1)',    color:'#B45309', border:'rgba(217,119,6,0.2)',    dot:'#D97706',  calColor:'#B45309' },
  draft:      { bg:'rgba(217,119,6,0.1)',    color:'#B45309', border:'rgba(217,119,6,0.2)',    dot:'#D97706',  calColor:'#B45309' },
  failed:     { bg:'rgba(248,113,113,0.1)',  color:'#dc2626', border:'rgba(248,113,113,0.3)',  dot:'#f87171',  calColor:'#dc2626' },
  processing: { bg:'rgba(217,119,6,0.1)',    color:'#D97706', border:'rgba(217,119,6,0.25)',   dot:'#D97706',  calColor:'#D97706' },
}

function isPostEditable(post) {
  return post.draft === true || post.status === 'draft' || post.status === 'pending' || post.status === 'scheduled'
}

function displayStatus(post) {
  if ((post.status === 'pending' || post.status === 'processing') && post.draft) return 'draft'
  return post.status
}

function getNowLocalISO() {
  const now = new Date()
  const pad = n => String(n).padStart(2,'0')
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function isDateInPast(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function isDayInPast(year, month, day) {
  const today = new Date()
  today.setHours(0,0,0,0)
  const d = new Date(year, month, day)
  return d < today
}

function DeleteConfirmModal({ post, groupId, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/posts/${post.id}?groupId=${groupId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Delete failed'); return }
      onDeleted()
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  const ds = displayStatus(post)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1100, background:'rgba(255,251,240,0.7)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'fadeIn 0.15s ease' }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:'100%', maxWidth:420, background:'#ffffff', border:'1.5px solid #fcd5d5', borderRadius:20, boxShadow:'0 40px 80px rgba(220,38,38,0.12)', overflow:'hidden' }}>
        <div style={{ padding:'22px 24px 18px', borderBottom:'1px solid #fce8e8', display:'flex', alignItems:'center', gap:13, background:'linear-gradient(135deg,#fff5f5,#ffffff)' }}>
          <div style={{ width:38, height:38, borderRadius:12, background:'#fef2f2', border:'1.5px solid #fcd5d5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>🗑</div>
          <div>
            <h2 style={{ fontSize:15, fontWeight:700, color:'#1C1200', margin:0 }}>Delete {ds === 'draft' ? 'Draft' : ds === 'scheduled' ? 'Scheduled Post' : 'Post'}</h2>
            <div style={{ fontSize:11, color:'#dc2626', marginTop:2, fontWeight:500 }}>This action cannot be undone</div>
          </div>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ padding:'13px 15px', borderRadius:12, background:'#FFFBF0', border:'1.5px solid #FDE68A' }}>
            <p style={{ fontSize:13, color:'#1C1200', margin:'0 0 8px', lineHeight:1.55 }}>
              {post.body ? <>"{post.body.slice(0, 80)}{post.body.length > 80 ? '…' : ''}"</> : <em style={{ color:'#D97706' }}>Media-only post</em>}
            </p>
            {post.scheduled_at && (
              <div style={{ fontSize:11, color:'#D97706', display:'flex', alignItems:'center', gap:5, fontWeight:500 }}>
                <span>⏰</span> Scheduled for {new Date(post.scheduled_at).toLocaleString()}
              </div>
            )}
          </div>
          <p style={{ fontSize:13, color:'#B45309', margin:0, lineHeight:1.6 }}>
            This will permanently delete this post from Postproxy. It will not be published.
          </p>
          {error && (
            <div style={{ padding:'10px 13px', borderRadius:10, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', fontSize:12, display:'flex', alignItems:'center', gap:7, fontWeight:500 }}>
              <span>⚠</span> {error}
            </div>
          )}
        </div>
        <div style={{ padding:'14px 24px 20px', display:'flex', gap:9, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'9px 18px', borderRadius:10, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} style={{ padding:'9px 22px', borderRadius:10, background:'linear-gradient(135deg,#fef2f2,#fee2e2)', border:'1.5px solid #fcd5d5', color:'#dc2626', fontSize:13, fontWeight:700, cursor:deleting?'not-allowed':'pointer', fontFamily:'inherit', opacity:deleting?0.6:1, display:'flex', alignItems:'center', gap:7 }}>
            {deleting ? <><span style={{ width:12, height:12, border:'2px solid #fcd5d5', borderTop:'2px solid #dc2626', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Deleting…</> : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status, isDraft }) {
  const effectiveStatus = (status === 'pending' && isDraft) ? 'draft' : status
  const st = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.processing
  const label = effectiveStatus === 'pending' && !isDraft ? 'pending' : effectiveStatus
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:100, background:st.bg, color:st.color, border:`1.5px solid ${st.border}`, letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
      <span style={{ width:4, height:4, borderRadius:'50%', background:st.dot, flexShrink:0 }} />
      {label}
    </span>
  )
}

function InputRow({ label, placeholder, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'#B45309', marginBottom:5 }}>{label.toUpperCase()}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', padding:'8px 11px', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:9, color:'#1C1200', fontSize:12, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
    </div>
  )
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
      <div onClick={() => onChange(!checked)} style={{ width:16, height:16, borderRadius:5, flexShrink:0, border:`2px solid ${checked ? '#D97706' : '#FCD34D'}`, background: checked ? '#FEF3C7' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#D97706' }}>{checked ? '✓' : ''}</div>
      <span style={{ fontSize:12, color:'#B45309', fontWeight:500 }}>{label}</span>
    </label>
  )
}

function PlatformParamsEditor({ platform, params, onChange }) {
  const formats = PLATFORM_FORMATS[platform] || []
  const currentFormat = params.format || (formats[0]?.value ?? 'post')
  const info = getPlatformInfo(platform)
  function set(key, val) { onChange({ ...params, [key]: val }) }

  return (
    <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
      {formats.length > 1 && (
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'#B45309', marginBottom:6 }}>FORMAT</div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {formats.map(f => (
              <button key={f.value} type="button" onClick={() => set('format', f.value)} style={{ padding:'5px 12px', borderRadius:8, fontSize:11, fontWeight:600, background: currentFormat===f.value ? info.color+'18' : '#FFFBF0', border:`1.5px solid ${currentFormat===f.value ? info.color+'60' : '#FDE68A'}`, color: currentFormat===f.value ? info.color : '#B45309', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>{f.icon} {f.label}</button>
            ))}
          </div>
        </div>
      )}
      {platform==='instagram' && (<>
        <InputRow label="First Comment" placeholder="Comment after posting…" value={params.first_comment||''} onChange={v=>set('first_comment',v)} />
        {currentFormat==='reel' && <InputRow label="Cover URL" placeholder="https://…thumbnail.jpg" value={params.cover_url||''} onChange={v=>set('cover_url',v)} />}
      </>)}
      {platform==='facebook' && currentFormat==='post' && <InputRow label="First Comment" placeholder="Comment after posting…" value={params.first_comment||''} onChange={v=>set('first_comment',v)} />}
      {platform==='facebook' && currentFormat==='reel' && <InputRow label="Reel Title" placeholder="Optional reel title" value={params.title||''} onChange={v=>set('title',v)} />}
      {platform==='youtube' && (<>
        <InputRow label="Video Title" placeholder="My awesome video" value={params.title||''} onChange={v=>set('title',v)} />
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'#B45309', marginBottom:5 }}>PRIVACY</div>
          <select value={params.privacy_status||'public'} onChange={e=>set('privacy_status',e.target.value)} style={{ width:'100%', padding:'8px 11px', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:9, color:'#1C1200', fontSize:12, fontFamily:'inherit', outline:'none' }}>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
        <InputRow label="Thumbnail URL" placeholder="https://…thumbnail.jpg" value={params.cover_url||''} onChange={v=>set('cover_url',v)} />
        <CheckRow label="Made for Kids" checked={!!params.made_for_kids} onChange={v=>set('made_for_kids',v)} />
      </>)}
      {platform==='tiktok' && (<>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'#B45309', marginBottom:5 }}>PRIVACY</div>
          <select value={params.privacy_status||'PUBLIC_TO_EVERYONE'} onChange={e=>set('privacy_status',e.target.value)} style={{ width:'100%', padding:'8px 11px', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:9, color:'#1C1200', fontSize:12, fontFamily:'inherit', outline:'none' }}>
            {TIKTOK_PRIVACY.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <CheckRow label="Disable Comments" checked={!!params.disable_comment} onChange={v=>set('disable_comment',v)} />
        <CheckRow label="Disable Duet" checked={!!params.disable_duet} onChange={v=>set('disable_duet',v)} />
        <CheckRow label="Disable Stitch" checked={!!params.disable_stitch} onChange={v=>set('disable_stitch',v)} />
        <CheckRow label="AI-Generated Content" checked={!!params.made_with_ai} onChange={v=>set('made_with_ai',v)} />
      </>)}
      {platform==='pinterest' && (<>
        <InputRow label="Pin Title" placeholder="My pin title" value={params.title||''} onChange={v=>set('title',v)} />
        <InputRow label="Destination Link" placeholder="https://yoursite.com" value={params.destination_link||''} onChange={v=>set('destination_link',v)} />
      </>)}
      {platform==='linkedin' && <div style={{ fontSize:11, color:'#B45309', fontStyle:'italic' }}>Organization ID is set via profile placement above.</div>}
    </div>
  )
}

function MediaInput({ files, urls, onFilesChange, onUrlsChange, label='MEDIA' }) {
  const [tab, setTab] = useState('upload')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault(); setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.match(/^(image|video)\//))
    if (dropped.length) onFilesChange(prev => [...prev, ...dropped])
  }
  function handleFileInput(e) {
    const picked = Array.from(e.target.files)
    if (picked.length) onFilesChange(prev => [...prev, ...picked])
    e.target.value = ''
  }
  function removeFile(i) { onFilesChange(prev => prev.filter((_,idx) => idx!==i)) }

  return (
    <div>
      <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:8 }}>{label}</label>
      <div style={{ display:'flex', gap:4, background:'#FEF3C7', border:'1.5px solid #FDE68A', borderRadius:9, padding:3, marginBottom:10, width:'fit-content' }}>
        {[{id:'upload',label:'⬆ Files'},{id:'url',label:'🔗 URL'}].map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{ padding:'5px 13px', borderRadius:6, fontSize:11, fontWeight:600, background: tab===t.id ? '#ffffff' : 'transparent', border: tab===t.id ? '1.5px solid #FCD34D' : '1.5px solid transparent', color: tab===t.id ? '#D97706' : '#B45309', cursor:'pointer', fontFamily:'inherit' }}>{t.label}</button>
        ))}
      </div>
      {tab==='upload' ? (<>
        <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop} onClick={()=>inputRef.current?.click()} style={{ border:`2px dashed ${dragging?'#D97706':'#FCD34D'}`, borderRadius:12, padding:'20px 16px', textAlign:'center', cursor:'pointer', background:dragging?'#FEF3C7':'#FFFBF0', transition:'all 0.2s' }}>
          <input ref={inputRef} type="file" accept={ACCEPT} multiple onChange={handleFileInput} style={{ display:'none' }} />
          <div style={{ fontSize:22, marginBottom:7, opacity:0.5 }}>🖼</div>
          <div style={{ fontSize:12, color:'#B45309', fontWeight:500 }}>Drop files or click to browse</div>
          <div style={{ fontSize:10, color:'#D97706', marginTop:3 }}>JPG, PNG, GIF, WEBP, MP4, MOV</div>
        </div>
        {files.length > 0 && (
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:10 }}>
            {files.map((file,i) => {
              const isVideo = file.type.startsWith('video/')
              return (
                <div key={i} style={{ position:'relative', borderRadius:9, overflow:'hidden', border:'1.5px solid #FDE68A' }}>
                  {isVideo ? (
                    <div style={{ width:64, height:64, background:'#FEF3C7', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3 }}>
                      <span style={{ fontSize:18 }}>▶</span>
                      <span style={{ fontSize:8, color:'#B45309', fontWeight:700 }}>VIDEO</span>
                    </div>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="" style={{ width:64, height:64, objectFit:'cover', display:'block' }} />
                  )}
                  <button type="button" onClick={()=>removeFile(i)} style={{ position:'absolute', top:2, right:2, width:15, height:15, borderRadius:'50%', background:'rgba(28,18,0,0.75)', border:'none', color:'#fff', fontSize:9, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                </div>
              )
            })}
          </div>
        )}
      </>) : (<>
        <textarea value={urls} onChange={e=>onUrlsChange(e.target.value)} placeholder={"https://example.com/image.jpg\nhttps://example.com/video.mp4"} rows={2} style={{ width:'100%', padding:'10px 14px', boxSizing:'border-box', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:10, color:'#1C1200', fontSize:13, fontFamily:'inherit', lineHeight:1.6, outline:'none', resize:'vertical' }} />
        <p style={{ fontSize:11, color:'#D97706', marginTop:5 }}>One URL per line</p>
      </>)}
    </div>
  )
}

function PlacementPicker({ profile, groupId, value, onChange, onLoaded }) {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    fetch(`/api/placements?profileId=${profile.id}&platform=${profile.platform}&groupId=${groupId}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setPlacements(list)
        onLoaded(profile.id, list)
        if (list.length >= 1 && value === undefined)
          onChange(list[0].id !== null ? list[0].id : '__personal__')
      })
      .catch(() => onLoaded(profile.id, []))
      .finally(() => setLoading(false))
  }, [profile.id])

  const label = profile.platform==='facebook' ? 'Page' : profile.platform==='pinterest' ? 'Board' : 'Profile'
  const info = getPlatformInfo(profile.platform)

  if (loading) return (
    <div style={{ padding:'10px 16px', fontSize:12, color:'#B45309', display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:10, height:10, border:'1.5px solid #FDE68A', borderTop:`1.5px solid ${info.color}`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      Loading {label.toLowerCase()}s…
    </div>
  )
  if (!placements.length) {
    if (profile.platform==='facebook') return <div style={{ padding:'10px 16px', fontSize:12, color:'#d97706', fontWeight:500 }}>⚠ No Pages found. Reconnect and grant Page access.</div>
    if (profile.platform==='pinterest') return <div style={{ padding:'10px 16px', fontSize:12, color:'#dc2626', fontWeight:500 }}>⚠ No boards found.</div>
    return null
  }
  if (placements.length===1) return (
    <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
      <span style={{ color:'#B45309', fontWeight:500 }}>{label}:</span>
      <span style={{ color:'#1C1200', fontWeight:600 }}>{placements[0].name}</span>
    </div>
  )
  return (
    <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:12, color:'#B45309', flexShrink:0, fontWeight:500 }}>{label}:</span>
      <select value={value??''} onChange={e=>onChange(e.target.value)} style={{ flex:1, padding:'7px 10px', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:8, color:'#1C1200', fontSize:12, fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
        <option value="">— Select {label} —</option>
        {placements.map(pl => <option key={pl.id??'p'} value={pl.id!==null?pl.id:'__personal__'}>{pl.name}</option>)}
      </select>
    </div>
  )
}

function ProfileSelector({ profiles, loadingProfiles, selectedProfileIds, onToggle, placements, onPlacementChange, loadedPlacements, onPlacementLoaded, groupId, platformParams, onPlatformParamChange }) {
  const [expandedParams, setExpandedParams] = useState({})
  const activeProfiles = profiles.filter(p => p.status==='active')

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309' }}>
          POST TO {selectedProfileIds.length > 0 && <span style={{ color:'#D97706', marginLeft:6 }}>{selectedProfileIds.length} selected</span>}
        </label>
        {activeProfiles.length > 1 && (
          <button type="button" onClick={() => {
            if (selectedProfileIds.length === activeProfiles.length) {
              activeProfiles.forEach(p => onToggle(p.id, true))
            } else {
              activeProfiles.forEach(p => { if (!selectedProfileIds.includes(p.id)) onToggle(p.id) })
            }
          }} style={{ background:'#FEF3C7', border:'1.5px solid #FCD34D', borderRadius:7, padding:'4px 12px', fontSize:11, color:'#B45309', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
            {selectedProfileIds.length===activeProfiles.length ? '✕ Deselect All' : '✓ Select All'}
          </button>
        )}
      </div>
      {loadingProfiles ? (
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {[1,2].map(i => <div key={i} style={{ height:52, borderRadius:11, background:'#FEF3C7', border:'1.5px solid #FDE68A' }} />)}
        </div>
      ) : profiles.length===0 ? (
        <div style={{ padding:'16px', borderRadius:11, textAlign:'center', background:'#FFFBF0', border:'1.5px solid #FDE68A' }}>
          <p style={{ fontSize:13, color:'#B45309', margin:0, fontWeight:500 }}>No profiles connected</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {profiles.map(profile => {
            const info = getPlatformInfo(profile.platform)
            const isSelected = selectedProfileIds.includes(profile.id)
            const inactive = profile.status !== 'active'
            const needsPlacement = isSelected && PLACEMENT_PLATFORMS.includes(profile.platform)
            const isExpanded = expandedParams[profile.id]
            const pp = (platformParams||{})[profile.id] || {}
            return (
              <div key={profile.id} style={{ borderRadius:12, border:`1.5px solid ${isSelected ? info.color+'55' : '#FDE68A'}`, background: isSelected ? info.color+'08' : '#FFFBF0', overflow:'hidden', opacity:inactive?0.5:1, transition:'border-color 0.15s, background 0.15s' }}>
                <div onClick={() => !inactive && onToggle(profile.id)} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 13px', cursor:inactive?'not-allowed':'pointer' }}>
                  <div style={{ width:19, height:19, borderRadius:6, flexShrink:0, border:`2px solid ${isSelected?info.color:'#FCD34D'}`, background:isSelected?info.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#ffffff', fontWeight:900, transition:'all 0.15s' }}>{isSelected?'✓':''}</div>
                  <div style={{ width:33, height:33, borderRadius:10, flexShrink:0, background:info.color+'14', border:`1.5px solid ${info.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:info.color }}>{info.label.slice(0,2).toUpperCase()}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#1C1200', lineHeight:1.3 }}>{info.label}</div>
                    <div style={{ fontSize:11, color:'#B45309', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1, fontWeight:500 }}>{profile.name}</div>
                  </div>
                  {isSelected && (() => {
                    const fmt = pp.format || PLATFORM_FORMATS[profile.platform]?.[0]?.value
                    const fmtLabel = PLATFORM_FORMATS[profile.platform]?.find(f => f.value===fmt)
                    return fmtLabel ? (
                      <span style={{ fontSize:10, color:info.color, background:info.color+'12', border:`1.5px solid ${info.color}30`, padding:'2px 8px', borderRadius:6, fontWeight:700, flexShrink:0 }}>{fmtLabel.icon} {fmtLabel.label}</span>
                    ) : null
                  })()}
                  {inactive && <span style={{ fontSize:10, color:'#dc2626', background:'#fef2f2', border:'1.5px solid #fcd5d5', padding:'2px 7px', borderRadius:5, fontWeight:600 }}>Reconnect</span>}
                </div>
                {needsPlacement && (
                  <div style={{ borderTop:`1px solid ${info.color}20`, background:`${info.color}04` }}>
                    <PlacementPicker profile={profile} groupId={groupId} value={placements[profile.id]} onChange={val=>onPlacementChange(profile.id,val)} onLoaded={(pid,list)=>onPlacementLoaded(pid,list)} />
                  </div>
                )}
                {isSelected && onPlatformParamChange && (
                  <div style={{ borderTop:`1px solid ${info.color}20` }}>
                    <button type="button" onClick={()=>setExpandedParams(p=>({...p,[profile.id]:!p[profile.id]}))} style={{ width:'100%', padding:'8px 13px', background:'transparent', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontFamily:'inherit' }}>
                      <span style={{ fontSize:11, fontWeight:600, color:isExpanded?info.color:'#B45309' }}>
                        ⚙ Post Settings
                        {Object.keys(pp).length>0 && <span style={{ marginLeft:6, fontSize:10, color:info.color, background:info.color+'14', padding:'1px 6px', borderRadius:4 }}>{Object.keys(pp).length} set</span>}
                      </span>
                      <span style={{ fontSize:11, color:'#D97706', transform:isExpanded?'rotate(180deg)':'none', transition:'transform 0.2s' }}>▾</span>
                    </button>
                    {isExpanded && (
                      <div style={{ borderTop:`1px solid ${info.color}15`, background:`${info.color}03` }}>
                        <PlatformParamsEditor platform={profile.platform} params={pp} onChange={newPp=>onPlatformParamChange(profile.id,newPp)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function toggleProfileWithDefaults(profileId, profiles, setSelectedProfileIds, setPlacements, setLoadedPlacements, setPlatformParams) {
  const profile = profiles.find(p => p.id === profileId)
  setSelectedProfileIds(prev => {
    if (prev.includes(profileId)) {
      setPlacements(p => { const n={...p}; delete n[profileId]; return n })
      setLoadedPlacements(p => { const n={...p}; delete n[profileId]; return n })
      setPlatformParams(p => { const n={...p}; delete n[profileId]; return n })
      return prev.filter(id => id !== profileId)
    }
    if (profile && PLATFORM_DEFAULTS[profile.platform]) {
      setPlatformParams(p => ({
        ...p,
        [profileId]: { ...PLATFORM_DEFAULTS[profile.platform], ...(p[profileId] || {}) }
      }))
    }
    return [...prev, profileId]
  })
}

function ScheduleModal({ date, groupId, onClose, onSaved }) {
  const [body, setBody]                     = useState('')
  const [mediaFiles, setMediaFiles]         = useState([])
  const [mediaUrls, setMediaUrls]           = useState('')
  const [profiles, setProfiles]             = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [selectedProfileIds, setSelectedProfileIds] = useState([])
  const [placements, setPlacements]         = useState({})
  const [loadedPlacements, setLoadedPlacements] = useState({})
  const [platformParams, setPlatformParams] = useState({})
  const [isDraft, setIsDraft]               = useState(false)
  const [saving, setSaving]                 = useState(false)
  const [error, setError]                   = useState('')

  const defaultDt = (() => {
    const d = new Date(date)
    const now = new Date()
    d.setHours(now.getHours() + 1, 0, 0, 0)
    if (d < now) {
      now.setMinutes(now.getMinutes() + 5, 0, 0)
      return now.toISOString().slice(0,16)
    }
    return d.toISOString().slice(0,16)
  })()
  const [scheduledAt, setScheduledAt] = useState(defaultDt)
  const minDateTime = getNowLocalISO()

  useEffect(() => {
    fetch(`/api/profiles?groupId=${groupId}`)
      .then(r => r.json())
      .then(data => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingProfiles(false))
  }, [groupId])

  function toggleProfile(profileId, forceRemove=false) {
    if (forceRemove) {
      setPlacements(p => { const n={...p}; delete n[profileId]; return n })
      setLoadedPlacements(p => { const n={...p}; delete n[profileId]; return n })
      setPlatformParams(p => { const n={...p}; delete n[profileId]; return n })
      setSelectedProfileIds(prev => prev.filter(id => id !== profileId))
      return
    }
    toggleProfileWithDefaults(profileId, profiles, setSelectedProfileIds, setPlacements, setLoadedPlacements, setPlatformParams)
  }

  function resolvePlacementId(pid) {
    const val = placements[pid]; if (val==='__personal__') return null; return val||null
  }

  function buildPlatformsPayload() {
    const result = {}
    selectedProfileIds.forEach(pid => {
      const profile = profiles.find(p => p.id===pid); if (!profile) return
      const defaults = PLATFORM_DEFAULTS[profile.platform] || {}
      const pp = { ...defaults, ...(platformParams[pid] || {}) }
      const placementId = resolvePlacementId(pid)
      const entry = { ...pp }
      if (profile.platform==='facebook' && placementId) entry.page_id = placementId
      if (profile.platform==='pinterest' && placementId) entry.board_id = placementId
      if (profile.platform==='linkedin' && placementId!==null) entry.organization_id = placementId
      if (Object.keys(entry).length > 0) result[profile.platform] = entry
    })
    return result
  }

  async function handleSave() {
    setError('')
    const urlList = mediaUrls.split('\n').map(s=>s.trim()).filter(Boolean)
    const hasMedia = mediaFiles.length > 0 || urlList.length > 0
    if (!body.trim() && !hasMedia) { setError('Add content or at least one media item.'); return }
    if (!selectedProfileIds.length) { setError('Select at least one profile.'); return }
    if (!isDraft && scheduledAt && isDateInPast(scheduledAt)) { setError('Scheduled time cannot be in the past. Please choose a future time.'); return }
    setSaving(true)
    const platformsPayload = buildPlatformsPayload()
    try {
      if (mediaFiles.length > 0) {
        const fd = new FormData()
        fd.append('groupId', groupId)
        if (body) fd.append('post[body]', body)
        if (!isDraft && scheduledAt) fd.append('post[scheduled_at]', scheduledAt)
        if (isDraft) fd.append('post[draft]', 'true')
        selectedProfileIds.forEach(pid => fd.append('profiles[]', pid))
        mediaFiles.forEach(f => fd.append('media[]', f, f.name))
        urlList.forEach(u => fd.append('media[]', u))
        Object.entries(platformsPayload).forEach(([plat, pp]) => {
          Object.entries(pp).forEach(([k,v]) => {
            if (v !== undefined && v !== '') fd.append(`platforms[${plat}][${k}]`, String(v))
          })
        })
        const res = await fetch('/api/posts', { method:'POST', body:fd })
        const data = await res.json()
        if (!res.ok) { setError(data.error||'Failed to create post'); return }
      } else {
        const res = await fetch('/api/posts', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ groupId, postBody:body, profiles:selectedProfileIds, scheduledAt:isDraft?undefined:scheduledAt||undefined, mediaUrls:urlList, draft:isDraft, platforms:platformsPayload }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error||'Failed to create post'); return }
      }
      onSaved()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const dateLabel = new Date(date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(255,251,240,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'fadeIn 0.18s ease' }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:'100%', maxWidth:620, background:'#ffffff', border:'1.5px solid #FCD34D', borderRadius:24, boxShadow:'0 40px 80px rgba(217,119,6,0.15)', overflow:'hidden' }}>
        <div style={{ padding:'20px 24px 18px', borderBottom:'1px solid #FEF3C7', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#FFFBF0,#ffffff)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:'#FEF3C7', border:'1.5px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⏰</div>
            <div>
              <h2 style={{ fontSize:16, fontWeight:800, color:'#1C1200', margin:0 }}>Schedule Post</h2>
              <div style={{ fontSize:11, color:'#D97706', marginTop:2, fontWeight:500 }}>{dateLabel}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        <div style={{ padding:'20px 24px', maxHeight:'72vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:7 }}>CONTENT</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="What do you want to share?" rows={5} style={{ width:'100%', padding:'12px 14px', boxSizing:'border-box', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:12, color:'#1C1200', fontSize:14, fontFamily:'inherit', lineHeight:1.6, outline:'none', resize:'vertical' }} />
          </div>

          <MediaInput files={mediaFiles} urls={mediaUrls} onFilesChange={setMediaFiles} onUrlsChange={setMediaUrls} />

          <ProfileSelector
            profiles={profiles} loadingProfiles={loadingProfiles}
            selectedProfileIds={selectedProfileIds} onToggle={toggleProfile}
            placements={placements} onPlacementChange={(pid,val)=>setPlacements(p=>({...p,[pid]:val}))}
            loadedPlacements={loadedPlacements} onPlacementLoaded={(pid,list)=>setLoadedPlacements(p=>({...p,[pid]:list}))}
            groupId={groupId}
            platformParams={platformParams}
            onPlatformParamChange={(pid,pp)=>setPlatformParams(p=>({...p,[pid]:pp}))}
          />

          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:7 }}>DATE & TIME</label>
            <div style={{ position:'relative' }}>
              <input
                type="datetime-local"
                value={scheduledAt}
                min={minDateTime}
                onChange={e => {
                  const val = e.target.value
                  if (val && isDateInPast(val)) { setError('You cannot schedule a post in the past.') }
                  else { setError(''); setScheduledAt(val) }
                }}
                disabled={isDraft}
                style={{ width:'100%', padding:'11px 14px', boxSizing:'border-box', background:isDraft?'#FEF3C7':'#FFFBF0', border:`1.5px solid ${scheduledAt && isDateInPast(scheduledAt) && !isDraft ? '#fcd5d5' : '#FDE68A'}`, borderRadius:12, color:isDraft?'#D97706':'#1C1200', fontSize:13, fontFamily:'inherit', outline:'none', cursor:isDraft?'not-allowed':'text', transition:'all 0.2s' }}
              />
              {!isDraft && scheduledAt && !isDateInPast(scheduledAt) && (
                <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#16a34a' }} />
                  <span style={{ fontSize:11, color:'#16a34a', fontWeight:500 }}>Scheduled for {new Date(scheduledAt).toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding:'13px 16px', borderRadius:13, background:isDraft?'#FEF3C7':'#FFFBF0', border:`1.5px solid ${isDraft?'#FCD34D':'#FDE68A'}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, cursor:'pointer', transition:'all 0.2s' }} onClick={()=>setIsDraft(v=>!v)}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:isDraft?'#D97706':'#B45309', marginBottom:2 }}>Save as Draft</div>
              <div style={{ fontSize:11, color:'#D97706', fontWeight:500 }}>Won't publish — edit and schedule later</div>
            </div>
            <div style={{ width:38, height:22, borderRadius:100, background:isDraft?'rgba(217,119,6,0.25)':'#FEF3C7', border:`1.5px solid ${isDraft?'#D97706':'#FCD34D'}`, position:'relative', transition:'all 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:3, left:isDraft?17:3, width:14, height:14, borderRadius:'50%', background:isDraft?'#D97706':'#FCD34D', transition:'all 0.2s' }} />
            </div>
          </div>

          {error && (
            <div style={{ padding:'11px 14px', borderRadius:11, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', fontSize:12, display:'flex', alignItems:'center', gap:8, fontWeight:500 }}>
              <span style={{ fontSize:14 }}>⚠</span> {error}
            </div>
          )}
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid #FEF3C7', display:'flex', gap:10, justifyContent:'flex-end', background:'#FFFBF0' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:11, background:'#ffffff', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || (!isDraft && scheduledAt && isDateInPast(scheduledAt))} style={{ padding:'10px 26px', borderRadius:11, background: isDraft ? 'linear-gradient(135deg,#FEF3C7,#FDE68A)' : scheduledAt ? 'linear-gradient(135deg,#D97706,#B45309)' : 'linear-gradient(135deg,#4ade80,#16a34a)', border: isDraft ? '1.5px solid #FCD34D' : 'none', color: isDraft ? '#B45309' : '#ffffff', fontSize:13, fontWeight:700, cursor:(saving||(!isDraft&&scheduledAt&&isDateInPast(scheduledAt)))?'not-allowed':'pointer', fontFamily:'inherit', opacity:(saving||(!isDraft&&scheduledAt&&isDateInPast(scheduledAt)))?0.5:1, display:'flex', alignItems:'center', gap:7, transition:'opacity 0.2s', boxShadow: isDraft?'none':'0 4px 14px rgba(217,119,6,0.35)' }}>
            {saving ? <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #ffffff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Saving…</> : isDraft ? '◻ Save Draft' : scheduledAt ? '⏰ Schedule Post' : '⚡ Publish Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ post, groupId, onClose, onSaved, onDelete }) {
  const [body, setBody]                     = useState(post.body||'')
  const [scheduledAt, setScheduledAt]       = useState(post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0,16) : '')
  const [mediaFiles, setMediaFiles]         = useState([])
  const [mediaUrls, setMediaUrls]           = useState((post.media||[]).map(m=>m.source_url||m.url||'').filter(Boolean).join('\n'))
  const [publishNow, setPublishNow]         = useState(false)
  const [saving, setSaving]                 = useState(false)
  const [error, setError]                   = useState('')
  const [profiles, setProfiles]             = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [selectedProfileIds, setSelectedProfileIds] = useState([])
  const [placements, setPlacements]         = useState({})
  const [loadedPlacements, setLoadedPlacements] = useState({})
  const [platformParams, setPlatformParams] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isDraft     = post.draft === true || post.status === 'draft' || post.status === 'pending'
  const isScheduled = post.status === 'scheduled'
  const minDateTime = getNowLocalISO()

  useEffect(() => {
    fetch(`/api/profiles?groupId=${groupId}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setProfiles(list)
        if (post.platforms?.length > 0) {
          const currentPlatformNames = post.platforms.map(pl=>pl.platform)
          const matchedIds = list.filter(p=>currentPlatformNames.includes(p.platform)).map(p=>p.id)
          setSelectedProfileIds(matchedIds)
          const initParams = {}
          matchedIds.forEach(pid => {
            const profile = list.find(p=>p.id===pid)
            if (!profile) return
            const defaults = PLATFORM_DEFAULTS[profile.platform] || {}
            const existingPl = post.platforms.find(pl=>pl.platform===profile.platform)
            initParams[pid] = { ...defaults, ...(existingPl?.params || {}) }
          })
          setPlatformParams(initParams)
        }
      })
      .catch(()=>{})
      .finally(()=>setLoadingProfiles(false))
  }, [groupId])

  function toggleProfile(profileId, forceRemove=false) {
    if (forceRemove) {
      setPlacements(p=>{const n={...p};delete n[profileId];return n})
      setLoadedPlacements(p=>{const n={...p};delete n[profileId];return n})
      setPlatformParams(p=>{const n={...p};delete n[profileId];return n})
      setSelectedProfileIds(prev=>prev.filter(id=>id!==profileId))
      return
    }
    toggleProfileWithDefaults(profileId, profiles, setSelectedProfileIds, setPlacements, setLoadedPlacements, setPlatformParams)
  }

  function resolvePlacementId(pid) {
    const val = placements[pid]; if (val==='__personal__') return null; return val||null
  }

  function buildPlatformsPayload() {
    const result = {}
    selectedProfileIds.forEach(pid => {
      const profile = profiles.find(p=>p.id===pid); if (!profile) return
      const defaults = PLATFORM_DEFAULTS[profile.platform] || {}
      const pp = { ...defaults, ...(platformParams[pid]||{}) }
      const placementId = resolvePlacementId(pid)
      const entry = { ...pp }
      if (profile.platform==='facebook' && placementId) entry.page_id = placementId
      if (profile.platform==='pinterest' && placementId) entry.board_id = placementId
      if (profile.platform==='linkedin' && placementId!==null) entry.organization_id = placementId
      if (Object.keys(entry).length > 0) result[profile.platform] = entry
    })
    return result
  }

  async function handleSave() {
    setSaving(true); setError('')
    if (!publishNow && scheduledAt && isDateInPast(scheduledAt)) {
      setError('Scheduled time cannot be in the past. Please pick a future time.')
      setSaving(false); return
    }
    try {
      const urlList = mediaUrls.split('\n').map(s=>s.trim()).filter(Boolean)
      const platformsPayload = buildPlatformsPayload()

      if (mediaFiles.length > 0) {
        const fd = new FormData()
        fd.append('groupId', groupId)
        if (body!==post.body) fd.append('post[body]', body)
        if (scheduledAt && !publishNow) fd.append('post[scheduled_at]', scheduledAt)
        if (publishNow) { fd.append('post[scheduled_at]',''); fd.append('post[draft]','false') }
        selectedProfileIds.forEach(pid=>fd.append('profiles[]',pid))
        mediaFiles.forEach(f=>fd.append('media[]',f,f.name))
        urlList.forEach(u=>fd.append('media[]',u))
        Object.entries(platformsPayload).forEach(([plat,pp])=>{
          Object.entries(pp).forEach(([k,v])=>{
            if (v!==undefined && v!=='') fd.append(`platforms[${plat}][${k}]`,String(v))
          })
        })
        const res = await fetch(`/api/posts/${post.id}`, { method:'PATCH', body:fd })
        const data = await res.json()
        if (!res.ok) { setError(data.error||'Failed to update'); return }
      } else {
        const payload = {
          groupId,
          post: { body, ...(scheduledAt&&!publishNow&&{scheduled_at:scheduledAt}), ...(publishNow&&{scheduled_at:null,draft:false}) },
          ...(selectedProfileIds.length>0&&{profiles:selectedProfileIds}),
          ...(Object.keys(platformsPayload).length>0&&{platforms:platformsPayload}),
          ...(urlList.length>0?{media:urlList}:(mediaFiles.length===0&&{media:[]})),
        }
        const res = await fetch(`/api/posts/${post.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
        const data = await res.json()
        if (!res.ok) { setError(data.error||'Failed to update'); return }
      }
      if (publishNow && isDraft) {
        const pRes = await fetch(`/api/posts/${post.id}/publish?groupId=${groupId}`, { method:'POST' })
        const pData = await pRes.json()
        if (!pRes.ok) { setError(pData.error||'Publish failed'); return }
      }
      onSaved()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirmModal
          post={post}
          groupId={groupId}
          onClose={() => setShowDeleteConfirm(false)}
          onDeleted={() => { setShowDeleteConfirm(false); onDelete() }}
        />
      )}
      <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(255,251,240,0.75)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'fadeIn 0.18s ease' }} onClick={e=>e.target===e.currentTarget&&onClose()}>
        <div style={{ width:'100%', maxWidth:640, background:'#ffffff', border:'1.5px solid #FCD34D', borderRadius:24, boxShadow:'0 40px 80px rgba(217,119,6,0.15)', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px 18px', borderBottom:'1px solid #FEF3C7', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#FFFBF0,#ffffff)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'#FEF3C7', border:'1.5px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>✎</div>
              <div>
                <h2 style={{ fontSize:16, fontWeight:800, color:'#1C1200', margin:0 }}>{isDraft?'Edit Draft':'Edit Scheduled Post'}</h2>
                <div style={{ marginTop:3 }}><StatusBadge status={post.status} isDraft={post.draft} /></div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => setShowDeleteConfirm(true)} style={{ padding:'6px 13px', borderRadius:9, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>🗑 Delete</button>
              <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
          </div>

          <div style={{ padding:'20px 24px', maxHeight:'72vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:7 }}>CONTENT</label>
              <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} style={{ width:'100%', padding:'12px 14px', boxSizing:'border-box', background:'#FFFBF0', border:'1.5px solid #FDE68A', borderRadius:12, color:'#1C1200', fontSize:14, fontFamily:'inherit', lineHeight:1.6, outline:'none', resize:'vertical' }} />
            </div>

            <MediaInput files={mediaFiles} urls={mediaUrls} onFilesChange={setMediaFiles} onUrlsChange={setMediaUrls} label="MEDIA — replaces existing" />

            {post.media?.length > 0 && (
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:7 }}>CURRENT MEDIA</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {post.media.map((m,i) => (
                    <div key={i} style={{ padding:'6px 12px', borderRadius:8, fontSize:11, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
                      <span style={{ fontSize:12 }}>🖼</span>
                      <span>{m.content_type||'media'}</span>
                      <StatusBadge status={m.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProfileSelector
              profiles={profiles} loadingProfiles={loadingProfiles}
              selectedProfileIds={selectedProfileIds} onToggle={toggleProfile}
              placements={placements} onPlacementChange={(pid,val)=>setPlacements(p=>({...p,[pid]:val}))}
              loadedPlacements={loadedPlacements} onPlacementLoaded={(pid,list)=>setLoadedPlacements(p=>({...p,[pid]:list}))}
              groupId={groupId}
              platformParams={platformParams}
              onPlatformParamChange={(pid,pp)=>setPlatformParams(p=>({...p,[pid]:pp}))}
            />

            <div>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color:'#B45309', display:'block', marginBottom:7 }}>
                SCHEDULE {isScheduled && post.scheduled_at && <span style={{ fontWeight:500, color:'#D97706', fontSize:10 }}>— current: {new Date(post.scheduled_at).toLocaleString()}</span>}
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                min={minDateTime}
                onChange={e => {
                  const val = e.target.value
                  if (val && isDateInPast(val)) { setError('You cannot schedule a post in the past.') }
                  else { setError(prev => prev.includes('past') ? '' : prev); setScheduledAt(val) }
                }}
                disabled={publishNow}
                style={{ width:'100%', padding:'11px 14px', boxSizing:'border-box', background:publishNow?'#FEF3C7':'#FFFBF0', border:`1.5px solid ${scheduledAt&&isDateInPast(scheduledAt)&&!publishNow?'#fcd5d5':'#FDE68A'}`, borderRadius:12, color:publishNow?'#D97706':'#1C1200', fontSize:13, fontFamily:'inherit', outline:'none', cursor:publishNow?'not-allowed':'text', transition:'all 0.2s' }}
              />
            </div>

            {isDraft && (
              <div style={{ padding:'13px 16px', borderRadius:13, background:'#f0fdf4', border:'1.5px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#16a34a', marginBottom:2 }}>Publish after saving?</div>
                  <div style={{ fontSize:11, color:'#86efac', fontWeight:500 }}>Will publish immediately to all selected platforms</div>
                </div>
                <div onClick={()=>setPublishNow(v=>!v)} style={{ width:38, height:22, borderRadius:100, cursor:'pointer', background:publishNow?'rgba(22,163,74,0.25)':'#d1fae5', border:`1.5px solid ${publishNow?'#16a34a':'#86efac'}`, position:'relative', transition:'all 0.2s', flexShrink:0 }}>
                  <div style={{ position:'absolute', top:3, left:publishNow?17:3, width:14, height:14, borderRadius:'50%', background:publishNow?'#16a34a':'#6ee7b7', transition:'all 0.2s' }} />
                </div>
              </div>
            )}

            {error && (
              <div style={{ padding:'11px 14px', borderRadius:11, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', fontSize:12, display:'flex', alignItems:'center', gap:8, fontWeight:500 }}>
                <span style={{ fontSize:14 }}>⚠</span> {error}
              </div>
            )}
          </div>

          <div style={{ padding:'16px 24px', borderTop:'1px solid #FEF3C7', display:'flex', gap:10, justifyContent:'flex-end', background:'#FFFBF0' }}>
            <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:11, background:'#ffffff', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving||(!publishNow&&scheduledAt&&isDateInPast(scheduledAt))} style={{ padding:'10px 26px', borderRadius:11, background: publishNow?'linear-gradient(135deg,#4ade80,#16a34a)':scheduledAt?'linear-gradient(135deg,#D97706,#B45309)':'linear-gradient(135deg,#F59E0B,#D97706)', border:'none', color:'#ffffff', fontSize:13, fontWeight:700, cursor:(saving||(!publishNow&&scheduledAt&&isDateInPast(scheduledAt)))?'not-allowed':'pointer', fontFamily:'inherit', opacity:(saving||(!publishNow&&scheduledAt&&isDateInPast(scheduledAt)))?0.5:1, display:'flex', alignItems:'center', gap:7, transition:'opacity 0.2s', boxShadow:'0 4px 14px rgba(217,119,6,0.35)' }}>
              {saving ? <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #ffffff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Saving…</> : publishNow ? '⚡ Save & Publish' : scheduledAt ? '⏰ Save & Schedule' : '✓ Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function DayPanel({ date, posts, onClose, onEdit, onSchedule, onDelete, isPast }) {
  const label = date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
  return (
    <div style={{ position:'fixed', inset:0, zIndex:900, background:'rgba(255,251,240,0.6)', backdropFilter:'blur(10px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:'100%', maxWidth:640, maxHeight:'80vh', background:'#ffffff', border:'1.5px solid #FDE68A', borderTop:'1.5px solid #FCD34D', borderRadius:'22px 22px 0 0', overflow:'hidden', animation:'slideUp 0.22s ease', display:'flex', flexDirection:'column', boxShadow:'0 -8px 40px rgba(217,119,6,0.12)' }}>
        <div style={{ padding:'18px 22px 14px', borderBottom:'1px solid #FEF3C7', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#FFFBF0,#ffffff)' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'#1C1200' }}>{label}</div>
            <div style={{ fontSize:12, color:'#B45309', marginTop:2, fontWeight:500 }}>
              {posts.length} post{posts.length!==1?'s':''}
              {isPast && <span style={{ marginLeft:8, fontSize:10, color:'#dc2626', background:'#fef2f2', border:'1.5px solid #fcd5d5', padding:'2px 7px', borderRadius:5, fontWeight:700 }}>PAST DATE</span>}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {!isPast && (
              <button onClick={()=>{onClose();onSchedule(date)}} style={{ padding:'7px 14px', borderRadius:9, fontSize:12, fontWeight:600, background:'#FEF3C7', border:'1.5px solid #FCD34D', color:'#D97706', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>⏰ Schedule here</button>
            )}
            {isPast && posts.length === 0 && (
              <span style={{ fontSize:11, color:'#dc2626', fontStyle:'italic', fontWeight:500 }}>Can't schedule past dates</span>
            )}
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        </div>
        <div style={{ overflowY:'auto', flex:1, padding:'12px 16px', display:'flex', flexDirection:'column', gap:10 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'44px 24px' }}>
              <div style={{ fontSize:32, marginBottom:10, opacity:0.25 }}>📅</div>
              <p style={{ fontSize:14, color:'#B45309', margin:'0 0 4px', fontWeight:600 }}>No posts on this day</p>
              {isPast
                ? <p style={{ fontSize:12, color:'#dc2626', margin:0, fontWeight:500 }}>Past dates cannot be scheduled</p>
                : <p style={{ fontSize:12, color:'#D97706', margin:0 }}>Click "Schedule here" to create one</p>
              }
            </div>
          ) : posts.map(post => {
            const canEdit = isPostEditable(post)
            return (
              <div key={post.id} style={{ padding:'14px 16px', borderRadius:14, background:'#FFFBF0', border:'1.5px solid #FEF3C7' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
                  <p style={{ fontSize:13, color:'#1C1200', margin:0, lineHeight:1.6, flex:1, fontWeight:500 }}>
                    {post.body || <em style={{ color:'#D97706' }}>Media-only post</em>}
                  </p>
                  <div style={{ display:'flex', gap:7, alignItems:'center', flexShrink:0 }}>
                    <StatusBadge status={post.status} isDraft={post.draft} />
                    {canEdit && (
                      <>
                        <button onClick={()=>{onEdit(post);onClose()}} style={{ padding:'4px 10px', borderRadius:7, fontSize:11, fontWeight:600, background:'#FEF3C7', border:'1.5px solid #FCD34D', color:'#D97706', cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                        <button onClick={()=>onDelete(post)} style={{ padding:'4px 9px', borderRadius:7, fontSize:11, fontWeight:600, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', cursor:'pointer', fontFamily:'inherit' }}>🗑</button>
                      </>
                    )}
                  </div>
                </div>
                {post.platforms?.length>0 && (
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {post.platforms.map(pl => {
                      const info = getPlatformInfo(pl.platform)
                      return (
                        <div key={pl.platform} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:100, background:info.color+'0d', border:`1.5px solid ${info.color}30` }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:info.color }} />
                          <span style={{ fontSize:10, fontWeight:600, color:'#1C1200' }}>{info.label}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {post.scheduled_at && <div style={{ marginTop:8, fontSize:11, color:'#D97706', fontWeight:500 }}>⏰ {new Date(post.scheduled_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CalendarView({ posts, onEdit, onSchedule, onDelete }) {
  const today = new Date()
  const [calYear, setCalYear]   = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [dayPanel, setDayPanel] = useState(null)

  const firstDay  = new Date(calYear, calMonth, 1)
  const lastDay   = new Date(calYear, calMonth+1, 0)
  const startDow  = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const postsByDate = {}
  posts.forEach(post => {
    const d = post.scheduled_at ? new Date(post.scheduled_at) : (post.created_at ? new Date(post.created_at) : null)
    if (!d) return
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!postsByDate[key]) postsByDate[key] = []
    postsByDate[key].push(post)
  })

  function prevMonth() { if (calMonth===0) { setCalYear(y=>y-1); setCalMonth(11) } else setCalMonth(m=>m-1) }
  function nextMonth() { if (calMonth===11) { setCalYear(y=>y+1); setCalMonth(0) } else setCalMonth(m=>m+1) }

  const canGoPrev = !(calYear===today.getFullYear() && calMonth===today.getMonth())

  const cells = []
  for (let i=0; i<startDow; i++) cells.push(null)
  for (let d=1; d<=totalDays; d++) cells.push(d)

  return (
    <>
      {dayPanel !== null && (
        <DayPanel
          date={new Date(calYear, calMonth, dayPanel)}
          posts={postsByDate[`${calYear}-${calMonth}-${dayPanel}`]||[]}
          onClose={()=>setDayPanel(null)}
          onEdit={onEdit}
          onSchedule={(date)=>{setDayPanel(null);onSchedule(date)}}
          onDelete={(post)=>{setDayPanel(null);onDelete(post)}}
          isPast={isDayInPast(calYear, calMonth, dayPanel)}
        />
      )}
      <div style={{ background:'#ffffff', border:'1.5px solid #FDE68A', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 16px rgba(217,119,6,0.07)' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid #FEF3C7', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#FFFBF0,#ffffff)' }}>
          <button onClick={prevMonth} disabled={!canGoPrev} style={{ width:34, height:34, borderRadius:10, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:canGoPrev?'#B45309':'#FCD34D', cursor:canGoPrev?'pointer':'not-allowed', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:800, color:'#1C1200' }}>{MONTH_NAMES[calMonth]} {calYear}</div>
            <div style={{ fontSize:10, color:'#B45309', marginTop:2, fontWeight:600 }}>
              {posts.filter(p=>{ const d=p.scheduled_at?new Date(p.scheduled_at):null; return d && d.getMonth()===calMonth && d.getFullYear()===calYear }).length} posts this month
            </div>
          </div>
          <button onClick={nextMonth} style={{ width:34, height:34, borderRadius:10, background:'#FFFBF0', border:'1.5px solid #FDE68A', color:'#B45309', cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid #FEF3C7', background:'#FFFBF0' }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:10, fontWeight:800, letterSpacing:'0.06em', color:'#D97706' }}>{d}</div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} style={{ minHeight:82, borderRight:'1px solid #FEF3C7', borderBottom:'1px solid #FEF3C7', background:'#FFFDF5' }} />
            const key = `${calYear}-${calMonth}-${day}`
            const dayPosts = postsByDate[key] || []
            const isToday = today.getDate()===day && today.getMonth()===calMonth && today.getFullYear()===calYear
            const past = isDayInPast(calYear, calMonth, day)

            return (
              <div
                key={day}
                onClick={() => setDayPanel(day)}
                className={past ? 'cal-day-past' : 'cal-day-hover'}
                style={{ minHeight:82, padding:'8px 6px', borderRight:'1px solid #FEF3C7', borderBottom:'1px solid #FEF3C7', cursor:'pointer', background: isToday ? '#FEF3C7' : past ? '#FFFDF5' : '#ffffff', position:'relative', transition:'background 0.15s', opacity: past && dayPosts.length===0 ? 0.5 : 1 }}
              >
                <div style={{ width:24, height:24, borderRadius:'50%', marginBottom:5, background: isToday ? '#D97706' : 'transparent', border: isToday ? 'none' : '1.5px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:isToday?800:500, color: isToday ? '#ffffff' : past ? '#FCD34D' : '#1C1200' }}>{day}</div>

                {past && dayPosts.length===0 && (
                  <div style={{ position:'absolute', bottom:6, right:6, width:14, height:14, borderRadius:'50%', background:'#fef2f2', border:'1.5px solid #fcd5d5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#dc2626' }}>✕</div>
                )}
                {!past && dayPosts.length===0 && (
                  <div className="cal-add-hint" style={{ position:'absolute', bottom:6, right:6, width:16, height:16, borderRadius:'50%', background:'#FEF3C7', border:'1.5px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#D97706', opacity:0, transition:'opacity 0.15s' }}>+</div>
                )}

                {dayPosts.slice(0,3).map((post,i) => {
                  const ds = displayStatus(post)
                  const cfg = STATUS_CONFIG[ds] || STATUS_CONFIG.processing
                  const short = (post.body||'Media').slice(0,16)
                  return (
                    <div key={i} style={{ marginBottom:2, padding:'2px 5px', borderRadius:4, background:cfg.calColor+'15', borderLeft:`2px solid ${cfg.calColor}`, fontSize:9, color:cfg.calColor, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.5, fontWeight:600 }}>
                      {short}{post.body?.length>16?'…':''}
                    </div>
                  )
                })}
                {dayPosts.length>3 && <div style={{ fontSize:9, color:'#B45309', paddingLeft:2, marginTop:1, fontWeight:600 }}>+{dayPosts.length-3} more</div>}
              </div>
            )
          })}
        </div>

        <div style={{ padding:'12px 22px', borderTop:'1px solid #FEF3C7', display:'flex', gap:16, flexWrap:'wrap', alignItems:'center', background:'#FFFBF0' }}>
          {[
            { label:'Published', color:STATUS_CONFIG.published.calColor },
            { label:'Scheduled', color:STATUS_CONFIG.scheduled.calColor },
            { label:'Draft',     color:STATUS_CONFIG.draft.calColor },
            { label:'Failed',    color:STATUS_CONFIG.failed.calColor },
          ].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:l.color+'25', borderLeft:`2px solid ${l.color}` }} />
              <span style={{ fontSize:10, color:'#B45309', fontWeight:700, letterSpacing:'0.04em' }}>{l.label}</span>
            </div>
          ))}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#fef2f2', border:'1.5px solid #fcd5d5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:6, color:'#dc2626' }}>✕</div>
            <span style={{ fontSize:10, color:'#dc2626', fontWeight:700, letterSpacing:'0.04em', opacity:0.7 }}>Past (no scheduling)</span>
          </div>
          <div style={{ marginLeft:'auto', fontSize:10, color:'#D97706', fontStyle:'italic', fontWeight:500 }}>Click any day to view or schedule</div>
        </div>
      </div>
    </>
  )
}

function ListView({ posts, onEdit, onDelete }) {
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  const normalizedPosts = posts.map(p => ({ ...p, _displayStatus: displayStatus(p) }))
  const statuses = ['all', ...new Set(normalizedPosts.map(p => p._displayStatus))]
  const filtered = filter==='all' ? normalizedPosts : normalizedPosts.filter(p => p._displayStatus === filter)

  return (
    <div>
      {statuses.length > 1 && (
        <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:16 }}>
          {statuses.map(s => {
            const cnt = s==='all' ? normalizedPosts.length : normalizedPosts.filter(p=>p._displayStatus===s).length
            return (
              <button key={s} onClick={()=>setFilter(s)} style={{ padding:'5px 13px', borderRadius:100, background:filter===s?'#FEF3C7':'#ffffff', border:`1.5px solid ${filter===s?'#FCD34D':'#FDE68A'}`, color:filter===s?'#D97706':'#B45309', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize', letterSpacing:'0.02em', boxShadow:filter===s?'0 2px 8px rgba(217,119,6,0.1)':'none' }}>
                {s==='all'?'All':s} <span style={{ opacity:0.6 }}>({cnt})</span>
              </button>
            )
          })}
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length===0 ? (
          <div style={{ textAlign:'center', padding:'56px 24px', background:'#ffffff', border:'1.5px solid #FDE68A', borderRadius:18, boxShadow:'0 2px 12px rgba(217,119,6,0.05)' }}>
            <div style={{ fontSize:36, marginBottom:12, opacity:0.2 }}>▤</div>
            <p style={{ fontSize:15, fontWeight:700, color:'#B45309', marginBottom:4 }}>No posts</p>
            <p style={{ fontSize:12, color:'#D97706' }}>Head to Compose to create your first post</p>
          </div>
        ) : filtered.map(post => {
          const isExp   = expanded===post.id
          const canEdit = isPostEditable(post)
          const ds      = post._displayStatus
          const cfg     = STATUS_CONFIG[ds] || STATUS_CONFIG.processing
          return (
            <div key={post.id} style={{ background:'#ffffff', border:'1.5px solid #FDE68A', borderRadius:14, overflow:'hidden', transition:'border-color 0.15s, box-shadow 0.15s', boxShadow:'0 2px 8px rgba(217,119,6,0.04)' }} className="list-post-card">
              <div onClick={()=>setExpanded(isExp?null:post.id)} style={{ padding:'14px 18px', cursor:'pointer', display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:3, borderRadius:3, alignSelf:'stretch', flexShrink:0, background:cfg.calColor, minHeight:36 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, color:'#1C1200', margin:0, lineHeight:1.6, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:isExp?'unset':2, WebkitBoxOrient:'vertical', fontWeight:500 }}>
                      {post.body || <em style={{ color:'#D97706' }}>Media-only post</em>}
                    </p>
                    {post.media?.length>0 && <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:5 }}><span style={{ fontSize:10, color:'#B45309' }}>🖼</span><span style={{ fontSize:10, color:'#B45309', fontWeight:500 }}>{post.media.length} media</span></div>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                    <StatusBadge status={post.status} isDraft={post.draft} />
                    {canEdit && (
                      <>
                        <button onClick={e=>{e.stopPropagation();onEdit(post)}} style={{ padding:'4px 10px', borderRadius:7, fontSize:11, fontWeight:600, background:'#FEF3C7', border:'1.5px solid #FCD34D', color:'#D97706', cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                        <button onClick={e=>{e.stopPropagation();onDelete(post)}} style={{ padding:'4px 9px', borderRadius:7, fontSize:11, fontWeight:600, background:'#fef2f2', border:'1.5px solid #fcd5d5', color:'#dc2626', cursor:'pointer', fontFamily:'inherit' }}>🗑</button>
                      </>
                    )}
                    <span style={{ fontSize:11, color:'#D97706', transform:isExp?'rotate(180deg)':'none', transition:'transform 0.2s', lineHeight:1 }}>▾</span>
                  </div>
                </div>
                {post.scheduled_at && (
                  <div style={{ paddingLeft:15 }}>
                    <span style={{ fontSize:10, color:'#D97706', background:'rgba(217,119,6,0.08)', border:'1.5px solid rgba(217,119,6,0.2)', padding:'2px 9px', borderRadius:100, display:'inline-flex', alignItems:'center', gap:4, fontWeight:600 }}>
                      ⏰ {new Date(post.scheduled_at).toLocaleString()}
                    </span>
                  </div>
                )}
                {post.platforms?.length>0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, paddingLeft:15 }}>
                    {post.platforms.map(pl => {
                      const info = getPlatformInfo(pl.platform)
                      return (
                        <div key={pl.platform} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:100, background:info.color+'0d', border:`1.5px solid ${info.color}30` }}>
                          <span style={{ width:4, height:4, borderRadius:'50%', background:info.color }} />
                          <span style={{ fontSize:10, fontWeight:700, color:'#1C1200' }}>{info.label}</span>
                          <StatusBadge status={pl.status} />
                          {pl.permalink && <a href={pl.permalink} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ color:'#D97706', textDecoration:'none', fontSize:11, fontWeight:600 }}>↗</a>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {isExp && (
                <div style={{ borderTop:'1px solid #FEF3C7', padding:'12px 18px', background:'#FFFBF0', display:'flex', gap:24, flexWrap:'wrap', animation:'fadeIn 0.15s ease' }}>
                  {[
                    { label:'STATUS',    content:<StatusBadge status={post.status} isDraft={post.draft} /> },
                    post.scheduled_at && { label:'SCHEDULED', content:<span style={{ fontSize:12, color:'#D97706', fontWeight:600 }}>{new Date(post.scheduled_at).toLocaleString()}</span> },
                    post.created_at   && { label:'CREATED',   content:<span style={{ fontSize:12, color:'#B45309', fontWeight:500 }}>{new Date(post.created_at).toLocaleString()}</span> },
                  ].filter(Boolean).map((item,i) => (
                    <div key={i}>
                      <div style={{ fontSize:9, fontWeight:800, letterSpacing:'0.12em', color:'#D97706', marginBottom:5 }}>{item.label}</div>
                      {item.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PostsPage() {
  const { selectedGroup } = useContext(DashboardContext)
  const [posts, setPosts]               = useState([])
  const [loading, setLoading]           = useState(false)
  const [editPost, setEditPost]         = useState(null)
  const [scheduleDate, setScheduleDate] = useState(null)
  const [deletePost, setDeletePost]     = useState(null)
  const [view, setView]                 = useState('calendar')

  const fetchPosts = useCallback(async (groupId) => {
    setLoading(true)
    const res  = await fetch(`/api/posts?groupId=${groupId}&per_page=50`)
    const data = await res.json()
    setPosts(data?.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!selectedGroup) return
    setPosts([])
    fetchPosts(selectedGroup.id)
  }, [selectedGroup?.id])

  if (!selectedGroup) return null

  const draftCount     = posts.filter(p => p.draft === true || p.status === 'draft' || p.status === 'pending').length
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length
  const publishedCount = posts.filter(p => p.status === 'published' || p.status === 'processed').length

  function handleDeletePost(post) {
    setEditPost(null)
    setDeletePost(post)
  }

  return (
    <div style={{ animation:'fadeIn 0.25s ease', background:'#FFFBF0', minHeight:'100%', padding:2 }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0}100%{background-position:400% 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .sk { background:linear-gradient(90deg,#FEF3C7 0%,#FDE68A 50%,#FEF3C7 100%); background-size:400% 100%; animation:shimmer 2s ease infinite; }
        .cal-day-hover:hover { background:#FFFBEB !important; }
        .cal-day-hover:hover .cal-add-hint { opacity:1 !important; }
        .cal-day-past { cursor:pointer; }
        .cal-day-past:hover { background:#FFFDF5 !important; }
        .vtab { transition:all 0.15s ease; }
        .vtab:hover { color:#D97706 !important; border-color:#FCD34D !important; }
        .refresh-btn-posts { transition: all 0.15s ease; }
        .refresh-btn-posts:hover { border-color:#D97706 !important; color:#D97706 !important; background:#FEF3C7 !important; }
        .list-post-card:hover { border-color:#FCD34D !important; box-shadow:0 4px 16px rgba(217,119,6,0.1) !important; }
      `}</style>

      {editPost && (
        <EditModal
          post={editPost}
          groupId={selectedGroup.id}
          onClose={()=>setEditPost(null)}
          onSaved={()=>{setEditPost(null);fetchPosts(selectedGroup.id)}}
          onDelete={handleDeletePost}
        />
      )}
      {scheduleDate && (
        <ScheduleModal
          date={scheduleDate}
          groupId={selectedGroup.id}
          onClose={()=>setScheduleDate(null)}
          onSaved={()=>{setScheduleDate(null);fetchPosts(selectedGroup.id)}}
        />
      )}
      {deletePost && (
        <DeleteConfirmModal
          post={deletePost}
          groupId={selectedGroup.id}
          onClose={()=>setDeletePost(null)}
          onDeleted={()=>{setDeletePost(null);fetchPosts(selectedGroup.id)}}
        />
      )}

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', border:'1.5px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>▤</div>
            <h1 style={{ fontSize:26, fontWeight:900, color:'#1C1200', letterSpacing:'-0.03em', margin:0 }}>Posts</h1>
          </div>
          <p style={{ fontSize:12, color:'#B45309', margin:0, fontWeight:500 }}>
            {posts.length} posts in <span style={{ color:'#D97706', fontWeight:700 }}>{selectedGroup.name}</span>
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', gap:3, background:'#ffffff', border:'1.5px solid #FDE68A', borderRadius:11, padding:3 }}>
            {[{id:'calendar',icon:'▦',label:'Calendar'},{id:'list',icon:'≡',label:'List'}].map(v => (
              <button key={v.id} className="vtab" onClick={()=>setView(v.id)} style={{ padding:'7px 15px', borderRadius:8, fontSize:12, fontWeight:700, background:view===v.id?'#FEF3C7':'transparent', border:view===v.id?'1.5px solid #FCD34D':'1.5px solid transparent', color:view===v.id?'#D97706':'#B45309', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}><span>{v.icon}</span> {v.label}</button>
            ))}
          </div>
          <button
            className="refresh-btn-posts"
            onClick={()=>fetchPosts(selectedGroup.id)}
            style={{ display:'flex', alignItems:'center', gap:5, background:'#ffffff', border:'1.5px solid #FDE68A', borderRadius:11, padding:'9px 15px', fontSize:12, color:'#B45309', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}
          >
            <span style={{ fontSize:13 }}>↻</span> Refresh
          </button>
        </div>
      </div>

      {!loading && posts.length>0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:22 }}>
          {[
            { label:'DRAFTS',    count:draftCount,     color:'#B45309', bg:'#ffffff', border:'#FDE68A', grad:'linear-gradient(135deg,#D97706,#B45309)' },
            { label:'SCHEDULED', count:scheduledCount, color:'#D97706', bg:'#ffffff', border:'#FCD34D', grad:'linear-gradient(135deg,#F59E0B,#D97706)' },
            { label:'PUBLISHED', count:publishedCount, color:'#16a34a', bg:'#ffffff', border:'#bbf7d0', grad:'linear-gradient(135deg,#4ade80,#16a34a)' },
          ].map(s => (
            <div key={s.label} style={{ padding:'20px 18px', borderRadius:15, background:s.bg, border:`1.5px solid ${s.border}`, position:'relative', overflow:'hidden', boxShadow:'0 2px 12px rgba(217,119,6,0.06)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.grad, borderRadius:'15px 15px 0 0' }} />
              <span style={{ fontSize:28, fontWeight:900, color:s.color, letterSpacing:'-0.04em', lineHeight:1, display:'block', marginBottom:6 }}>{s.count}</span>
              <span style={{ fontSize:10, fontWeight:800, color:'#D97706', letterSpacing:'0.08em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="sk" style={{ height:440, borderRadius:20 }} />
        </div>
      ) : view==='calendar' ? (
        <CalendarView posts={posts} onEdit={setEditPost} onSchedule={(date)=>setScheduleDate(date)} onDelete={handleDeletePost} />
      ) : (
        <ListView posts={posts} onEdit={setEditPost} onDelete={handleDeletePost} />
      )}
    </div>
  )
}