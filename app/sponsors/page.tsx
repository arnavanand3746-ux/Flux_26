"use client"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Button } from "@/components/ui/button"

import React, { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"
import { saveSubmission, submissionTables } from "@/app/lib/submissions"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"

const defaultTiers = [
  { name: "Title Sponsor", price: "Custom", perks: ["Headline branding everywhere", "Keynote slot", "Dedicated booth", "Custom hackathon track", "Access to all resumes"] },
  { name: "Gold Sponsor", price: "₹1,00,000", perks: ["Branding on website & tees", "Judge slot", "Dedicated booth", "Sponsored API prize", "Access to all resumes"] },
  { name: "Silver Sponsor", price: "₹50,000", perks: ["Branding on website", "Sponsored prize", "Workshop slot", "Access to opt-in resumes"] },
  { name: "Community Partner", price: "In-kind", perks: ["Logo on website", "Social media shoutout", "Swag distribution"] },
]

interface SponsorPageData {
  title: string
  subtitle: string
  whyTitle: string
  whyText: string
  tiers: typeof defaultTiers
}

const defaultSponsorData: SponsorPageData = {
  title: "Partner with FLUX",
  subtitle: "Get your tools, APIs, and brand in front of 1000+ of the most ambitious student developers in India.",
  whyTitle: "Why Sponsor FLUX?",
  whyText: "We aren't just hosting an event; we're building an ecosystem. Sponsoring FLUX means direct recruitment access, product feedback from early adopters, and immense brand goodwill.",
  tiers: defaultTiers
}

export default function SponsorsPage() {
  const [data, setData] = useState<SponsorPageData>(defaultSponsorData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [workEmail, setWorkEmail] = useState("")
  const [role, setRole] = useState("")
  const [selectedTier, setSelectedTier] = useState("")
  const [submitError, setSubmitError] = useState("")
  
  const openRequestModal = (tierName: string) => {
    setSelectedTier(tierName)
    setSubmitError("")
    setIsModalOpen(true)
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    const saved = await saveSubmission(submissionTables.sponsorRequests, {
      id: crypto.randomUUID(),
      companyName,
      workEmail,
      role,
      tier: selectedTier,
      timestamp: new Date().toISOString(),
    })

    if (!saved) {
      setSubmitError("We could not save this request. Please try again.")
      return
    }

    setIsSubmitted(true)
    setCompanyName("")
    setWorkEmail("")
    setRole("")
    setTimeout(() => {
      setIsModalOpen(false)
      setIsSubmitted(false)
    }, 3000)
  }

  useEffect(() => {
    const loadData = async () => {
      const res = await loadPageContent<SponsorPageData>("sponsors", defaultSponsorData)
      setData(res)
    }
    loadData()
  }, [])

  return (
    <div className="pt-12">
      <SectionWrapper>
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-slate-900">
            {data.title.includes("FLUX") ? (
              <>
                Partner with <span className="text-mlh-blue">FLUX</span>
              </>
            ) : (
              data.title
            )}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {data.tiers.map((tier, i) => (
            <div key={i} className={`p-6 mlh-card flex flex-col h-full bg-white ${i === 0 ? "border-mlh-blue shadow-[8px_8px_0px_rgba(0,43,92,0.1)] scale-105 z-10" : ""}`}>
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-2">{tier.name}</h3>
              <div className="text-xl font-bold text-slate-500 mb-6 pb-6 border-b-2 border-slate-100">{tier.price}</div>
              <ul className="space-y-3 flex-grow mb-8">
                {tier.perks.map((perk, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                    <span className="text-mlh-blue font-bold">✓</span> {perk}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-auto" variant={i === 0 ? "default" : "outline"} onClick={() => openRequestModal(tier.name)}>Request Pitch Deck</Button>
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12 text-center max-w-4xl mx-auto border-4 border-slate-900 shadow-[8px_8px_0px_rgba(0,43,92,1)] bg-slate-900 text-white rounded-xl">
          <h2 className="font-heading text-3xl font-black mb-4">{data.whyTitle}</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto font-bold">
            {data.whyText}
          </p>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200">Download Prospectus (PDF)</Button>
        </div>
      </SectionWrapper>

      {/* Pitch Deck Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-md w-full border-2 border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading font-black text-2xl text-slate-900">Request Pitch Deck</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Get our comprehensive sponsorship guide.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                  <Check size={24} strokeWidth={3} />
                </div>
                <h4 className="font-heading font-bold text-xl text-slate-900">Request Sent!</h4>
                <p className="text-slate-600 text-sm font-medium">Our team will email you the pitch deck and sponsorship details within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Company Name *</label>
                  <Input required placeholder="Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Work Email *</label>
                  <Input required type="email" placeholder="you@company.com" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Role</label>
                  <Input placeholder="e.g. Developer Relations, Marketing" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                {submitError && (
                  <p className="text-sm font-bold text-mlh-red">{submitError}</p>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Request Deck
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
