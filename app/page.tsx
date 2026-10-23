"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Instagram, Megaphone, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BRIEF_CONFIG } from "@/lib/briefs/types"

const packages = [
  {
    ...BRIEF_CONFIG.ads,
    href: "/ads",
    icon: Megaphone,
  },
  {
    ...BRIEF_CONFIG.estandar,
    href: "/estandar",
    icon: Star,
  },
  {
    ...BRIEF_CONFIG.premium,
    href: "/premium",
    icon: Sparkles,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #CADCFF 0%, #C1FFDD 100%)" }}>
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/saint-logo.png" alt="SAINT Logo" width={120} height={120} className="object-contain" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge variant="outline" className="mb-4">
                  Herramienta Profesional
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">Elige tu brief</h1>

                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Cada paquete tiene su propio cuestionario. Entra al link que te compartió Saint y responde con información concreta.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {packages.map((item) => (
                    <Link key={item.href} href={item.href} className="block h-full">
                      <div className="h-full bg-white/90 border border-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <item.icon className="h-8 w-8 mb-4" />
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h2 className="text-2xl font-bold text-black">{item.name}</h2>
                          <span className="text-xs font-medium bg-black text-white px-2 py-1 rounded-full">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">{item.description}</p>
                        <Button className="w-full bg-black text-white hover:bg-gray-800">
                          Abrir {item.shortName}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center mb-4 md:mb-0 hover:opacity-80 transition-opacity">
              <Image src="/saint-logo.png" alt="SAINT Logo" width={80} height={80} className="object-contain" />
            </Link>

            <div className="flex flex-col items-center md:items-end gap-4">
              <a
                href="https://www.instagram.com/sainttagency/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-black transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @sainttagency
              </a>
              <div className="text-sm text-muted-foreground text-center md:text-right">
                <p>© 2026 SAINT Agency. Todos los derechos reservados.</p>
                <p className="mt-1">saintbrief.com/ads · /estandar · /premium</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
