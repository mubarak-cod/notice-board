export interface ComparisonPoint {
  id: string;
  label: string;
  before: string;
  after: string;
}

export const COMPARISONS: ComparisonPoint[] = [
  {
    id: "1",
    label: "Reach",
    before: "Only reaches whoever walks past it",
    after: "Reaches every student, on any device",
  },
  {
    id: "2",
    label: "Finding a notice",
    before: "Ask around and hope someone remembers",
    after: "Search it and find it in seconds",
  },
  {
    id: "3",
    label: "Relevance",
    before: "One board, every notice, everyone sees it all",
    after: "Filtered by department, so you see what's yours",
  },
  {
    id: "4",
    label: "Staying updated",
    before: "You find out if you're lucky",
    after: "You get notified the moment it's posted",
  },
  {
    id: "5",
    label: "After it's taken down",
    before: "Gone. No record, no way back",
    after: "Stays archived and searchable",
  },
];