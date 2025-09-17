"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, Save, FileText, Music2 } from "lucide-react"
import type { Excerpt } from "@/lib/types"

interface AddAuditionProps {
  onBack: () => void
}

interface AuditionFormData {
  orchestra: string
  position: string
  date: string
  location: string
  excerpts: Omit<Excerpt, "id" | "practiced">[]
}

export function AddAudition({ onBack }: AddAuditionProps) {
  const [formData, setFormData] = useState<AuditionFormData>({
    orchestra: "",
    position: "",
    date: "",
    location: "",
    excerpts: [],
  })
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (field: keyof AuditionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addExcerpt = () => {
    const newExcerpt = {
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

  const updateExcerpt = (index: number, field: keyof Omit<Excerpt, "id" | "practiced">, value: string) => {
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

    // Validate excerpts
    for (let i = 0; i < formData.excerpts.length; i++) {
      const excerpt = formData.excerpts[i]
      if (!excerpt.piece.trim() || !excerpt.composer.trim()) {
        return `Excerpt ${i + 1}: Piece and composer are required`
      }
    }

    return null
  }

  const handleSave = async (status: "draft" | "upcoming") => {
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setIsSaving(true)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAudition = {
      id: Date.now().toString(),
      ...formData,
      status,
      createdAt: new Date().toISOString(),
      excerpts: formData.excerpts.map((excerpt, index) => ({
        ...excerpt,
        id: `${Date.now()}-${index}`,
        practiced: false,
      })),
    }

    console.log("Saving audition:", newAudition)

    setIsSaving(false)
    alert(`Audition saved as ${status}!`)
    onBack()
  }

  const isFormValid = () => {
    return (
      formData.orchestra.trim() &&
      formData.position.trim() &&
      formData.date &&
      formData.location.trim() &&
      formData.excerpts.every((excerpt) => excerpt.piece.trim() && excerpt.composer.trim())
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
          <h1 className="text-3xl font-bold text-foreground">Add New Audition</h1>
          <p className="text-muted-foreground">Create a new audition to track your preparation</p>
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
            </CardContent>
          </Card>

          {/* Save Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Save Audition</CardTitle>
              <p className="text-sm text-muted-foreground">
                Save as draft to continue editing later, or save as active to start practicing
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSave("draft")}
                disabled={isSaving || !formData.orchestra || !formData.position}
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
              >
                <FileText className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save as Draft"}
              </Button>

              <Button
                onClick={() => handleSave("upcoming")}
                disabled={isSaving || !isFormValid()}
                className="w-full flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save as Active"}
              </Button>

              <p className="text-xs text-muted-foreground">* Required fields must be completed to save as active</p>
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
              <p className="text-sm text-muted-foreground">Add the musical excerpts required for this audition</p>
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
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
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
