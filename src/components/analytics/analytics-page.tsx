'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Calendar,
  Inbox,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────

interface AnalyticsData {
  jobsBySource: Array<{ source: string; count: number; fill: string }>
  matchDistribution: Array<{ range: string; jobs: number }>
  applicationPipeline: Array<{ stage: string; count: number; color: string }>
  skillsGap: Array<{ skill: string; yourLevel: number; requiredLevel: number }>
  topCompanies: Array<{ company: string; applications: number }>
  applicationTimeline: Array<{ date: string; apps: number }>
  salaryData: Array<{ x: number; y: number; z: number; name: string }>
  stats: {
    totalJobs: number
    avgMatch: number
    successRate: number
    activeApps: number
    interviewing: number
  }
}

// ── Custom Tooltip ─────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-xs">
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────

function EmptyState({ message, icon: Icon }: { message: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <Icon className="size-10 mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  delay,
  loading,
}: {
  title: string
  value: string
  subtitle: string
  trend?: 'up' | 'down'
  icon: React.ElementType
  delay: number
  loading?: boolean
}) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-7 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <div className="flex items-center gap-1 mt-1">
                {trend === 'up' && <TrendingUp className="size-3.5 text-emerald-600" />}
                {trend === 'down' && <TrendingDown className="size-3.5 text-red-500" />}
                <span className={cn('text-xs', trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground')}>
                  {subtitle}
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Icon className="size-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Chart Skeleton ────────────────────────────────────

function ChartSkeleton({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Chart Wrapper ──────────────────────────────────────

function ChartCard({
  title,
  description,
  children,
  delay,
  loading,
}: {
  title: string
  description?: string
  children: React.ReactNode
  delay: number
  loading?: boolean
}) {
  if (loading) {
    return <ChartSkeleton delay={delay} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (range: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/analytics?range=${range}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError('Failed to load analytics. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics(dateRange)
  }, [dateRange, fetchAnalytics])

  // Check if all data sections are empty
  const hasAnyData = data && (
    data.stats.totalJobs > 0 ||
    data.stats.activeApps > 0 ||
    data.jobsBySource.length > 0 ||
    data.applicationPipeline.some(p => p.count > 0)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Track your job search performance and discover trends</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="size-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-destructive/50">
            <CardContent className="p-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Inbox className="size-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Could not load analytics</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => fetchAnalytics(dateRange)}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Global Empty State */}
      {!loading && !error && !hasAnyData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No data yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start adding jobs and tracking applications to see your analytics dashboard come to life.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs Found"
          value={data ? data.stats.totalJobs.toLocaleString() : '—'}
          subtitle={data ? `${data.jobsBySource.reduce((s, j) => s + j.count, 0)} from ${data.jobsBySource.length} sources` : ''}
          icon={Briefcase}
          delay={0.1}
          loading={loading}
        />
        <StatCard
          title="Avg Match Score"
          value={data ? `${data.stats.avgMatch}%` : '—'}
          subtitle={data ? `Based on job match analysis` : ''}
          icon={Target}
          delay={0.15}
          loading={loading}
        />
        <StatCard
          title="Application Success Rate"
          value={data ? `${data.stats.successRate}%` : '—'}
          subtitle={data ? `${data.stats.activeApps} active applications` : ''}
          trend={data && data.stats.successRate > 10 ? 'up' : data && data.stats.successRate > 0 ? undefined : 'down'}
          icon={BarChart3}
          delay={0.2}
          loading={loading}
        />
        <StatCard
          title="Active Applications"
          value={data ? data.stats.activeApps.toString() : '—'}
          subtitle={data ? `${data.stats.interviewing} in interview stage` : ''}
          icon={Activity}
          delay={0.25}
          loading={loading}
        />
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Jobs by Source */}
        <ChartCard title="Jobs by Source" description="Distribution of job listings by platform" delay={0.2} loading={loading}>
          {data && data.jobsBySource.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobsBySource} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="source"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jobs" radius={[6, 6, 0, 0]}>
                    {data.jobsBySource.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No jobs found yet" icon={Briefcase} />
          )}
        </ChartCard>

        {/* Chart 2: Match Score Distribution */}
        <ChartCard title="Match Score Distribution" description="How many jobs fall in each match score range" delay={0.25} loading={loading}>
          {data && data.matchDistribution.some(d => d.jobs > 0) ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.matchDistribution}>
                  <defs>
                    <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="jobs"
                    name="Jobs"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#matchGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No match scores available" icon={Target} />
          )}
        </ChartCard>

        {/* Chart 3: Application Pipeline */}
        <ChartCard title="Application Pipeline" description="Current status of all applications" delay={0.3} loading={loading}>
          {data && data.applicationPipeline.some(p => p.count > 0) ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.applicationPipeline} layout="vertical" barCategoryGap="12%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Applications" radius={[0, 6, 6, 0]}>
                    {data.applicationPipeline.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No applications tracked yet" icon={Activity} />
          )}
        </ChartCard>

        {/* Chart 4: Skills Gap Analysis */}
        <ChartCard title="Skills Gap Analysis" description="Your skills vs required skills for target roles" delay={0.35} loading={loading}>
          {data && data.skillsGap.length > 0 ? (
            <>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.skillsGap} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="Your Skills"
                      dataKey="yourLevel"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="requiredLevel"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Your Skills</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500 opacity-60" />
                  <span className="text-muted-foreground">Required Level</span>
                </div>
              </div>
            </>
          ) : (
            <EmptyState message="No skills data from job matches" icon={Target} />
          )}
        </ChartCard>
      </div>

      {/* Bottom Section Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <ChartCard title="Top Companies by Applications" description="Where you have applied the most" delay={0.4} loading={loading}>
          {data && data.topCompanies.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCompanies} layout="vertical" barCategoryGap="6%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis
                    type="category"
                    dataKey="company"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    width={85}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="applications" name="Applications" fill="#059669" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No company application data" icon={Briefcase} />
          )}
        </ChartCard>

        {/* Application Timeline */}
        <ChartCard title="Application Timeline" description="Number of applications over time" delay={0.45} loading={loading}>
          {data && data.applicationTimeline.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.applicationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="apps"
                    name="Applications"
                    stroke="transparent"
                    fill="url(#timelineGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="apps"
                    name="Applications"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No application timeline data" icon={Calendar} />
          )}
        </ChartCard>
      </div>

      {/* Salary Distribution */}
      {loading ? (
        <ChartSkeleton delay={0.5} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="size-5 text-emerald-600" /> Salary Range Distribution
              </CardTitle>
              <CardDescription>
                Job roles plotted by experience (years) vs salary (LPA) — bubble size indicates job count
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data && data.salaryData.length > 0 ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Experience"
                        unit=" yr"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        label={{ value: 'Experience (years)', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'var(--muted-foreground)' }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Salary"
                        unit=" LPA"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        label={{ value: 'Salary (LPA)', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: 'var(--muted-foreground)' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[40, 400]} name="Count" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const d = payload[0].payload
                          return (
                            <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                              <p className="font-medium">{d.name}</p>
                              <p className="text-xs text-muted-foreground">Experience: {d.x} years</p>
                              <p className="text-xs text-muted-foreground">Salary: {d.y} LPA</p>
                              <p className="text-xs text-muted-foreground">Jobs available: {d.z}</p>
                            </div>
                          )
                        }}
                      />
                      <Scatter data={data.salaryData} fill="#10b981" fillOpacity={0.6} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No salary data available from job listings" icon={DollarSign} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
