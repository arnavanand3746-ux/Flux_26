"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CanvasWave } from "@/components/ui/canvas-wave"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 overflow-hidden bg-background">
      {/* Interactive Wave Background */}
      <CanvasWave />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
        >
          Build. Break.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mlh-red to-mlh-light-blue">Rebuild the Future.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 font-medium"
        >
          Join 1000+ student developers, designers, and creators for 36 hours of non-stop hacking, learning, and shipping real products.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 border-2 border-transparent hover:border-slate-800">
              Apply to Hack
            </Button>
          </Link>
          <Link href="/sponsors" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg h-14 px-8 border-2 border-transparent hover:border-slate-800">
              Sponsor Us
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-slate-500 font-bold text-sm tracking-widest uppercase"
        >
          Scroll to explore
        </motion.div>
      </div>
    </section>
  )
}
