'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Target,
  BarChart3,
  Activity,
  Building2,
  DollarSign,
  Calendar,
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
} from 'recharts'
import { cn } from '@/lib/utils'

// ── Mock Data ──────────────────────────────────────────────

const JOBS_BY_SOURCE = [
  { source: 'Web Search', count: 156, fill: '#059669' },
  { source: 'LinkedIn', count: 89, fill: '#10b981' },
  { source: 'Naukri', count: 124, fill: '#34d399' },
  { source: 'Manual', count: 42, fill: '#6ee7b7' },
]

const MATCH_SCORE_DISTRIBUTION = [
  { range: '0-20', jobs: 45 },
  { range: '20-45', jobs: 98 },
  { range: '45-70', jobs: 134 },
  { range: '70-100', jobs: 67 },
]

const APPLICATION_PIPELINE = [
  { stage: 'Interested', count: 234, color: '#10b981' },
  { stage: 'Applied', count: 156, color: '#34d399' },
  { stage: 'Interviewing', count: 42, color: '#f59e0b' },
  { stage: 'Offered', count: 12, color: '#059669' },
  { stage: 'Rejected', count: 67, color: '#ef4444' },
]

const SKILLS_GAP_DATA = [
  { skill: 'Python', yourLevel: 85, requiredLevel: 90 },
  { skill: 'Kubernetes', yourLevel: 60, requiredLevel: 85 },
  { skill: 'Terraform', yourLevel: 30, requiredLevel: 75 },
  { skill: 'CI/CD', yourLevel: 80, requiredLevel: 90 },
  { skill: 'Docker', yourLevel: 75, requiredLevel: 80 },
  { skill: 'Cloud (Azure)', yourLevel: 70, requiredLevel: 85 },
  { skill: 'SQL', yourLevel: 85, requiredLevel: 70 },
  { skill: 'Linux', yourLevel: 80, requiredLevel: 75 },
  { skill: 'Monitoring', yourLevel: 45, requiredLevel: 80 },
  { skill: 'Security', yourLevel: 40, requiredLevel: 70 },
]

const TOP_COMPANIES = [
  { company: 'Microsoft', applications: 18 },
  { company: 'Amazon', applications: 15 },
  { company: 'Google', applications: 12 },
  { company: 'Infosys', applications: 10 },
  { company: 'TCS', applications: 9 },
  { company: 'Wipro', applications: 8 },
  { company: 'Capgemini', applications: 7 },
  { company: 'Accenture', applications: 6 },
  { company: 'Deloitte', applications: 5 },
  { company: 'IBM', applications: 4 },
]

const APPLICATION_TIMELINE = [
  { date: 'Jan W1', apps: 3 },
  { date: 'Jan W3', apps: 5 },
  { date: 'Feb W1', apps: 8 },
  { date: 'Feb W3', apps: 6 },
  { date: 'Mar W1', apps: 12 },
  { date: 'Mar W3', apps: 9 },
  { date: 'Apr W1', apps: 15 },
  { date: 'Apr W3', apps: 11 },
  { date: 'May W1', apps: 18 },
  { date: 'May W3', apps: 14 },
  { date: 'Jun W1', apps: 20 },
  { date: 'Jun W3', apps: 16 },
]

const SALARY_DATA = [
  { x: 6, y: 18, z: 12, name: 'Support Eng' },
  { x: 10, y: 22, z: 8, name: 'DevOps Eng' },
  { x: 15, y: 28, z: 15, name: 'Sr. DevOps' },
  { x: 8, y: 20, z: 10, name: 'SRE' },
  { x: 12, y: 25, z: 7, name: 'Platform Eng' },
  { x: 20, y: 35, z: 5, name: 'Staff Eng' },
  { x: 7, y: 19, z: 11, name: 'Cloud Eng' },
  { x: 18, y: 30, z: 6, name: 'Tech Lead' },
  { x: 25, y: 42, z: 4, name: 'Principal' },
  { x: 14, y: 26, z: 9, name: 'Infra Eng' },
  { x: 9, y: 21, z: 13, name: 'Sys Admin' },
  { x: 16, y: 27, z: 8, name: 'Release Eng' },
  { x: 11, y: 24, z: 7, name: 'Automation Eng' },
  { x: 22, y: 38, z: 3, name: 'Architect' },
  { x: 5, y: 15, z: 14, name: 'Jr. DevOps' },
]

const STATS = {
  '7d': { totalJobs: 34, avgMatch: 72.4, successRate: 18.2, activeApps: 14 },
  '30d': { totalJobs: 156, avgMatch: 68.7, successRate: 15.6, activeApps: 42 },
  '90d': { totalJobs: 411, avgMatch: 71.2, successRate: 14.8, activeApps: 67 },
  all: { totalJobs: 411, avgMatch: 71.2, successRate: 14.8, activeApps: 67 },
}

// ── Custom Tooltip ─────────────────────────────────────────

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

// ── Stat Card ──────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  delay,
}: {
  title: string
  value: string
  subtitle: string
  trend?: 'up' | 'down'
  icon: React.ElementType
  delay: number
}) {
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

// ── Chart Wrapper ──────────────────────────────────────────

function ChartCard({
  title,
  description,
  children,
  delay,
}: {
  title: string
  description?: string
  children: React.ReactNode
  delay: number
}) {
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

// ── Main Component ─────────────────────────────────────────

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const stats = STATS[dateRange as keyof typeof STATS]

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

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs Found"
          value={stats.totalJobs.toLocaleString()}
          subtitle="+23 from last period"
          trend="up"
          icon={Briefcase}
          delay={0.1}
        />
        <StatCard
          title="Avg Match Score"
          value={`${stats.avgMatch}%`}
          subtitle="+2.3% from last period"
          trend="up"
          icon={Target}
          delay={0.15}
        />
        <StatCard
          title="Application Success Rate"
          value={`${stats.successRate}%`}
          subtitle="-1.1% from last period"
          trend="down"
          icon={BarChart3}
          delay={0.2}
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApps.toString()}
          subtitle="12 in interview stage"
          icon={Activity}
          delay={0.25}
        />
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Jobs by Source */}
        <ChartCard title="Jobs by Source" description="Distribution of job listings by platform" delay={0.2}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={JOBS_BY_SOURCE} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="source"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Jobs" radius={[6, 6, 0, 0]}>
                  {JOBS_BY_SOURCE.map((entry, index) => (
                    <React.Fragment key={index}>
                      {/* @ts-expect-error recharts cell type */}
                      <Bar dataKey="count" fill={entry.fill} name="Jobs" radius={[6, 6, 0, 0]} />
                    </React.Fragment>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Match Score Distribution */}
        <ChartCard title="Match Score Distribution" description="How many jobs fall in each match score range" delay={0.25}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MATCH_SCORE_DISTRIBUTION}>
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
        </ChartCard>

        {/* Chart 3: Application Pipeline */}
        <ChartCard title="Application Pipeline" description="Current status of all applications" delay={0.3}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={APPLICATION_PIPELINE} layout="vertical" barCategoryGap="12%">
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
                  {APPLICATION_PIPELINE.map((entry, index) => (
                    <React.Fragment key={index}>
                      {/* @ts-expect-error recharts cell type */}
                      <Bar dataKey="count" fill={entry.color} name="Applications" radius={[0, 6, 6, 0]} />
                    </React.Fragment>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Skills Gap Analysis */}
        <ChartCard title="Skills Gap Analysis" description="Your skills vs required skills for target roles" delay={0.35}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SKILLS_GAP_DATA} cx="50%" cy="50%" outerRadius="70%">
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
        </ChartCard>
      </div>

      {/* Bottom Section Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <ChartCard title="Top Companies by Applications" description="Where you have applied the most" delay={0.4}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_COMPANIES} layout="vertical" barCategoryGap="6%">
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
        </ChartCard>

        {/* Application Timeline */}
        <ChartCard title="Application Timeline" description="Number of applications over time" delay={0.45}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APPLICATION_TIMELINE}>
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
        </ChartCard>
      </div>

      {/* Salary Distribution */}
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
                      const data = payload[0].payload
                      return (
                        <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-xs text-muted-foreground">Experience: {data.x} years</p>
                          <p className="text-xs text-muted-foreground">Salary: {data.y} LPA</p>
                          <p className="text-xs text-muted-foreground">Jobs available: {data.z}</p>
                        </div>
                      )
                    }}
                  />
                  <Scatter data={SALARY_DATA} fill="#10b981" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
