"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Tv, Users, Send, Download, ExternalLink, Calendar, Check, X, Settings } from "lucide-react"
import { loadPageContent, savePageContent } from "@/app/lib/page-content"
import { saveSubmission, submissionTables } from "@/app/lib/submissions"



interface ChatMessage {
  user: string
  text: string
  color: string
  isSelf?: boolean
}

const initialChat = [
  { user: "HackerDev", text: "Hey everyone! Is this workshop being recorded?", color: "text-mlh-red" },
  { user: "DesignNinja", text: "Yes, all workshops are saved in the VODs section below!", color: "text-mlh-light-blue" },
  { user: "SupabaseFan", text: "Can we use PostgreSQL schemas directly or does it need to be Supabase clients?", color: "text-emerald-500" },
  { user: "FLUX_Coach", text: "Feel free to use whatever database tools suit your build, Postgres is great!", color: "text-purple-500 font-bold" },
  { user: "NextCoder", text: "Is Next.js 16 supported on the Vercel deployment?", color: "text-amber-500" },
]

const botReplies = [
  "Can we build team configurations of 5 people?",
  "Aarav is killing it with the layout demonstration!",
  "Is the Discord server link available here?",
  "When are the final track submissions due?",
  "This AI workshop is exactly what our team needed.",
  "Is anyone looking for a UI designer? We have 3 coders.",
  "Check the slides link below, it's very detailed.",
  "Are we allowed to use pre-trained models like Llama-3?",
  "The slides look super clean, fits the FLUX style perfectly.",
  "I am building a smart contract for the Web3 track.",
]

const usernames = [
  "CodeCrusader", "CloudNinja", "SponsorMent", "HackStar", "TeamLeadX",
  "DevQueen", "AgentBuilder", "VercelFan", "ByteCoder", "TailwindPro"
]

const userColors = [
  "text-mlh-red", "text-mlh-blue", "text-mlh-light-blue", "text-amber-600", "text-emerald-500", "text-purple-500"
]

const parseStreamUrl = (url: string): { type: "youtube" | "twitch" | "mock"; id: string } => {
  if (!url) return { type: "mock", id: "" }
  
  // YouTube parser
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (ytMatch) {
    return { type: "youtube", id: ytMatch[1] }
  }
  
  // Twitch parser
  const twitchMatch = url.match(/(?:twitch\.tv\/)([a-zA-Z0-9_]{4,25})/i)
  if (twitchMatch) {
    return { type: "twitch", id: twitchMatch[1] }
  }
  
  // If simple ID is pasted directly:
  if (url.length === 11 && !url.includes(".")) {
    return { type: "youtube", id: url }
  }
  
  return { type: "mock", id: "" }
}

export default function LivePage() {
  const [chat, setChat] = useState<ChatMessage[]>(initialChat)
  const [inputMsg, setInputMsg] = useState("")
  const [viewers, setViewers] = useState(148)
  const [rsvpd, setRsvpd] = useState<number[]>([])
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<any[]>([])
  
  // RSVP Modal State
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<{ id: number; title: string } | null>(null)
  const [rsvpName, setRsvpName] = useState("")
  const [rsvpEmail, setRsvpEmail] = useState("")
  const [rsvpGithub, setRsvpGithub] = useState("")

  // Stream Configuration State
  const [streamSource, setStreamSource] = useState<"mock" | "youtube" | "twitch">("mock")
  const [youtubeId, setYoutubeId] = useState("")
  const [twitchChannel, setTwitchChannel] = useState("")
  const [discordLink, setDiscordLink] = useState("https://discord.gg/flux")
  const [streamTitle, setStreamTitle] = useState("FLUX '26 Launch Workshop")
  const [streamSpeaker, setStreamSpeaker] = useState("Aarav Sharma")
  const [streamTrack, setStreamTrack] = useState("AI & Agents")
  
  // Settings Panel Modal State
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tempSourceUrl, setTempSourceUrl] = useState("")
  const [tempDiscordLink, setTempDiscordLink] = useState("")
  const [tempTitle, setTempTitle] = useState("")
  const [tempSpeaker, setTempSpeaker] = useState("")
  const [tempTrack, setTempTrack] = useState("")

  const [isAdmin, setIsAdmin] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load RSVPs, Workshops & Stream Settings on Mount
  useEffect(() => {
    // 0. Check Admin
    setIsAdmin(localStorage.getItem("flux_admin_auth") === "true")

    // 1. Load RSVPs
    const storedRsvps = localStorage.getItem("flux-rsvp-workshops")
    if (storedRsvps) {
      setRsvpd(JSON.parse(storedRsvps))
    }

    const fetchStreamAndEvents = async () => {
      // 2. Load Events/Workshops
      const defaultEvents = [
        { id: 1, title: "Building Autonomous Agents with LangChain", speaker: "Dr. Ananya Iyer", date: "June 26, 4:00 PM" },
        { id: 2, title: "Deploying Edge Functions at Scale", speaker: "Kabir Mehta", date: "June 27, 2:00 PM" },
        { id: 3, title: "Framer Motion & Interactive UI design", speaker: "Riya Patel", date: "June 28, 6:00 PM" },
      ]
      const eventsList = await loadPageContent<any[]>("events", [])
      if (eventsList && eventsList.length > 0) {
        const list = eventsList
          .filter((e: any) => e.type === "workshop" || e.tags?.includes("Workshop"))
          .map((e: any, idx: number) => ({
            id: e.id || idx + 1,
            title: e.name || e.title,
            speaker: e.location.includes("Discord") || e.location.includes("Zoom") ? "Core Team" : e.location,
            date: e.date
          }))
        setUpcomingWorkshops(list.length > 0 ? list : defaultEvents)
      } else {
        setUpcomingWorkshops(defaultEvents)
      }

      // 3. Load Stream Settings
      const settings = await loadPageContent<any>("stream", {
        sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "FLUX '26 Launch Workshop",
        speaker: "Aarav Sharma",
        track: "AI & Agents",
        discordUrl: "https://discord.gg/flux"
      })
      if (settings) {
        setDiscordLink(settings.discordUrl || "https://discord.gg/flux")
        setStreamTitle(settings.title || "FLUX '26 Launch Workshop")
        setStreamSpeaker(settings.speaker || "Aarav Sharma")
        setStreamTrack(settings.track || "AI & Agents")
        
        const parsed = parseStreamUrl(settings.sourceUrl)
        setStreamSource(parsed.type)
        if (parsed.type === "youtube") setYoutubeId(parsed.id)
        if (parsed.type === "twitch") setTwitchChannel(parsed.id)
      }
    }
    fetchStreamAndEvents()
  }, [])

  // Auto-scroll chat within container only
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chat])

  // Simulated Chat Stream
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = usernames[Math.floor(Math.random() * usernames.length)]
      const randomText = botReplies[Math.floor(Math.random() * botReplies.length)]
      const randomColor = userColors[Math.floor(Math.random() * userColors.length)]
      
      setChat(prev => [...prev.slice(-30), { user: randomUser, text: randomText, color: randomColor }])
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMsg.trim()) return
    
    setChat(prev => [...prev, { user: "You", text: inputMsg, color: "text-slate-900 font-bold", isSelf: true }])
    setInputMsg("")
  }

  const triggerRsvpModal = (ws: { id: number; title: string }) => {
    if (rsvpd.includes(ws.id)) {
      if (confirm(`Do you want to cancel your RSVP for "${ws.title}"?`)) {
        const updated = rsvpd.filter(x => x !== ws.id)
        setRsvpd(updated)
        localStorage.setItem("flux-rsvp-workshops", JSON.stringify(updated))
      }
    } else {
      setSelectedWorkshop(ws)
      setRsvpModalOpen(true)
    }
  }

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkshop) return

    const storedRSVPs = localStorage.getItem("flux-workshop-details-rsvps")
    const list = storedRSVPs ? JSON.parse(storedRSVPs) : []
    
    const newRsvp = {
      id: crypto.randomUUID(),
      workshopId: String(selectedWorkshop.id),
      workshopTitle: selectedWorkshop.title,
      name: rsvpName,
      email: rsvpEmail,
      github: rsvpGithub,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem("flux-workshop-details-rsvps", JSON.stringify([...list, newRsvp]))
    await saveSubmission(submissionTables.workshopRsvps, newRsvp)
    
    const updated = [...rsvpd, selectedWorkshop.id]
    setRsvpd(updated)
    localStorage.setItem("flux-rsvp-workshops", JSON.stringify(updated))
    
    setRsvpName("")
    setRsvpEmail("")
    setRsvpGithub("")
    setRsvpModalOpen(false)
    setSelectedWorkshop(null)
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = parseStreamUrl(tempSourceUrl)
    setStreamSource(parsed.type)
    if (parsed.type === "youtube") setYoutubeId(parsed.id)
    if (parsed.type === "twitch") setTwitchChannel(parsed.id)
    
    setDiscordLink(tempDiscordLink)
    setStreamTitle(tempTitle)
    setStreamSpeaker(tempSpeaker)
    setStreamTrack(tempTrack)

    // Save to LocalStorage & Supabase
    const settings = {
      sourceUrl: tempSourceUrl,
      discordUrl: tempDiscordLink,
      title: tempTitle,
      speaker: tempSpeaker,
      track: tempTrack
    }
    savePageContent("stream", settings)
    setSettingsOpen(false)
  }

  return (
    <div className="pt-8 min-h-[90vh]">
      <SectionWrapper>
        {/* Stream Settings Trigger Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-heading font-black text-3xl text-slate-900 flex items-center gap-2">
            <span>📺 FLUX Live Arena</span>
          </h1>
          {isAdmin && (
            <button 
              onClick={() => {
                // Load active URL
                const stored = localStorage.getItem("flux-stream-settings")
                const active = stored ? JSON.parse(stored) : {}
                setTempSourceUrl(active.sourceUrl || "")
                setTempDiscordLink(discordLink)
                setTempTitle(streamTitle)
                setTempSpeaker(streamSpeaker)
                setTempTrack(streamTrack)
                setSettingsOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 bg-white hover:border-mlh-blue text-slate-700 hover:text-mlh-blue rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Settings size={14} /> Configure Stream
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Main Streaming Area */}
          <div className="space-y-6">
            
            {/* Stream Player Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-slate-900 mlh-card shadow-[6px_6px_0px_rgba(0,43,92,1)] bg-slate-950 flex flex-col justify-center items-center">
              
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="bg-mlh-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white block" />
                  Live
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Users size={12} />
                  {viewers} Hacking
                </span>
              </div>

              {/* Conditional Video Player Source */}
              {streamSource === "youtube" && youtubeId ? (
                <iframe
                  className={`w-full h-full absolute inset-0 z-10 ${isAdmin ? '' : 'pointer-events-none'}`}
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&disablekb=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : streamSource === "twitch" && twitchChannel ? (
                <iframe
                  className={`w-full h-full absolute inset-0 z-10 ${isAdmin ? '' : 'pointer-events-none'}`}
                  src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&muted=false`}
                  frameBorder="0"
                  allowFullScreen={true}
                  scrolling="no"
                ></iframe>
              ) : (
                /* Simulated Streaming Video / Background */
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90 flex flex-col justify-center items-center">
                  <Tv className="w-24 h-24 text-white/10 mb-4 animate-bounce" />
                  <div className="text-center px-6">
                    <p className="text-white font-heading font-black text-2xl md:text-3xl mb-2">{streamTitle}</p>
                    <p className="text-slate-400 font-medium max-w-md mx-auto text-sm">
                      Streaming from FLUX studio workspace. Connect tools below to sync live sessions.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Mock Play Control Bar */}
              {streamSource === "mock" && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center z-20">
                  <button className="text-white hover:text-mlh-yellow transition-colors"><Play size={20} fill="currentColor" /></button>
                  <div className="h-1 bg-white/30 rounded-full flex-grow mx-4 overflow-hidden">
                    <div className="h-full bg-mlh-red w-3/4" />
                  </div>
                  <span className="text-xs font-mono text-white">45:12 / 1:30:00</span>
                </div>
              )}
            </div>

            {/* Quick Redirect Buttons (Removed to keep users on-site) */}

            {/* Stream Info */}
            <div className="mlh-card p-6 bg-white border-2 border-slate-200">
              <h2 className="font-heading font-black text-3xl text-slate-900 mb-2">
                {streamTitle}
              </h2>
              <div className="flex flex-wrap gap-4 items-center mb-6 text-sm">
                <span className="text-slate-500 font-bold">Speaker: <span className="text-mlh-blue">{streamSpeaker}</span></span>
                <span className="text-slate-200">|</span>
                <span className="text-slate-500 font-bold">Track: <span className="text-mlh-red">{streamTrack}</span></span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium mb-6">
                Connect and build together. In this active workshop session, we explore direct implementations and help debug active integrations live.
              </p>
              
              {/* Downloads & Resources */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Download Slides (PDF)
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  GitHub Repository
                </Button>
              </div>
            </div>
          </div>


        </div>

        {/* Upcoming Workshops Section Removed per request */}
      </SectionWrapper>

      {/* RSVP Modal */}
      <AnimatePresence>
        {rsvpModalOpen && selectedWorkshop && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-md w-full border-2 border-slate-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-heading font-black text-2xl text-slate-900">Workshop RSVP</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase mt-1">{selectedWorkshop.title}</p>
                </div>
                <button 
                  onClick={() => { setRsvpModalOpen(false); setSelectedWorkshop(null) }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name *</label>
                  <Input 
                    required 
                    placeholder="Your Name" 
                    value={rsvpName} 
                    onChange={(e) => setRsvpName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address *</label>
                  <Input 
                    required 
                    type="email" 
                    placeholder="you@example.com" 
                    value={rsvpEmail} 
                    onChange={(e) => setRsvpEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">GitHub Username *</label>
                  <Input 
                    required 
                    placeholder="username" 
                    value={rsvpGithub} 
                    onChange={(e) => setRsvpGithub(e.target.value)} 
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/2" 
                    onClick={() => { setRsvpModalOpen(false); setSelectedWorkshop(null) }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Confirm RSVP
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stream Configuration Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl mlh-card p-6 md:p-8 max-w-md w-full border-2 border-slate-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-heading font-black text-2xl text-slate-900">Stream Settings</h3>
                <button 
                  onClick={() => setSettingsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Stream URL (YouTube, Twitch)</label>
                  <Input 
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    value={tempSourceUrl} 
                    onChange={(e) => setTempSourceUrl(e.target.value)} 
                  />
                  <p className="text-[10px] text-slate-500 font-semibold">Paste any YouTube/Twitch URL. The player will parse and embed it.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Stream Title</label>
                  <Input 
                    placeholder="Launch Session" 
                    value={tempTitle} 
                    onChange={(e) => setTempTitle(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Speaker Name</label>
                    <Input 
                      placeholder="Name" 
                      value={tempSpeaker} 
                      onChange={(e) => setTempSpeaker(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Track Tag</label>
                    <Input 
                      placeholder="AI & Agents" 
                      value={tempTrack} 
                      onChange={(e) => setTempTrack(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Discord Redirect Link</label>
                  <Input 
                    placeholder="https://discord.gg/invite_code" 
                    value={tempDiscordLink} 
                    onChange={(e) => setTempDiscordLink(e.target.value)} 
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/2" 
                    onClick={() => setSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Save Configuration
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
