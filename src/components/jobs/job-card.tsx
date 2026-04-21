'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Briefcase,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Job, getScoreColor, getScoreBarColor, getSourceBadgeColor, getWorkModeBadgeColor } from '@/lib/types';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onSave: (jobId: string) => void;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function JobCard({ job, onViewDetails, onSave }: JobCardProps) {
  const score = job.matchScore ?? 0;
  const scoreColorClass = getScoreColor(score);
  const barColor = getScoreBarColor(score);
  const sourceColor = getSourceBadgeColor(job.source);
  const workModeColor = getWorkModeBadgeColor(job.workMode ?? '');

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col gap-4 py-5 px-5 hover:border-emerald-200 transition-colors">
        <CardContent className="flex-1 p-0 flex flex-col gap-3">
          {/* Header: Title + Score */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-0.5">{job.companyName}</p>
            </div>
            {job.matchScore !== undefined && (
              <div
                className={`shrink-0 flex items-center justify-center rounded-full w-11 h-11 text-sm font-bold border ${scoreColorClass}`}
              >
                {score}
              </div>
            )}
          </div>

          {/* Location + Work Mode */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {job.location}
            </span>
            {job.workMode && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${workModeColor}`}>
                {job.workMode}
              </Badge>
            )}
            {job.experienceRange && (
              <span className="flex items-center gap-1">
                <Briefcase className="size-3" />
                {job.experienceRange}
              </span>
            )}
          </div>

          {/* Score bar */}
          {job.matchScore !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Match Score</span>
                <span className="font-medium">{score}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-normal"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                  +{job.skills.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Source + Date */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sourceColor}`}>
              {job.source}
            </Badge>
            {job.datePosted && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {timeAgo(job.datePosted)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0 pt-2 flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onViewDetails(job)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(job.id)}
          >
            {job.saved ? (
              <BookmarkCheck className="size-4 text-emerald-600" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
          {job.url && (
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
