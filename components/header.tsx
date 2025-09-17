"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import type { Page } from "@/app/page"

interface HeaderProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  onNavigateToDashboard: () => void
}

export function Header({ currentPage, onNavigate, onNavigateToDashboard }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <Music className="h-6 w-6 text-primary" />
            AuditionLab
          </button>

          <nav className="flex items-center gap-4">
            <Button variant={currentPage === "dashboard" ? "default" : "ghost"} onClick={() => onNavigate("dashboard")}>
              Dashboard
            </Button>
            <Button
              variant={currentPage === "practice-session" ? "default" : "ghost"}
              onClick={() => onNavigate("practice-session")}
            >
              Practice
            </Button>
            <Button
              variant={currentPage === "add-audition" ? "default" : "ghost"}
              onClick={() => onNavigate("add-audition")}
            >
              Add Audition
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
