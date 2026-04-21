'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MapPin,
  Bookmark,
  ExternalLink,
  FileText,
  Sparkles,
  UserPlus,
  Send,
  Briefcase,
  Clock,
  Globe,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Job,
  getScoreColor,
  getScoreBarColor,
  getWorkModeBadgeColor,
} from '@/lib/types';

interface JobDetailDrawerProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailDrawer({ job, open, onClose }: JobDetailDrawerProps) {
  if (!job) return null;

  const score = job.matchScore ?? 0;
  const scoreColorClass = getScoreColor(score);
  const barColor = getScoreBarColor(score);
  const workModeColor = getWorkModeBadgeColor(job.workMode ?? '');

  const matchingSkills = job.skills?.slice(0, 5) ?? [];
  const missingSkills = job.skills?.slice(5) ?? [];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-lg w-full p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 space-y-3">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg leading-tight">
                {job.title}
              </SheetTitle>
              <SheetDescription className="text-sm mt-1">
                {job.companyName}
              </SheetDescription>
            </div>
            {job.matchScore !== undefined && (
              <div
                className={`shrink-0 flex items-center justify-center rounded-full w-14 h-14 text-lg font-bold border ${scoreColorClass}`}
              >
                {score}
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {job.location}
            </span>
            {job.workMode && (
              <Badge variant="outline" className={workModeColor}>
                {job.workMode}
              </Badge>
            )}
            {job.experienceRange && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                {job.experienceRange}
              </span>
            )}
            {job.datePosted && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {new Date(job.datePosted).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Score bar */}
          {job.matchScore !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Match Score</span>
                <span className="font-semibold">{score}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 h-[calc(100vh-320px)]">
          <div className="p-6 space-y-6">
            {/* Match Analysis */}
            {job.matchScore !== undefined && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-600" />
                  Match Analysis
                </h3>

                {/* Alignment */}
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Alignment:
                    </span>
                    <Badge
                      variant={
                        score >= 70
                          ? 'default'
                          : score >= 45
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        score >= 70
                          ? 'bg-emerald-600'
                          : score >= 45
                            ? 'bg-amber-500'
                            : 'bg-orange-500 text-white'
                      }
                    >
                      {score >= 70
                        ? 'Strong Match'
                        : score >= 45
                          ? 'Good Match'
                          : score >= 20
                            ? 'Stretch'
                            : 'Ignore'}
                    </Badge>
                  </div>
                </div>

                {/* Matching Skills */}
                {matchingSkills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      Matching Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing / Needed Skills */}
                {missingSkills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <XCircle className="size-3.5 text-red-500" />
                      Skills to Develop
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-red-50 text-red-600 border-red-200 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why this fits */}
                <div className="rounded-lg border bg-emerald-50/50 p-3 space-y-1.5">
                  <p className="text-xs font-medium text-emerald-800">
                    Why this fits
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {score >= 70
                      ? 'This role strongly aligns with your skills and experience. Your background in application support, Linux administration, and automation makes you an excellent candidate for this position.'
                      : score >= 45
                        ? 'This role is a good match for your existing skill set. You may need to develop a few additional skills, but your core experience provides a solid foundation.'
                        : score >= 20
                          ? 'This role represents a stretch opportunity. While some skills overlap, significant preparation may be needed in key areas to be a competitive candidate.'
                          : 'This role may not be the best fit for your current profile. Consider focusing on roles that better match your existing expertise.'}
                  </p>
                </div>
              </section>
            )}

            <Separator />

            {/* Job Description */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Job Description
              </h3>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-3 [&_h3]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:text-sm [&_strong]:text-foreground [&_p]:mb-2">
                <div
                  dangerouslySetInnerHTML={{
                    __html: job.description
                      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/^- (.+)$/gm, '<li>$1</li>')
                      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
                      .replace(/\n\n/g, '<p></p>'),
                  }}
                />
              </div>
            </section>

            {/* All Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Globe className="size-4 text-muted-foreground" />
                  All Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="border-t p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
              <UserPlus className="size-4" />
              Add to Applications
            </Button>
            <Button variant="outline" className="text-sm">
              <FileText className="size-4" />
              Tailor Resume
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-sm">
              <Sparkles className="size-4" />
              Generate Cover Letter
            </Button>
            <Button variant="outline" className="text-sm">
              <Bookmark className="size-4" />
              Save Match
            </Button>
          </div>
          {job.url && (
            <Button
              variant="ghost"
              className="w-full text-sm text-emerald-600 hover:text-emerald-700"
              asChild
            >
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                View Original Posting
              </a>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
