'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Target,
  Send,
  Building2,
  Search,
  ListChecks,
  TrendingUp,
  Clock,
  BookmarkPlus,
  Zap,
  ArrowRight,
  Settings,
  Loader2,
  Inbox,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getScoreColor, getScoreBarColor } from '@/lib/types';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

function timeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'search':
      return <Search className="size-3.5 text-blue-500" />;
    case 'apply':
      return <Send className="size-3.5 text-emerald-500" />;
    case 'save':
      return <BookmarkPlus className="size-3.5 text-amber-500" />;
    case 'score':
      return <Target className="size-3.5 text-violet-500" />;
    case 'interview':
      return <Zap className="size-3.5 text-orange-500" />;
    default:
      return <Clock className="size-3.5 text-muted-foreground" />;
  }
}

const statCards = [
  {
    label: 'Total Jobs Discovered',
    icon: Briefcase,
    key: 'totalJobs' as const,
    iconBg: 'bg-slate-100 text-slate-600',
  },
  {
    label: 'Strong Matches',
    icon: Target,
    key: 'strongMatches' as const,
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: 'Applications Active',
    icon: Send,
    key: 'activeApplications' as const,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Companies Targeted',
    icon: Building2,
    key: 'companiesTargeted' as const,
    iconBg: 'bg-violet-100 text-violet-600',
  },
];

const pipelineColors = [
  'bg-blue-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-emerald-500',
];

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="py-5 px-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-1.5 w-full max-w-[200px]" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <div className="p-5 space-y-4">
              <Skeleton className="h-5 w-36" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Derive data from API response only
  const stats = dashboardData ? {
    totalJobs: dashboardData.totalJobs || 0,
    strongMatches: dashboardData.strongMatches || 0,
    activeApplications: dashboardData.activeApplications || 0,
    companiesTargeted: dashboardData.companiesTargeted || 0,
  } : { totalJobs: 0, strongMatches: 0, activeApplications: 0, companiesTargeted: 0 };

  const pipeline = dashboardData?.pipelineCounts
    ? Object.entries(dashboardData.pipelineCounts)
        .filter(([stage]) => stage !== 'rejected')
        .map(([stage, count]) => ({
          stage: stage.charAt(0).toUpperCase() + stage.slice(1),
          count: count as number,
        }))
    : [];

  const topJobsRaw = dashboardData?.topJobs || [];
  const topJobs = [...topJobsRaw]
    .filter((j: any) => j.match?.score !== undefined)
    .sort((a: any, b: any) => (b.match?.score ?? 0) - (a.match?.score ?? 0))
    .slice(0, 5)
    .map((j: any) => {
      let skills: string[] = [];
      try { skills = typeof j.skills === 'string' ? JSON.parse(j.skills || '[]') : (j.skills || []); } catch { skills = []; }
      return {
        id: j.id,
        title: j.title,
        companyName: j.companyName,
        location: j.location,
        matchScore: j.match?.score,
        skills,
      };
    });

  const recentActivities = (dashboardData?.recentActivity || []).map((a: any) => ({
    id: a.id,
    type: a.type,
    description: a.detail || a.action || a.description || '',
    timestamp: a.createdAt,
  }));

  const maxPipeline = Math.max(...pipeline.map((p: any) => p.count), 1);
  const hasPipelineData = pipeline.some((p: any) => p.count > 0);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Page Header */}
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your career intelligence overview at a glance
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.key} variants={fadeIn}>
              <Card className="py-5 px-5">
                <CardContent className="p-0 flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2.5 shrink-0 ${stat.iconBg}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-foreground">
                      {stats[stat.key]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Matches */}
        <motion.div className="lg:col-span-2" variants={fadeIn}>
          <Card className="py-0 overflow-hidden">
            <CardHeader className="py-4 px-6 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-600" />
                  Top Matches
                </CardTitle>
                {topJobs.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-emerald-600"
                    onClick={() => onNavigate('jobs')}
                  >
                    View All
                    <ArrowRight className="size-3" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {topJobs.length > 0 ? (
                <div className="divide-y">
                  {topJobs.map((job) => {
                    const score = job.matchScore ?? 0;
                    const scoreColor = getScoreColor(score);
                    const barColor = getScoreBarColor(score);
                    const alignment =
                      score >= 70
                        ? 'Strong Match'
                        : score >= 45
                          ? 'Good Match'
                          : score >= 20
                            ? 'Stretch'
                            : 'Ignore';

                    return (
                      <motion.div
                        key={job.id}
                        variants={fadeIn}
                        className="flex items-center gap-4 py-4 px-6 hover:bg-muted/30 transition-colors"
                      >
                        {/* Score */}
                        <div
                          className={`shrink-0 flex items-center justify-center rounded-full w-10 h-10 text-xs font-bold border ${scoreColor}`}
                        >
                          {score}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {job.title}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {job.companyName} · {job.location}
                          </p>
                          {/* Score bar */}
                          <div className="mt-2 flex items-center gap-3">
                            <div className="h-1.5 flex-1 max-w-[200px] rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            {job.skills && (
                              <div className="flex gap-1">
                                {job.skills.slice(0, 3).map((s) => (
                                  <span
                                    key={s}
                                    className="text-[10px] px-1.5 py-0 bg-secondary rounded text-muted-foreground"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Alignment Badge + View */}
                        <div className="shrink-0 flex items-center gap-2">
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
                                ? 'bg-emerald-600 text-xs'
                                : score >= 45
                                  ? 'bg-amber-500 text-white text-xs'
                                  : 'text-xs'
                            }
                          >
                            {alignment}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => onNavigate('jobs')}
                          >
                            View
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <Inbox className="size-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No jobs discovered yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Use AI Search to find matching positions.
                  </p>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="sm"
                    onClick={() => onNavigate('jobs')}
                  >
                    <Search className="size-4" />
                    Search Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div className="space-y-6" variants={stagger}>
          {/* Application Pipeline */}
          <motion.div variants={fadeIn}>
            <Card className="py-0 overflow-hidden">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListChecks className="size-4 text-emerald-600" />
                  Application Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {hasPipelineData ? (
                  <>
                    {pipeline.map((item, i) => (
                      <div key={item.stage} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">
                            {item.stage}
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            {item.count}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${pipelineColors[i]}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(item.count / maxPipeline) * 100}%`,
                            }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Funnel arrow connectors */}
                    <div className="flex items-center justify-center pt-1">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span>Interested</span>
                        <ArrowRight className="size-3" />
                        <span>Applied</span>
                        <ArrowRight className="size-3" />
                        <span>Interview</span>
                        <ArrowRight className="size-3" />
                        <span>Offer</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ListChecks className="size-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No applications yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start tracking your job applications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeIn}>
            <Card className="py-0 overflow-hidden">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="size-4 text-emerald-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-80 overflow-y-auto">
                {recentActivities.length > 0 ? (
                  <div className="divide-y">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 py-3 px-5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">
                            {activity.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {timeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center px-5">
                    <Activity className="size-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No recent activity
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start by searching for jobs!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="flex flex-wrap gap-3"
        variants={fadeIn}
      >
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => onNavigate('jobs')}
        >
          <Search className="size-4" />
          Search Jobs
        </Button>
        <Button variant="outline" onClick={() => onNavigate('settings')}>
          <Settings className="size-4" />
          Go to Settings
        </Button>
        <Button variant="outline" onClick={() => onNavigate('jobs')}>
          <ListChecks className="size-4" />
          View All Applications
        </Button>
      </motion.div>
    </motion.div>
  );
}
