"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { loadPageContent } from "@/app/lib/page-content"

const defaultValues = [
  { num: "01", title: "Builders First", desc: "We prioritize actual creation over endless discussion." },
  { num: "02", title: "Learn by Building", desc: "The fastest way to learn a technology is to use it to solve a problem." },
  { num: "03", title: "Community Over Competition", desc: "Help each other. A rising tide lifts all boats." },
  { num: "04", title: "Ship Real Products", desc: "Don't stop at the demo. We want to see actual users." },
  { num: "05", title: "Collaboration at Scale", desc: "Form teams across different colleges, disciplines, and skill levels." },
]

interface AboutData {
  title: string
  mission: string
  vision: string
  values: typeof defaultValues
}

const defaultAbout: AboutData = {
  title: "Serious Student Builders",
  mission: "To bridge the gap between academic learning and real-world product development. We want to empower students to build, launch, and scale their ideas with access to top-tier mentorship and a global community.",
  vision: "To become the launchpad for the next generation of technical founders and open-source contributors from India. We see a future where student-led innovation drives the tech ecosystem forward.",
  values: defaultValues
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(defaultAbout)

  useEffect(() => {
    const loadData = async () => {
      const res = await loadPageContent<AboutData>("about", defaultAbout)
      setData(res)
    }
    loadData()
  }, [])

  return (
    <div className="flex flex-col gap-12 pt-12">
      <SectionWrapper>
        <div className="text-center mb-24 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl md:text-7xl font-black mb-6 text-slate-900"
          >
            A Movement for <br/>
            <span className="text-mlh-blue">{data.title}</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-heading text-3xl font-black text-mlh-red mb-4">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed mlh-card p-6">
              {data.mission}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-heading text-3xl font-black text-mlh-blue mb-4">Our Vision</h2>
            <p className="text-slate-600 text-lg leading-relaxed mlh-card p-6">
              {data.vision}
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <h2 className="font-heading text-4xl font-black mb-12 text-center text-slate-900">Core Values</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {data.values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 mlh-card border-l-4 border-l-mlh-blue"
              >
                <div className="font-heading text-4xl font-black text-slate-200">{val.num}</div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-slate-600 font-medium">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
