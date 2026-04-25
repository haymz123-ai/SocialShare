'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: '$0',
    period: 'forever',
    color: '#D97706',
    grad: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
    border: '#FCD34D',
    icon: '◈',
    features: [
      '1 workspace',
      '3 social media profiles',
      'Up to 8 posts total',
      'All platforms supported',
      'Calendar & list view',
      'Basic analytics',
    ],
    cta: 'Current Plan',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 19,
    priceLabel: '$19',
    period: 'per month',
    color: '#7C3AED',
    grad: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    border: '#8B5CF6',
    icon: '⚡',
    features: [
      '4 workspaces',
      '6 social media profiles',
      'Unlimited posts',
      'All platforms supported',
      'Priority scheduling',
      'Advanced analytics',
      'Email support',
    ],
    cta: 'Upgrade to Growth',
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 49,
    priceLabel: '$49',
    period: 'per month',
    color: '#0EA5E9',
    grad: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    border: '#38BDF8',
    icon: '✦',
    features: [
      '8 workspaces',
      'Unlimited social profiles',
      'Unlimited posts',
      'All platforms supported',
      'Priority scheduling',
      'Full analytics suite',
      'Priority support',
      'Team collaboration (soon)',
    ],
    cta: 'Upgrade to Scale',
  },
]

function PlanBadge({ plan }) {
  const cfg = {
    free:   { label: 'Free Plan',    bg: '#FEF3C7', color: '#B45309', border: '#FCD34D',  dot: '#D97706' },
    growth: { label: 'Growth Plan',  bg: '#f5f3ff', color: '#7C3AED', border: '#c4b5fd',  dot: '#7C3AED' },
    scale:  { label: 'Scale Plan',   bg: '#eff6ff', color: '#0284C7', border: '#bae6fd',  dot: '#0EA5E9' },
  }
  const c = cfg[plan] || cfg.free
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 100,
      background: c.bg, border: `1.5px solid ${c.border}`,
      fontSize: 11, fontWeight: 700, color: c.color,
      letterSpacing: '0.05em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label.toUpperCase()}
    </span>
  )
}

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const [userPlan, setUserPlan] = useState(null)
  const [planLoading, setPlanLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setPlanLoading(false); return }
    fetch('/api/user-plan')
      .then(r => r.json())
      .then(data => setUserPlan(data))
      .catch(() => {})
      .finally(() => setPlanLoading(false))
  }, [isLoaded, user])

  const activePlan = userPlan?.plan || 'free'

  async function handleUpgrade(planId) {
    if (planId === 'free') return // disabled — no action
    if (planId === activePlan) return // already on this plan

    if (!user) {
      router.push('/sign-up')
      return
    }

    setLoading(planId)
    setError('')

    const priceId = planId === 'growth'
      ? process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planId }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to start checkout'); return }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  function getButtonState(plan) {
    const isActive = activePlan === plan.id
    const isDowngrade = plan.id === 'free' && activePlan !== 'free'
    const isDisabled = plan.id === 'free' || isActive || loading !== null

    let label = plan.cta
    let sublabel = null
    if (isActive && plan.id !== 'free') label = '✓ Current Plan'
    if (isActive && plan.id === 'free') label = '✓ Your Free Plan'
    if (isDowngrade) { label = 'Downgrade'; sublabel = 'Cancel subscription to downgrade' }

    return { isActive, isDowngrade, isDisabled, label, sublabel }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .plan-card { transition: transform 0.22s ease, box-shadow 0.22s ease; animation: fadeUp 0.5s ease both; }
        .plan-card:not(.plan-card-disabled):hover { transform: translateY(-6px); }
        .plan-btn { transition: all 0.18s ease; }
        .plan-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
        .feat-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .feat-check { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '72px 24px 52px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 100, background: '#FEF3C7', border: '1.5px solid #FCD34D', marginBottom: 22 }}>
          <span style={{ fontSize: 12 }}>✦</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309', letterSpacing: '0.05em' }}>SIMPLE, TRANSPARENT PRICING</span>
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, color: '#1C1200', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 18, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
          Grow your social presence<br />
          <span style={{ background: 'linear-gradient(135deg,#D97706,#B45309)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>without limits</span>
        </h1>
        <p style={{ fontSize: 18, color: '#B45309', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7, fontWeight: 500 }}>
          Start free, upgrade when you're ready. No contracts, cancel anytime.
        </p>

        {/* Active plan pill — shown when logged in */}
        {isLoaded && user && !planLoading && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 100, background: '#ffffff', border: '1.5px solid #FDE68A', boxShadow: '0 2px 12px rgba(217,119,6,0.08)' }}>
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>You are on the</span>
            <PlanBadge plan={activePlan} />
            {activePlan !== 'free' && (
              <button
                onClick={async () => {
                  setLoading('portal')
                  try {
                    const res = await fetch('/api/stripe/portal', { method: 'POST' })
                    const d = await res.json()
                    if (d.url) window.location.href = d.url
                  } finally { setLoading(null) }
                }}
                style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', padding: 0 }}
              >
                {loading === 'portal' ? 'Opening…' : 'Manage billing →'}
              </button>
            )}
          </div>
        )}
        {isLoaded && user && planLoading && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
            <span style={{ width: 10, height: 10, border: '2px solid #FDE68A', borderTop: '2px solid #D97706', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>Loading your plan…</span>
          </div>
        )}
        {isLoaded && !user && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
            <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>Sign up to get started — it's free</span>
          </div>
        )}
      </div>

      {/* Plans grid */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
        {PLANS.map((plan, i) => {
          const { isActive, isDowngrade, isDisabled, label, sublabel } = getButtonState(plan)
          const isFree = plan.id === 'free'
          const dimmed = isFree && activePlan !== 'free' // paid user sees free plan dimmed

          return (
            <div
              key={plan.id}
              className={`plan-card${isFree ? ' plan-card-disabled' : ''}`}
              style={{
                animationDelay: `${i * 0.1}s`,
                background: '#ffffff',
                border: isActive && !isFree
                  ? `2px solid ${plan.border}`
                  : plan.popular && !isActive
                    ? `2px solid ${plan.border}`
                    : '1.5px solid #FDE68A',
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: isActive && !isFree
                  ? `0 20px 60px ${plan.color}25`
                  : plan.popular && !isActive
                    ? `0 20px 60px ${plan.color}20`
                    : '0 4px 20px rgba(217,119,6,0.08)',
                position: 'relative',
                opacity: dimmed ? 0.62 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              {/* Top accent bar */}
              {(plan.popular || isActive) && !isFree && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: plan.grad }} />
              )}
              {isActive && !isFree && (
                <div style={{ position: 'absolute', top: 14, right: 16 }}>
                  <PlanBadge plan={plan.id} />
                </div>
              )}
              {!isActive && plan.popular && (
                <div style={{ position: 'absolute', top: 14, right: 16, background: plan.grad, borderRadius: 100, padding: '4px 12px', fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.08em' }}>MOST POPULAR</div>
              )}

              {/* Free plan "included" ribbon */}
              {isFree && (
                <div style={{ position: 'absolute', top: 14, right: 16, padding: '4px 12px', borderRadius: 100, background: '#FEF3C7', border: '1.5px solid #FCD34D', fontSize: 10, fontWeight: 700, color: '#B45309', letterSpacing: '0.06em' }}>
                  INCLUDED
                </div>
              )}

              {/* Card header */}
              <div style={{ padding: '28px 28px 20px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 13, marginBottom: 14,
                  background: plan.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 14px ${plan.color}30`,
                }}>
                  <span style={{ fontSize: 18, color: isFree ? '#B45309' : '#fff' }}>{plan.icon}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: plan.color, letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: '#1C1200', letterSpacing: '-0.04em', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{plan.priceLabel}</span>
                  {plan.price > 0 && <span style={{ fontSize: 14, color: '#B45309', fontWeight: 500 }}>{plan.period}</span>}
                </div>
                {plan.price === 0 && <div style={{ fontSize: 13, color: '#B45309', fontWeight: 500 }}>No credit card required</div>}
              </div>

              {/* Features + CTA */}
              <div style={{ padding: '0 28px 28px', borderTop: '1.5px solid #FEF3C7' }}>
                <div style={{ padding: '20px 0 22px' }}>
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="feat-row">
                      <div className="feat-check" style={{
                        background: isFree ? '#FEF3C7' : `${plan.color}18`,
                        color: isFree ? '#D97706' : plan.color,
                      }}>✓</div>
                      <span style={{ fontSize: 13, color: dimmed ? '#9ca3af' : '#1C1200', fontWeight: 500, lineHeight: 1.5 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {error && loading === null && !isFree && (
                  <div style={{ marginBottom: 12, padding: '9px 12px', borderRadius: 9, background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>{error}</div>
                )}

                {/* CTA button */}
                <button
                  className="plan-btn"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isDisabled || loading === plan.id}
                  style={{
                    width: '100%', padding: '13px 20px', borderRadius: 12,
                    background: isActive && !isFree
                      ? `${plan.color}10`
                      : isFree
                        ? '#F9F6EE'
                        : plan.grad,
                    border: isActive && !isFree
                      ? `1.5px solid ${plan.border}`
                      : isFree
                        ? '1.5px solid #E5DFC8'
                        : 'none',
                    color: isActive && !isFree
                      ? plan.color
                      : isFree
                        ? '#C4A96B'
                        : '#ffffff',
                    fontSize: 14, fontWeight: 800,
                    cursor: isDisabled || loading === plan.id ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: (!isActive && !isFree && loading !== plan.id) ? `0 8px 24px ${plan.color}35` : 'none',
                    opacity: loading === plan.id ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 3,
                    letterSpacing: '0.01em',
                  }}
                >
                  {loading === plan.id ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Redirecting…
                    </span>
                  ) : (
                    <>
                      <span>{label}</span>
                      {sublabel && <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>{sublabel}</span>}
                    </>
                  )}
                </button>

                {/* Manage billing link for active paid plan */}
                {isActive && !isFree && (
                  <button
                    onClick={async () => {
                      setLoading('portal')
                      try {
                        const res = await fetch('/api/stripe/portal', { method: 'POST' })
                        const d = await res.json()
                        if (d.url) window.location.href = d.url
                      } finally { setLoading(null) }
                    }}
                    style={{ width: '100%', marginTop: 9, padding: '8px', background: 'none', border: 'none', color: plan.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', opacity: 0.75 }}
                  >
                    {loading === 'portal' ? 'Opening portal…' : 'Manage or cancel subscription →'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

  
    </div>
  )
}