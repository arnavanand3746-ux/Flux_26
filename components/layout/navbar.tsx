"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 bg-mlh-blue rounded flex items-center justify-center">
            <span className="font-heading font-bold text-white text-xl">F</span>
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-mlh-blue">
            FLUX
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">About</Link>
          <Link href="/events" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Events</Link>
          <Link href="/live" className="text-xs lg:text-sm font-bold text-mlh-red hover:text-mlh-blue transition-colors flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-mlh-red block animate-pulse" />
            Live Arena
          </Link>
          <Link href="/pitch-deck" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Pitch Deck</Link>
          <Link href="/sponsors" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Sponsors</Link>
          <Link href="/community" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Community</Link>
          <Link href="/contact" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Contact</Link>
          <Link href="/admin" className="text-xs lg:text-sm font-bold text-slate-600 hover:text-mlh-blue transition-colors">Admin</Link>
          <Link href="/register">
            <Button>Register Now</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-50 text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-6"
        >
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">About</Link>
          <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Events</Link>
          <Link href="/live" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-mlh-red flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-mlh-red block animate-pulse" />
            Live Arena
          </Link>
          <Link href="/pitch-deck" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Pitch Deck</Link>
          <Link href="/sponsors" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Sponsors</Link>
          <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Community</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Contact</Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-slate-800">Admin</Link>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
            <Button size="lg">Register Now</Button>
          </Link>
        </motion.div>
      )}
    </nav>
  )
}
