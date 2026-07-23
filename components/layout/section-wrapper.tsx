"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import React from "react"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn("w-full py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto relative z-10", className)}
    >
      {children}
    </motion.section>
  )
}
