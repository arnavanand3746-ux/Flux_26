"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function ParachuteMan() {
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollPercent(pct)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    <motion.div
      style={{
        top: `${18 + scrollPercent * 0.65}%`, // slide smoothly from 18% to 83% of screen height
      }}
      animate={{
        x: [0, 6, -6, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      }}
      className="fixed left-2 md:left-6 z-40 pointer-events-none hidden sm:flex flex-col items-center select-none"
    >
      <svg
        width="75"
        height="115"
        viewBox="0 0 80 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)] filter"
      >
        {/* Parachute Canopy (MLH Red/Blue/Yellow striped) */}
        <path d="M10 40C10 15 70 15 70 40H60C60 22 53 20 50 20C47 20 43 22 40 22C37 22 33 20 30 20C27 20 20 22 20 40H10Z" fill="#ea2745" />
        <path d="M20 40C20 22 27 20 30 20C33 20 37 22 40 22C43 22 47 20 50 20C53 20 60 22 60 40H50C50 30 45 28 40 28C35 28 30 30 30 40H20Z" fill="#002b5c" />
        <path d="M30 40C30 30 35 28 40 28C45 28 50 30 50 40H40H30Z" fill="#f5c400" />
        
        {/* Strings */}
        <line x1="10" y1="40" x2="40" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="25" y1="40" x2="40" y2="80" stroke="#94a3b8" strokeWidth="1" />
        <line x1="55" y1="40" x2="40" y2="80" stroke="#94a3b8" strokeWidth="1" />
        <line x1="70" y1="40" x2="40" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
        
        {/* Hacker Character */}
        {/* Backpack */}
        <rect x="33" y="88" width="14" height="15" rx="3" fill="#64748b" />
        
        {/* Body */}
        <rect x="36" y="85" width="8" height="18" rx="4" fill="#1e293b" />
        
        {/* Head */}
        <circle cx="40" cy="78" r="6" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
        {/* Hacker Cap */}
        <path d="M34 76C34 72 46 72 46 76H34Z" fill="#ea2745" />
        
        {/* Arms holding strings */}
        <path d="M32 88L40 80L48 88" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Legs dangling */}
        <path d="M37 103V114" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <path d="M43 103V114" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        {/* Shoes */}
        <rect x="34" y="112" width="5" height="3" rx="1" fill="#ea2745" />
        <rect x="41" y="112" width="5" height="3" rx="1" fill="#ea2745" />
      </svg>
      <span className="text-[10px] font-mono font-black bg-white border-2 border-slate-200 px-2 py-0.5 rounded-md shadow-sm text-slate-600 mt-2 uppercase tracking-wider">
        FLUX BUILDER
      </span>
    </motion.div>
  )
}
