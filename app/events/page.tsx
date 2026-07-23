"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Video, X, Check, Users, Plus, Trash2 } from "lucide-react"
import { supabase } from '@/app/lib/supabase';
import { loadPageContent } from "@/app/lib/page-content"


interface EventMember {
  name: string
  github: string
}

interface EventRegistration {
  id: string
  eventName: string
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderGithub: string
  members: EventMember[]
  timestamp: string
}

interface EventItem {
  name: string
  date: string
  mode: "Online" | "Offline"
  location: string
  tags: string[]
  type: string
}

const defaultEvents: EventItem[] = [
  { name: "FLUX '26 Flagship Hackathon", date: "Oct 10-12, 2026", mode: "Offline", location: "Main Arena", tags: ["Hackathon"], type: "hackathon" },
  { name: "Agentic AI Workshop", date: "Sep 15, 2026", mode: "Online", location: "Discord", tags: ["Workshop", "AI"], type: "workshop" },
  { name: "Mentor Connect: Architecture", date: "Sep 20, 2026", mode: "Online", location: "Zoom", tags: ["Mentor Session"], type: "mentor" },
  { name: "Pre-FLUX Community Meetup", date: "Sep 25, 2026", mode: "Offline", location: "City Hub", tags: ["Community"], type: "meetup" },
]

export default function EventsPage() {
  const [filter, setFilter] = useState("all")
  const [registeredEventNames, setRegisteredEventNames] = useState<string[]>([]) // tracks only THIS user's registrations (stored in localStorage)
  const [events, setEvents] = useState<EventItem[]>(defaultEvents)
  
  // Registration Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  
  // Form State
  const [teamName, setTeamName] = useState("")
  const [leaderName, setLeaderName] = useState("")
  const [leaderEmail, setLeaderEmail] = useState("")
  const [leaderGithub, setLeaderGithub] = useState("")
  const [members, setMembers] = useState<EventMember[]>([])

  // Load only THIS user's registered events from localStorage (NOT global Supabase data)
  useEffect(() => {
    const myRegs = localStorage.getItem("flux-my-registered-events")
    if (myRegs) {
      setRegisteredEventNames(JSON.parse(myRegs))
    }

    const fetchEvents = async () => {
      const stored = await loadPageContent<EventItem[]>("events", defaultEvents)
      setEvents(stored)
    }
    fetchEvents()
  }, []);


  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const newReg: EventRegistration = {
      id: Math.random().toString(36).substring(2, 9),
      eventName: selectedEvent.name,
      teamName,
      leaderName,
      leaderEmail,
      leaderGithub,
      members,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('event_registrations').insert([newReg]);
    if (error) {
      console.error('Error saving registration:', error.message, error.code, error.details);
    } else {
      // Save to localStorage so only THIS user sees "Registered" badge
      const updated = [...registeredEventNames, newReg.eventName]
      setRegisteredEventNames(updated)
      localStorage.setItem("flux-my-registered-events", JSON.stringify(updated))
    }

    // Reset Form
    setTeamName("");
    setLeaderName("");
    setLeaderEmail("");
    setLeaderGithub("");
    setMembers([]);
    setRegisterModalOpen(false);
    setSelectedEvent(null);
  };


  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: "", github: "" }])
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: keyof EventMember, value: string) => {
    const updated = [...members]
    updated[index][field] = value
    setMembers(updated)
  }

  const filteredEvents = filter === "all" ? events : events.filter(e => e.type === filter)

  return (
    <div className="pt-12">
      <SectionWrapper>
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6">
            <span className="text-mlh-blue">Upcoming Events</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            From hands-on workshops to the flagship 36-hour hackathon, explore what's happening in the FLUX ecosystem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border-2 cursor-pointer ${filter === f.value ? "bg-mlh-blue border-mlh-blue text-white" : "bg-white border-slate-200 text-slate-500 hover:border-mlh-blue"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-heading text-2xl font-black text-slate-900">{event.name}</h3>
                  <span className="px-2 py-1 bg-slate-100 text-xs text-slate-600 rounded font-mono font-bold uppercase">{event.mode}</span>
                </div>
                
                <div className="space-y-3 mb-6 text-slate-500 font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-mlh-blue" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    {event.mode === "Online" ? <Video size={16} className="text-mlh-red" /> : <MapPin size={16} className="text-mlh-red" />} 
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                  <div className="flex gap-2">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold text-mlh-blue bg-mlh-blue/10 px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                  {registeredEventNames.includes(event.name) ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-sm">
                      <Check size={16} />
                      Registered
                    </span>
                  ) : event.name.toLowerCase().includes("nerds room") && event.name.toLowerCase().includes("flux") ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open("https://luma.com/bz0l2wjd", "_blank")}
                    >
                      Register
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setSelectedEvent(event); setRegisterModalOpen(true) }}
                    >
                      Register
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Team Event Registration Modal */}
      <AnimatePresence>
        {registerModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-lg w-full border-2 border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-heading font-black text-2xl text-slate-900">Event Registration</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase mt-1">{selectedEvent.name}</p>
                </div>
                <button 
                  onClick={() => { setRegisterModalOpen(false); setSelectedEvent(null) }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                
                {/* Team Section */}
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-sm text-slate-900 border-b pb-1">Team Information</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Team Name *</label>
                    <Input 
                      required 
                      placeholder="e.g. Code Wizards" 
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Leader Section */}
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-sm text-slate-900 border-b pb-1">Leader Details (Member 1)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <Input 
                        required 
                        placeholder="Aarav Sharma" 
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Email *</label>
                      <Input 
                        required 
                        type="email" 
                        placeholder="you@example.com" 
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">GitHub Username *</label>
                    <Input 
                      required 
                      placeholder="github_username" 
                      value={leaderGithub}
                      onChange={(e) => setLeaderGithub(e.target.value)}
                    />
                  </div>
                </div>

                {/* Members Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-1">
                    <h4 className="font-heading font-bold text-sm text-slate-900">Additional Team Members (Optional)</h4>
                    {members.length < 3 && (
                      <button
                        type="button"
                        onClick={addMember}
                        className="text-[10px] font-bold bg-slate-100 hover:bg-mlh-blue hover:text-white px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1 text-slate-700"
                      >
                        <Plus size={10} /> Add
                      </button>
                    )}
                  </div>

                  {members.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Solo hacker? No worries. Leave this section blank.</p>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 relative">
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-mlh-red cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                          <span className="text-[10px] font-bold text-slate-500 block mb-2">Member #{idx + 2}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              required
                              placeholder="Full Name"
                              value={member.name}
                              onChange={(e) => updateMember(idx, "name", e.target.value)}
                              className="h-10 text-xs"
                            />
                            <Input
                              required
                              placeholder="GitHub Username"
                              value={member.github}
                              onChange={(e) => updateMember(idx, "github", e.target.value)}
                              className="h-10 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/2" 
                    onClick={() => { setRegisterModalOpen(false); setSelectedEvent(null) }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Submit Registration
                  </Button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const filters = [
  { label: "All", value: "all" },
  { label: "Hackathons", value: "hackathon" },
  { label: "Workshops", value: "workshop" },
  { label: "Mentor Sessions", value: "mentor" },
  { label: "Meetups", value: "meetup" },
]
