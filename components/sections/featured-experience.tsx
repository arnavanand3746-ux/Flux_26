"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Zap, Code, Shield, ChevronLeft, ChevronRight } from "lucide-react"

const defaultTeam = [
  {
    name: "Krish Kumar Singh",
    role: "Founder & Lead Organizer",
    quote: "Building the developer community I wish I had when I started. FLUX '26 is about real code, not just pitch decks.",
    initials: "K",
    color: "bg-mlh-red",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    name: "Arnav Anand",
    role: "Co-Founder & Tech Lead",
    quote: "We provide the infrastructure and cloud credits so you can focus entirely on creating. Let's see what you ship!",
    initials: "A",
    color: "bg-mlh-light-blue",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    name: "Omm Prakash Lenka",
    role: "Co-Founder & Operations",
    quote: "Logistics, food, gigabit internet, and resting zones—we handle the details so you can focus on building.",
    initials: "OM",
    color: "bg-mlh-yellow text-slate-900",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    name: "Azam Khan",
    role: "Community Manager",
    quote: "Connecting 1000+ builders to exchange ideas, form teams, and collaborate year-round in our Discord.",
    initials: "AK",
    color: "bg-emerald-500",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    name: "Usama Ameen",
    role: "Core Mentor & Tech Lead",
    quote: "Stuck on a compile error or cloud database architecture? Our mentors are on standby to get you building.",
    initials: "UA",
    color: "bg-slate-800",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
   {
    name: "Chetan Sharma",
    role: "Director at Flux",
    quote: "Flux is not just a Community,It is a space that will lead the future events and operations.",
    initials: "CH",
    color: "bg-slate-800",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  }
]

export function FeaturedExperience() {
  const [teamList, setTeamList] = useState<any[]>(defaultTeam)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const storedTeam = localStorage.getItem("flux-team-members")
    if (storedTeam) {
      try {
        const parsed = JSON.parse(storedTeam)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeamList(parsed)
        }
      } catch (e) {
        console.error("Error parsing stored team members:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (teamList.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % teamList.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [teamList])

  const next = () => {
    if (teamList.length === 0) return
    setIndex((prev) => (prev + 1) % teamList.length)
  }
  const prev = () => {
    if (teamList.length === 0) return
    setIndex((prev) => (prev - 1 + teamList.length) % teamList.length)
  }

  if (teamList.length === 0) return null

  const currentMember = teamList[index] || teamList[0] || {
    name: "",
    role: "",
    quote: "",
    initials: "",
    color: "bg-slate-500",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  }

  return (
    <SectionWrapper className="bg-mlh-blue text-white overflow-hidden border-y-2 border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-6">
            More than a <span className="text-mlh-yellow">Weekend.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 font-medium">
            FLUX gives you an environment designed for absolute focus and creativity. From high-speed internet to hardware labs, we provide the tools so you can just build.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-slate-200">
              <Zap className="text-mlh-yellow shrink-0" />
              <span>Unlimited hardware access & cloud credits</span>
            </li>
            <li className="flex items-center gap-4 text-slate-200">
              <Code className="text-mlh-light-blue shrink-0" />
              <span>1:1 mentorship from industry engineers</span>
            </li>
            <li className="flex items-center gap-4 text-slate-200">
              <Shield className="text-mlh-red shrink-0" />
              <span>Dedicated quiet zones and resting areas</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Stylized Slider Card */}
          <div className="rounded-xl border-2 border-white/20 bg-white/5 p-6 backdrop-blur-md shadow-2xl relative z-10 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-mlh-red" />
                <div className="w-3 h-3 rounded-full bg-mlh-yellow" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-white/50 tracking-wider">FLUX CORE TEAM</span>
            </div>

            {/* Slider Content */}
            <div className="flex-grow flex flex-col justify-center relative overflow-hidden min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-heading font-black text-xl text-white ${currentMember.color || "bg-mlh-blue"}`}>
                      {currentMember.initials || currentMember.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "FL"}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xl text-white">{currentMember.name}</h4>
                      <p className="text-sm text-mlh-yellow font-bold">{currentMember.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-200 italic font-medium text-lg leading-relaxed">
                    "{currentMember.quote}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
              <div className="flex gap-3">
                <a href={currentMember.socials?.twitter || "#"} className="text-white/60 hover:text-mlh-yellow transition-colors" aria-label="Twitter">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href={currentMember.socials?.github || "#"} className="text-white/60 hover:text-mlh-yellow transition-colors" aria-label="GitHub">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href={currentMember.socials?.linkedin || "#"} className="text-white/60 hover:text-mlh-yellow transition-colors" aria-label="LinkedIn">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764.784 1.764 1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={prev}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Previous Team Member"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={next}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Next Team Member"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
