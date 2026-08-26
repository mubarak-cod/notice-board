export interface Notice {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

/*
 * Placeholder data so the section has something real to render.
 * Once your backend/API route for notices exists, swap this array
 * for a fetch call — everything downstream (NoticeCard, the grid)
 * already expects this exact shape, so nothing else has to change.
 */
export const NOTICES: Notice[] = [
  {
    id: "1",
    title: "Second Semester Exam Timetable Released",
    category: "Exams",
    date: "Aug 20, 2026",
    excerpt:
      "Check your exam dates and venues for all 100–400 level Computer Science courses this semester.",
  },
  {
    id: "2",
    title: "SIWES Briefing for 300 Level Students",
    category: "Academics",
    date: "Aug 18, 2026",
    excerpt:
      "Mandatory briefing on industrial training placement, logbooks, and supervisor assignment.",
  },
  {
    id: "3",
    title: "Project Defense Schedule — Week 3",
    category: "Events",
    date: "Aug 15, 2026",
    excerpt:
      "Final year project defense slots have been assigned. Confirm your time and panel room number.",
  },
  {
    id: "4",
    title: "Free Python & Git Workshop — Register Now",
    category: "Workshop",
    date: "Aug 12, 2026",
    excerpt:
      "Open to all levels. Limited seats in the CS computer lab, first come first served.",
  },
  {
    id: "5",
    title: "Result Checking Portal Now Live",
    category: "General",
    date: "Aug 10, 2026",
    excerpt:
      "First semester results are now available on the student portal. Report discrepancies to the department office.",
  },
  {
    id: "6",
    title: "Departmental Library Access Hours Updated",
    category: "General",
    date: "Aug 6, 2026",
    excerpt: "New opening hours effective this week: Monday–Friday, 8am–6pm.",
  },
];