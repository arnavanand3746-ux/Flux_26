"use client"
import React from "react"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

import { loadPageContent } from "@/app/lib/page-content"

const defaultFounders = [
  {
    name: "Aarav Sharma",
    role: "Founder & Lead Organizer",
    thought: "FLUX '26 is built on the philosophy of shipping real products. We want to bridge the gap between classroom theory and real-world software engineering by empowering students to build what they want.",
    initials: "AS",
    color: "bg-mlh-red text-white",
  },
  {
    name: "Dr. Ananya Iyer",
    role: "Co-Founder & Tech Lead",
    thought: "Our mission is to create a frictionless sandbox for student builders. We provide the mentorship, APIs, and cloud credits—the rest is up to your imagination. Let's see what you ship!",
    initials: "AI",
    color: "bg-mlh-light-blue text-white",
  },
  {
    name: "Kabir Mehta",
    role: "Co-Founder & Operations",
    thought: "Hackathons are intense, but they are also career-defining community hubs. We design FLUX to be a memorable, supportive, and incredibly fun environment for every participant.",
    initials: "KM",
    color: "bg-mlh-yellow text-slate-900",
  }
]

export function FoundersCorner() {
  const [founders, setFounders] = React.useState<any[]>(defaultFounders)

  React.useEffect(() => {
    const fetchTeam = async () => {
      const data = await loadPageContent<any[]>("team", [])
      if (data && data.length > 0) {
        const mapped = data.map(m => ({
          ...m,
          thought: m.quote || m.thought
        }))
        setFounders(mapped)
      }
    }
    fetchTeam()
  }, [])
  return (
    <SectionWrapper id="founders" className="bg-slate-50 border-y border-slate-200">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Founder's <span className="text-mlh-blue">Corner</span>
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
          The minds behind the FLUX movement and their vision for the next generation of builders.
        </p>
      </div>

      {/* Grid of Founders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {founders.map((founder, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="p-8 h-full bg-white mlh-card flex flex-col justify-between relative overflow-hidden">
              {/* Background Quote Icon decoration */}
              <div className="absolute -top-4 -right-4 opacity-5 text-slate-950 pointer-events-none">
                <Quote size={120} />
              </div>

              <div className="space-y-6">
                <Quote className="text-mlh-light-blue w-8 h-8" />
                <p className="text-slate-600 font-medium text-base leading-relaxed italic relative z-10">
                  "{founder.thought}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading font-black text-lg shadow-sm border-2 border-slate-900/10 ${founder.color}`}>
                  {founder.initials}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900 leading-snug">{founder.name}</h4>
                  <p className="text-xs text-mlh-blue font-bold uppercase tracking-wider">{founder.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
