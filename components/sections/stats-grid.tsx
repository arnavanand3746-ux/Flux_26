"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"

import React, { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"

const defaultStats = [
  { value: "₹5L+", label: "In Prizes", color: "text-mlh-red" },
  { value: "36", label: "Hours of Hacking", color: "text-mlh-blue" },
  { value: "1000+", label: "Builders", color: "text-amber-600" },
  { value: "50+", label: "Mentors", color: "text-mlh-light-blue" },
]

export function StatsGrid() {
  const [stats, setStats] = useState<any[]>(defaultStats)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await loadPageContent<any[]>("home_stats", defaultStats)
      if (data && data.length > 0) setStats(data)
    }
    fetchStats()
  }, [])
  return (
    <SectionWrapper>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="mlh-card p-8 flex flex-col items-center justify-center text-center"
          >
            <h3 className={`font-heading text-5xl md:text-6xl font-black mb-2 ${stat.color}`}>
              {stat.value}
            </h3>
            <p className="font-bold text-slate-500 uppercase tracking-wide text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
