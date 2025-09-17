"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Play, Pause, Square, Clock, Save, Star } from "lucide-react"
import { sampleAuditions } from "@/lib/sample-data"

interface PracticeSessionProps {
  selectedAuditionId?: string | null
  onBack: () => void
}

export function PracticeSession({ selectedAuditionId, onBack }: PracticeSessionProps) {
  const [auditionId, setAuditionId] = useState<string>(selectedAuditionId || "")
  const [isTimerMode, setIsTimerMode] = useState(true)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [manualDuration, setManualDuration] = useState("")
  const [selectedExcerpts, setSelectedExcerpts] = useState<Set<string>>(new Set())
  const [effortRatings, setEffortRatings] = useState<Record<string, number>>({})
  const [sessionNotes, setSessionNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const selectedAudition = sampleAuditions.find((a) => a.id === auditionId)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => setIsTimerRunning(true)
  const pauseTimer = () => setIsTimerRunning(false)
  const stopTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(0)
  }

  const toggleExcerpt = (excerptId: string) => {
    const newSelected = new Set(selectedExcerpts)
    if (newSelected.has(excerptId)) {
      newSelected.delete(excerptId)
      // Remove rating when unchecking
      const newRatings = { ...effortRatings }
      delete newRatings[excerptId]
      setEffortRatings(newRatings)
    } else {
      newSelected.add(excerptId)
    }
    setSelectedExcerpts(newSelected)
  }

  const setEffortRating = (excerptId: string, rating: number) => {
    setEffortRatings((prev) => ({ ...prev, [excerptId]: rating }))
  }

  const handleSave = async () => {
    if (!auditionId) {
      alert("Please select an audition")
      return
    }

    setIsSaving(true)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const duration = isTimerMode ? Math.floor(timerSeconds / 60) : Number.parseInt(manualDuration) || 0

    console.log("Saving practice session:", {
      auditionId,
      duration,
      excerptsPracticed: Array.from(selectedExcerpts),
      effortRatings,
      notes: sessionNotes,
      date: new Date().toISOString(),
    })

    setIsSaving(false)

    // Reset form
    setTimerSeconds(0)
    setIsTimerRunning(false)
    setManualDuration("")
    setSelectedExcerpts(new Set())
    setEffortRatings({})
    setSessionNotes("")

    alert("Practice session saved successfully!")
  }

  const renderStarRating = (excerptId: string, currentRating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setEffortRating(excerptId, rating)}
            className={`p-1 rounded transition-colors ${
              rating <= currentRating
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practice Session</h1>
          <p className="text-muted-foreground">Log your practice time and track progress</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Session Setup */}
        <div className="space-y-6">
          {/* Audition Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Audition</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={auditionId} onValueChange={setAuditionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an audition to practice for" />
                </SelectTrigger>
                <SelectContent>
                  {sampleAuditions
                    .filter((a) => a.status === "upcoming")
                    .map((audition) => (
                      <SelectItem key={audition.id} value={audition.id}>
                        {audition.orchestra} - {audition.position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Timer/Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Practice Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant={isTimerMode ? "default" : "outline"} onClick={() => setIsTimerMode(true)} size="sm">
                  Timer
                </Button>
                <Button variant={!isTimerMode ? "default" : "outline"} onClick={() => setIsTimerMode(false)} size="sm">
                  Manual Entry
                </Button>
              </div>

              {isTimerMode ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-primary">{formatTime(timerSeconds)}</div>
                  </div>
                  <div className="flex justify-center gap-2">
                    {!isTimerRunning ? (
                      <Button onClick={startTimer} className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopTimer} variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter practice duration"
                    value={manualDuration}
                    onChange={(e) => setManualDuration(e.target.value)}
                    min="1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Excerpts and Notes */}
        <div className="space-y-6">
          {/* Excerpts Practiced */}
          {selectedAudition && (
            <Card>
              <CardHeader>
                <CardTitle>Excerpts Practiced</CardTitle>
                <p className="text-sm text-muted-foreground">Select excerpts and rate your effort level (1-5 stars)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAudition.excerpts.map((excerpt) => (
                    <div key={excerpt.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedExcerpts.has(excerpt.id)}
                          onCheckedChange={() => toggleExcerpt(excerpt.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{excerpt.piece}</h4>
                            <span className="text-sm text-muted-foreground">by {excerpt.composer}</span>
                          </div>
                          {excerpt.movement && <p className="text-sm text-muted-foreground">{excerpt.movement}</p>}
                          {excerpt.measures && <p className="text-sm text-muted-foreground">{excerpt.measures}</p>}
                        </div>
                      </div>

                      {selectedExcerpts.has(excerpt.id) && (
                        <div className="ml-7 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Effort level:</span>
                            {renderStarRating(excerpt.id, effortRatings[excerpt.id] || 0)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about your practice session... What went well? What needs more work?"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSave}
                disabled={!auditionId || isSaving}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Practice Session"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
