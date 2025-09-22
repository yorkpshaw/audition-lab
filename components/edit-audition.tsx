"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Save, Music2 } from "lucide-react"
import type { Excerpt } from "@/lib/types"

interface EditAuditionProps {
  auditionId: string
  onBack: () => void
}

// Sample audition data - in a real app this would come from a database
const sampleAuditionData = {
  id: "1",
  orchestra: "New York Philharmonic",
  position: "Principal Violin",
  date: "2024-03-14",
  location: "David Geffen Hall, New York",
  status: "upcoming" as const,
  notes: "Bring own music stand. Warm-up room available 30 minutes before audition time.",
  excerpts: [
    {
      id: "1",
      piece: "Symphony No. 5",
      composer: "Beethoven",
      movement: "I. Allegro con brio",
      measures: "mm. 1-21",
      notes: "Focus on precise articulation",
      practiced: false,
    },
    {
      id: "2",
      piece: "Violin Concerto",
      composer: "Brahms",
      movement: "I. Allegro ma non troppo",
      measures: "mm. 77-108",
      notes: "",
      practiced: false,
    },
    {
      id: "3",
      piece: "Scheherazade",
      composer: "Rimsky-Korsakov",
      movement: "I. The Sea and Sinbad's Ship",
      measures: "mm. 1-16",
      notes: "Solo passage",
      practiced: false,
    },
  ],
}

interface AuditionFormData {
  orchestra: string
  position: string
  date: string
  location: string
  status: "upcoming" | "preparing" | "ready" | "completed"
  notes: string
  excerpts: Omit<Excerpt, "practiced">[]
}

export function EditAudition({ auditionId, onBack }: EditAuditionProps) {
  const [formData, setFormData] = useState<AuditionFormData>({
    orchestra: sampleAuditionData.orchestra,
    position: sampleAuditionData.position,
    date: sampleAuditionData.date,
    location: sampleAuditionData.location,
    status: sampleAuditionData.status,
    notes: sampleAuditionData.notes,
    excerpts: sampleAuditionData.excerpts.map(({ practiced, ...excerpt }) => excerpt),
  })
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (field: keyof AuditionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addExcerpt = () => {
    const newExcerpt = {
      id: Date.now().toString(),
      piece: "",
      composer: "",
      movement: "",
      measures: "",
      notes: "",
    }
    setFormData((prev) => ({
      ...prev,
      excerpts: [...prev.excerpts, newExcerpt],
    }))
  }

  const updateExcerpt = (index: number, field: keyof Omit<Excerpt, "practiced">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      excerpts: prev.excerpts.map((excerpt, i) => (i === index ? { ...excerpt, [field]: value } : excerpt)),
    }))
  }

  const removeExcerpt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      excerpts: prev.excerpts.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    if (!formData.orchestra.trim()) return "Orchestra name is required"
    if (!formData.position.trim()) return "Position is required"
    if (!formData.date) return "Audition date is required"
    if (!formData.location.trim()) return "Location is required"

    for (let i = 0; i < formData.excerpts.length; i++) {
      const excerpt = formData.excerpts[i]
      if (!excerpt.piece.trim() || !excerpt.composer.trim()) {
        return `Excerpt ${i + 1}: Piece and composer are required`
      }
    }

    return null
  }

  const handleSave = async () => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Updating audition:", {
      auditionId,
      ...formData,
      updatedAt: new Date().toISOString(),
    })

    setIsSaving(false)
    alert("Audition updated successfully!")
    onBack()
  }

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this audition? This will also delete all associated practice sessions. This action cannot be undone.",
      )
    ) {
      console.log("Deleting audition:", auditionId)
      alert("Audition deleted successfully!")
      onBack()
    }
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
          <h1 className="text-3xl font-bold text-foreground">Edit Audition</h1>
          <p className="text-muted-foreground">Update audition details and requirements</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="h-5 w-5" />
                Audition Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orchestra">Orchestra Name *</Label>
                <Input
                  id="orchestra"
                  placeholder="e.g., New York Philharmonic"
                  value={formData.orchestra}
                  onChange={(e) => updateField("orchestra", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  placeholder="e.g., Principal Violin, Section Viola"
                  value={formData.position}
                  onChange={(e) => updateField("position", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Audition Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., David Geffen Hall, New York"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => updateField("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Audition Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any notes about requirements, logistics, etc..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button onClick={handleSave} disabled={isSaving} className="w-full flex items-center gap-2" size="lg">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>

              <Button onClick={onBack} variant="outline" className="w-full bg-transparent" size="lg">
                Cancel
              </Button>

              <Button onClick={handleDelete} variant="destructive" className="w-full flex items-center gap-2" size="lg">
                <Trash2 className="h-4 w-4" />
                Delete Audition
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Excerpts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Required Excerpts</CardTitle>
                <Button onClick={addExcerpt} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Excerpt
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Update the musical excerpts required for this audition</p>
            </CardHeader>
            <CardContent>
              {formData.excerpts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-3">No excerpts added yet</p>
                  <Button onClick={addExcerpt} variant="outline" size="sm" className="bg-transparent">
                    Add your first excerpt
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.excerpts.map((excerpt, index) => (
                    <div key={excerpt.id || index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Excerpt {index + 1}</h4>
                        <Button
                          onClick={() => removeExcerpt(index)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`piece-${index}`}>Piece *</Label>
                          <Input
                            id={`piece-${index}`}
                            placeholder="e.g., Symphony No. 5"
                            value={excerpt.piece}
                            onChange={(e) => updateExcerpt(index, "piece", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`composer-${index}`}>Composer *</Label>
                          <Input
                            id={`composer-${index}`}
                            placeholder="e.g., Beethoven"
                            value={excerpt.composer}
                            onChange={(e) => updateExcerpt(index, "composer", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`movement-${index}`}>Movement (optional)</Label>
                        <Input
                          id={`movement-${index}`}
                          placeholder="e.g., I. Allegro con brio"
                          value={excerpt.movement}
                          onChange={(e) => updateExcerpt(index, "movement", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`measures-${index}`}>Measures (optional)</Label>
                        <Input
                          id={`measures-${index}`}
                          placeholder="e.g., mm. 1-21"
                          value={excerpt.measures}
                          onChange={(e) => updateExcerpt(index, "measures", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`notes-${index}`}>Notes (optional)</Label>
                        <Textarea
                          id={`notes-${index}`}
                          placeholder="Add any specific notes about this excerpt..."
                          value={excerpt.notes}
                          onChange={(e) => updateExcerpt(index, "notes", e.target.value)}
                          rows={2}
                        />
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
