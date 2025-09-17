"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Plus, Eye, Play } from "lucide-react"
import { sampleAuditions, samplePracticeSessions } from "@/lib/sample-data"
import type { Audition } from "@/lib/types"

interface DashboardProps {
  onViewAudition: (auditionId: string) => void
  onStartPractice: (auditionId: string) => void
  onAddAudition: () => void
}

export function Dashboard({ onViewAudition, onStartPractice, onAddAudition }: DashboardProps) {
  const upcomingAuditions = sampleAuditions.filter((audition) => audition.status === "upcoming")
  const recentSessions = samplePracticeSessions.slice(0, 5) // Show last 5 sessions

  const getStatusColor = (status: Audition["status"]) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getAuditionById = (id: string) => sampleAuditions.find((a) => a.id === id)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your orchestra auditions and practice sessions</p>
        </div>
        <Button onClick={onAddAudition} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Audition
        </Button>
      </div>

      {/* Current Auditions Section */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Current Auditions</h2>
        {upcomingAuditions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">No upcoming auditions</p>
                <Button onClick={onAddAudition} variant="outline">
                  Add your first audition
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAuditions.map((audition) => (
              <Card key={audition.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{audition.orchestra}</CardTitle>
                      <p className="text-sm text-muted-foreground">{audition.position}</p>
                    </div>
                    <Badge className={getStatusColor(audition.status)}>{audition.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(audition.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {audition.location}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      {audition.excerpts.length} excerpts • {audition.excerpts.filter((e) => e.practiced).length}{" "}
                      practiced
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewAudition(audition.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onStartPractice(audition.id)}
                        className="flex items-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Practice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent Practice Sessions Section */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Recent Practice Sessions</h2>
        {recentSessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No practice sessions yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentSessions.map((session) => {
                  const audition = getAuditionById(session.auditionId)
                  return (
                    <div key={session.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{audition?.orchestra || "Unknown Audition"}</h3>
                            <Badge variant="outline" className="text-xs">
                              {audition?.position || "Position"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(session.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.duration} min
                            </div>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{session.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{session.excerptsPracticed.length} excerpts</p>
                          <p className="text-xs text-muted-foreground">practiced</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
