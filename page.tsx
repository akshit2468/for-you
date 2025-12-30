"use client"

import { useEffect, useRef, useState } from "react"

interface Ripple {
  id: number
  x: number
  y: number
  startTime: number
}

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  speed: number
  direction: number
  shape: "circle" | "square" | "triangle"
  color: string
}

const CARDS = [
  { title: "Fluid Interactions", desc: "Experience smooth, liquid-like animations", icon: "~" },
  { title: "Dynamic Patterns", desc: "Watch geometric shapes dance and morph", icon: "◊" },
  { title: "Ripple Effects", desc: "Create beautiful water-like ripples", icon: "○" },
  { title: "Morphing Shapes", desc: "See elements transform in real-time", icon: "▵" },
  { title: "Color Waves", desc: "Surf through vibrant color transitions", icon: "≋" },
  { title: "Particle Magic", desc: "Generate mesmerizing particle systems", icon: "✦" },
]

export default function InteractivePage() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([])
  const rippleIdRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  // Initialize floating shapes
  useEffect(() => {
    const shapes: FloatingShape[] = []
    const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb"]
    for (let i = 0; i < 20; i++) {
      shapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 20 + Math.random() * 40,
        speed: 0.2 + Math.random() * 0.5,
        direction: Math.random() * Math.PI * 2,
        shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as any,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setFloatingShapes(shapes)
  }, [])

  // Animate floating shapes
  useEffect(() => {
    const animate = () => {
      setFloatingShapes((prev) =>
        prev.map((shape) => {
          let newX = shape.x + Math.cos(shape.direction) * shape.speed
          let newY = shape.y + Math.sin(shape.direction) * shape.speed
          let newDirection = shape.direction

          if (newX < 0 || newX > window.innerWidth) {
            newDirection = Math.PI - shape.direction
            newX = Math.max(0, Math.min(window.innerWidth, newX))
          }
          if (newY < 0 || newY > window.innerHeight) {
            newDirection = -shape.direction
            newY = Math.max(0, Math.min(window.innerHeight, newY))
          }

          return { ...shape, x: newX, y: newY, direction: newDirection }
        }),
      )
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    let rafId: number
    const smoothFollow = () => {
      setCursorPos((prev) => {
        // Lerp with slower factor (0.08) for smooth trailing effect
        const newX = prev.x + (targetPos.x - prev.x) * 0.08
        const newY = prev.y + (targetPos.y - prev.y) * 0.08
        return { x: newX, y: newY }
      })
      rafId = requestAnimationFrame(smoothFollow)
    }
    rafId = requestAnimationFrame(smoothFollow)
    return () => cancelAnimationFrame(rafId)
  }, [targetPos])

  // Draw grid pattern on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let time = 0
    const draw = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(0.5, "#1e3a8a")
      gradient.addColorStop(1, "#1e40af")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"
      ctx.lineWidth = 1

      const gridSize = 50
      const offset = time % gridSize

      for (let x = -gridSize + offset; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = -gridSize + offset; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      ctx.strokeStyle = "rgba(96, 165, 250, 0.2)"
      ctx.lineWidth = 2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin((x + time * 2 + i * 100) * 0.01) * 50
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      time += 1
      requestAnimationFrame(draw)
    }
    draw()

    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY })
    }

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  const createRipple = (x: number, y: number) => {
    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      startTime: Date.now(),
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 1500)
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative cursor-none">
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />

      {/* Floating shapes */}
      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className="fixed pointer-events-none opacity-10 transition-all duration-300"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            transform: "translate(-50%, -50%)",
          }}
        >
          {shape.shape === "circle" && (
            <div className="w-full h-full rounded-full blur-sm" style={{ backgroundColor: shape.color }} />
          )}
          {shape.shape === "square" && (
            <div className="w-full h-full rotate-45 blur-sm" style={{ backgroundColor: shape.color }} />
          )}
          {shape.shape === "triangle" && (
            <div
              className="w-0 h-0 blur-sm"
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            />
          )}
        </div>
      ))}

      <div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: "translate(-50%, -50%)",
          transition: "none",
        }}
      >
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-500 rounded-full blur-xl opacity-60 animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-full blur-md" />
          <div className="absolute inset-4 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full" />
        </div>
      </div>

      {/* Ripples */}
      {ripples.map((ripple) => {
        const elapsed = Date.now() - ripple.startTime
        const progress = elapsed / 1500
        const scale = 1 + progress * 3
        const opacity = 1 - progress

        return (
          <div
            key={ripple.id}
            className="fixed pointer-events-none z-40"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full border-4 border-blue-400 transition-all"
              style={{
                width: 100 * scale,
                height: 100 * scale,
                opacity: opacity * 0.6,
              }}
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-cyan-400 transition-all"
              style={{
                width: 100 * scale * 0.7,
                height: 100 * scale * 0.7,
                opacity: opacity * 0.8,
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%",
              }}
            />
          </div>
        )
      })}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Hero section */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block px-6 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm mb-4">
            <span className="text-blue-300 text-sm font-medium">Immersive Experience</span>
          </div>
          <h1 className="text-8xl font-bold tracking-tight mb-6">
            <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-none bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Create
            </span>
            <br />
            <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-none bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Interact
            </span>
            <br />
            <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-none bg-gradient-to-r from-sky-300 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Explore
            </span>
          </h1>
          <p className="text-2xl text-blue-200 max-w-2xl mx-auto text-balance">
            A new dimension of web interaction with liquid animations and dynamic patterns
          </p>
        </div>

        {/* Grid of interactive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
          {CARDS.map((card, index) => (
            <div
              key={index}
              className="group relative cursor-none"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`relative h-64 rounded-3xl bg-gradient-to-br from-blue-900/30 to-blue-950/50 backdrop-blur-xl border transition-all duration-500 overflow-hidden ${
                  hoveredCard === index
                    ? "border-blue-400 scale-105 shadow-2xl shadow-blue-500/20"
                    : "border-blue-700/50"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 transition-opacity duration-500 ${
                    hoveredCard === index ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div
                    className={`text-7xl mb-4 transition-all duration-500 ${
                      hoveredCard === index ? "scale-125 rotate-12" : "scale-100 rotate-0"
                    }`}
                    style={{
                      color: hoveredCard === index ? "#60a5fa" : "#94a3b8",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-100">{card.title}</h3>
                  <p className="text-blue-300">{card.desc}</p>
                </div>

                {hoveredCard === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shimmer" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center space-y-8">
          <div className="inline-flex gap-4">
            <button className="cursor-none px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/50">
              Start Exploring
            </button>
            <button className="cursor-none px-8 py-4 bg-blue-900/50 backdrop-blur-sm border border-blue-600 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300">
              Learn More
            </button>
          </div>
          <p className="text-blue-400">Click anywhere to create ripples • Move to paint with light</p>
        </div>
      </div>
    </div>
  )
}
