"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { AuditionDetail } from "@/components/audition-detail"
import { PracticeSession } from "@/components/practice-session"
import { AddAudition } from "@/components/add-audition"

export type Page = "dashboard" | "audition-detail" | "practice-session" | "add-audition"

export default function AuditionLab() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [selectedAuditionId, setSelectedAuditionId] = useState<string | null>(null)

  const navigateToAudition = (auditionId: string) => {
    setSelectedAuditionId(auditionId)
    setCurrentPage("audition-detail")
  }

  const navigateToPractice = (auditionId?: string) => {
    if (auditionId) setSelectedAuditionId(auditionId)
    setCurrentPage("practice-session")
  }

  const navigateToAddAudition = () => {
    setCurrentPage("add-audition")
  }

  const navigateToDashboard = () => {
    setCurrentPage("dashboard")
    setSelectedAuditionId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} onNavigateToDashboard={navigateToDashboard} />

      <main className="container mx-auto px-4 py-6">
        {currentPage === "dashboard" && (
          <Dashboard
            onViewAudition={navigateToAudition}
            onStartPractice={navigateToPractice}
            onAddAudition={navigateToAddAudition}
          />
        )}

        {currentPage === "audition-detail" && selectedAuditionId && (
          <AuditionDetail
            auditionId={selectedAuditionId}
            onStartPractice={() => navigateToPractice(selectedAuditionId)}
            onBack={navigateToDashboard}
          />
        )}

        {currentPage === "practice-session" && (
          <PracticeSession selectedAuditionId={selectedAuditionId} onBack={navigateToDashboard} />
        )}

        {currentPage === "add-audition" && <AddAudition onBack={navigateToDashboard} />}
      </main>
    </div>
  )
}
