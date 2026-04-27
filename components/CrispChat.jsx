'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function CrispChat() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    // Initialize Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_ID;

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script)
      delete window.$crisp
      delete window.CRISP_WEBSITE_ID
    }
  }, [])

  // Pre-fill user info once Clerk user is loaded
  useEffect(() => {
    if (!isLoaded || !user || !window.$crisp) return

    const email = user?.emailAddresses?.[0]?.emailAddress
    const name = user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.username || ''

    if (email) window.$crisp.push(['set', 'user:email', [email]])
    if (name)  window.$crisp.push(['set', 'user:nickname', [name]])
  }, [isLoaded, user])

  return null // Crisp injects its own UI
}
