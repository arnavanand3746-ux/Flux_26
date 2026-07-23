"use client"

import { useState, useEffect } from "react"
import { loadPageContent, savePageContent } from "../lib/page-content"
import { Trash, Trash2, Plus, Save } from "lucide-react"

// Minimal UI components since we're pulling them out
const Input = (props: any) => (
  <input
    {...props}
    className={`flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-1 text-xs text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlh-blue transition-colors ${props.className || ""}`}
  />
)
const Button = (props: any) => {
  const variantClasses = props.variant === "destructive" 
    ? "bg-rose-500 hover:bg-rose-600 text-white"
    : props.variant === "outline"
    ? "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900"
    : "bg-mlh-blue hover:bg-blue-700 text-white"
  const sizeClasses = props.size === "icon" ? "p-2" : props.size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2"
  return (
    <button 
      {...props}
      className={`rounded-lg font-bold transition-all cursor-pointer ${variantClasses} ${sizeClasses} ${props.className || ""}`}
    >
      {props.children}
    </button>
  )
}

export default function PagesEditor({ triggerNotification }: { triggerNotification: (msg: string, type?: "success" | "error") => void }) {
  const [selectedEditorPage, setSelectedEditorPage] = useState<"home" | "about" | "sponsors" | "pitch-deck" | "community" | "contact" | "previous-events">("home")
  
  // Home Page State
  const [homeStats, setHomeStats] = useState<any[]>([])
  const [homeTracks, setHomeTracks] = useState<any[]>([])
  const [homePartners, setHomePartners] = useState<string[]>([])
  const [homeSponsorsData, setHomeSponsorsData] = useState<any>({
    titlePartner: { name: "", image: "" },
    goldPartners: []
  })
  
  // About Page State
  const [aboutTitle, setAboutTitle] = useState("")
  const [aboutMission, setAboutMission] = useState("")
  const [aboutVision, setAboutVision] = useState("")
  const [aboutValues, setAboutValues] = useState<any[]>([])
  
  // Sponsors Page State
  const [sponsorsTitle, setSponsorsTitle] = useState("")
  const [sponsorsSubtitle, setSponsorsSubtitle] = useState("")
  const [sponsorsWhyTitle, setSponsorsWhyTitle] = useState("")
  const [sponsorsWhyText, setSponsorsWhyText] = useState("")
  const [sponsorsTiers, setSponsorsTiers] = useState<any[]>([])
  
  // Pitch Deck State
  const [deckSlides, setDeckSlides] = useState<any[]>([])
  
  // Community Page State
  const [commDiscordUrl, setCommDiscordUrl] = useState("")
  const [commTitle, setCommTitle] = useState("")
  const [commSubtitle, setCommSubtitle] = useState("")
  const [commDescription, setCommDescription] = useState("")
  const [commChannels, setCommChannels] = useState<any[]>([])
  
  // Contact Page State
  const [contactTitle, setContactTitle] = useState("")
  const [contactSubtitle, setContactSubtitle] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactLocation, setContactLocation] = useState("")
  const [contactXUrl, setContactXUrl] = useState("")
  const [contactIgUrl, setContactIgUrl] = useState("")
  const [contactInUrl, setContactInUrl] = useState("")

  // Previous Events
  const [prevPhotos, setPrevPhotos] = useState<any[]>([])

  useEffect(() => {
    const fetchAllData = async () => {
      // Home
      const defaultStats = [
        { value: "₹5L+", label: "In Prizes", color: "text-mlh-red" },
        { value: "36", label: "Hours of Hacking", color: "text-mlh-blue" },
        { value: "1000+", label: "Builders", color: "text-amber-600" },
        { value: "50+", label: "Mentors", color: "text-mlh-light-blue" },
      ]
      const hStats = await loadPageContent<any[]>("home_stats", defaultStats)
      setHomeStats(hStats)

      const defaultTracks = [
        { icon: "Bot", title: "AI & Agents", desc: "Build intelligent systems, LLM wrappers, and autonomous agents.", color: "bg-mlh-blue text-white" },
        { icon: "Globe", title: "Web3 & Blockchain", desc: "Decentralized apps, smart contracts, and new economies.", color: "bg-mlh-red text-white" },
        { icon: "Cloud", title: "Cloud & DevOps", desc: "Scalable architectures, infrastructure as code, and tools.", color: "bg-mlh-yellow text-slate-900" },
        { icon: "Cpu", title: "Hardware & IoT", desc: "Connect the physical world with software solutions.", color: "bg-slate-800 text-white" },
        { icon: "Palette", title: "Design / UI/UX", desc: "Create beautiful, accessible, and intuitive interfaces.", color: "bg-mlh-light-blue text-white" },
        { icon: "Shield", title: "Cybersecurity", desc: "Protect data, find vulnerabilities, and build secure apps.", color: "bg-emerald-500 text-white" },
      ]
      const hTracks = await loadPageContent<any[]>("home_tracks", defaultTracks)
      setHomeTracks(hTracks)

      const defaultPartners = ["GitHub", "Twilio", "Supabase", "Vercel", "DigitalOcean", "Stripe", "Auth0"]
      const hPartners = await loadPageContent<string[]>("home_partners", defaultPartners)
      setHomePartners(hPartners)

      const defaultHSponsors = {
        titlePartner: { name: "Your Logo Here", image: "" },
        goldPartners: [
          { name: "Sponsor A", image: "" },
          { name: "Sponsor B", image: "" },
          { name: "Sponsor C", image: "" }
        ]
      }
      const hSponsors = await loadPageContent<any>("home_sponsors", defaultHSponsors)
      setHomeSponsorsData(hSponsors)

      // About
      const defaultAbout = {
        title: "A Movement for Serious Student Builders",
        mission: "To bridge the gap between academic learning and real-world product development. We want to empower students to build, launch, and scale their ideas with access to top-tier mentorship and a global community.",
        vision: "To become the launchpad for the next generation of technical founders and open-source contributors from India. We see a future where student-led innovation drives the tech ecosystem forward.",
        values: [
          { num: "01", title: "Builders First", desc: "We prioritize actual creation over endless discussion." },
          { num: "02", title: "Learn by Building", desc: "The fastest way to learn a technology is to use it to solve a problem." },
        ]
      }
      const aboutData = await loadPageContent<any>("about", defaultAbout)
      setAboutTitle(aboutData.title)
      setAboutMission(aboutData.mission)
      setAboutVision(aboutData.vision)
      setAboutValues(aboutData.values || [])

      // Sponsors
      const defaultSponsorsData = {
        title: "Empower the Next Generation of Builders",
        subtitle: "Join forces with FLUX to support India's most ambitious student developers.",
        whyTitle: "Why Sponsor FLUX?",
        whyText: "We aren't just hosting an event; we're building an ecosystem. Sponsoring FLUX means direct recruitment access, product feedback from early adopters, and immense brand goodwill.",
        tiers: [
          { name: "Title Sponsor", price: "₹2,00L", perks: ["Headline branding", "Keynote slot", "Dedicated booth"] },
          { name: "Gold Sponsor", price: "₹1,00L", perks: ["Premium branding", "Workshop slot", "Booth"] },
        ]
      }
      const spData = await loadPageContent<any>("sponsors", defaultSponsorsData)
      setSponsorsTitle(spData.title)
      setSponsorsSubtitle(spData.subtitle)
      setSponsorsWhyTitle(spData.whyTitle)
      setSponsorsWhyText(spData.whyText)
      setSponsorsTiers(spData.tiers || [])

      // Pitch Deck
      const defaultDeck = [
        { title: "The Problem", content: "Students lack real-world building experience." },
        { title: "The Solution", content: "A 36-hour intensive hackathon with top mentorship." }
      ]
      const deckData = await loadPageContent<any[]>("pitch-deck", defaultDeck)
      setDeckSlides(deckData)

      // Community
      const defaultCommData = {
        discordUrl: "https://discord.gg/flux",
        title: "Join the FLUX Community",
        subtitle: "A place for builders to connect, collaborate, and create.",
        description: "Whether you're a seasoned developer or just starting out, there's a place for you here.",
        channels: [
          { name: "#general", desc: "Main discussion" },
          { name: "#find-a-team", desc: "Team building" }
        ]
      }
      const commData = await loadPageContent<any>("community", defaultCommData)
      setCommDiscordUrl(commData.discordUrl)
      setCommTitle(commData.title)
      setCommSubtitle(commData.subtitle)
      setCommDescription(commData.description)
      setCommChannels(commData.channels || [])

      // Contact
      const defaultContactData = {
        title: "Get in Touch",
        subtitle: "Have a question that isn't answered in our FAQ? Reach out to us.",
        email: "hello@fluxhack.com",
        location: "Uttar Pradesh, India",
        socials: { x: "#", ig: "#", in: "#" }
      }
      const contactData = await loadPageContent<any>("contact", defaultContactData)
      setContactTitle(contactData.title)
      setContactSubtitle(contactData.subtitle)
      setContactEmail(contactData.email)
      setContactLocation(contactData.location)
      setContactXUrl(contactData.socials.x)
      setContactIgUrl(contactData.socials.ig)
      setContactInUrl(contactData.socials.in)

      // Previous Events
      const defaultPhotos = [
        { id: "1", url: "", title: "Midnight Hacking", height: "h-64" },
        { id: "2", url: "", title: "Winner Announcements", height: "h-48" },
        { id: "3", url: "", title: "Mentor Session", height: "h-80" },
        { id: "4", url: "", title: "Hardware Lab", height: "h-56" },
        { id: "5", url: "", title: "Swag Distribution", height: "h-64" },
        { id: "6", url: "", title: "Main Stage", height: "h-48" },
      ]
      const loadedPhotos = await loadPageContent<any[]>("previous_events_photos", defaultPhotos)
      setPrevPhotos(loadedPhotos)
    }

    fetchAllData()
  }, [])

  // PAGE EDITOR SAVE HANDLERS
  const saveHomeContent = async () => {
    await savePageContent("home_stats", homeStats)
    await savePageContent("home_tracks", homeTracks)
    await savePageContent("home_partners", homePartners)
    await savePageContent("home_sponsors", homeSponsorsData)
    triggerNotification("Home page content saved successfully!")
  }
  const saveAboutContent = async () => {
    await savePageContent("about", { title: aboutTitle, mission: aboutMission, vision: aboutVision, values: aboutValues })
    triggerNotification("About page content saved successfully!")
  }
  const saveSponsorsContent = async () => {
    await savePageContent("sponsors", { title: sponsorsTitle, subtitle: sponsorsSubtitle, whyTitle: sponsorsWhyTitle, whyText: sponsorsWhyText, tiers: sponsorsTiers })
    triggerNotification("Sponsors page content saved successfully!")
  }
  const savePitchDeckContent = async () => {
    await savePageContent("pitch-deck", deckSlides)
    triggerNotification("Pitch Deck content saved successfully!")
  }
  const saveCommunityContent = async () => {
    await savePageContent("community", { discordUrl: commDiscordUrl, title: commTitle, subtitle: commSubtitle, description: commDescription, channels: commChannels })
    triggerNotification("Community page content saved successfully!")
  }
  const saveContactContent = async () => {
    await savePageContent("contact", { title: contactTitle, subtitle: contactSubtitle, email: contactEmail, location: contactLocation, socials: { x: contactXUrl, ig: contactIgUrl, in: contactInUrl } })
    triggerNotification("Contact page content saved successfully!")
  }
  const savePrevPhotosContent = async () => {
    await savePageContent("previous_events_photos", prevPhotos)
    triggerNotification("Previous events photos saved successfully!")
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-64 flex flex-col gap-2 shrink-0 border border-slate-200 rounded-xl p-2 bg-slate-50">
        {(["home", "about", "sponsors", "pitch-deck", "community", "contact", "previous-events"] as const).map(page => (
          <button
            key={page}
            onClick={() => setSelectedEditorPage(page)}
            className={`px-4 py-3 text-left font-bold rounded-lg transition-all capitalize ${
              selectedEditorPage === page ? "bg-mlh-blue text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {page} Page
          </button>
        ))}
      </div>

      <div className="flex-1 w-full bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
        
        {selectedEditorPage === "home" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Home Page Editor</h2>
              <p className="text-slate-500 font-medium">Edit the dynamic sections of the homepage.</p>
            </div>
            
            {/* STATS */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Prize Pool & Stats (StatsGrid)</h3>
              <div className="grid grid-cols-2 gap-4">
                {homeStats.map((stat, i) => (
                  <div key={i} className="space-y-2 border p-4 rounded-lg">
                    <Input value={stat.value} onChange={(e: any) => { const n = [...homeStats]; n[i].value = e.target.value; setHomeStats(n) }} placeholder="Value (e.g. ₹5L+)" />
                    <Input value={stat.label} onChange={(e: any) => { const n = [...homeStats]; n[i].label = e.target.value; setHomeStats(n) }} placeholder="Label (e.g. In Prizes)" />
                    <Input value={stat.color} onChange={(e: any) => { const n = [...homeStats]; n[i].color = e.target.value; setHomeStats(n) }} placeholder="Tailwind Color (e.g. text-mlh-red)" />
                  </div>
                ))}
              </div>
            </div>

            {/* TRACKS */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Hackathon Tracks</h3>
              <div className="space-y-4">
                {homeTracks.map((track, i) => (
                  <div key={i} className="flex gap-4 items-start border p-4 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input value={track.title} onChange={(e: any) => { const n = [...homeTracks]; n[i].title = e.target.value; setHomeTracks(n) }} placeholder="Track Title" />
                      <Input value={track.desc} onChange={(e: any) => { const n = [...homeTracks]; n[i].desc = e.target.value; setHomeTracks(n) }} placeholder="Track Description" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input value={track.icon} onChange={(e: any) => { const n = [...homeTracks]; n[i].icon = e.target.value; setHomeTracks(n) }} placeholder="Icon Name (e.g. Bot, Globe, Cloud)" />
                      <Input value={track.color} onChange={(e: any) => { const n = [...homeTracks]; n[i].color = e.target.value; setHomeTracks(n) }} placeholder="Color Class (e.g. bg-mlh-blue text-white)" />
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => { const n = [...homeTracks]; n.splice(i, 1); setHomeTracks(n) }}><Trash size={16} /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setHomeTracks([...homeTracks, { title: "", desc: "", icon: "Code", color: "bg-slate-800 text-white" }])}>Add Track</Button>
              </div>
            </div>

            {/* PARTNERS */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Scrolling Partners (TrustStrip)</h3>
              <div className="flex flex-wrap gap-2">
                {homePartners.map((partner, i) => (
                  <div key={i} className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border">
                    <Input value={partner} onChange={(e: any) => { const n = [...homePartners]; n[i] = e.target.value; setHomePartners(n) }} className="h-8 w-32 border-none bg-transparent text-xs" />
                    <button onClick={() => { const n = [...homePartners]; n.splice(i, 1); setHomePartners(n) }} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash size={14} /></button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setHomePartners([...homePartners, "New Partner"])}>Add Partner</Button>
              </div>
            </div>

            {/* SPONSORS PREVIEW */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Home Sponsors Preview</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title Partner</label>
                <div className="flex gap-2">
                  <Input value={homeSponsorsData.titlePartner.name} onChange={(e: any) => setHomeSponsorsData({...homeSponsorsData, titlePartner: {...homeSponsorsData.titlePartner, name: e.target.value}})} placeholder="Sponsor Name" />
                  <Input value={homeSponsorsData.titlePartner.image} onChange={(e: any) => setHomeSponsorsData({...homeSponsorsData, titlePartner: {...homeSponsorsData.titlePartner, image: e.target.value}})} placeholder="Image URL (optional)" />
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-slate-700">Gold Partners</label>
                {homeSponsorsData.goldPartners.map((sp: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={sp.name} onChange={(e: any) => { const g = [...homeSponsorsData.goldPartners]; g[i].name = e.target.value; setHomeSponsorsData({...homeSponsorsData, goldPartners: g}) }} placeholder="Sponsor Name" />
                    <Input value={sp.image} onChange={(e: any) => { const g = [...homeSponsorsData.goldPartners]; g[i].image = e.target.value; setHomeSponsorsData({...homeSponsorsData, goldPartners: g}) }} placeholder="Image URL" />
                    <Button variant="destructive" size="icon" onClick={() => { const g = [...homeSponsorsData.goldPartners]; g.splice(i, 1); setHomeSponsorsData({...homeSponsorsData, goldPartners: g}) }}><Trash size={14} /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setHomeSponsorsData({...homeSponsorsData, goldPartners: [...homeSponsorsData.goldPartners, { name: "New Sponsor", image: "" }]})}>Add Gold Partner</Button>
              </div>
            </div>

            <Button onClick={saveHomeContent} className="w-full h-12 text-lg">Save Home Page</Button>
          </div>
        )}
        
        {selectedEditorPage === "about" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">About Page Editor</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Main Title</label>
              <Input value={aboutTitle} onChange={(e: any) => setAboutTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Mission Statement</label>
              <textarea value={aboutMission} onChange={(e: any) => setAboutMission(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Vision Statement</label>
              <textarea value={aboutVision} onChange={(e: any) => setAboutVision(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Core Values</label>
              {aboutValues.map((val, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Input className="w-16" value={val.num} onChange={(e: any) => { const v = [...aboutValues]; v[i].num = e.target.value; setAboutValues(v) }} placeholder="Num" />
                  <Input className="flex-1" value={val.title} onChange={(e: any) => { const v = [...aboutValues]; v[i].title = e.target.value; setAboutValues(v) }} placeholder="Title" />
                  <Input className="flex-[2]" value={val.desc} onChange={(e: any) => { const v = [...aboutValues]; v[i].desc = e.target.value; setAboutValues(v) }} placeholder="Description" />
                  <Button variant="destructive" size="icon" onClick={() => { const v = [...aboutValues]; v.splice(i,1); setAboutValues(v) }}><Trash size={16} /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setAboutValues([...aboutValues, { num: "0"+(aboutValues.length+1), title: "", desc: "" }])}>Add Core Value</Button>
            </div>
            <Button onClick={saveAboutContent} className="w-full h-12 text-lg">Save About Page</Button>
          </div>
        )}
        
        {selectedEditorPage === "sponsors" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Sponsors Page Editor</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Main Title</label>
              <Input value={sponsorsTitle} onChange={(e: any) => setSponsorsTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Subtitle</label>
              <textarea value={sponsorsSubtitle} onChange={(e: any) => setSponsorsSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Why Sponsor Title</label>
              <Input value={sponsorsWhyTitle} onChange={(e: any) => setSponsorsWhyTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Why Sponsor Text</label>
              <textarea value={sponsorsWhyText} onChange={(e: any) => setSponsorsWhyText(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Sponsorship Tiers</label>
              {sponsorsTiers.map((tier, i) => (
                <div key={i} className="border p-4 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <Input className="flex-1" value={tier.name} onChange={(e: any) => { const t = [...sponsorsTiers]; t[i].name = e.target.value; setSponsorsTiers(t) }} placeholder="Tier Name" />
                    <Input className="flex-1" value={tier.price} onChange={(e: any) => { const t = [...sponsorsTiers]; t[i].price = e.target.value; setSponsorsTiers(t) }} placeholder="Price" />
                    <Button variant="destructive" size="icon" onClick={() => { const t = [...sponsorsTiers]; t.splice(i,1); setSponsorsTiers(t) }}><Trash size={16} /></Button>
                  </div>
                  <Input value={tier.perks?.join(", ") || ""} onChange={(e: any) => { const t = [...sponsorsTiers]; t[i].perks = e.target.value.split(",").map((s: string) => s.trim()); setSponsorsTiers(t) }} placeholder="Perks (comma-separated)" />
                </div>
              ))}
              <Button variant="outline" onClick={() => setSponsorsTiers([...sponsorsTiers, { name: "", price: "", perks: [] }])}>Add Tier</Button>
            </div>
            <Button onClick={saveSponsorsContent} className="w-full h-12 text-lg">Save Sponsors Page</Button>
          </div>
        )}
        
        {selectedEditorPage === "community" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Community Page Editor</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Discord URL</label>
              <Input value={commDiscordUrl} onChange={(e: any) => setCommDiscordUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Main Title</label>
              <Input value={commTitle} onChange={(e: any) => setCommTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Subtitle</label>
              <textarea value={commSubtitle} onChange={(e: any) => setCommSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea value={commDescription} onChange={(e: any) => setCommDescription(e.target.value)} className="w-full border border-slate-200 rounded-md p-3 h-24 text-xs font-medium focus:ring-2 focus:ring-mlh-blue focus:outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Channels</label>
              {commChannels.map((channel, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input className="w-1/3" value={channel.name} onChange={(e: any) => { const c = [...commChannels]; c[i].name = e.target.value; setCommChannels(c) }} placeholder="#channel-name" />
                  <Input className="flex-1" value={channel.desc} onChange={(e: any) => { const c = [...commChannels]; c[i].desc = e.target.value; setCommChannels(c) }} placeholder="Channel description" />
                  <Button variant="destructive" size="icon" onClick={() => { const c = [...commChannels]; c.splice(i,1); setCommChannels(c) }}><Trash size={16} /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setCommChannels([...commChannels, { name: "", desc: "" }])}>Add Channel</Button>
            </div>
            <Button onClick={saveCommunityContent} className="w-full h-12 text-lg">Save Community Page</Button>
          </div>
        )}
        
        {selectedEditorPage === "pitch-deck" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Pitch Deck Editor</h2>
            </div>
            <div className="space-y-4">
              {deckSlides.map((slide, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input className="flex-1" value={slide.title} onChange={(e: any) => { const s = [...deckSlides]; s[i].title = e.target.value; setDeckSlides(s) }} placeholder="Slide Title" />
                  <Input className="flex-[2]" value={slide.content} onChange={(e: any) => { const s = [...deckSlides]; s[i].content = e.target.value; setDeckSlides(s) }} placeholder="Slide Content" />
                  <Button variant="destructive" size="icon" onClick={() => { const s = [...deckSlides]; s.splice(i,1); setDeckSlides(s) }}><Trash size={16} /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setDeckSlides([...deckSlides, { title: "", content: "" }])}>Add Slide</Button>
            </div>
            <Button onClick={savePitchDeckContent} className="w-full h-12 text-lg">Save Pitch Deck</Button>
          </div>
        )}
        
        {selectedEditorPage === "contact" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Contact Page Editor</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Main Title</label>
              <Input value={contactTitle} onChange={(e: any) => setContactTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <Input value={contactEmail} onChange={(e: any) => setContactEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <Input value={contactLocation} onChange={(e: any) => setContactLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Social Links</label>
              <Input placeholder="X (Twitter) URL" value={contactXUrl} onChange={(e: any) => setContactXUrl(e.target.value)} />
              <Input placeholder="Instagram URL" value={contactIgUrl} onChange={(e: any) => setContactIgUrl(e.target.value)} />
              <Input placeholder="LinkedIn URL" value={contactInUrl} onChange={(e: any) => setContactInUrl(e.target.value)} />
            </div>
            <Button onClick={saveContactContent} className="w-full h-12 text-lg">Save Contact Page</Button>
          </div>
        )}

        {selectedEditorPage === "previous-events" && (
          <div className="space-y-6">
            <h2 className="font-heading font-black text-2xl">Previous Events Photos</h2>
            <div className="space-y-4">
              {prevPhotos.map((photo, i) => (
                <div key={photo.id} className="p-4 border rounded-xl flex gap-4 bg-slate-50">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-700">Photo Title</label>
                    <Input 
                      value={photo.title} 
                      onChange={(e: any) => {
                        const newP = [...prevPhotos]; newP[i].title = e.target.value; setPrevPhotos(newP)
                      }} 
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-700">Image URL or Base64</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://... or select file ->"
                        value={photo.url} 
                        onChange={(e: any) => {
                          const newP = [...prevPhotos]; newP[i].url = e.target.value; setPrevPhotos(newP)
                        }} 
                      />
                      <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-md text-xs font-bold flex items-center">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const newP = [...prevPhotos];
                                newP[i].url = ev.target?.result as string;
                                setPrevPhotos(newP);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPrevPhotos(prevPhotos.filter((_, idx) => idx !== i))
                    }}
                    className="mt-6 p-2 text-mlh-red border border-mlh-red rounded hover:bg-mlh-red hover:text-white transition-colors h-10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => setPrevPhotos([...prevPhotos, { id: Math.random().toString(), url: "", title: "New Photo", height: "h-64" }])}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Photo
              </Button>
            </div>
            <Button onClick={savePrevPhotosContent} className="w-full flex items-center justify-center gap-2"><Save size={16} /> Save Previous Events</Button>
          </div>
        )}
      </div>
    </div>
  )
}
