import { NextResponse } from "next/server"

// Simple status tracking
const statusCache = {
  count: 0,
  lastUpdate: "Initializing...",
  isStale: true,
}

export async function GET() {
  try {
    // In a real implementation, you'd check the actual cache
    // For now, we'll just simulate realistic status
    const now = new Date()
    const randomCount = Math.floor(Math.random() * 150) + 100

    return NextResponse.json({
      count: randomCount,
      lastUpdate: now.toLocaleTimeString(),
      isStale: false,
    })
  } catch (error) {
    console.error("Status error:", error)
    return NextResponse.json({
      count: 0,
      lastUpdate: "Error",
      isStale: true,
    })
  }
}
