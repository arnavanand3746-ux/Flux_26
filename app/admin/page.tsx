"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PagesEditor from "./PagesEditor"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar, Users, Tv, Database, Plus, Trash2, 
  Check, X, Search, RefreshCw, AlertCircle, Save, ExternalLink,
  Lock, Eye, EyeOff, LogOut, Shield, Settings
} from "lucide-react"
import { supabase } from '@/app/lib/supabase'
import { savePageContent, loadPageContent } from '@/app/lib/page-content'

// ─── Admin Credentials ───────────────────────────────────────
// Change these to set your admin login credentials.
// In production, use a proper auth backend instead.
const ADMIN_USERNAME = "flux.ioi.26@gmail.com"
const ADMIN_PASSWORD = "YPGYVR2CG#@"
const AUTH_SESSION_KEY = "flux-admin-auth"

// Types
interface EventItem {
  id: string
  name: string
  date: string
  timing?: string
  mode: "Online" | "Offline"
  location: string
  address?: string
  venueDetails?: string
  tags: string[]
  type: "hackathon" | "workshop" | "mentor" | "meetup"
}

interface TeamMember {
  id: string
  name: string
  role: string
  quote: string
  initials: string
  color: string
  socials: {
    twitter: string
    github: string
    linkedin: string
  }
}

interface StreamSettings {
  sourceUrl: string
  title: string
  speaker: string
  track: string
  discordUrl: string
}

const defaultEvents: EventItem[] = [
  { id: "event-1", name: "FLUX '26 Flagship Hackathon", date: "Oct 10-12, 2026", mode: "Offline", location: "Main Arena", tags: ["Hackathon"], type: "hackathon" },
  { id: "event-2", name: "Agentic AI Workshop", date: "Sep 15, 2026", mode: "Online", location: "Discord", tags: ["Workshop", "AI"], type: "workshop" },
  { id: "event-3", name: "Mentor Connect: Architecture", date: "Sep 20, 2026", mode: "Online", location: "Zoom", tags: ["Mentor Session"], type: "mentor" },
  { id: "event-4", name: "Pre-FLUX Community Meetup", date: "Sep 25, 2026", mode: "Offline", location: "City Hub", tags: ["Community"], type: "meetup" },
]

const defaultTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Aarav Sharma",
    role: "Founder & Lead Organizer",
    quote: "Building the developer community I wish I had when I started. FLUX '26 is about real code, not just pitch decks.",
    initials: "AS",
    color: "bg-mlh-red",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    id: "team-2",
    name: "Ananya Iyer",
    role: "Co-Founder & Tech Lead",
    quote: "We provide the infrastructure and cloud credits so you can focus entirely on creating. Let's see what you ship!",
    initials: "AI",
    color: "bg-mlh-light-blue",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    id: "team-3",
    name: "Kabir Mehta",
    role: "Co-Founder & Operations",
    quote: "Logistics, food, gigabit internet, and resting zones—we handle the details so you can focus on building.",
    initials: "KM",
    color: "bg-mlh-yellow text-slate-900",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    id: "team-4",
    name: "Riya Patel",
    role: "Community Manager",
    quote: "Connecting 1000+ builders to exchange ideas, form teams, and collaborate year-round in our Discord.",
    initials: "RP",
    color: "bg-emerald-500",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  },
  {
    id: "team-5",
    name: "Vikram Aditya",
    role: "Core Mentor & Tech Lead",
    quote: "Stuck on a compile error or cloud database architecture? Our mentors are on standby to get you building.",
    initials: "VA",
    color: "bg-slate-800",
    socials: { twitter: "#", github: "#", linkedin: "#" }
  }
]

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"events" | "team" | "stream" | "databases" | "pages">("events")
  
  // ─── Auth State ──────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Data States
  const [events, setEvents] = useState<EventItem[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [stream, setStream] = useState<StreamSettings>({
    sourceUrl: "",
    title: "",
    speaker: "",
    track: "",
    discordUrl: ""
  })
  
  // Submissions Database States
  const [registrations, setRegistrations] = useState<any[]>([])
  const [rsvps, setRsvps] = useState<any[]>([])
  const [communityRequests, setCommunityRequests] = useState<any[]>([])
  
  // Search and Filter States for DB tab
  const [dbSubTab, setDbSubTab] = useState<"registrations" | "rsvps" | "community">("registrations")
  const [searchQuery, setSearchQuery] = useState("")

  // Form States (Adding/Editing)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  
  // Event Form State
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTiming, setEventTiming] = useState("")
  const [eventMode, setEventMode] = useState<"Online" | "Offline">("Offline")
  const [eventLocation, setEventLocation] = useState("")
  const [eventAddress, setEventAddress] = useState("")
  const [eventVenueDetails, setEventVenueDetails] = useState("")
  const [eventTags, setEventTags] = useState("")
  const [eventType, setEventType] = useState<"hackathon" | "workshop" | "mentor" | "meetup">("hackathon")

  // Team Form State
  const [teamFormOpen, setTeamFormOpen] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [teamNameState, setTeamNameState] = useState("")
  const [teamRole, setTeamRole] = useState("")
  const [teamQuote, setTeamQuote] = useState("")
  const [teamInitials, setTeamInitials] = useState("")
  const [teamColor, setTeamColor] = useState("bg-mlh-blue")
  const [teamTwitter, setTeamTwitter] = useState("")
  const [teamGithub, setTeamGithub] = useState("")
  const [teamLinkedin, setTeamLinkedin] = useState("")

  // Load state on mount
  useEffect(() => {
    setMounted(true)

    // Check if already authenticated this session
    const authSession = sessionStorage.getItem(AUTH_SESSION_KEY)
    if (authSession === "true") {
      setIsAuthenticated(true)
    }

    const loadAll = async () => {
      // Load Events from Supabase (via page-content)
      const storedEvents = await loadPageContent<EventItem[]>("events", defaultEvents)
      setEvents(storedEvents && storedEvents.length > 0 ? storedEvents : defaultEvents)

      // Load Team from Supabase (via page-content)
      const storedTeam = await loadPageContent<TeamMember[]>("team", defaultTeam)
      setTeam(storedTeam && storedTeam.length > 0 ? storedTeam : defaultTeam)

      // Load Stream settings from Supabase (via page-content)
      const defaultStreamVal = {
        sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "FLUX '26 Launch Workshop",
        speaker: "Aarav Sharma",
        track: "AI & Agents",
        discordUrl: "https://discord.gg/flux"
      }
      const storedStream = await loadPageContent<StreamSettings>("stream", defaultStreamVal)
      setStream(storedStream || defaultStreamVal)

      // Load DB lists
      loadDatabases()
    }
    loadAll()
  }, [])

  const loadDatabases = async () => {
    // Fetch registrations from Supabase
    const { data: regs, error: regError } = await supabase
      .from('event_registrations')
      .select('*');
    if (regError) console.error('Error loading registrations:', regError);
    else setRegistrations(regs || []);

    // Fetch RSVPs from Supabase
    const { data: rsvpsData, error: rsvpError } = await supabase
      .from('workshop_rsvps')
      .select('*');
    if (rsvpError) console.error('Error loading RSVPs:', rsvpError);
    else setRsvps(rsvpsData || []);

    // Fetch community requests from Supabase
    const { data: comm, error: commError } = await supabase
      .from('community_requests')
      .select('*');
    if (commError) console.error('Error loading community requests:', commError);
    else setCommunityRequests(comm || []);
  }

  // Trigger temporary toast notifications
  const triggerNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Reset all settings to defaults helper
  const handleResetToDefaults = async () => {
    if (window.confirm("Are you sure you want to reset events and team members to original defaults? This will overwrite your changes.")) {
      await savePageContent("events", defaultEvents)
      await savePageContent("team", defaultTeam)
      setEvents(defaultEvents)
      setTeam(defaultTeam)
      triggerNotification("Reset events & team data to defaults successfully!")
    }
  }

  // EVENT CRUD
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventName || !eventDate || !eventLocation) {
      triggerNotification("Please fill in all required fields", "error")
      return
    }

    let updatedEvents = [...events]
    const tagArray = eventTags.split(",").map(t => t.trim()).filter(Boolean)

    if (editingEventId) {
      // Edit
      updatedEvents = updatedEvents.map(evt => 
        evt.id === editingEventId 
          ? { ...evt, name: eventName, date: eventDate, timing: eventTiming, mode: eventMode, location: eventLocation, address: eventAddress, venueDetails: eventVenueDetails, tags: tagArray, type: eventType }
          : evt
      )
      triggerNotification("Event updated successfully!")
    } else {
      // Add
      const newEvt: EventItem = {
        id: "event-" + Math.random().toString(36).substring(2, 9),
        name: eventName,
        date: eventDate,
        timing: eventTiming,
        mode: eventMode,
        location: eventLocation,
        address: eventAddress,
        venueDetails: eventVenueDetails,
        tags: tagArray,
        type: eventType
      }
      updatedEvents.push(newEvt)
      triggerNotification("New event added successfully!")
    }

    // Save events to Supabase via page-content
    await savePageContent("events", updatedEvents)
    setEvents(updatedEvents)
    closeEventForm()
  }

  const deleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updated = events.filter(evt => evt.id !== id)
      await savePageContent("events", updated)
      setEvents(updated)
      triggerNotification("Event deleted successfully!")
    }
  }

  const openEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id)
    setEventName(evt.name)
    setEventDate(evt.date)
    setEventTiming(evt.timing || "")
    setEventMode(evt.mode)
    setEventLocation(evt.location)
    setEventAddress(evt.address || "")
    setEventVenueDetails(evt.venueDetails || "")
    setEventTags(evt.tags.join(", "))
    setEventType(evt.type)
    setEventFormOpen(true)
  }

  const closeEventForm = () => {
    setEditingEventId(null)
    setEventName("")
    setEventDate("")
    setEventTiming("")
    setEventMode("Offline")
    setEventLocation("")
    setEventAddress("")
    setEventVenueDetails("")
    setEventTags("")
    setEventType("hackathon")
    setEventFormOpen(false)
  }


  // TEAM CRUD
  const saveTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamNameState || !teamRole || !teamQuote) {
      triggerNotification("Please fill in name, role, and quote", "error")
      return
    }

    let updatedTeam = [...team]
    const initials = teamInitials || teamNameState.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()

    const memberData = {
      name: teamNameState,
      role: teamRole,
      quote: teamQuote,
      initials,
      color: teamColor,
      socials: {
        twitter: teamTwitter || "#",
        github: teamGithub || "#",
        linkedin: teamLinkedin || "#"
      }
    }

    if (editingTeamId) {
      // Edit
      updatedTeam = updatedTeam.map(tMember => 
        tMember.id === editingTeamId 
          ? { ...tMember, ...memberData }
          : tMember
      )
      triggerNotification("Team profile updated successfully!")
    } else {
      // Add
      const newMember: TeamMember = {
        id: "team-" + Math.random().toString(36).substring(2, 9),
        ...memberData
      }
      updatedTeam.push(newMember)
      triggerNotification("New team member added successfully!")
    }

    // Save team to Supabase via page-content
    await savePageContent("team", updatedTeam)
    setTeam(updatedTeam)
    closeTeamForm()
  }

  const deleteTeam = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const updated = team.filter(tMember => tMember.id !== id)
      await savePageContent("team", updated)
      setTeam(updated)
      triggerNotification("Team member deleted successfully!")
    }
  }

  const openEditTeam = (tMember: TeamMember) => {
    setEditingTeamId(tMember.id)
    setTeamNameState(tMember.name)
    setTeamRole(tMember.role)
    setTeamQuote(tMember.quote)
    setTeamInitials(tMember.initials)
    setTeamColor(tMember.color)
    setTeamTwitter(tMember.socials.twitter)
    setTeamGithub(tMember.socials.github)
    setTeamLinkedin(tMember.socials.linkedin)
    setTeamFormOpen(true)
  }

  const closeTeamForm = () => {
    setEditingTeamId(null)
    setTeamNameState("")
    setTeamRole("")
    setTeamQuote("")
    setTeamInitials("")
    setTeamColor("bg-mlh-blue")
    setTeamTwitter("")
    setTeamGithub("")
    setTeamLinkedin("")
    setTeamFormOpen(false)
  }


  // STREAM CONFIGURATION SAVE
  const handleSaveStream = async (e: React.FormEvent) => {
    e.preventDefault()
    await savePageContent("stream", stream)
    triggerNotification("Live Stream settings saved successfully!")
  }


  // DATABASE DELETIONS
  const deleteRegistration = async (id: string) => {
    if (confirm("Are you sure you want to delete this event registration?")) {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting registration:', error);
        triggerNotification('Failed to delete registration.', 'error');
      } else {
        setRegistrations((prev) => prev.filter((r: any) => r.id !== id));
        triggerNotification('Registration deleted!');
      }
    }
  }

  const deleteRsvp = async (timestamp: string, email: string) => {
    if (confirm("Are you sure you want to delete this RSVP?")) {
      const { error } = await supabase
        .from('workshop_rsvps')
        .delete()
        .match({ timestamp, email });
      if (error) {
        console.error('Error deleting RSVP:', error);
        triggerNotification('Failed to delete RSVP.', 'error');
      } else {
        setRsvps((prev) => prev.filter((r: any) => !(r.timestamp === timestamp && r.email === email)));
        triggerNotification('RSVP deleted!');
      }
    }
  }

  const deleteCommunityRequest = async (id: string) => {
    if (confirm("Are you sure you want to delete this community request?")) {
      const { error } = await supabase
        .from('community_requests')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting community request:', error);
        triggerNotification('Failed to delete request.', 'error');
      } else {
        setCommunityRequests((prev) => prev.filter((r: any) => r.id !== id));
        triggerNotification('Community request deleted!');
      }
    }
  }

  // DB Filter / Search query processing
  const getFilteredRegistrations = () => {
    if (!searchQuery) return registrations
    const q = searchQuery.toLowerCase()
    return registrations.filter((r: any) => 
      r.teamName?.toLowerCase().includes(q) ||
      r.leaderName?.toLowerCase().includes(q) ||
      r.leaderEmail?.toLowerCase().includes(q) ||
      r.leaderGithub?.toLowerCase().includes(q) ||
      r.eventName?.toLowerCase().includes(q)
    )
  }

  const getFilteredRsvps = () => {
    if (!searchQuery) return rsvps
    const q = searchQuery.toLowerCase()
    return rsvps.filter((r: any) => 
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.github?.toLowerCase().includes(q) ||
      r.workshopTitle?.toLowerCase().includes(q)
    )
  }

  const getFilteredCommunityRequests = () => {
    if (!searchQuery) return communityRequests
    const q = searchQuery.toLowerCase()
    return communityRequests.filter((r: any) => 
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.github?.toLowerCase().includes(q) ||
      r.role?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q)
    )
  }


  // ─── Login Handler ──────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_SESSION_KEY, "true")
      setLoginUsername("")
      setLoginPassword("")
    } else {
      setLoginError("Invalid username or password. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_SESSION_KEY)
  }

  if (!mounted) {
    return (
      <div className="pt-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-mlh-blue rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  // ─── Login Gate ────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="p-8 md:p-10 border-2 border-slate-200 bg-white shadow-xl rounded-2xl">
            {/* Logo / Branding */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-mlh-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-mlh-blue/20">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
                FLUX Dashboard
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1.5">
                Organizer access only. Enter your credentials.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-700 text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0" />
                      {loginError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="admin-username" className="text-xs font-bold text-slate-700 block">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input
                    id="admin-username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => { setLoginUsername(e.target.value); setLoginError("") }}
                    className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-mlh-blue focus:border-mlh-blue transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-xs font-bold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError("") }}
                    className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-12 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-mlh-blue focus:border-mlh-blue transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-sm font-bold cursor-pointer mt-2">
                <Lock size={16} className="mr-2" />
                Sign In to Dashboard
              </Button>
            </form>

            {/* Footer Hint */}
            <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
              Protected area. Contact the FLUX organizing team for access.
            </p>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-12 pb-24">
      <SectionWrapper>
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b pb-6">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-3">
              <span>🛠️ FLUX Dashboard</span>
              <span className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Organizers Only</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Configure real-time hackathon features, stream embeds, event pages, team slider, and manage submission databases.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetToDefaults}
              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl text-xs mlh-card cursor-pointer transition-all active:translate-y-0.5"
            >
              <RefreshCw size={14} /> Reset Data to Defaults
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-rose-500 bg-white hover:bg-rose-50 text-rose-600 font-bold rounded-xl text-xs cursor-pointer transition-all active:translate-y-0.5"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-6 z-50 p-4 rounded-xl border-2 shadow-lg flex items-center gap-2 max-w-sm ${
                notification.type === "success" 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                  : "bg-rose-50 border-rose-500 text-rose-800"
              }`}
            >
              {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-bold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab System Selector */}
        <div className="flex flex-wrap gap-2 border-b-2 border-slate-200 pb-3 mb-8">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "events" 
                ? "bg-mlh-blue text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar size={16} /> Manage Events
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "team" 
                ? "bg-mlh-blue text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users size={16} /> Team & Community Thoughts
          </button>
          <button
            onClick={() => setActiveTab("stream")}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "stream" 
                ? "bg-mlh-blue text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Tv size={16} /> Active Live Stream
          </button>
          <button
            onClick={() => { setActiveTab("databases"); loadDatabases() }}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "databases" 
                ? "bg-mlh-blue text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Database size={16} /> User Databases ({registrations.length + rsvps.length + communityRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "pages" 
                ? "bg-mlh-blue text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings size={16} /> Pages Editor
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          
          {/* TAB 1: EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-800">Events Directory ({events.length})</h3>
                  <p className="text-slate-500 text-xs font-semibold">Changes here are dynamically updated on the /events listing page.</p>
                </div>
                <Button onClick={() => setEventFormOpen(true)} className="flex items-center gap-1.5 cursor-pointer">
                  <Plus size={16} /> Add Event
                </Button>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(evt => (
                  <Card key={evt.id} className="p-5 relative border-2 border-slate-200 hover:border-slate-900 bg-white shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {evt.type}
                        </span>
                        <h4 className="font-heading font-black text-lg text-slate-900 mt-2">{evt.name}</h4>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs font-medium text-slate-500">
                          <div>📅 {evt.date}{evt.timing ? ` · ${evt.timing}` : ""}</div>
                          <div>📍 {evt.location} ({evt.mode})</div>
                          {evt.address && <div className="col-span-2">🗺 {evt.address}</div>}
                          {evt.venueDetails && <div className="col-span-2">🏛 {evt.venueDetails}</div>}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {evt.tags.map(t => (
                            <span key={t} className="text-[9px] font-bold text-mlh-blue bg-mlh-blue/10 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => openEditEvent(evt)}
                          className="p-2 border border-slate-200 hover:border-mlh-blue hover:text-mlh-blue rounded-lg bg-slate-50 transition-all text-slate-600 cursor-pointer"
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteEvent(evt.id)}
                          className="p-2 border border-slate-200 hover:border-mlh-red hover:text-mlh-red rounded-lg bg-slate-50 transition-all text-slate-600 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add / Edit Event Dialog Modal */}
              <AnimatePresence>
                {eventFormOpen && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-lg w-full border-2 border-slate-200 max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="font-heading font-black text-2xl text-slate-900">
                          {editingEventId ? "✏️ Edit Event" : "➕ Add Event"}
                        </h3>
                        <button onClick={closeEventForm} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20} /></button>
                      </div>

                      <form onSubmit={saveEvent} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Event Title *</label>
                          <Input required placeholder="FLUX '26 Hackathon" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Event Date *</label>
                            <Input required placeholder="e.g. Oct 10-12, 2026" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Event Timing</label>
                            <Input placeholder="e.g. 9:00 AM – 9:00 PM" value={eventTiming} onChange={(e) => setEventTiming(e.target.value)} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Event Type *</label>
                            <select
                              value={eventType}
                              onChange={(e) => setEventType(e.target.value as any)}
                              className="flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-1 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors"
                            >
                              <option value="hackathon">Hackathon</option>
                              <option value="workshop">Workshop</option>
                              <option value="mentor">Mentor Session</option>
                              <option value="meetup">Meetup</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Event Mode *</label>
                            <select
                              value={eventMode}
                              onChange={(e) => setEventMode(e.target.value as any)}
                              className="flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-1 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors"
                            >
                              <option value="Offline">Offline</option>
                              <option value="Online">Online</option>
                            </select>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          <span className="text-xs font-bold text-slate-700 block">📍 Venue Details</span>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Venue / Location Name *</label>
                            <Input required placeholder="e.g. Main Arena, Zoom, Discord" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Full Address</label>
                            <Input placeholder="e.g. 123 Innovation St, Lucknow, UP 226001" value={eventAddress} onChange={(e) => setEventAddress(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600">Venue Details / Directions</label>
                            <textarea
                              rows={2}
                              placeholder="e.g. 3rd floor, Gate B. Metro: Hazratganj. Parking available."
                              value={eventVenueDetails}
                              onChange={(e) => setEventVenueDetails(e.target.value)}
                              className="flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Tags (Comma-separated)</label>
                          <Input placeholder="Workshop, AI, Edge" value={eventTags} onChange={(e) => setEventTags(e.target.value)} />
                          <p className="text-[10px] text-slate-400 font-semibold">Separate tags with commas (e.g. AI, Agentic, Hackathon).</p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t mt-6">
                          <Button type="button" variant="outline" className="w-1/2 cursor-pointer" onClick={closeEventForm}>Cancel</Button>
                          <Button type="submit" className="w-1/2 cursor-pointer">Save Event</Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 2: TEAM MEMBERS */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-800">Team Slider Directory ({team.length})</h3>
                  <p className="text-slate-500 text-xs font-semibold">Changes here populate the "Founder's & Core Team" slides on the home page slider.</p>
                </div>
                <Button onClick={() => setTeamFormOpen(true)} className="flex items-center gap-1.5 cursor-pointer">
                  <Plus size={16} /> Add Team Member
                </Button>
              </div>

              {/* Team Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map(member => (
                  <Card key={member.id} className="p-5 border-2 border-slate-200 bg-white hover:border-slate-900 shadow-sm relative flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-heading font-black text-white text-base ${member.color || "bg-mlh-blue"}`}>
                      {member.initials}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-heading font-bold text-base text-slate-900 truncate">{member.name}</h4>
                      <p className="text-xs font-bold text-mlh-blue">{member.role}</p>
                      <p className="text-xs text-slate-500 italic mt-1.5 line-clamp-2">"{member.quote}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0 self-start">
                      <button 
                        onClick={() => openEditTeam(member)}
                        className="p-1.5 border border-slate-200 hover:border-mlh-blue hover:text-mlh-blue rounded-lg bg-slate-50 text-slate-600 cursor-pointer"
                        title="Edit Profile"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteTeam(member.id)}
                        className="p-1.5 border border-slate-200 hover:border-mlh-red hover:text-mlh-red rounded-lg bg-slate-50 text-slate-600 cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add / Edit Team Member Dialog Modal */}
              <AnimatePresence>
                {teamFormOpen && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-md w-full border-2 border-slate-200 max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="font-heading font-black text-2xl text-slate-900">
                          {editingTeamId ? "✏️ Edit Team Member" : "➕ Add Team Member"}
                        </h3>
                        <button onClick={closeTeamForm} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20} /></button>
                      </div>

                      <form onSubmit={saveTeam} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Full Name *</label>
                            <Input required placeholder="Aarav Sharma" value={teamNameState} onChange={(e) => setTeamNameState(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Initials *</label>
                            <Input required placeholder="AS" maxLength={2} value={teamInitials} onChange={(e) => setTeamInitials(e.target.value)} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Role / Designation *</label>
                          <Input required placeholder="Founder / Tech Lead" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Theme Color Class *</label>
                          <select
                            value={teamColor}
                            onChange={(e) => setTeamColor(e.target.value)}
                            className="flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-1 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors"
                          >
                            <option value="bg-mlh-red">Red (bg-mlh-red)</option>
                            <option value="bg-mlh-blue text-white">Dark Blue (bg-mlh-blue)</option>
                            <option value="bg-mlh-light-blue text-white">Light Blue (bg-mlh-light-blue)</option>
                            <option value="bg-mlh-yellow text-slate-900">Yellow (bg-mlh-yellow)</option>
                            <option value="bg-emerald-500 text-white">Green (bg-emerald-500)</option>
                            <option value="bg-purple-500 text-white">Purple (bg-purple-500)</option>
                            <option value="bg-slate-800 text-white">Slate Black (bg-slate-800)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Quote / Short Thought *</label>
                          <textarea 
                            required 
                            rows={3} 
                            placeholder="What is your core motivation or advice for hackers?" 
                            value={teamQuote} 
                            onChange={(e) => setTeamQuote(e.target.value)}
                            className="flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors placeholder:text-slate-400"
                          />
                        </div>

                        {/* Social Links */}
                        <div className="border-t pt-4 space-y-3">
                          <span className="text-xs font-bold text-slate-600 block">Social Links (Use '#' if empty)</span>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600">Twitter</label>
                              <Input placeholder="Twitter URL" value={teamTwitter} onChange={(e) => setTeamTwitter(e.target.value)} className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600">GitHub</label>
                              <Input placeholder="GitHub URL" value={teamGithub} onChange={(e) => setTeamGithub(e.target.value)} className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600">LinkedIn</label>
                              <Input placeholder="LinkedIn URL" value={teamLinkedin} onChange={(e) => setTeamLinkedin(e.target.value)} className="h-9 text-xs" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t mt-6">
                          <Button type="button" variant="outline" className="w-1/2 cursor-pointer" onClick={closeTeamForm}>Cancel</Button>
                          <Button type="submit" className="w-1/2 cursor-pointer">Save Member</Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 3: STREAM CONFIGURATION */}
          {activeTab === "stream" && (
            <Card className="p-6 md:p-8 border-2 border-slate-200 bg-white max-w-xl mx-auto shadow-sm">
              <div className="flex items-center gap-3 border-b pb-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-mlh-red/10 text-mlh-red flex items-center justify-center">
                  <Tv size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-900">Configure Live Stream Embed</h3>
                  <p className="text-xs text-slate-500 font-semibold">Active live streaming player settings for the /live page.</p>
                </div>
              </div>

              <form onSubmit={handleSaveStream} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Live Video Source URL (YouTube, Twitch)</label>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    value={stream.sourceUrl} 
                    onChange={(e) => setStream({ ...stream, sourceUrl: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Enter a YouTube link (`youtube.com/watch?v=...`), youtu.be link, Twitch channel URL (`twitch.tv/...`), or YouTube Video ID directly.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Stream Embed Title</label>
                  <Input 
                    placeholder="e.g. FLUX '26 Launch Session" 
                    value={stream.title} 
                    onChange={(e) => setStream({ ...stream, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Active Speaker Name</label>
                    <Input 
                      placeholder="e.g. Aarav Sharma" 
                      value={stream.speaker} 
                      onChange={(e) => setStream({ ...stream, speaker: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Active Track Tag</label>
                    <Input 
                      placeholder="e.g. AI & Agents" 
                      value={stream.track} 
                      onChange={(e) => setStream({ ...stream, track: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Discord Redirect Link</label>
                  <Input 
                    placeholder="https://discord.gg/flux" 
                    value={stream.discordUrl} 
                    onChange={(e) => setStream({ ...stream, discordUrl: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button type="submit" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                    <Save size={16} /> Save Stream Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 4: DATABASES */}
          {activeTab === "databases" && (
            <div className="space-y-6">
              
              {/* Database selector and search */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                
                {/* Sub tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDbSubTab("registrations"); setSearchQuery("") }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dbSubTab === "registrations" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Event Registrations ({registrations.length})
                  </button>
                  <button
                    onClick={() => { setDbSubTab("rsvps"); setSearchQuery("") }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dbSubTab === "rsvps" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Workshop RSVPs ({rsvps.length})
                  </button>
                  <button
                    onClick={() => { setDbSubTab("community"); setSearchQuery("") }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dbSubTab === "community" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Community Invites ({communityRequests.length})
                  </button>
                </div>

                {/* Search query box */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-slate-900 bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-mlh-blue"
                  />
                </div>
              </div>

              {/* Active list views */}
              <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                
                {/* 1. EVENT REGISTRATIONS LIST */}
                {dbSubTab === "registrations" && (
                  <div className="overflow-x-auto">
                    {getFilteredRegistrations().length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-500 font-medium italic">No registrations found matching query.</p>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="p-3 font-semibold">Event Name</th>
                            <th className="p-3 font-semibold">Team Name</th>
                            <th className="p-3 font-semibold">Leader Details</th>
                            <th className="p-3 font-semibold">Members</th>
                            <th className="p-3 font-semibold">Timestamp</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getFilteredRegistrations().map((reg: any) => (
                            <tr key={reg.id} className="hover:bg-slate-50 text-slate-800">
                              <td className="p-3 font-bold text-slate-900">{reg.eventName}</td>
                              <td className="p-3 font-mono font-bold text-mlh-blue">{reg.teamName}</td>
                              <td className="p-3 space-y-1">
                                <div className="font-bold">{reg.leaderName}</div>
                                <div className="text-slate-500 text-[10px]">{reg.leaderEmail}</div>
                                <a 
                                  href={`https://github.com/${reg.leaderGithub}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] text-mlh-light-blue hover:underline inline-flex items-center gap-0.5"
                                >
                                  github.com/{reg.leaderGithub} <ExternalLink size={8} />
                                </a>
                              </td>
                              <td className="p-3 max-w-[200px]">
                                {reg.members && reg.members.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {reg.members.map((m: any, i: number) => (
                                      <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 inline-block truncate">
                                        {m.name} ({m.github})
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">Solo Hacker</span>
                                )}
                              </td>
                              <td className="p-3 text-[10px] text-slate-500 font-mono">{reg.timestamp}</td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => deleteRegistration(reg.id)}
                                  className="p-1 bg-slate-100 hover:bg-mlh-red hover:text-white rounded border text-slate-500 transition-colors cursor-pointer"
                                  title="Delete Registration"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 2. WORKSHOP RSVPs LIST */}
                {dbSubTab === "rsvps" && (
                  <div className="overflow-x-auto">
                    {getFilteredRsvps().length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-500 font-medium italic">No RSVPs found matching query.</p>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="p-3 font-semibold">Workshop</th>
                            <th className="p-3 font-semibold">Attendee Name</th>
                            <th className="p-3 font-semibold">Email Address</th>
                            <th className="p-3 font-semibold">GitHub Profile</th>
                            <th className="p-3 font-semibold">RSVP Time</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getFilteredRsvps().map((rsvp: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-50 text-slate-800">
                              <td className="p-3 font-bold text-slate-900">{rsvp.workshopTitle}</td>
                              <td className="p-3 font-semibold">{rsvp.name}</td>
                              <td className="p-3 text-slate-600 font-mono">{rsvp.email}</td>
                              <td className="p-3">
                                <a 
                                  href={`https://github.com/${rsvp.github}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-mlh-light-blue hover:underline inline-flex items-center gap-0.5"
                                >
                                  github.com/{rsvp.github} <ExternalLink size={8} />
                                </a>
                              </td>
                              <td className="p-3 text-[10px] text-slate-500 font-mono">{rsvp.timestamp}</td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => deleteRsvp(rsvp.timestamp, rsvp.email)}
                                  className="p-1 bg-slate-100 hover:bg-mlh-red hover:text-white rounded border text-slate-500 transition-colors cursor-pointer"
                                  title="Delete RSVP"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 3. COMMUNITY REQUESTS LIST */}
                {dbSubTab === "community" && (
                  <div className="overflow-x-auto">
                    {getFilteredCommunityRequests().length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-500 font-medium italic">No community requests found matching query.</p>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="p-3 font-semibold">Applicant Name</th>
                            <th className="p-3 font-semibold">Requested Role</th>
                            <th className="p-3 font-semibold">GitHub / Contact</th>
                            <th className="p-3 font-semibold">Join Reason</th>
                            <th className="p-3 font-semibold">Timestamp</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getFilteredCommunityRequests().map((req: any) => (
                            <tr key={req.id} className="hover:bg-slate-50 text-slate-800">
                              <td className="p-3 space-y-0.5">
                                <div className="font-bold text-slate-900">{req.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{req.email}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-mlh-blue/10 text-mlh-blue">
                                  {req.role}
                                </span>
                              </td>
                              <td className="p-3 space-y-1">
                                <div>
                                  <a 
                                    href={`https://github.com/${req.github?.replace(/https?:\/\/github\.com\//, "")}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-mlh-light-blue hover:underline inline-flex items-center gap-0.5"
                                  >
                                    github.com/{req.github?.replace(/https?:\/\/github\.com\//, "")} <ExternalLink size={8} />
                                  </a>
                                </div>
                                {req.portfolio && req.portfolio !== "#" && (
                                  <div>
                                    <a 
                                      href={req.portfolio.startsWith("http") ? req.portfolio : `https://${req.portfolio}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-slate-500 hover:text-slate-800 text-[10px] inline-flex items-center gap-0.5"
                                    >
                                      Portfolio / LinkedIn <ExternalLink size={8} />
                                    </a>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 max-w-[280px]">
                                <p className="text-slate-600 leading-relaxed break-words font-medium text-[11px] whitespace-pre-line">
                                  "{req.reason}"
                                </p>
                              </td>
                              <td className="p-3 text-[10px] text-slate-500 font-mono">{req.timestamp}</td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => deleteCommunityRequest(req.id)}
                                  className="p-1 bg-slate-100 hover:bg-mlh-red hover:text-white rounded border text-slate-500 transition-colors cursor-pointer"
                                  title="Delete Request"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 5: PAGES EDITOR */}
          {activeTab === "pages" && (
            <PagesEditor triggerNotification={triggerNotification} />
          )}

        </div>
      </SectionWrapper>
    </div>
  )
}
