'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Briefcase,
  Search,
  Bell,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import ResumePage from '@/components/resume/resume-page'
import AnalyticsPage from '@/components/analytics/analytics-page'
import SettingsPage from '@/components/settings/settings-page'

// ── Page Registry ──────────────────────────────────────────

type PageId = 'resume' | 'analytics' | 'settings'

interface NavItem {
  id: PageId
  label: string
  icon: React.ElementType
  description: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'resume',
    label: 'Resume Intelligence',
    icon: FileText,
    description: 'AI-powered resume analysis & tailoring',
  },
  {
    id: 'analytics',
    label: 'Analytics & Insights',
    icon: BarChart3,
    description: 'Job search performance tracking',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Profile, skills & preferences',
  },
]

// ── Mobile Sidebar ─────────────────────────────────────────

function MobileSidebar({
  activePage,
  onNavigate,
  open,
  onClose,
}: {
  activePage: PageId
  onNavigate: (page: PageId) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-background border-r p-4 lg:hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Sparkles className="size-4 text-white" />
                </div>
                <span className="font-bold text-lg">CareerForge</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="size-4" />
              </Button>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id)
                      onClose()
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-colors text-left',
                      isActive
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <div>
                      <div>{item.label}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Desktop Sidebar ────────────────────────────────────────

function DesktopSidebar({
  activePage,
  onNavigate,
}: {
  activePage: PageId
  onNavigate: (page: PageId) => void
}) {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r bg-muted/30 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
          <Sparkles className="size-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-none">CareerForge</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">Career Intelligence Dashboard</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all text-left',
                isActive
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === 'resume' && (
                <Badge className="ml-auto bg-emerald-600 text-white text-[10px] px-1.5 h-4">AI</Badge>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AG
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">Alok Garg</p>
            <p className="text-xs text-muted-foreground truncate">Noida, India</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── Main Layout ────────────────────────────────────────────

export default function Home() {
  const [activePage, setActivePage] = useState<PageId>('resume')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'resume':
        return <ResumePage />
      case 'analytics':
        return <AnalyticsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <ResumePage />
    }
  }

  const currentPage = NAV_ITEMS.find((item) => item.id === activePage)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
            className="h-9 w-9 p-0"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">CareerForge</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
