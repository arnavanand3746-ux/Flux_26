"use client"
import React, { useState, useEffect } from "react"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { loadPageContent } from "@/app/lib/page-content"

const defaultSponsorsData = {
  titlePartner: { name: "Your Logo Here", image: "" },
  goldPartners: [
    { name: "Sponsor A", image: "" },
    { name: "Sponsor B", image: "" },
    { name: "Sponsor C", image: "" }
  ]
}

export function SponsorsPreview() {
  const [sponsorsData, setSponsorsData] = useState<any>(defaultSponsorsData)

  useEffect(() => {
    const fetchSponsors = async () => {
      const data = await loadPageContent<any>("home_sponsors", defaultSponsorsData)
      if (data) setSponsorsData(data)
    }
    fetchSponsors()
  }, [])
  const renderSponsor = (sponsor: any, h: string) => (
    <div className={`w-full ${h} bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all hover:border-mlh-blue hover:shadow-[4px_4px_0px_rgba(0,43,92,0.1)] group overflow-hidden relative`}>
      {sponsor.image ? (
        <img src={sponsor.image} alt={sponsor.name} className="max-w-[80%] max-h-[80%] object-contain" />
      ) : (
        <span className="font-heading font-bold text-slate-400 group-hover:text-mlh-blue">{sponsor.name}</span>
      )}
    </div>
  )

  return (
    <SectionWrapper id="sponsors" className="bg-slate-50">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 text-slate-900">
          Backed by the <span className="text-mlh-red">Best</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-8 font-medium">
          Partner with us to reach the brightest minds in the student developer ecosystem.
        </p>
        <Link href="/contact">
          <Button variant="outline">Partner with FLUX</Button>
        </Link>
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="text-center text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Title Partner</h3>
          <div className="max-w-md mx-auto">
            {renderSponsor(sponsorsData.titlePartner, "h-32")}
          </div>
        </div>

        {sponsorsData.goldPartners && sponsorsData.goldPartners.length > 0 && (
          <div>
            <h3 className="text-center text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Gold Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {sponsorsData.goldPartners.map((sp: any, i: number) => (
                <React.Fragment key={i}>
                  {renderSponsor(sp, "h-24")}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
