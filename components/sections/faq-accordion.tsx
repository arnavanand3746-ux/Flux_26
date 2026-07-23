"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Plus, Minus } from "lucide-react"

const faqs = [
  { q: "Who can participate?", a: "Any university student or recent graduate (within 1 year) who is passionate about building can apply." },
  { q: "Do I need a team?", a: "You can apply solo or as a team (up to 4 members). We'll have team formation activities before hacking begins." },
  { q: "Is FLUX beginner-friendly?", a: "Absolutely! We have beginner tracks, mentor sessions, and introductory workshops to help you get started." },
  { q: "Is it online or offline?", a: "FLUX '26 is an offline, in-person hackathon. The exact venue details will be shared with accepted hackers." },
  { q: "How much does it cost?", a: "Zero. Registration, food, swag, and accommodation during the event are entirely free for accepted participants." },
  { q: "Will mentors be available?", a: "Yes, we have over 50 mentors from top tech companies to guide you throughout the 36 hours." },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionWrapper id="faq">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 text-slate-900">
            Got <span className="text-mlh-yellow">Questions?</span>
          </h2>
          <p className="text-slate-600 text-lg mb-8 font-medium">
            Can't find what you're looking for? Reach out to our team on Discord or via email.
          </p>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="mlh-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left group hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-lg text-slate-800 group-hover:text-mlh-blue transition-colors">
                  {faq.q}
                </span>
                <span className="text-slate-400 group-hover:text-mlh-blue">
                  {openIndex === i ? <Minus /> : <Plus />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50"
                  >
                    <p className="px-6 pb-4 pt-2 text-slate-600 leading-relaxed border-t border-slate-200">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
