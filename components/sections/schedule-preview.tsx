"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { ChevronDown, ChevronUp } from "lucide-react"

const schedule = {
  day1: [
    { time: "10:00 AM", title: "Check-in & Networking", desc: "Collect your swag, meet the organizers, and find a desk." },
    { time: "11:30 AM", title: "Opening Ceremony", desc: "Welcome address, sponsor talks, and theme reveal." },
    { time: "12:30 PM", title: "Team Formation", desc: "Last chance to find teammates." },
    { time: "01:00 PM", title: "Hacking Begins", desc: "36 hours of non-stop building." },
    { time: "06:00 PM", title: "Mentor Round 1", desc: "First checkpoint to validate ideas." },
    { time: "12:00 AM", title: "Midnight Build Sprint", desc: "Late-night pizza and coding." },
  ],
  day2: [
    { time: "09:00 AM", title: "Morning Checkpoint", desc: "Progress update and breakfast." },
    { time: "02:00 PM", title: "Mentor Round 2", desc: "Final feedback before submission." },
    { time: "01:00 AM", title: "Final Submission", desc: "Devpost submissions close." },
    { time: "09:00 AM", title: "Demo Expo", desc: "Showcase your project to the judges." },
    { time: "02:00 PM", title: "Closing Ceremony", desc: "Winners announcement and closing note." },
  ]
}

export function SchedulePreview() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1")
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <SectionWrapper id="schedule">
      <div className="text-center mb-12">
        <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 text-slate-900">
          The <span className="text-mlh-blue">Schedule</span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveDay("day1")}
            className={`px-8 py-3 rounded-full font-bold transition-all border-2 ${
              activeDay === "day1" 
                ? "bg-mlh-blue text-white border-mlh-blue" 
                : "bg-white text-slate-500 border-slate-200 hover:border-mlh-blue"
            }`}
          >
            Day 1
          </button>
          <button
            onClick={() => setActiveDay("day2")}
            className={`px-8 py-3 rounded-full font-bold transition-all border-2 ${
              activeDay === "day2" 
                ? "bg-mlh-red text-white border-mlh-red" 
                : "bg-white text-slate-500 border-slate-200 hover:border-mlh-red"
            }`}
          >
            Day 2
          </button>
        </div>

        <div className="space-y-4">
          {schedule[activeDay].map((item, i) => (
            <motion.div
              key={`${activeDay}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-2 border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono font-bold text-mlh-blue min-w-[80px]">{item.time}</span>
                  <span className="font-bold text-lg text-slate-900">{item.title}</span>
                </div>
                {expandedIndex === i ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 ml-[104px] text-slate-600 border-t border-slate-100">
                      {item.desc}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
