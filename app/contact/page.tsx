"use client"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, MapPin } from "lucide-react"

import React, { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"
import { saveSubmission, submissionTables } from "@/app/lib/submissions"

interface ContactPageData {
  title: string
  subtitle: string
  email: string
  location: string
  xUrl: string
  igUrl: string
  inUrl: string
}

const defaultContactData: ContactPageData = {
  title: "Get in Touch",
  subtitle: "Have a question that isn't answered in our FAQ? Reach out to us.",
  email: "hello@fluxhack.com",
  location: "Uttar Pradesh, India",
  xUrl: "#",
  igUrl: "#",
  inUrl: "#"
}

export default function ContactPage() {
  const [data, setData] = useState<ContactPageData>(defaultContactData)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const res = await loadPageContent<ContactPageData>("contact", defaultContactData)
      setData(res)
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    const saved = await saveSubmission(submissionTables.contactMessages, {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    if (!saved) {
      setSubmitError("We could not save your message. Please try again.")
      return
    }

    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setSubmitted(true)
  }

  return (
    <div className="pt-12">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-slate-900">
              {data.title.includes("Touch") ? (
                <>
                  Get in <span className="text-mlh-red">Touch</span>
                </>
              ) : (
                data.title
              )}
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              {data.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="font-heading font-black text-xl mb-4 text-slate-900">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <Mail className="text-mlh-red" size={20} />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <MapPin className="text-mlh-blue" size={20} />
                    <span>{data.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl mb-4 text-slate-900">Follow Us</h3>
                <div className="flex gap-4">
                  <a href={data.xUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-mlh-blue hover:text-white cursor-pointer transition-colors font-bold">X</a>
                  <a href={data.igUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-mlh-red hover:text-white cursor-pointer transition-colors font-bold">IG</a>
                  <a href={data.inUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors font-bold">IN</a>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="mlh-card p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Name</label>
                    <Input required placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-slate-200 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <Input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white border-slate-200 text-slate-900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <Input required placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-white border-slate-200 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea 
                    required
                    rows={5} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors placeholder:text-slate-400" 
                    placeholder="Your message here..."
                  />
                </div>
                {submitted && (
                  <p className="text-sm font-bold text-emerald-600">Message saved. We will get back to you soon.</p>
                )}
                {submitError && (
                  <p className="text-sm font-bold text-mlh-red">{submitError}</p>
                )}
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
