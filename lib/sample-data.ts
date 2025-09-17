import type { Audition, PracticeSession } from "./types"

export const sampleAuditions: Audition[] = [
  {
    id: "1",
    orchestra: "New York Philharmonic",
    position: "Principal Violin",
    date: "2024-03-15",
    location: "David Geffen Hall, New York",
    status: "upcoming",
    createdAt: "2024-01-15",
    excerpts: [
      {
        id: "1",
        piece: "Symphony No. 5",
        composer: "Beethoven",
        movement: "I. Allegro con brio",
        measures: "mm. 1-21",
        practiced: true,
      },
      {
        id: "2",
        piece: "Violin Concerto",
        composer: "Brahms",
        movement: "I. Allegro ma non troppo",
        measures: "mm. 77-108",
        practiced: false,
      },
      {
        id: "3",
        piece: "Scheherazade",
        composer: "Rimsky-Korsakov",
        movement: "I. The Sea and Sinbad's Ship",
        measures: "mm. 1-16",
        practiced: true,
      },
    ],
  },
  {
    id: "2",
    orchestra: "Boston Symphony Orchestra",
    position: "Associate Concertmaster",
    date: "2024-04-22",
    location: "Symphony Hall, Boston",
    status: "upcoming",
    createdAt: "2024-02-01",
    excerpts: [
      {
        id: "4",
        piece: "Symphony No. 9",
        composer: "Dvorak",
        movement: "IV. Allegro con fuoco",
        measures: "mm. 1-32",
        practiced: false,
      },
      {
        id: "5",
        piece: "Don Juan",
        composer: "Richard Strauss",
        measures: "mm. 1-25",
        practiced: true,
      },
    ],
  },
  {
    id: "3",
    orchestra: "Chicago Symphony Orchestra",
    position: "Section Violin",
    date: "2024-02-28",
    location: "Symphony Center, Chicago",
    status: "completed",
    createdAt: "2024-01-10",
    excerpts: [
      {
        id: "6",
        piece: "Symphony No. 4",
        composer: "Tchaikovsky",
        movement: "I. Andante sostenuto",
        measures: "mm. 1-37",
        practiced: true,
      },
    ],
  },
]

export const samplePracticeSessions: PracticeSession[] = [
  {
    id: "1",
    auditionId: "1",
    date: "2024-01-20",
    duration: 90,
    excerptsPracticed: ["1", "3"],
    notes: "Focused on intonation in the Beethoven opening. Scheherazade solo needs more work on the high positions.",
    effortRatings: { "1": 4, "3": 3 },
  },
  {
    id: "2",
    auditionId: "1",
    date: "2024-01-22",
    duration: 60,
    excerptsPracticed: ["2"],
    notes: "First time working on the Brahms. Need to work on the double stops in measures 95-100.",
    effortRatings: { "2": 2 },
  },
  {
    id: "3",
    auditionId: "2",
    date: "2024-02-05",
    duration: 75,
    excerptsPracticed: ["5"],
    notes: "Don Juan opening - worked on bow distribution and dynamic contrast.",
    effortRatings: { "5": 4 },
  },
]
