export interface Audition {
  id: string
  orchestra: string
  position: string
  date: string
  location: string
  status: "upcoming" | "completed" | "draft"
  excerpts: Excerpt[]
  createdAt: string
}

export interface Excerpt {
  id: string
  piece: string
  composer: string
  movement?: string
  measures?: string
  notes?: string
  practiced: boolean
}

export interface PracticeSession {
  id: string
  auditionId: string
  date: string
  duration: number // in minutes
  excerptsPracticed: string[] // excerpt IDs
  notes: string
  effortRatings: Record<string, number> // excerpt ID -> rating (1-5)
}
