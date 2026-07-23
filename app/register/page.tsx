"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Input } from "@/components/ui/input"
import { supabase } from '@/app/lib/supabase';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Users, Search, Check, Layers } from "lucide-react"

interface TeamMember {
  name: string
  email: string
  github: string
}

interface TeamRegistration {
  id: string
  teamName: string
  track: string
  leaderName: string
  leaderEmail: string
  leaderGithub: string
  members: TeamMember[]
  timestamp: string
}

const tracks = [
  "AI & Agents",
  "Web3 & Blockchain",
  "Cloud & DevOps",
  "Hardware & IoT",
  "Design / UI/UX",
  "Cybersecurity"
]

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"register" | "dashboard">("register")
  const [success, setSuccess] = useState(false)
  const [registeredTeams, setRegisteredTeams] = useState<TeamRegistration[]>()
  const [searchQuery, setSearchQuery] = useState("")

  // Dashboard Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  // Form State
  const [teamName, setTeamName] = useState("")
  const [track, setTrack] = useState(tracks[0])
  const [leaderName, setLeaderName] = useState("")
  const [leaderEmail, setLeaderEmail] = useState("")
  const [leaderGithub, setLeaderGithub] = useState("")
  const [members, setMembers] = useState<TeamMember[]>([])

  // Load registered teams from Supabase
  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('team_registrations').select('*');
      if (error) {
        console.error('Error fetching teams:', error);
        setRegisteredTeams([]);
      } else {
        setRegisteredTeams(data);
      }
    };
    fetchTeams();
  }, []);


  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: "", email: "", github: "" }])
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members]
    updated[index][field] = value
    setMembers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newReg: TeamRegistration = {
      id: crypto.randomUUID(),
      teamName,
      track,
      leaderName,
      leaderEmail,
      leaderGithub,
      members,
      timestamp: new Date().toISOString()
    }
    const { error } = await supabase.from('team_registrations').insert([newReg]);
    if (error) {
      console.error('Error saving team registration:', error);
    } else {
      setRegisteredTeams((prev) => [newReg, ...(prev || [])]);
    }
    
    // Clear Form
    setTeamName("")
    setTrack(tracks[0])
    setLeaderName("")
    setLeaderEmail("")
    setLeaderGithub("")
    setMembers([])
    
    setSuccess(true)
  }

  const deleteTeam = async (id: string) => {
    const { error } = await supabase.from('team_registrations').delete().eq('id', id);
    if (error) {
      console.error('Error deleting team:', error);
    } else {
      const updated = (registeredTeams || []).filter(t => t.id !== id);
      setRegisteredTeams(updated);
    }
  }

  const filteredTeams = (registeredTeams || []).filter(team => 
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.track.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pt-8 min-h-[90vh]">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading text-5xl md:text-6xl font-black mb-4 text-slate-900">
              Enter the <span className="text-mlh-blue">FLUX</span>
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Register your team for FLUX '26 and claim your space in UP's emerging hackathon community.
            </p>

            {/* Navigation Tabs */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => { setActiveTab("register"); setSuccess(false) }}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "bg-mlh-blue border-mlh-blue text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:border-mlh-blue"
                }`}
              >
                Registration Form
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "dashboard"
                    ? "bg-mlh-blue border-mlh-blue text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:border-mlh-blue"
                }`}
              >
                <Users size={16} />
                Live Registry Dashboard ({registeredTeams?.length || 0})
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "register" ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                {success ? (
                  <Card className="p-10 text-center max-w-xl mx-auto mlh-card bg-white">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500 shadow-sm">
                      <Check className="w-8 h-8" strokeWidth={3} />
                    </div>
                    <h2 className="font-heading text-3xl font-black mb-4 text-slate-900">Registration Successful!</h2>
                    <p className="text-slate-600 mb-8 font-medium">
                      Your team has been successfully registered on the FLUX client database. You can check your entry in the Registry Dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={() => setSuccess(false)} variant="outline">
                        Register Another Team
                      </Button>
                      <Button onClick={() => setActiveTab("dashboard")}>
                        Go to Dashboard
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit} className="mlh-card p-6 md:p-10 space-y-8 bg-white border-2 border-slate-200">
                    {/* Section 1: Team Info */}
                    <div className="space-y-6">
                      <h3 className="font-heading font-black text-2xl text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-2">
                        <Layers className="text-mlh-red" size={24} />
                        Team Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Team Name *</label>
                          <Input 
                            required 
                            placeholder="e.g. Byte Busters"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Hackathon Track *</label>
                          <select
                            value={track}
                            onChange={(e) => setTrack(e.target.value)}
                            className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors"
                          >
                            {tracks.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Leader Info */}
                    <div className="space-y-6">
                      <h3 className="font-heading font-black text-2xl text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-2">
                        <Users className="text-mlh-blue" size={24} />
                        Team Leader (Member 1)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Full Name *</label>
                          <Input 
                            required 
                            placeholder="Aarav Sharma"
                            value={leaderName}
                            onChange={(e) => setLeaderName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Email Address *</label>
                          <Input 
                            required 
                            type="email"
                            placeholder="leader@example.com"
                            value={leaderEmail}
                            onChange={(e) => setLeaderEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">GitHub Profile *</label>
                          <Input 
                            required 
                            placeholder="github.com/username"
                            value={leaderGithub}
                            onChange={(e) => setLeaderGithub(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Dynamic Members */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
                        <h3 className="font-heading font-black text-2xl text-slate-900 flex items-center gap-2">
                          <Users className="text-mlh-yellow" size={24} />
                          Team Members (Optional, Max 3)
                        </h3>
                        {members.length < 3 && (
                          <button
                            type="button"
                            onClick={addMember}
                            className="text-xs font-bold bg-slate-100 hover:bg-mlh-blue hover:text-white text-slate-700 px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={14} /> Add Member
                          </button>
                        )}
                      </div>

                      {members.length === 0 ? (
                        <p className="text-sm text-slate-500 font-medium italic">
                          Hacking solo? You can add team members later or proceed to register as an individual.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {members.map((member, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-lg relative border border-slate-200">
                              <button
                                type="button"
                                onClick={() => removeMember(idx)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-mlh-red cursor-pointer"
                              >
                                <Trash2 size={18} />
                              </button>
                              <h4 className="font-heading font-bold text-sm text-slate-700 mb-4">Member #{idx + 2} Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-600">Full Name</label>
                                  <Input
                                    required
                                    placeholder="Member Name"
                                    value={member.name}
                                    onChange={(e) => updateMember(idx, "name", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-600">Email</label>
                                  <Input
                                    required
                                    type="email"
                                    placeholder="email@example.com"
                                    value={member.email}
                                    onChange={(e) => updateMember(idx, "email", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-600">GitHub</label>
                                  <Input
                                    required
                                    placeholder="github.com/username"
                                    value={member.github}
                                    onChange={(e) => updateMember(idx, "github", e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button type="submit" className="w-full h-12 text-lg">
                        Submit Application
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {!isAuthenticated ? (
                  <Card className="p-10 text-center max-w-md mx-auto mlh-card bg-white">
                    <h2 className="font-heading text-2xl font-black mb-4 text-slate-900">Admin Access Required</h2>
                    <p className="text-slate-600 mb-6 font-medium text-sm">
                      Please enter the admin password to view the live registry dashboard.
                    </p>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (password === "YPGYVR2CG#@") {
                        setIsAuthenticated(true);
                      } else {
                        alert("Incorrect password");
                      }
                    }} className="space-y-4">
                      <Input 
                        type="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full">
                        Unlock Dashboard
                      </Button>
                    </form>
                  </Card>
                ) : (
                  <>
                    {/* Search Bar */}
                    <div className="flex gap-4 items-center mlh-card p-4 bg-white border-2 border-slate-200">
                  <Search className="text-slate-400 shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder="Search by Team Name, Track, or Leader Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-slate-900 placeholder:text-slate-400 bg-transparent outline-none text-sm"
                  />
                </div>

                {/* Team Grid */}
                {filteredTeams.length === 0 ? (
                  <Card className="p-12 text-center mlh-card bg-white">
                    <p className="text-slate-500 font-medium italic">No registered teams found matching your query.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTeams.map((team) => (
                      <Card key={team.id} className="p-6 mlh-card bg-white relative">

                        <h4 className="font-heading font-black text-2xl text-slate-900 mb-1">{team.teamName}</h4>
                        <span className="inline-block px-2.5 py-1 bg-mlh-blue/10 text-mlh-blue font-bold text-xs rounded mb-4">
                          {team.track}
                        </span>

                        <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                          <div>
                            <span className="font-bold text-slate-500">Team Leader:</span>
                            <p className="text-slate-950 font-semibold">{team.leaderName} ({team.leaderEmail})</p>
                            <p className="text-slate-500 text-xs font-mono">{team.leaderGithub}</p>
                          </div>

                          {team.members.length > 0 && (
                            <div>
                              <span className="font-bold text-slate-500">Members ({team.members.length}):</span>
                              <ul className="list-disc pl-5 text-slate-700 font-medium mt-1">
                                {team.members.map((m, i) => (
                                  <li key={i}>{m.name} ({m.github})</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-[10px] text-slate-400 font-mono mt-4">
                          Registered: {team.timestamp}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionWrapper>
    </div>
  )
}