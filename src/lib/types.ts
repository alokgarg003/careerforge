export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  source: string;
  url: string;
  description: string;
  matchScore?: number;
  alignment?: string;
  skills?: string[];
  experienceRange?: string;
  workMode?: string;
  datePosted?: string;
  saved?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: "interested" | "applied" | "interviewing" | "offered" | "completed";
  appliedDate: string;
  notes?: string;
}

export interface ActivityItem {
  id: string;
  type: "search" | "apply" | "save" | "score" | "interview";
  description: string;
  timestamp: string;
}

export type Alignment = "Strong Match" | "Good Match" | "Stretch" | "Ignore";
export type ViewMode = "cards" | "table";
export type SortOption = "score" | "date" | "company";

export function getAlignmentFromScore(score: number): Alignment {
  if (score >= 70) return "Strong Match";
  if (score >= 45) return "Good Match";
  if (score >= 20) return "Stretch";
  return "Ignore";
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 45) return "text-amber-600 bg-amber-50 border-amber-200";
  if (score >= 20) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export function getScoreBarColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 45) return "bg-amber-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export function getAlignmentBadgeVariant(
  alignment: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (alignment) {
    case "Strong Match":
      return "default";
    case "Good Match":
      return "secondary";
    case "Stretch":
      return "outline";
    case "Ignore":
      return "destructive";
    default:
      return "outline";
  }
}

export function getSourceBadgeColor(source: string): string {
  switch (source.toLowerCase()) {
    case "web search":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "linkedin":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "naukri":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "manual":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function getWorkModeBadgeColor(workMode: string): string {
  switch (workMode.toLowerCase()) {
    case "remote":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "hybrid":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "onsite":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}
