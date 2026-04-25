// lib/plans

export const PLANS = {
  free: {
    name: 'Free',
    maxWorkspaces: 1,
    maxProfiles: 3,
    maxPosts: 8,
    unlimitedPosts: false,
  },
  growth: {
    name: 'Growth',
    maxWorkspaces: 4,
    maxProfiles: 6,
    maxPosts: Infinity,
    unlimitedPosts: true,
  },
  scale: {
    name: 'Scale',
    maxWorkspaces: 8,
    maxProfiles: Infinity,
    maxPosts: Infinity,
    unlimitedPosts: true,
  },
}

export function getPlan(planName) {
  return PLANS[planName] || PLANS.free
}