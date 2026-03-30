"use client"

export function AppBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 app-bg" />
    </div>
  )
}
