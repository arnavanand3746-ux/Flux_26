"use client"
import React, { useState } from "react"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

import { useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"
import { saveSubmission, submissionTables } from "@/app/lib/submissions"

const defaultChannels = [
  { name: "find-a-team", color: "bg-mlh-blue/20 text-mlh-blue" },
  { name: "project-showcase", color: "bg-mlh-red/20 text-mlh-red" },
  { name: "ask-a-mentor", color: "bg-emerald-100 text-emerald-500" }
]

interface CommunityPageData {
  discordUrl: string
  title: string
  subtitle: string
  description: string
  channels: typeof defaultChannels
}

const defaultCommunityData: CommunityPageData = {
  discordUrl: "https://discord.gg/flux",
  title: "The Community",
  subtitle: "Join the conversation. Meet your team. Get help from mentors.",
  description: "Our Discord server is the heart of the FLUX ecosystem. It's where teams form, ideas are validated, and late-night debugging sessions happen.",
  channels: defaultChannels
}

export default function CommunityPage() {
  const [data, setData] = useState<CommunityPageData>(defaultCommunityData)
  const [reqSubmitted, setReqSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Developer")
  const [github, setGithub] = useState("")
  const [portfolio, setPortfolio] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const res = await loadPageContent<CommunityPageData>("community", defaultCommunityData)
      setData(res)
    }
    loadData()
  }, [])

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const storedReqs = localStorage.getItem("flux-community-requests")
    const list = storedReqs ? JSON.parse(storedReqs) : []
    
    const newReq = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      github,
      portfolio,
      reason,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem("flux-community-requests", JSON.stringify([...list, newReq]))
    
    await saveSubmission(submissionTables.communityRequests, newReq)

    setReqSubmitted(true)
    
    // Clear form
    setName("")
    setEmail("")
    setRole("Developer")
    setGithub("")
    setPortfolio("")
    setReason("")
  }

  return (
    <div className="pt-12 pb-24">
      <SectionWrapper>
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-slate-900">
            {data.title.includes("Community") ? (
              <>
                The <span className="text-mlh-blue">Community</span>
              </>
            ) : (
              data.title
            )}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            {data.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl font-black mb-4 text-slate-900">Always Active.</h2>
            <p className="text-slate-600 mb-6 font-medium">
              {data.description}
            </p>
            <ul className="space-y-4 mb-8">
              {data.channels.map((chan, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${chan.color || "bg-mlh-blue/20 text-mlh-blue"}`}>#</div>
                  <span>{chan.name}</span>
                </li>
              ))}
            </ul>
            <a href={data.discordUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Join the Discord Server</Button>
            </a>
          </div>


        </div>

        {/* Join Community Form Section */}
        <div className="max-w-xl mx-auto mt-24">
          <Card className="p-6 md:p-8 mlh-card bg-white border-2 border-slate-200">
            <h2 className="font-heading text-3xl font-black text-slate-900 mb-2 text-center">
              Request to Join <span className="text-mlh-blue">FLUX</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm text-center mb-8">
              Want to contribute as a developer, designer, moderator, or organizer? Submit your details to join the core community database.
            </p>

            {reqSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                  <Check size={24} strokeWidth={3} />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900">Request Submitted!</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  Welcome to the queue! Our community leads will review your profile and send an invite to your email shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setReqSubmitted(false)} className="mt-2">
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <Input required placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address *</label>
                    <Input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-xs" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary Skill / Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-1 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors"
                    >
                      <option value="Developer">Developer / Coder</option>
                      <option value="Designer">Designer (UI/UX / 3D)</option>
                      <option value="Moderator">Community Moderator</option>
                      <option value="Organizer">Event Organizer</option>
                      <option value="Mentor">Tech Mentor</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">GitHub Profile *</label>
                    <Input required placeholder="github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} className="h-10 text-xs" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Portfolio / LinkedIn Link (Optional)</label>
                  <Input placeholder="linkedin.com/in/username" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="h-10 text-xs" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Why do you want to join FLUX? *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what you want to build or how you want to contribute..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors placeholder:text-slate-400"
                  />
                </div>

                <Button type="submit" className="w-full mt-4 h-10 text-sm">
                  Send Membership Request
                </Button>
              </form>
            )}
          </Card>
        </div>
      </SectionWrapper>
    </div>
  )
}
