export interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    id: "1",
    number: "01",
    title: "Browse",
    description:
      "See every notice posted by the department, newest first — no more guessing what's pinned where.",
  },
  {
    id: "2",
    number: "02",
    title: "Filter",
    description:
      "Narrow it down by category — exams, events, workshops — so you only see what's relevant to you.",
  },
  {
    id: "3",
    number: "03",
    title: "Get Notified",
    description:
      "Subscribe once, and get an alert the moment something new goes up. No more checking back manually.",
  },
];