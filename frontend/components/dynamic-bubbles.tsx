"use client"

export default function DynamicBubbles() {
  return (
    <>
      {/* Top-right bubble - Purple */}
      <div
        className="fixed top-10 right-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-purple-300/10 rounded-full blur-3xl animate-float opacity-60 pointer-events-none"
        style={{ animationDelay: "0s" }}
      />

      {/* Bottom-right bubble - Pink */}
      <div
        className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-pink-400/15 to-pink-200/5 rounded-full blur-3xl animate-float opacity-50 pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* Top-left bubble - Purple accent */}
      <div
        className="fixed -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-purple-300/10 to-transparent rounded-full blur-3xl animate-float opacity-40 pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      {/* Middle bubble - Orange accent */}
      <div
        className="fixed top-1/2 -right-40 w-64 h-64 bg-gradient-to-l from-orange-400/10 to-transparent rounded-full blur-3xl animate-float opacity-30 pointer-events-none"
        style={{ animationDelay: "3s" }}
      />
    </>
  )
}
