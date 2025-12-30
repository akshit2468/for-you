"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  emoji: string
}

export default function LoveExperience() {
  const [particles, setParticles] = useState<Particle[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)

  /* Floating romantic particles */
  useEffect(() => {
    const emojis = ["✨", "💫", "🌸", "💖", "⭐"]
    const items: Particle[] = []

    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 14 + Math.random() * 20,
        speed: 0.3 + Math.random() * 0.6,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      })
    }

    setParticles(items)
  }, [])

  /* Animate particles */
  useEffect(() => {
    let raf: number
    const animate = () => {
      setParticles(p =>
        p.map(el => ({
          ...el,
          y: el.y - el.speed,
          x: el.x + Math.sin(el.y * 0.01),
          ...(el.y < -50
            ? { y: window.innerHeight + 50, x: Math.random() * window.innerWidth }
            : {}),
        }))
      )
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  /* Cursor glow */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.transform =
        `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50"
        style={{
          background:
            "radial-gradient(circle, rgba(255,154,203,0.8), transparent 60%)",
          filter: "blur(2px)",
        }}
      />

      {/* Floating background particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none opacity-40"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            transform: "translate(-50%, -50%)",
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 fade-in">
          Happy New Year, My Love ✨
        </h1>

        <p className="max-w-2xl text-lg md:text-xl opacity-90 fade-in">
          Every year feels brighter with you by my side.
          This little world is just for you — a place where
          my love lives, grows, and waits for our forever.
        </p>

        <div className="mt-12 fade-in">
          <span className="inline-block px-8 py-4 rounded-full text-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,154,203,0.4), rgba(255,214,165,0.4))",
              backdropFilter: "blur(10px)",
            }}
          >
            💖 Scroll & Feel the Magic 💖
          </span>
        </div>
      </section>
    </main>
  )
}
