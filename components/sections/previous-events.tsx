"use client"
import { motion } from "framer-motion"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { useState, useEffect } from "react"
import { loadPageContent } from "@/app/lib/page-content"

export interface PreviousPhoto {
  id: string
  url: string
  title: string
  height: string
}

const defaultPhotos: PreviousPhoto[] = [
  { id: "1", url: "", title: "Midnight Hacking", height: "h-64" },
  { id: "2", url: "", title: "Winner Announcements", height: "h-48" },
  { id: "3", url: "", title: "Mentor Session", height: "h-80" },
  { id: "4", url: "", title: "Hardware Lab", height: "h-56" },
  { id: "5", url: "", title: "Swag Distribution", height: "h-64" },
  { id: "6", url: "", title: "Main Stage", height: "h-48" },
]

export function PreviousEvents() {
  const [photos, setPhotos] = useState<PreviousPhoto[]>(defaultPhotos)

  useEffect(() => {
    loadPageContent<PreviousPhoto[]>("previous_events_photos", defaultPhotos).then(data => {
      if (data && data.length > 0) setPhotos(data)
    })
  }, [])

  return (
    <SectionWrapper id="previous-events" className="bg-slate-50 border-y-2 border-slate-200">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 text-slate-900">
          Previous <span className="text-mlh-light-blue">Events</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium mb-4">
          A glimpse into our past hackathons. We can't wait to see what you build this year!
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`w-full ${photo.height} ${photo.url ? "bg-slate-200" : "bg-slate-800"} rounded-xl mlh-card overflow-hidden relative group break-inside-avoid`}
          >
            {photo.url && (
              <img src={photo.url} alt={photo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            )}
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${photo.url ? "bg-black/40 opacity-0 group-hover:opacity-100" : "text-white/50"} transition-all duration-300`}>
              <span className={`font-bold text-xl drop-shadow-md text-center px-4 ${photo.url ? "text-white translate-y-4 group-hover:translate-y-0 transition-transform" : ""}`}>
                {photo.title}
              </span>
              {!photo.url && <span className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Photo Placeholder</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
