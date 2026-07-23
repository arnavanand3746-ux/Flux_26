"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"


import React, { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"

const defaultTracks = [
  { icon: "Bot", title: "AI & Agents", desc: "Build intelligent systems, LLM wrappers, and autonomous agents.", color: "bg-mlh-blue text-white" },
  { icon: "Globe", title: "Web3 & Blockchain", desc: "Decentralized apps, smart contracts, and new economies.", color: "bg-mlh-red text-white" },
  { icon: "Cloud", title: "Cloud & DevOps", desc: "Scalable architectures, infrastructure as code, and tools.", color: "bg-mlh-yellow text-slate-900" },
  { icon: "Cpu", title: "Hardware & IoT", desc: "Connect the physical world with software solutions.", color: "bg-slate-800 text-white" },
  { icon: "Palette", title: "Design / UI/UX", desc: "Create beautiful, accessible, and intuitive interfaces.", color: "bg-mlh-light-blue text-white" },
  { icon: "Shield", title: "Cybersecurity", desc: "Protect data, find vulnerabilities, and build secure apps.", color: "bg-emerald-500 text-white" },
]

import { Cpu, Globe, Cloud, Palette, Shield, Bot, Code, Zap, Database } from "lucide-react"
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "Bot": return <Bot />
    case "Globe": return <Globe />
    case "Cloud": return <Cloud />
    case "Cpu": return <Cpu />
    case "Palette": return <Palette />
    case "Shield": return <Shield />
    case "Code": return <Code />
    case "Zap": return <Zap />
    case "Database": return <Database />
    default: return <Code />
  }
}

export function Tracks() {
  const [tracks, setTracks] = useState<any[]>(defaultTracks)

  useEffect(() => {
    const fetchTracks = async () => {
      const data = await loadPageContent<any[]>("home_tracks", defaultTracks)
      if (data && data.length > 0) setTracks(data)
    }
    fetchTracks()
  }, [])
  return (
    <SectionWrapper id="tracks" className="bg-slate-50 py-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Hackathon <span className="text-mlh-blue">Tracks</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Choose a track that excites you, or combine them to build something completely unique.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="mlh-card p-6 overflow-hidden relative group"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm ${track.color}`}>
              {typeof track.icon === 'string' ? renderIcon(track.icon) : track.icon}
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 mb-3 group-hover:text-mlh-blue transition-colors">{track.title}</h3>
            <p className="text-slate-600">{track.desc}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
