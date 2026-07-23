"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Maximize2, ArrowLeft, ArrowRight, Download, Laptop, Presentation, Award, BookOpen } from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle?: string
  content?: string
  points?: string[]
  type: "title" | "content" | "grid"
  bg: string
  textColor: string
  accentColor: string
}

import { loadPageContent } from "@/app/lib/page-content"

const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "FLUX '26 HACKATHON",
    subtitle: "Build. Break. Rebuild the Future.",
    content: "Uttar Pradesh's emerging student innovation movement and developer community.",
    type: "title",
    bg: "bg-mlh-blue",
    textColor: "text-white",
    accentColor: "text-mlh-yellow"
  },
  {
    id: 2,
    title: "The Problem We Face",
    subtitle: "Isolated developer bases & outdated curriculums",
    points: [
      "Traditional classrooms lack focus on actual product shipping.",
      "Outdated technology stacks keep students isolated from modern engineering.",
      "Lack of structured mentorship leads to high project abandonment rates.",
      "Lack of direct channels for top companies to source premier technical student talent."
    ],
    type: "content",
    bg: "bg-white border-4 border-slate-900",
    textColor: "text-slate-900",
    accentColor: "text-mlh-red"
  },
  {
    id: 3,
    title: "The Solution: FLUX Arena",
    subtitle: "A 36-hour sandbox of absolute focus",
    points: [
      "Learn by Shipping: A strict building marathon with zero boring seminars.",
      "Vibrant Community: Connect 1000+ student developers, designers, and authors.",
      "1:1 Industry Mentorship: Direct advice from Senior Engineers and CTOs.",
      "Direct Hiring pipelines: Onsite recruiter matching and pitch deck showcases."
    ],
    type: "content",
    bg: "bg-white border-4 border-slate-900",
    textColor: "text-slate-900",
    accentColor: "text-mlh-light-blue"
  },
  {
    id: 4,
    title: "Project Scope & Numbers",
    subtitle: "Impacting the local tech landscape",
    points: [
      "1000+ Registered Attendees expected from 25+ top institutes.",
      "36 Hours of hacking fueled by food, snacks, and technical support.",
      "₹5 Lakh+ Prize Pool across multiple tracks.",
      "50+ Industry Mentors guiding teams 24/7."
    ],
    type: "content",
    bg: "bg-white border-4 border-slate-900",
    textColor: "text-slate-900",
    accentColor: "text-amber-600"
  },
  {
    id: 5,
    title: "Sponsorship Packages",
    subtitle: "Engage with future tech leaders",
    points: [
      "Platinum Sponsor: Main stage branding, key-note workshops, API tracks.",
      "Gold Sponsor: Shared track sponsorships, tech recruiting, banner placements.",
      "Silver Sponsor: Booth space, swag integrations, logo placements.",
      "Community Partner: Event support, local student recruitment pipelines."
    ],
    type: "content",
    bg: "bg-white border-4 border-slate-900",
    textColor: "text-slate-900",
    accentColor: "text-emerald-600"
  },
  {
    id: 6,
    title: "Join the Innovation Wave",
    subtitle: "October 10-12, 2026",
    content: "Contact us to sponsor, mentor, or register: hello@fluxhack.com. Let's build the future together.",
    type: "title",
    bg: "bg-mlh-red",
    textColor: "text-white",
    accentColor: "text-mlh-yellow"
  }
]

export default function PitchDeckPage() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await loadPageContent<Slide[]>("pitch-deck", defaultSlides)
      setSlides(res)
    }
    fetchSlides()
  }, [])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setSlideIdx(prev => Math.min(prev + 1, slides.length - 1))
      } else if (e.key === "ArrowLeft") {
        setSlideIdx(prev => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFsChange)
    return () => document.removeEventListener("fullscreenchange", handleFsChange)
  }, [])

  const next = () => setSlideIdx(prev => Math.min(prev + 1, slides.length - 1))
  const prev = () => setSlideIdx(prev => Math.max(prev - 1, 0))

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      deckRef.current?.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen mode:", err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="pt-8 min-h-[95vh] bg-slate-50">
      <SectionWrapper>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-5xl md:text-6xl font-black mb-4 text-slate-900">
            FLUX Pitch <span className="text-mlh-red">Deck</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
            An interactive HTML presentation template. Click <strong>Present</strong> to go full-screen or download templates.
          </p>
        </div>

        {/* Presentation Area */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Deck Frame */}
          <div 
            ref={deckRef} 
            className={`relative aspect-[16/9] w-full rounded-2xl overflow-hidden transition-all duration-300 mlh-card shadow-[6px_6px_0px_rgba(0,43,92,1)] ${
              isFullscreen ? "h-screen w-screen rounded-none border-none shadow-none" : "bg-white"
            }`}
          >
            {/* Active Slide Renderer */}
            <div className={`w-full h-full flex flex-col justify-center px-10 md:px-20 py-12 select-none relative ${
              slides[slideIdx].bg
            } ${slides[slideIdx].textColor}`}>
              
              {/* Slide Brand Indicator */}
              <div className="absolute top-6 left-10 md:left-20 flex items-center gap-2">
                <span className={`font-heading font-black tracking-wider text-xs ${
                  slides[slideIdx].bg.includes("bg-white") ? "text-mlh-blue" : "text-white"
                }`}>FLUX '26</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mlh-red animate-pulse" />
              </div>

              <div className="absolute top-6 right-10 md:right-20 text-xs font-mono opacity-50">
                {slideIdx + 1} / {slides.length}
              </div>

              {/* Slide Content Layouts */}
              <div className="space-y-6 max-w-3xl">
                {slides[slideIdx].type === "title" ? (
                  <motion.div
                    key={`title-${slideIdx}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 text-center md:text-left"
                  >
                    <h2 className="font-heading text-4xl md:text-6xl font-black tracking-tight leading-tight">
                      {slides[slideIdx].title}
                    </h2>
                    <p className={`font-heading font-bold text-lg md:text-2xl ${slides[slideIdx].accentColor}`}>
                      {slides[slideIdx].subtitle}
                    </p>
                    {slides[slideIdx].content && (
                      <p className="text-slate-200 text-sm md:text-lg max-w-xl font-medium mt-6">
                        {slides[slideIdx].content}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`content-${slideIdx}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className={`font-mono text-xs md:text-sm font-bold uppercase tracking-wider ${slides[slideIdx].accentColor}`}>
                        {slides[slideIdx].subtitle}
                      </span>
                      <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight text-slate-900 mt-1">
                        {slides[slideIdx].title}
                      </h2>
                    </div>

                    <ul className="grid grid-cols-1 gap-3 md:gap-4 pt-4">
                      {slides[slideIdx].points?.map((pt, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 font-medium text-sm md:text-base leading-relaxed">
                          <span className={`font-black shrink-0 ${slides[slideIdx].accentColor}`}>👉</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Slide Controller Overlay (only shown in Fullscreen on hover, or always on normal view) */}
            <div className={`absolute bottom-4 right-6 flex gap-2 z-30 transition-opacity ${
              isFullscreen ? "opacity-30 hover:opacity-100" : ""
            }`}>
              <button 
                onClick={prev}
                disabled={slideIdx === 0}
                className="w-10 h-10 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer disabled:opacity-30 transition-all border border-white/10"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={next}
                disabled={slideIdx === slides.length - 1}
                className="w-10 h-10 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer disabled:opacity-30 transition-all border border-white/10"
              >
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-all border border-white/10"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border-2 border-slate-200 mlh-card p-6 gap-4">
            <div className="text-center sm:text-left">
              <span className="font-heading font-black text-lg text-slate-900 block">HTML Slide Deck Controller</span>
              <span className="text-slate-500 font-medium text-xs">Use Left/Right arrow keys or click the buttons to control.</span>
            </div>
            <div className="flex gap-3">
              <Button onClick={toggleFullscreen} className="flex items-center gap-2">
                <Presentation size={16} />
                Present Fullscreen
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                PPTX Template
              </Button>
            </div>
          </div>

          {/* Guide / Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="p-6 mlh-card bg-white">
              <h3 className="font-heading font-black text-xl mb-4 text-slate-900 flex items-center gap-2">
                <Award className="text-mlh-red" size={20} />
                FLUX Pitch Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 font-medium list-disc pl-5">
                <li><strong>Urgency & Core Problem</strong>: Clearly define the issue your team is addressing. Validate it with real data or developer community trends.</li>
                <li><strong>Core Solution & Product Demo</strong>: Walk through a live demonstration of your working prototype, highlighting how it directly solves the problem.</li>
                <li><strong>Technical Implementation</strong>: Show a clean diagram of your architecture. Detail database choices, APIs, and cloud services integrated.</li>
                <li><strong>Impact & Business Potential</strong>: Discuss the scalability, user acquisition potential, or market feasibility of turning this hack into a startup.</li>
              </ul>
            </Card>
            <Card className="p-6 mlh-card bg-white">
              <h3 className="font-heading font-black text-xl mb-4 text-slate-900 flex items-center gap-2">
                <BookOpen className="text-mlh-blue" size={20} />
                Template Instructions
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 font-medium list-disc pl-5">
                <li><strong>Download PPTX / Copy Slides</strong>: Click the template button to save the official FLUX layout presentation locally.</li>
                <li><strong>Brand Palette compliance</strong>: Use the pre-selected FLUX theme colors (FLUX Red, FLUX Blue, FLUX Yellow) for all shapes to match brand sponsors.</li>
                <li><strong>Typography Rules</strong>: Use <strong>Space Grotesk</strong> for headers and <strong>Inter</strong> for body copy. Restrict fonts to 2 styles maximum.</li>
                <li><strong>Embed Live References</strong>: Include a dedicated slide showing your live deployed application URL and GitHub repository link.</li>
              </ul>
            </Card>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
