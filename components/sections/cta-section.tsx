"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaSection() {
  return (
    <SectionWrapper>
      <div className="relative rounded-3xl overflow-hidden bg-mlh-light-blue border-4 border-mlh-blue mlh-card shadow-[8px_8px_0px_rgba(0,43,92,1)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mlh-red/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-7xl font-black mb-6 text-slate-900"
          >
            Ready to <span className="text-mlh-red">Build?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mb-10 font-bold"
          >
            Join the movement where student builders stop waiting and start shipping.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full h-14 text-lg font-bold border-2 border-transparent">Register Now</Button>
            </Link>
            <Link href="/community" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 text-lg bg-mlh-blue border-2 border-transparent">Join Discord</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
