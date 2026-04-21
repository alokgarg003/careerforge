'use client'

import React from 'react'
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Building2,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Target,
  Clock,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore, sectionLabels, sectionDescriptions } from '@/stores/app-store'

const sectionIcons: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  jobs: Briefcase,
  applications: ClipboardList,
  companies: Building2,
  resume: FileText,
  analytics: BarChart3,
  settings: Settings,
}

const sectionAccents: Record<string, string> = {
  dashboard: 'emerald',
  jobs: 'amber',
  applications: 'violet',
  companies: 'sky',
  resume: 'rose',
  analytics: 'teal',
  settings: 'zinc',
}

const accentStyles: Record<string, { bg: string; text: string; badge: string; border: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800/50',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    text: 'text-sky-600 dark:text-sky-400',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800/50',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800/50',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800/50',
  },
  zinc: {
    bg: 'bg-zinc-50 dark:bg-zinc-900/50',
    text: 'text-zinc-600 dark:text-zinc-400',
    badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    border: 'border-zinc-200 dark:border-zinc-700',
  },
}

function PlaceholderSection({ sectionId }: { sectionId: string }) {
  const Icon = sectionIcons[sectionId]
  const accent = accentStyles[sectionAccents[sectionId]]

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className={`rounded-xl border ${accent.border} ${accent.bg} p-6 md:p-8`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={`flex items-center justify-center size-12 rounded-xl ${accent.badge}`}>
            <Icon className={`size-6 ${accent.text}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {sectionLabels[sectionId as keyof typeof sectionLabels]}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              {sectionDescriptions[sectionId as keyof typeof sectionDescriptions]}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard-specific quick stats */}
      {sectionId === 'dashboard' && <DashboardQuickStats />}

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                Module {i}
              </CardDescription>
              <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This feature is currently being built. Check back soon for updates.
              </p>
              <Badge variant="secondary" className="mt-3 text-xs">
                In Development
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DashboardQuickStats() {
  const stats = [
    { label: 'Active Jobs', value: '24', icon: Briefcase, trend: '+3 this week', color: 'emerald' },
    { label: 'Applications', value: '12', icon: ClipboardList, trend: '+5 this week', color: 'amber' },
    { label: 'Interviews', value: '3', icon: Target, trend: '1 scheduled', color: 'violet' },
    { label: 'Saved Companies', value: '18', icon: Building2, trend: '+2 this week', color: 'teal' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const accent = accentStyles[stat.color]
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`size-10 rounded-lg ${accent.badge} flex items-center justify-center`}>
                  <Icon className={`size-5 ${accent.text}`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/* ============================================================
   Public section-page components — one per section
   ============================================================ */

export function DashboardPage() {
  return <PlaceholderSection sectionId="dashboard" />
}

export function JobsPage() {
  return <PlaceholderSection sectionId="jobs" />
}

export function ApplicationsPage() {
  return <PlaceholderSection sectionId="applications" />
}

export function CompaniesPage() {
  return <PlaceholderSection sectionId="companies" />
}

export function ResumePage() {
  return <PlaceholderSection sectionId="resume" />
}

export function AnalyticsPage() {
  return <PlaceholderSection sectionId="analytics" />
}

export function SettingsPage() {
  return <PlaceholderSection sectionId="settings" />
}
