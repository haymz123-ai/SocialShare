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
const getPlatformInfo = id => PLATFORMS.find(p => p.id === id) || { label: id, color: '#FFD700' }

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/mpeg'

const PLATFORM_FORMATS = {
  instagram: [
    { value: 'post',  label: 'Feed Post', icon: '🖼' },
    { value: 'reel',  label: 'Reel',      icon: '🎬' },
    { value: 'story', label: 'Story',     icon: '⭕' },
  ],
  facebook: [
    { value: 'post',  label: 'Feed Post', icon: '📝' },
    { value: 'reel',  label: 'Reel',      icon: '🎬' },
    { value: 'story', label: 'Story',     icon: '⭕' },
  ],
  tiktok: [
    { value: 'video', label: 'Video',  icon: '🎬' },
    { value: 'image', label: 'Images', icon: '🖼' },
  ],
  youtube: [
    { value: 'post', label: 'Video Upload', icon: '▶' },
  ],
  twitter:   [{ value: 'post', label: 'Tweet',   icon: '🐦' }],
  linkedin:  [{ value: 'post', label: 'Post',     icon: '💼' }],
  threads:   [{ value: 'post', label: 'Thread',   icon: '🧵' }],
  pinterest: [{ value: 'pin',  label: 'Pin',      icon: '📌' }],
}

const TIKTOK_PRIVACY = [
  { value: 'PUBLIC_TO_EVERYONE',    label: 'Everyone' },
  { value: 'MUTUAL_FOLLOW_FRIENDS', label: 'Mutual Followers' },
  { value: 'FOLLOWER_OF_CREATOR',   label: 'Followers Only' },
  { value: 'SELF_ONLY',             label: 'Only Me' },
]

function SectionCard({ title, hint, children, headerRight }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.3)' }}>{title}</span>
          {hint && <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>{hint}</span>}
        </div>
        {headerRight}
      </div>
      <div style={{ padding:'18px 20px' }}>{children}</div>
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

  const label = profile.platform === 'facebook' ? 'Page' : profile.platform === 'pinterest' ? 'Board' : 'Profile'
  const info = getPlatformInfo(profile.platform)

  if (loading) return (
    <div style={{ padding:'10px 16px', fontSize:12, color:'rgba(240,237,232,0.25)', display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:10, height:10, border:'1.5px solid rgba(255,255,255,0.15)', borderTop:`1.5px solid ${info.color}`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      Loading {label.toLowerCase()}s…
    </div>
  )
  if (!placements.length) {
    if (profile.platform === 'facebook') return <div style={{ padding:'10px 16px', fontSize:12, color:'#fbbf24' }}>⚠ No Pages found. Reconnect and grant Page access.</div>
    if (profile.platform === 'pinterest') return <div style={{ padding:'10px 16px', fontSize:12, color:'#f87171' }}>⚠ No boards found.</div>
    return null
  }
  if (placements.length === 1) return (
    <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
      <span style={{ color:'rgba(240,237,232,0.35)' }}>{label}:</span>
      <span style={{ color:'#E8E4DF', fontWeight:600 }}>{placements[0].name}</span>
    </div>
  )
  return (
    <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:12, color:'rgba(240,237,232,0.35)', flexShrink:0 }}>{label}:</span>
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ flex:1, padding:'7px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#E8E4DF', fontSize:12, fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
        <option value="">— Select {label} —</option>
        {placements.map(pl => <option key={pl.id ?? 'p'} value={pl.id !== null ? pl.id : '__personal__'}>{pl.name}</option>)}
      </select>
    </div>
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
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', marginBottom:6 }}>FORMAT</div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {formats.map(f => (
              <button key={f.value} type="button" onClick={() => set('format', f.value)} style={{
                padding:'5px 12px', borderRadius:8, fontSize:11, fontWeight:600,
                background: currentFormat === f.value ? info.color + '18' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${currentFormat === f.value ? info.color + '50' : 'rgba(255,255,255,0.08)'}`,
                color: currentFormat === f.value ? info.color : 'rgba(240,237,232,0.4)',
                cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4,
              }}>{f.icon} {f.label}</button>
            ))}
          </div>
        </div>
      )}
      {platform === 'instagram' && (
        <>
          <InputRow label="First Comment" placeholder="Comment after posting…" value={params.first_comment || ''} onChange={v => set('first_comment', v)} />
          {currentFormat === 'reel' && (
            <InputRow label="Cover URL" placeholder="https://…thumbnail.jpg" value={params.cover_url || ''} onChange={v => set('cover_url', v)} />
          )}
        </>
      )}
      {platform === 'facebook' && currentFormat === 'post' && (
        <InputRow label="First Comment" placeholder="Comment after posting…" value={params.first_comment || ''} onChange={v => set('first_comment', v)} />
      )}
      {platform === 'facebook' && currentFormat === 'reel' && (
        <InputRow label="Reel Title" placeholder="Optional reel title" value={params.title || ''} onChange={v => set('title', v)} />
      )}
      {platform === 'youtube' && (
        <>
          <InputRow label="Video Title" placeholder="My awesome video" value={params.title || ''} onChange={v => set('title', v)} />
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', marginBottom:5 }}>PRIVACY</div>
            <select value={params.privacy_status || 'public'} onChange={e => set('privacy_status', e.target.value)} style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, color:'#E8E4DF', fontSize:12, fontFamily:'inherit', outline:'none', colorScheme:'dark' }}>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
          <InputRow label="Thumbnail URL" placeholder="https://…thumbnail.jpg" value={params.cover_url || ''} onChange={v => set('cover_url', v)} />
          <CheckRow label="Made for Kids" checked={!!params.made_for_kids} onChange={v => set('made_for_kids', v)} />
        </>
      )}
      {platform === 'tiktok' && (
        <>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', marginBottom:5 }}>PRIVACY</div>
            <select value={params.privacy_status || 'PUBLIC_TO_EVERYONE'} onChange={e => set('privacy_status', e.target.value)} style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, color:'#E8E4DF', fontSize:12, fontFamily:'inherit', outline:'none', colorScheme:'dark' }}>
              {TIKTOK_PRIVACY.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <CheckRow label="Disable Comments" checked={!!params.disable_comment} onChange={v => set('disable_comment', v)} />
          <CheckRow label="Disable Duet" checked={!!params.disable_duet} onChange={v => set('disable_duet', v)} />
          <CheckRow label="Disable Stitch" checked={!!params.disable_stitch} onChange={v => set('disable_stitch', v)} />
          <CheckRow label="AI-Generated Content" checked={!!params.made_with_ai} onChange={v => set('made_with_ai', v)} />
        </>
      )}
      {platform === 'pinterest' && (
        <>
          <InputRow label="Pin Title" placeholder="My pin title" value={params.title || ''} onChange={v => set('title', v)} />
          <InputRow label="Destination Link" placeholder="https://yoursite.com" value={params.destination_link || ''} onChange={v => set('destination_link', v)} />
        </>
      )}
      {platform === 'linkedin' && (
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Organization ID is set via profile placement above.</div>
      )}
    </div>
  )
}

function InputRow({ label, placeholder, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', marginBottom:5 }}>{label.toUpperCase()}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, color:'#E8E4DF', fontSize:12, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
    </div>
  )
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
      <div onClick={() => onChange(!checked)} style={{
        width:16, height:16, borderRadius:4, flexShrink:0,
        border:`2px solid ${checked ? '#FFD700' : 'rgba(255,255,255,0.2)'}`,
        background: checked ? 'rgba(255,215,0,0.2)' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#FFD700',
      }}>{checked ? '✓' : ''}</div>
      <span style={{ fontSize:12, color:'rgba(240,237,232,0.5)' }}>{label}</span>
    </label>
  )
}



// ── Live Preview Panel ────────────────────────────────────────────────────────
function LivePreviewPanel({ postBody, mediaFiles, mediaUrls, profiles, platformParams }) {
  const [activeId, setActiveId] = useState(null)
  // Track object URLs so we can revoke them on cleanup
  const objectUrlsRef = useRef([])

  useEffect(() => {
    if (profiles.length > 0 && (!activeId || !profiles.find(p => p.id === activeId))) {
      setActiveId(profiles[0].id)
    }
    if (profiles.length === 0) setActiveId(null)
  }, [profiles.map(p => p.id).join(',')])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  function getObjectUrl(file) {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.push(url)
    return url
  }

  const urlList = mediaUrls.split('\n').map(s => s.trim()).filter(Boolean)
  const firstFile = mediaFiles[0] || null
  const firstUrl = urlList[0] || null
  const hasMedia = !!firstFile || !!firstUrl
  const isVideo = firstFile?.type?.startsWith('video/') || (firstUrl && /\.(mp4|mov|webm)$/i.test(firstUrl))
  const previewUrl = firstFile ? URL.createObjectURL(firstFile) : firstUrl
  const mediaCount = mediaFiles.length + urlList.length

  const activeProfile = profiles.find(p => p.id === activeId)
  const platform = activeProfile?.platform
  const info = platform ? getPlatformInfo(platform) : null
  const params = activeId ? (platformParams[activeId] || {}) : {}
  const format = params.format || (platform ? PLATFORM_FORMATS[platform]?.[0]?.value : 'post') || 'post'
  const isStory = format === 'story'
  const isReel = format === 'reel'
  const charCount = postBody.length

  if (!profiles.length) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:400, gap:16, padding:32 }}>
        <div style={{ width:64, height:64, borderRadius:20, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>👁</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'rgba(240,237,232,0.3)', marginBottom:6 }}>Live Preview</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.15)', lineHeight:1.6 }}>Select platforms to see<br/>a live post preview</div>
        </div>
      </div>
    )
  }

  // Shared video renderer used across platform previews
  function renderVideoOrImage({ wrapperStyle, imgStyle, videoStyle }) {
    if (!hasMedia) return null
    if (isVideo) {
      return (
        <video
          src={previewUrl}
          controls
          playsInline
          preload="metadata"
          style={{ display:'block', background:'#000', ...videoStyle }}
        />
      )
    }
    return <img src={previewUrl} alt="" style={{ display:'block', ...imgStyle }} />
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Platform tabs */}
      <div style={{ padding:'0 0 14px', display:'flex', gap:6, flexWrap:'wrap' }}>
        {profiles.map(profile => {
          const pi = getPlatformInfo(profile.platform)
          const isActive = activeId === profile.id
          return (
            <button key={profile.id} type="button" onClick={() => setActiveId(profile.id)} style={{
              padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:700,
              background: isActive ? pi.color + '20' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${isActive ? pi.color + '60' : 'rgba(255,255,255,0.08)'}`,
              color: isActive ? pi.color : 'rgba(240,237,232,0.35)',
              cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.03em',
              transition:'all 0.15s',
            }}>
              {pi.label}
            </button>
          )
        })}
      </div>

      {activeProfile && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ height:2, flex:1, background:`linear-gradient(90deg, ${info.color}60, transparent)`, borderRadius:2 }} />
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color: info.color, opacity:0.7 }}>
              {PLATFORM_FORMATS[platform]?.find(f => f.value === format)?.label?.toUpperCase() || 'POST'} · {info.label.toUpperCase()}
            </span>
            <div style={{ height:2, flex:1, background:`linear-gradient(270deg, ${info.color}60, transparent)`, borderRadius:2 }} />
          </div>

          <div style={{ maxWidth:320, margin:'0 auto', width:'100%' }}>
            {(['instagram','facebook','threads'].includes(platform)) && (
              <div style={{ background:'#16162a', borderRadius: isStory ? 20 : 14, border:`1px solid ${info.color}20`, overflow:'hidden', boxShadow:`0 0 40px ${info.color}12` }}>
                <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${info.color},${info.color}88)`, flexShrink:0, border:`2px solid ${info.color}40` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#fff', lineHeight:1.2 }}>your_account</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:1 }}>
                      {format === 'story' ? '⭕ Story' : format === 'reel' ? '🎬 Reel' : '🖼 Feed'} · {info.label}
                    </div>
                  </div>
                  <span style={{ fontSize:18, color:'rgba(255,255,255,0.25)', letterSpacing:1 }}>···</span>
                </div>
                {hasMedia ? (
                  <div style={{ position:'relative', width:'100%', background:'#0a0a18', overflow:'hidden' }}>
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{
                          width:'100%',
                          maxHeight: isStory ? 480 : 320,
                          objectFit:'cover',
                          display:'block',
                          background:'#000',
                        }}
                      />
                    ) : (
                      <div style={{ position:'relative', paddingTop: isStory ? '160%' : '100%' }}>
                        <img src={previewUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                      </div>
                    )}
                    {isReel && !isVideo && (
                      <div style={{ position:'absolute', bottom:10, right:10, display:'flex', flexDirection:'column', gap:16, alignItems:'center' }}>
                        {['♥','💬','↗','⋯'].map((ic,i) => (
                          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                            <span style={{ fontSize:22, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,0.8)' }}>{ic}</span>
                            {i < 2 && <span style={{ fontSize:9, color:'rgba(255,255,255,0.6)' }}>{i === 0 ? '2.4K' : '184'}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {mediaCount > 1 && !isReel && !isVideo && (
                      <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.6)', borderRadius:12, padding:'3px 9px', fontSize:10, color:'#fff', fontWeight:700 }}>1/{mediaCount}</div>
                    )}
                  </div>
                ) : (
                  !isStory && (
                    <div style={{ padding:'14px 14px 0', fontSize:13, color:'#E8E4DF', lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word', minHeight:60 }}>
                      {postBody || <span style={{ opacity:.25, fontStyle:'italic' }}>Your caption here…</span>}
                    </div>
                  )
                )}
                {!isStory && (
                  <div style={{ padding:'10px 14px 14px' }}>
                    {hasMedia && (
                      <div style={{ display:'flex', gap:14, marginBottom:8, alignItems:'center' }}>
                        {['♥','💬','↗'].map((ic,i) => <span key={i} style={{ fontSize:20, color:'rgba(255,255,255,0.7)' }}>{ic}</span>)}
                        <span style={{ marginLeft:'auto', fontSize:20, color:'rgba(255,255,255,0.7)' }}>🔖</span>
                      </div>
                    )}
                    {hasMedia && (
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>
                        <span style={{ color:'#fff', fontWeight:700 }}>1,024 likes</span>
                      </div>
                    )}
                    {postBody && (
                      <p style={{ fontSize:12, color:'#E8E4DF', margin:0, lineHeight:1.55, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
                        <strong style={{ marginRight:5, color:'#fff' }}>your_account</strong>{postBody}
                      </p>
                    )}
                    {params.first_comment && (
                      <div style={{ marginTop:6, padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', display:'block', marginBottom:2 }}>💬 First comment</span>
                        <span style={{ fontSize:11, color:'rgba(240,237,232,0.6)', fontStyle:'italic' }}>{params.first_comment}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {platform === 'twitter' && (
              <div style={{ background:'#15202b', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', padding:'16px', boxShadow:'0 0 40px rgba(29,161,242,0.08)' }}>
                <div style={{ display:'flex', gap:10 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#1DA1F2,#0d8ed9)', flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Your Name</span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>@yourhandle · now</span>
                    </div>
                    <p style={{ fontSize:14, color:'#E8E4DF', margin:'0 0 12px', lineHeight:1.6, whiteSpace:'pre-wrap', wordBreak:'break-word', minHeight:20 }}>
                      {postBody || <span style={{ opacity:.3, fontStyle:'italic' }}>Your tweet here…</span>}
                    </p>
                    {hasMedia && (
                      <div style={{ borderRadius:12, overflow:'hidden', marginBottom:12, border:'1px solid rgba(255,255,255,0.1)' }}>
                        {isVideo ? (
                          <video
                            src={previewUrl}
                            controls
                            playsInline
                            preload="metadata"
                            style={{ width:'100%', maxHeight:200, objectFit:'cover', display:'block', background:'#000' }}
                          />
                        ) : (
                          <img src={previewUrl} alt="" style={{ width:'100%', maxHeight:200, objectFit:'cover', display:'block' }} />
                        )}
                        {mediaCount > 1 && !isVideo && (
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, marginTop:1 }}>
                            {Array.from({length:Math.min(mediaCount - 1, 3)}).map((_,i) => (
                              <div key={i} style={{ height:60, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(255,255,255,0.2)' }}>+{i+2}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:20, color:'rgba(255,255,255,0.35)' }}>
                      {['💬 12','🔁 34','♥ 284','📊','📤'].map((ic,i) => <span key={i} style={{ fontSize:13 }}>{ic}</span>)}
                    </div>
                    {charCount > 240 && (
                      <div style={{ marginTop:8, fontSize:11, color:'#f59e0b', display:'flex', alignItems:'center', gap:5 }}>
                        ⚠ {charCount}/280 characters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {platform === 'linkedin' && (
              <div style={{ background:'#1d2226', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', boxShadow:'0 0 40px rgba(10,102,194,0.1)' }}>
                <div style={{ padding:'14px 16px', display:'flex', gap:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width:46, height:46, borderRadius:10, background:'linear-gradient(135deg,#0A66C2,#0051a1)', flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Your Name</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>Your Title · 1st</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:1 }}>Just now · 🌐</div>
                  </div>
                  <span style={{ marginLeft:'auto', fontSize:18, color:'rgba(255,255,255,0.25)' }}>···</span>
                </div>
                <div style={{ padding:'12px 16px', fontSize:13, color:'#E8E4DF', lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                  {postBody || <span style={{ opacity:.3, fontStyle:'italic' }}>Your post content…</span>}
                </div>
                {hasMedia && (
                  <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width:'100%', maxHeight:220, objectFit:'cover', display:'block', background:'#000' }}
                      />
                    ) : (
                      <img src={previewUrl} alt="" style={{ width:'100%', maxHeight:220, objectFit:'cover', display:'block' }} />
                    )}
                  </div>
                )}
                <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:16, alignItems:'center' }}>
                  {['👍','💬','🔁','📤'].map((ic,i) => (
                    <span key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:14 }}>{ic}</span>
                      {['Like','Comment','Repost','Send'][i]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {platform === 'tiktok' && (
              <div style={{ background:'#000', borderRadius:20, border:`1px solid ${info.color}20`, overflow:'hidden', boxShadow:`0 0 40px ${info.color}12` }}>
                <div style={{ position:'relative', background:'#111' }}>
                  {hasMedia && isVideo ? (
                    <video
                      src={previewUrl}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ width:'100%', maxHeight:480, objectFit:'cover', display:'block', background:'#000' }}
                    />
                  ) : hasMedia && !isVideo && previewUrl ? (
                    <div style={{ position:'relative', paddingTop:'160%' }}>
                      <img src={previewUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  ) : (
                    <div style={{ paddingTop:'160%', position:'relative', background:'linear-gradient(to bottom, #1a0010, #000)' }}>
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ width:60, height:60, borderRadius:'50%', border:`2px solid ${info.color}60`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span style={{ fontSize:20, marginLeft:4 }}>▶</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ position:'absolute', top:10, right:10, zIndex:2 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff' }}>✕</div>
                  </div>
                  <div style={{ padding:'12px', background:'linear-gradient(transparent,rgba(0,0,0,0.85))', position: hasMedia && isVideo ? 'relative' : 'absolute', bottom:0, left:0, right:0 }}>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:'#fff', marginBottom:4 }}>@yourusername</div>
                        <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,0.85)', lineHeight:1.55, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
                          {postBody || <span style={{ opacity:.5, fontStyle:'italic' }}>Caption here…</span>}
                        </p>
                        <div style={{ marginTop:5, fontSize:10, color:'rgba(255,255,255,0.45)', display:'flex', alignItems:'center', gap:4 }}>
                          🔒 {TIKTOK_PRIVACY.find(p => p.value === (params.privacy_status || 'PUBLIC_TO_EVERYONE'))?.label}
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:18, alignItems:'center', flexShrink:0 }}>
                        {[['♥','284K'],['💬','1.2K'],['🔁','8.4K'],['⋯','']].map(([ic,ct],i) => (
                          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                            <span style={{ fontSize:24, textShadow:'0 2px 8px rgba(0,0,0,0.8)', color: i===0 ? '#ff4d6d' : '#fff' }}>{ic}</span>
                            {ct && <span style={{ fontSize:9, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{ct}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {platform === 'youtube' && (
              <div style={{ background:'#0f0f0f', borderRadius:14, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', boxShadow:'0 0 40px rgba(255,0,0,0.08)' }}>
                <div style={{ position:'relative', background:'#1a1a1a' }}>
                  {hasMedia && isVideo ? (
                    <video
                      src={previewUrl}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ width:'100%', maxHeight:200, objectFit:'cover', display:'block', background:'#000' }}
                    />
                  ) : hasMedia && !isVideo && previewUrl ? (
                    <div style={{ position:'relative', paddingTop:'56.25%' }}>
                      <img src={previewUrl} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  ) : (
                    <div style={{ position:'relative', paddingTop:'56.25%', background:'linear-gradient(135deg,#1a0000,#0f0f0f)' }}>
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ width:56, height:56, borderRadius:14, background:'#FF0000', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span style={{ fontSize:22, marginLeft:4 }}>▶</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isVideo && (
                    <div style={{ position:'absolute', bottom:6, right:8, background:'rgba(0,0,0,0.85)', borderRadius:5, padding:'2px 8px', fontSize:10, color:'#fff', fontWeight:700 }}>12:34</div>
                  )}
                </div>
                <div style={{ padding:'12px 14px 14px' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.4, marginBottom:6 }}>
                    {params.title || postBody?.slice(0, 60) || 'Your video title'}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'#FF0000', flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Your Channel</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>
                        {params.privacy_status === 'private' ? '🔒 Private' : params.privacy_status === 'unlisted' ? '🔗 Unlisted' : '🌐 Public'} · Just now
                      </div>
                    </div>
                    <button style={{ marginLeft:'auto', padding:'6px 14px', borderRadius:20, background:'#fff', border:'none', fontSize:11, fontWeight:700, color:'#0f0f0f', cursor:'pointer' }}>Subscribe</button>
                  </div>
                  {postBody && (
                    <div style={{ padding:'8px 10px', borderRadius:8, background:'rgba(255,255,255,0.05)', fontSize:11, color:'rgba(255,255,255,0.5)', lineHeight:1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {postBody}
                    </div>
                  )}
                </div>
              </div>
            )}

            {platform === 'pinterest' && (
              <div style={{ background:'#111', borderRadius:16, border:`1px solid ${info.color}20`, overflow:'hidden', boxShadow:`0 0 40px ${info.color}10` }}>
                <div style={{ position:'relative' }}>
                  {hasMedia && previewUrl ? (
                    isVideo ? (
                      <video
                        src={previewUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width:'100%', maxHeight:260, objectFit:'cover', display:'block', background:'#000' }}
                      />
                    ) : (
                      <img src={previewUrl} alt="" style={{ width:'100%', maxHeight:260, objectFit:'cover', display:'block' }} />
                    )
                  ) : (
                    <div style={{ height:200, background:`linear-gradient(135deg, ${info.color}22, rgba(0,0,0,0))`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:48, opacity:.15 }}>📌</span>
                    </div>
                  )}
                  <div style={{ position:'absolute', top:10, right:10, background:'#E60023', borderRadius:20, padding:'7px 16px', fontSize:12, fontWeight:700, color:'#fff', boxShadow:'0 4px 12px rgba(230,0,35,0.4)' }}>Save</div>
                </div>
                <div style={{ padding:'12px 14px 14px' }}>
                  {params.title && <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:6 }}>{params.title}</div>}
                  {postBody && <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:0, lineHeight:1.55 }}>{postBody}</p>}
                  {params.destination_link && (
                    <div style={{ marginTop:8, fontSize:11, color:'#E60023', display:'flex', alignItems:'center', gap:5, background:'rgba(230,0,35,0.08)', padding:'5px 10px', borderRadius:8 }}>
                      🔗 {params.destination_link}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:16, flexWrap:'wrap' }}>
            <div style={{ display:'flex', flex:1, flexDirection:'column', gap:3 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.2)' }}>CHARACTERS</div>
              <div style={{ fontSize:13, fontWeight:700, color: charCount > 280 ? '#f59e0b' : 'rgba(255,255,255,0.6)' }}>
                {charCount} {charCount > 280 && platform === 'twitter' ? <span style={{ fontSize:10, color:'#f59e0b' }}>over limit</span> : ''}
              </div>
            </div>
            <div style={{ display:'flex', flex:1, flexDirection:'column', gap:3 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.2)' }}>MEDIA</div>
              <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{mediaCount || '—'}</div>
            </div>
            <div style={{ display:'flex', flex:1, flexDirection:'column', gap:3 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.2)' }}>FORMAT</div>
              <div style={{ fontSize:13, fontWeight:700, color: info.color, opacity:0.8 }}>{format}</div>
            </div>
          </div>

          <div style={{ fontSize:10, color:'rgba(255,255,255,0.12)', textAlign:'center', fontStyle:'italic' }}>
            Approximate preview · actual post may vary
          </div>
        </div>
      )}
    </div>
  )
}

// ── Media Uploader ────────────────────────────────────────────────────────────
function MediaUploader({ files, urls, onFilesChange, onUrlsChange }) {
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
  function removeFile(i) { onFilesChange(prev => prev.filter((_, idx) => idx !== i)) }
  const totalItems = files.length + urls.split('\n').filter(u => u.trim()).length

  return (
    <div>
      <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:3, marginBottom:14, width:'fit-content' }}>
        {[{ id:'upload', label:'⬆ Upload Files' },{ id:'url', label:'🔗 From URL' }].map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
            padding:'6px 16px', borderRadius:7, fontSize:12, fontWeight:600,
            background: tab === t.id ? 'rgba(255,215,0,0.1)' : 'transparent',
            border: tab === t.id ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
            color: tab === t.id ? '#FFD700' : 'rgba(240,237,232,0.35)',
            cursor:'pointer', fontFamily:'inherit',
          }}>{t.label}</button>
        ))}
      </div>
      {tab === 'upload' ? (
        <>
          <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()} style={{
            border:`2px dashed ${dragging ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:12, padding:'28px 20px', textAlign:'center', cursor:'pointer',
            background: dragging ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.02)', transition:'all 0.2s',
          }}>
            <input ref={inputRef} type="file" accept={ACCEPT} multiple onChange={handleFileInput} style={{ display:'none' }} />
            <div style={{ fontSize:28, marginBottom:10, opacity:0.5 }}>🖼</div>
            <div style={{ fontSize:13, fontWeight:600, color:'rgba(240,237,232,0.5)', marginBottom:4 }}>Drop images or videos here</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>or click to browse · JPG, PNG, GIF, WEBP, MP4, MOV</div>
          </div>
          {files.length > 0 && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:12 }}>
              {files.map((file, i) => {
                const isVid = file.type.startsWith('video/')
                const thumbUrl = isVid ? null : URL.createObjectURL(file)
                return (
                  <div key={i} style={{ position:'relative', borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                    {isVid ? (
                      <video
                        src={URL.createObjectURL(file)}
                        style={{ width:80, height:80, objectFit:'cover', display:'block', background:'#111' }}
                        preload="metadata"
                        muted
                      />
                    ) : (
                      <img src={thumbUrl} alt="" style={{ width:80, height:80, objectFit:'cover', display:'block' }} />
                    )}
                    <button type="button" onClick={() => removeFile(i)} style={{ position:'absolute', top:3, right:3, width:18, height:18, borderRadius:'50%', background:'rgba(0,0,0,0.75)', border:'none', color:'#fff', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'3px 5px', background:'rgba(0,0,0,0.6)', fontSize:9, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{file.name}</div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <textarea value={urls} onChange={e => onUrlsChange(e.target.value)} placeholder={"https://example.com/image.jpg\nhttps://example.com/video.mp4"} rows={3} style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'12px 16px', color:'#E8E4DF', fontSize:13, fontFamily:'inherit', lineHeight:1.65, outline:'none', resize:'vertical', boxSizing:'border-box' }} />
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.18)', marginTop:8 }}>One URL per line · Images and videos supported</p>
        </>
      )}
      {totalItems > 0 && (
        <div style={{ marginTop:10, fontSize:11, color:'rgba(255,215,0,0.5)', display:'flex', alignItems:'center', gap:5 }}>
          <span>✓</span> {totalItems} media item{totalItems !== 1 ? 's' : ''} ready
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ComposePage() {
  const { selectedGroup } = useContext(DashboardContext)
  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [refreshingProfiles, setRefreshingProfiles] = useState(false)
  const [postBody, setPostBody] = useState('')
  const [selectedProfileIds, setSelectedProfileIds] = useState([])
  const [placements, setPlacements] = useState({})
  const [loadedPlacements, setLoadedPlacements] = useState({})
  const [scheduledAt, setScheduledAt] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaUrls, setMediaUrls] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postMsg, setPostMsg] = useState({ type:'', text:'' })
  const [platformParams, setPlatformParams] = useState({})
  const [expandedParams, setExpandedParams] = useState({})
  // Track whether we've already loaded profiles for the current group
  const loadedGroupRef = useRef(null)

  const fetchProfiles = useCallback(async (groupId) => {
    const res = await fetch(`/api/profiles?groupId=${groupId}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  }, [])

  // Only fires when selectedGroup changes — initial load only, no polling
  useEffect(() => {
    if (!selectedGroup) return
    // Don't re-fetch if we already loaded this group
    if (loadedGroupRef.current === selectedGroup.id) return
    loadedGroupRef.current = selectedGroup.id

    setProfiles([])
    setSelectedProfileIds([])
    setPlacements({})
    setLoadedPlacements({})
    setPlatformParams({})
    setExpandedParams({})
    setPostMsg({ type:'', text:'' })
    setLoadingProfiles(true)
    fetchProfiles(selectedGroup.id)
      .then(data => setProfiles(data))
      .finally(() => setLoadingProfiles(false))
  }, [selectedGroup?.id])

  // Manual refresh — only triggered by button click
  async function handleRefreshProfiles() {
    if (!selectedGroup || refreshingProfiles) return
    setRefreshingProfiles(true)
    try {
      const data = await fetchProfiles(selectedGroup.id)
      setProfiles(data)
      setSelectedProfileIds(prev => prev.filter(id => data.find(p => p.id === id)))
    } finally {
      setRefreshingProfiles(false)
    }
  }

  function toggleProfile(profileId) {
    setSelectedProfileIds(prev => {
      if (prev.includes(profileId)) {
        setPlacements(p => { const n={...p}; delete n[profileId]; return n })
        setLoadedPlacements(p => { const n={...p}; delete n[profileId]; return n })
        setPlatformParams(p => { const n={...p}; delete n[profileId]; return n })
        setExpandedParams(p => { const n={...p}; delete n[profileId]; return n })
        return prev.filter(id => id !== profileId)
      }
      return [...prev, profileId]
    })
  }

  function resolvePlacementId(pid) {
    const val = placements[pid]
    if (val === '__personal__') return null
    return val || null
  }

  function buildPlatformsPayload() {
    const result = {}
    selectedProfileIds.forEach(pid => {
      const profile = profiles.find(p => p.id === pid)
      if (!profile) return
      const pp = platformParams[pid] || {}
      const placementId = resolvePlacementId(pid)
      const platformEntry = { ...pp }
      if (profile.platform === 'facebook' && placementId) platformEntry.page_id = placementId
      if (profile.platform === 'pinterest' && placementId) platformEntry.board_id = placementId
      if (profile.platform === 'linkedin' && placementId !== null) platformEntry.organization_id = placementId
      if (Object.keys(platformEntry).length > 0) result[profile.platform] = platformEntry
    })
    return result
  }

  async function handlePost(e) {
    e.preventDefault()
    setPostMsg({ type:'', text:'' })
    const urlList = mediaUrls.split('\n').map(s => s.trim()).filter(Boolean)
    const hasMedia = mediaFiles.length > 0 || urlList.length > 0
    if (!postBody.trim() && !hasMedia) { setPostMsg({ type:'error', text:'Add content or at least one media item.' }); return }
    if (!selectedProfileIds.length) { setPostMsg({ type:'error', text:'Select at least one profile.' }); return }
    setPosting(true)
    const platformsPayload = buildPlatformsPayload()
    try {
      if (mediaFiles.length > 0) {
        const fd = new FormData()
        fd.append('groupId', selectedGroup.id)
        if (postBody) fd.append('post[body]', postBody)
        if (scheduledAt) fd.append('post[scheduled_at]', scheduledAt)
        if (isDraft) fd.append('post[draft]', 'true')
        selectedProfileIds.forEach(pid => fd.append('profiles[]', pid))
        mediaFiles.forEach(f => fd.append('media[]', f, f.name))
        urlList.forEach(u => fd.append('media[]', u))
        Object.entries(platformsPayload).forEach(([plat, pp]) => {
          Object.entries(pp).forEach(([k, v]) => {
            if (v !== undefined && v !== '') fd.append(`platforms[${plat}][${k}]`, String(v))
          })
        })
        const res = await fetch('/api/posts', { method:'POST', body:fd })
        const data = await res.json()
        if (!res.ok) { setPostMsg({ type:'error', text: Array.isArray(data.error) ? data.error.join(', ') : (data.error||'Failed') }); return }
      } else {
        const res = await fetch('/api/posts', {
          method:'POST', headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({
            groupId: selectedGroup.id, postBody, profiles: selectedProfileIds,
            scheduledAt: scheduledAt || undefined, mediaUrls: urlList, draft: isDraft,
            platforms: platformsPayload,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setPostMsg({ type:'error', text: Array.isArray(data.error) ? data.error.join(', ') : (data.error||'Failed') }); return }
      }
      setPostMsg({ type:'success', text: isDraft ? '✓ Draft saved!' : scheduledAt ? '✓ Post scheduled!' : '✓ Published successfully!' })
      setPostBody(''); setSelectedProfileIds([]); setPlacements({}); setLoadedPlacements({}); setPlatformParams({}); setExpandedParams({}); setScheduledAt(''); setMediaFiles([]); setMediaUrls(''); setIsDraft(false)
    } catch {
      setPostMsg({ type:'error', text:'Network error. Please try again.' })
    } finally { setPosting(false) }
  }

  if (!selectedGroup) return null

  const charCount = postBody.length
  const activeProfiles = profiles.filter(p => p.status === 'active')
  const overLimit = charCount > 280
  const submitLabel = posting ? 'Publishing…' : isDraft ? 'Save Draft' : scheduledAt ? 'Schedule Post' : 'Publish Now'
  const submitIcon  = posting ? '⟳' : isDraft ? '◻' : scheduledAt ? '⏰' : '⚡'

  const selectedProfileObjects = selectedProfileIds.map(pid => profiles.find(p => p.id === pid)).filter(Boolean)

  const refreshProfilesBtn = (
    <button
      type="button"
      onClick={handleRefreshProfiles}
      disabled={refreshingProfiles || loadingProfiles}
      style={{
        display:'flex', alignItems:'center', gap:5,
        padding:'4px 10px', borderRadius:8,
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.08)',
        color: refreshingProfiles ? 'rgba(255,215,0,0.6)' : 'rgba(240,237,232,0.3)',
        fontSize:11, fontWeight:600, fontFamily:'inherit',
        cursor: refreshingProfiles || loadingProfiles ? 'not-allowed' : 'pointer',
        opacity: refreshingProfiles || loadingProfiles ? 0.6 : 1,
        transition:'all 0.15s',
      }}
    >
      <span style={{
        display:'inline-block', fontSize:12,
        animation: refreshingProfiles ? 'spin 0.7s linear infinite' : 'none',
        transformOrigin:'center',
      }}>↻</span>
      {refreshingProfiles ? 'Refreshing…' : 'Refresh'}
    </button>
  )

  return (
    <div style={{ animation:'fadeIn 0.25s ease' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        .sk { background: linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 100%); background-size:400% 100%; animation:shimmer 2s ease infinite; }
        .ctarea { outline: none; resize: vertical; transition: border-color 0.2s; }
        .ctarea:focus { border-color: rgba(255,215,0,0.3) !important; box-shadow: 0 0 0 3px rgba(255,215,0,0.05) !important; }
        .cinput { outline: none; transition: border-color 0.2s; }
        .cinput:focus { border-color: rgba(255,215,0,0.3) !important; }
        .ptoggle { transition: background 0.15s; cursor: pointer; }
        .ptoggle:hover { background: rgba(255,255,255,0.035) !important; }
        .sbtn { transition: all 0.2s ease; }
        .sbtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(255,215,0,0.22); }
        .pp-toggle:hover { background: rgba(255,255,255,0.04) !important; }
        .preview-panel { position: sticky; top: 24px; }
        video { border-radius: 0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,140,66,0.1))', border:'1px solid rgba(255,215,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✦</div>
          <h1 style={{ fontSize:26, fontWeight:700, color:'#F0EDE8', fontFamily:"'Syne',sans-serif", letterSpacing:'-0.02em', margin:0 }}>Compose</h1>
        </div>
        <p style={{ fontSize:13, color:'rgba(240,237,232,0.35)', margin:0 }}>
          Write once, publish everywhere from <span style={{ color:'rgba(255,215,0,0.5)', fontWeight:500 }}>{selectedGroup.name}</span>
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>

        {/* LEFT: Form */}
        <form onSubmit={handlePost} style={{ display:'flex', flexDirection:'column', gap:12 }}>

          <SectionCard title="CONTENT">
            <textarea className="ctarea" value={postBody} onChange={e => setPostBody(e.target.value)} placeholder="What do you want to share today?" rows={6} style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'14px 16px', color:'#E8E4DF', fontSize:15, fontFamily:'inherit', lineHeight:1.65, boxSizing:'border-box' }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.15)' }}>Supports plain text, hashtags &amp; mentions</span>
              <span style={{ fontSize:11, fontWeight:600, color: overLimit ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}>{charCount}{overLimit && ' · over X/Twitter limit'}</span>
            </div>
            <div style={{ height:2, background:'rgba(255,255,255,0.05)', borderRadius:2, marginTop:8, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:2, width:`${Math.min((charCount/280)*100,100)}%`, background: overLimit ? '#f59e0b' : 'rgba(255,215,0,0.4)', transition:'width 0.15s ease, background 0.15s ease' }} />
            </div>
          </SectionCard>

          <SectionCard title="MEDIA" hint="Optional">
            <MediaUploader files={mediaFiles} urls={mediaUrls} onFilesChange={setMediaFiles} onUrlsChange={setMediaUrls} />
          </SectionCard>

          <SectionCard
            title="POST TO"
            hint={selectedProfileIds.length > 0 ? `${selectedProfileIds.length} selected` : undefined}
            headerRight={refreshProfilesBtn}
          >
            {loadingProfiles ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>{[1,2,3].map(i => <div key={i} className="sk" style={{ height:54, borderRadius:10 }} />)}</div>
            ) : profiles.length === 0 ? (
              <div style={{ textAlign:'center', padding:'24px 0' }}>
                <p style={{ fontSize:14, color:'rgba(240,237,232,0.3)', marginBottom:4 }}>No profiles connected</p>
                <p style={{ fontSize:12, color:'rgba(240,237,232,0.18)' }}>Go to the Connect tab to link your social accounts</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {activeProfiles.length > 1 && (
                  <button type="button" onClick={() => {
                    if (selectedProfileIds.length === activeProfiles.length) { setSelectedProfileIds([]); setPlacements({}); setLoadedPlacements({}); setPlatformParams({}) }
                    else setSelectedProfileIds(activeProfiles.map(p => p.id))
                  }} style={{ alignSelf:'flex-start', background:'rgba(255,215,0,0.06)', border:'1px solid rgba(255,215,0,0.15)', borderRadius:8, padding:'6px 14px', fontSize:12, color:'rgba(255,215,0,0.7)', cursor:'pointer', fontFamily:'inherit', fontWeight:600, marginBottom:4 }}>
                    {selectedProfileIds.length === activeProfiles.length ? '✕ Deselect All' : '✓ Select All Active'}
                  </button>
                )}
                {profiles.map(profile => {
                  const info = getPlatformInfo(profile.platform)
                  const isSelected = selectedProfileIds.includes(profile.id)
                  const inactive = profile.status !== 'active'
                  const needsPlacement = isSelected && PLACEMENT_PLATFORMS.includes(profile.platform)
                  const isExpanded = expandedParams[profile.id]
                  const pp = platformParams[profile.id] || {}

                  return (
                    <div key={profile.id} style={{ borderRadius:12, border:`1.5px solid ${isSelected ? info.color+'45' : 'rgba(255,255,255,0.06)'}`, background: isSelected ? info.color+'07' : 'rgba(255,255,255,0.02)', overflow:'hidden', opacity: inactive ? 0.45 : 1, transition:'border-color 0.15s, background 0.15s' }}>
                      <div className="ptoggle" onClick={() => !inactive && toggleProfile(profile.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', cursor: inactive ? 'not-allowed' : 'pointer' }}>
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, border:`2px solid ${isSelected ? info.color : 'rgba(255,255,255,0.15)'}`, background: isSelected ? info.color : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#080810', fontWeight:900, transition:'all 0.15s' }}>{isSelected ? '✓' : ''}</div>
                        <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background: info.color+'14', border:`1px solid ${info.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:info.color }}>{info.label.slice(0,2).toUpperCase()}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:'#E8E4DF', lineHeight:1.3 }}>{info.label}</div>
                          <div style={{ fontSize:11, color:'rgba(240,237,232,0.35)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{profile.name}</div>
                        </div>
                        {isSelected && (() => {
                          const fmt = pp.format || PLATFORM_FORMATS[profile.platform]?.[0]?.value
                          const fmtLabel = PLATFORM_FORMATS[profile.platform]?.find(f => f.value === fmt)
                          return fmtLabel ? (
                            <span style={{ fontSize:10, color: info.color, background: info.color+'12', border:`1px solid ${info.color}30`, padding:'2px 8px', borderRadius:6, fontWeight:600, flexShrink:0 }}>{fmtLabel.icon} {fmtLabel.label}</span>
                          ) : null
                        })()}
                        {inactive && <span style={{ fontSize:11, color:'#f87171', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', padding:'3px 8px', borderRadius:6 }}>Reconnect</span>}
                      </div>
                      {needsPlacement && (
                        <div style={{ borderTop:`1px solid ${info.color}18`, background:`${info.color}04` }}>
                          <PlacementPicker profile={profile} groupId={selectedGroup.id} value={placements[profile.id]} onChange={val => setPlacements(p => ({ ...p, [profile.id]: val }))} onLoaded={(pid, list) => setLoadedPlacements(p => ({ ...p, [pid]: list }))} />
                        </div>
                      )}
                      {isSelected && (
                        <div style={{ borderTop:`1px solid ${info.color}18` }}>
                          <button type="button" className="pp-toggle" onClick={() => setExpandedParams(p => ({ ...p, [profile.id]: !p[profile.id] }))} style={{ width:'100%', padding:'8px 14px', background:'transparent', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontFamily:'inherit' }}>
                            <span style={{ fontSize:11, fontWeight:600, color: isExpanded ? info.color : 'rgba(240,237,232,0.3)' }}>
                              ⚙ Post Settings
                              {Object.keys(pp).length > 0 && <span style={{ marginLeft:6, fontSize:10, color: info.color, background: info.color+'14', padding:'1px 6px', borderRadius:4 }}>{Object.keys(pp).length} set</span>}
                            </span>
                            <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>▾</span>
                          </button>
                          {isExpanded && (
                            <div style={{ borderTop:`1px solid ${info.color}10`, background:`${info.color}03`, animation:'fadeIn 0.15s ease' }}>
                              <PlatformParamsEditor
                                platform={profile.platform}
                                params={pp}
                                onChange={newPp => setPlatformParams(p => ({ ...p, [profile.id]: newPp }))}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>

          {/* Schedule & Draft */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, alignItems:'stretch' }}>
            <SectionCard title="SCHEDULE" hint="Optional">
              <input className="cinput" type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#E8E4DF', fontSize:13, fontFamily:'inherit', colorScheme:'dark', boxSizing:'border-box' }} />
            </SectionCard>
            <div onClick={() => setIsDraft(v => !v)} style={{ background: isDraft ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)', border:`1px solid ${isDraft ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius:16, padding:'14px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', minWidth:100, transition:'all 0.18s ease' }}>
              <div style={{ width:32, height:18, borderRadius:100, background: isDraft ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.08)', position:'relative', transition:'background 0.2s', border:`1px solid ${isDraft ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                <div style={{ position:'absolute', top:2, left: isDraft ? 14 : 2, width:12, height:12, borderRadius:'50%', background: isDraft ? '#FFD700' : 'rgba(255,255,255,0.3)', transition:'left 0.2s, background 0.2s' }} />
              </div>
              <span style={{ fontSize:11, fontWeight:700, color: isDraft ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.25)', letterSpacing:'0.08em' }}>DRAFT</span>
            </div>
          </div>

          {postMsg.text && (
            <div style={{ padding:'12px 16px', borderRadius:12, background: postMsg.type==='error' ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)', border:`1px solid ${postMsg.type==='error' ? 'rgba(248,113,113,0.18)' : 'rgba(74,222,128,0.18)'}`, color: postMsg.type==='error' ? '#f87171' : '#4ade80', fontSize:13, fontWeight:500, animation:'fadeIn 0.2s ease' }}>{postMsg.text}</div>
          )}

          <button type="submit" disabled={posting} className="sbtn" style={{ padding:'15px 24px', borderRadius:13, background: isDraft ? 'rgba(255,255,255,0.07)' : scheduledAt ? 'linear-gradient(135deg,#4facfe,#00f2fe)' : 'linear-gradient(135deg,#FFD700,#FF8C42)', color: isDraft ? '#E8E4DF' : '#08080F', border:`1px solid ${isDraft ? 'rgba(255,255,255,0.1)' : 'transparent'}`, fontWeight:800, fontSize:15, cursor: posting ? 'default' : 'pointer', fontFamily:"'Syne',sans-serif", opacity: posting ? 0.65 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, letterSpacing:'0.01em', boxShadow: !isDraft && !posting ? (scheduledAt ? '0 8px 24px rgba(79,172,254,0.2)' : '0 8px 24px rgba(255,215,0,0.18)') : 'none' }}>
            {posting ? <><span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.2)', borderTop:'2px solid rgba(0,0,0,0.7)', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 }} /> Publishing…</> : <>{submitIcon} {submitLabel}</>}
          </button>
        </form>

        {/* RIGHT: Live Preview Panel */}
        <div className="preview-panel">
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background: selectedProfileIds.length > 0 ? '#4ade80' : 'rgba(255,255,255,0.2)', transition:'background 0.3s' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.3)' }}>LIVE PREVIEW</span>
              {selectedProfileIds.length > 0 && (
                <span style={{ marginLeft:'auto', fontSize:10, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>
                  {selectedProfileObjects.length} platform{selectedProfileObjects.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ padding:'16px' }}>
              <LivePreviewPanel
                postBody={postBody}
                mediaFiles={mediaFiles}
                mediaUrls={mediaUrls}
                profiles={selectedProfileObjects}
                platformParams={platformParams}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}