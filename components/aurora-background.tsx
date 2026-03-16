"use client"

export function AppBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 app-bg" />
      {/* Decorative blobs */}
      <div
        className="absolute rounded-full blur-3xl opacity-60 animate-pulse"
        style={{
          width: '56vw', height: '56vw',
          top: '-10vw', left: '-12vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          animationDuration: '10s',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-50"
        style={{
          width: '44vw', height: '44vw',
          top: '5vw', right: '-10vw',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          animation: 'pulse 13s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: '60vw', height: '35vw',
          bottom: '8vh', left: '8vw',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          animation: 'pulse 16s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: '38vw', height: '38vw',
          bottom: '18vh', right: '2vw',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          animation: 'pulse 11s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}
