"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"

const steps = [
  { num: "01", title: "Apply", desc: "Submit your application. Show us what you've built or want to build.", align: "left" },
  { num: "02", title: "Form a Team", desc: "Find teammates on our Discord or during the offline mixer event.", align: "right" },
  { num: "03", title: "Build", desc: "36 hours of intense hacking, fueled by coffee, snacks, and mentorship.", align: "left" },
  { num: "04", title: "Ship & Demo", desc: "Deploy your project and pitch it to top founders and engineers.", align: "right" },
]

export function HackerJourney() {
  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-6">
          The <span className="text-mlh-red">Hacker Journey</span>
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-200" />
        
        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center w-full ${step.align === "left" ? "justify-start" : "justify-end"} relative`}>
              <motion.div 
                initial={{ opacity: 0, x: step.align === "left" ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`w-5/12 mlh-card p-6 ${step.align === "left" ? "text-right" : "text-left"}`}
              >
                <div className={`font-mono text-xl font-bold mb-2 ${i % 2 === 0 ? "text-mlh-blue" : "text-mlh-red"}`}>
                  Phase {step.num}
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 font-medium">{step.desc}</p>
              </motion.div>
              
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white bg-mlh-yellow z-10 shadow-sm" />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
