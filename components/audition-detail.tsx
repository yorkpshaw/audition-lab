"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, MapPin, Play, Edit, Clock, Music } from "lucide-react"
import { sampleAuditions, samplePracticeSessions } from "@/lib/sample-data"
import { useState } from "react"
import type { Excerpt } from "@/lib/types"

interface AuditionDetailProps {
  auditionId: string
  onStartPractice: () => void
  onBack: () => void
}

export function AuditionDetail({ auditionId, onStartPractice, onBack }: AuditionDetailProps) {
  const audition = sampleAuditions.find((a) => a.id === auditionId)
  const practiceSessions = samplePracticeSessions.filter((s) => s.auditionId === auditionId)

  const [excerpts, setExcerpts] = useState<Excerpt[]>(audition?.excerpts || [])
  const [excerptNotes, setExcerptNotes] = useState<Record<string, string>>({})

  if (!audition) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Audition not found</p>
        <Button onClick={onBack} variant="outline">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSessionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const toggleExcerptPracticed = (excerptId: string) => {
    setExcerpts((prev) =>
      prev.map((excerpt) => (excerpt.id === excerptId ? { ...excerpt, practiced: !excerpt.practiced } : excerpt)),
    )
  }

  const updateExcerptNotes = (excerptId: string, notes: string) => {
    setExcerptNotes((prev) => ({ ...prev, [excerptId]: notes }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary text-primary-foreground"
      case "completed":
        return "bg-secondary text-secondary-foreground"
      case "draft":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const practicedCount = excerpts.filter((e) => e.practiced).length
  const totalExcerpts = excerpts.length
  const progressPercentage = totalExcerpts > 0 ? (practicedCount / totalExcerpts) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{audition.orchestra}</h1>
          <p className="text-lg text-muted-foreground">{audition.position}</p>
        </div>
        <Badge className={getStatusColor(audition.status)}>{audition.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audition Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audition Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(audition.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{audition.location}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Practice Progress</span>
                  <span>
                    {practicedCount} of {totalExcerpts} excerpts
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={onStartPractice} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Practice Session
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Edit className="h-4 w-4" />
                  Edit Audition
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Required Excerpts */}
          <Card>
            <CardHeader>
              <CardTitle>Required Excerpts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track your practice progress and add notes for each excerpt
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {excerpts.map((excerpt) => (
                  <div key={excerpt.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={excerpt.practiced}
                        onCheckedChange={() => toggleExcerptPracticed(excerpt.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{excerpt.piece}</h4>
                          <span className="text-sm text-muted-foreground">by {excerpt.composer}</span>
                        </div>
                        {excerpt.movement && <p className="text-sm text-muted-foreground">{excerpt.movement}</p>}
                        {excerpt.measures && <p className="text-sm text-muted-foreground">{excerpt.measures}</p>}
                      </div>
                    </div>

                    <Textarea
                      placeholder="Add practice notes for this excerpt..."
                      value={excerptNotes[excerpt.id] || excerpt.notes || ""}
                      onChange={(e) => updateExcerptNotes(excerpt.id, e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practice History Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Practice History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {practiceSessions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No practice sessions yet</p>
                  <Button onClick={onStartPractice} variant="outline" size="sm" className="mt-2 bg-transparent">
                    Start your first session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {practiceSessions.map((session, index) => (
                    <div key={session.id} className="relative">
                      {/* Timeline line */}
                      {index < practiceSessions.length - 1 && (
                        <div className="absolute left-2 top-8 w-0.5 h-16 bg-border" />
                      )}

                      <div className="flex gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary mt-1 relative z-10" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{formatSessionDate(session.date)}</p>
                            <span className="text-xs text-muted-foreground">{session.duration} min</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {session.excerptsPracticed.length} excerpts practiced
                          </p>
                          {session.notes && (
                            <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{session.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
