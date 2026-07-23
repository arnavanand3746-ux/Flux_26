import { Hero } from "@/components/sections/hero"
import { TrustStrip } from "@/components/sections/trust-strip"
import { WhatIsFlux } from "@/components/sections/what-is-flux"
import { StatsGrid } from "@/components/sections/stats-grid"
import { Tracks } from "@/components/sections/tracks"
import { HackerJourney } from "@/components/sections/hacker-journey"
import { FeaturedExperience } from "@/components/sections/featured-experience"
import { FoundersCorner } from "@/components/sections/founders-corner"
import { CommunityPreview } from "@/components/sections/community-preview"
import { PreviousEvents } from "@/components/sections/previous-events"
import { SchedulePreview } from "@/components/sections/schedule-preview"
import { SponsorsPreview } from "@/components/sections/sponsors-preview"
import { FaqAccordion } from "@/components/sections/faq-accordion"
import { CtaSection } from "@/components/sections/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden bg-background">
      <Hero />
      <TrustStrip />
      <WhatIsFlux />
      <StatsGrid />
      <Tracks />
      <HackerJourney />
      <FeaturedExperience />
      <FoundersCorner />
      <CommunityPreview />
      <PreviousEvents />
      <SchedulePreview />
      <SponsorsPreview />
      <FaqAccordion />
      <CtaSection />
    </div>
  );
}
