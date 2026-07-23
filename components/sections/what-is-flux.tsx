"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Code, Users, Zap } from "lucide-react"

export function WhatIsFlux() {
  return (
    <SectionWrapper id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            What is <span className="text-mlh-blue">FLUX?</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            FLUX is not just another hackathon. It's a movement to empower the next generation of builders in India. We believe in learning by doing, breaking things, and collaborating to build solutions that actually matter.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Whether you are a seasoned open-source contributor or a first-year student writing your first line of code, FLUX provides the environment, mentorship, and resources you need to ship your ideas.
          </p>
        </motion.div>

        <div className="grid gap-6">
          <FeatureCard 
            icon={<Code className="text-mlh-red" size={28} />}
            title="Learn by Building"
            desc="Workshops are great, but shipping is better. Build real projects."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Users className="text-mlh-blue" size={28} />}
            title="Find Your Co-Founders"
            desc="Meet your next co-founder, collaborator, or best friend."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Zap className="text-mlh-yellow" size={28} />}
            title="Accelerate Your Career"
            desc="Get noticed by top companies and grab internship opportunities."
            delay={0.3}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="mlh-card p-6 flex gap-6 items-start"
    >
      <div className="p-4 rounded-xl bg-slate-100 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{desc}</p>
      </div>
    </motion.div>
  )
}
