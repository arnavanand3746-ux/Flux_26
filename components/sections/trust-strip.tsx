"use client"
import { motion } from "framer-motion"
import React, { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"

const defaultPartners = ["GitHub", "Twilio", "Supabase", "Vercel", "DigitalOcean", "Stripe", "Auth0", "Cloudflare", "Figma", "Notion", "Linear", "Postman"]

export function TrustStrip() {
  const [partners, setPartners] = useState<string[]>(defaultPartners)

  useEffect(() => {
    const fetchPartners = async () => {
      const data = await loadPageContent<string[]>("home_partners", defaultPartners)
      if (data && data.length > 0) setPartners(data)
    }
    fetchPartners()
  }, [])

  return (
    <div className="w-full bg-slate-50 border-y-2 border-slate-200 py-12 overflow-hidden flex relative z-10 shadow-sm">
      {/* Fade masks for smooth entry/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex whitespace-nowrap gap-24 px-8 items-center"
      >
        {/* Duplicate the array to create a seamless loop */}
        {[...partners, ...partners, ...partners, ...partners].map((sponsor, i) => (
          <div 
            key={i} 
            className="text-3xl md:text-4xl font-black font-heading text-slate-300 uppercase tracking-widest flex items-center hover:text-slate-400 transition-colors cursor-default"
          >
            {sponsor}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
