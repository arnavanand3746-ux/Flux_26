"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Video } from "lucide-react"

export function CommunityPreview() {
  return (
    <SectionWrapper className="bg-slate-50">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-6">
          A Community of <span className="text-mlh-light-blue">Doers</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Don't wait for the hackathon to start meeting people. Our Discord is active year-round.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-8 text-center h-full hover:border-mlh-light-blue border-2 border-transparent transition-colors shadow-sm bg-white">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-mlh-light-blue" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">Find a Team</h3>
            <p className="text-sm text-slate-500">Post your idea or skills and match with the perfect co-founders.</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Card className="p-8 text-center h-full hover:border-mlh-red border-2 border-transparent transition-colors shadow-sm bg-white">
            <Users className="w-12 h-12 mx-auto mb-4 text-mlh-red" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">Mentor Hours</h3>
            <p className="text-sm text-slate-500">Get stuck? Open a ticket and an industry expert will hop in to help.</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Card className="p-8 text-center h-full hover:border-mlh-yellow border-2 border-transparent transition-colors shadow-sm bg-white">
            <Video className="w-12 h-12 mx-auto mb-4 text-mlh-yellow" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">Live Workshops</h3>
            <p className="text-sm text-slate-500">Weekly streams on Next.js, AI wrappers, hardware, and pitching.</p>
          </Card>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
