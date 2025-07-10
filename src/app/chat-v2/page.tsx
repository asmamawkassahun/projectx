"use client"

import { Suspense } from "react"
import UnifiedAgent from "../../components/chat-v2/unified-agent"

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedAgent />
    </Suspense>
  )
}
