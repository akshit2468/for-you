"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  size: number
  color: string
  rotation: number
}

export default function SparklePage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [revealedSections, setRevealedSections] = useState<number[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  const particleIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })

      // Create particle trail on move
      if (Math.random() > 0.7) {
        createParticle(e.clientX, e.clientY)
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Create burst of particles on click
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createParticle(e.clientX, e.clientY), i * 20)
      }
    }

    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((scrolled / maxScroll) * 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const createParticle = (x: number, y: number) => {
    const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]
    const angle = Math.random() * Math.PI * 2
    const distance = 40 + Math.random() * 60

    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }

    setParticles((prev) => [...prev, newParticle])

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
    }, 1000)
  }

  const revealSection = (index: number) => {
    if (!revealedSections.includes(index)) {
      setRevealedSections([...revealedSections, index])
    }
  }

  const sections = [
    { emoji: "✨", title: "Create Magic", desc: "Every interaction creates something beautiful" },
    { emoji: "🎨", title: "Express Yourself", desc: "Your movements paint the canvas" },
    { emoji: "🌈", title: "Vibrant Colors", desc: "Watch the rainbow particles dance" },
    { emoji: "💫", title: "Cosmic Wonder", desc: "Explore the universe of interaction" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden cursor-none">
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: cursorPos.x - 16,
          top: cursorPos.y - 16,
          transition: "all 0.1s ease-out",
        }}
      >
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-md opacity-75 animate-pulse" />
          <div className="absolute inset-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
          }}
        >
          <div
            className="w-full h-full transition-all duration-1000 ease-out"
            style={{
              transform: `translate(${particle.tx}px, ${particle.ty}px) rotate(${particle.rotation}deg) scale(0)`,
              opacity: 0,
              background: particle.color,
              borderRadius: "50%",
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        </div>
      ))}

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in text-pretty">
            Interactive Sparkle Experience
          </h1>
          <p className="text-2xl text-slate-300 animate-fade-in animation-delay-500 text-balance">
            Move your cursor and click to create magical particles
          </p>
          <div className="flex gap-4 justify-center animate-fade-in animation-delay-1000">
            <div className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold">
              Scroll to Explore
            </div>
          </div>
        </div>
      </div>

      {/* Interactive sections */}
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ${
              revealedSections.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
            onMouseEnter={() => revealSection(index)}
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-12 border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-7xl mb-6 text-center animate-bounce-slow">{section.emoji}</div>
              <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <p className="text-xl text-center text-slate-300">{section.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30 hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-cyan-400 mb-2">{particles.length}</div>
            <div className="text-slate-400 text-lg">Active Particles</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-purple-400 mb-2">{revealedSections.length}</div>
            <div className="text-slate-400 text-lg">Sections Discovered</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/30 hover:scale-105 transition-transform">
            <div className="text-5xl font-bold text-pink-400 mb-2">{scrollProgress.toFixed(0)}%</div>
            <div className="text-slate-400 text-lg">Journey Complete</div>
          </div>
        </div>
      </div>

      {/* Final section */}
      <div className="min-h-screen flex items-center justify-center px-4 pb-20">
        <div className="max-w-2xl text-center space-y-8">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Keep Exploring
          </h2>
          <p className="text-2xl text-slate-300 text-balance">
            Every movement creates beauty. Every click tells a story. This is your interactive canvas.
          </p>
        </div>
      </div>
    </div>
  )
}
