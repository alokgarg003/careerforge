'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore, sectionLabels, type AppState } from '@/stores/app-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

const navItems: { id: AppState['activeSection']; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: sectionLabels.dashboard },
  { id: 'jobs', icon: Briefcase, label: sectionLabels.jobs },
  { id: 'applications', icon: ClipboardList, label: sectionLabels.applications },
  { id: 'companies', icon: Building2, label: sectionLabels.companies },
  { id: 'resume', icon: FileText, label: sectionLabels.resume },
  { id: 'analytics', icon: BarChart3, label: sectionLabels.analytics },
  { id: 'settings', icon: Settings, label: sectionLabels.settings },
]

function SidebarNav() {
  const { activeSection, setActiveSection, setSidebarOpen } = useAppStore()

  const handleNavClick = (section: AppState['activeSection']) => {
    setActiveSection(section)
    setSidebarOpen(false)
  }

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = activeSection === item.id
        const Icon = item.icon

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              'group relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
            )}
          >
            {/* Active left border indicator */}
            {isActive && (
              <motion.div
                layoutId="activeSection"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-500"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            <Icon
              className={cn(
                'size-[18px] shrink-0 transition-colors duration-200',
                isActive
                  ? 'text-emerald-400'
                  : 'text-zinc-500 group-hover:text-zinc-300'
              )}
            />

            <span className="truncate">{item.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeDot"
                className="ml-auto size-1.5 rounded-full bg-emerald-400"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="px-3 py-4">
      <Separator className="bg-zinc-700/50 mb-4" />
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar className="size-9 ring-2 ring-zinc-700/50">
          <AvatarFallback className="bg-emerald-600/20 text-emerald-400 text-xs font-semibold">
            AG
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">Alok Garg</p>
          <p className="text-xs text-zinc-500 truncate">Software Engineer</p>
        </div>
      </div>
    </div>
  )
}

function LogoSection() {
  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 shadow-lg shadow-emerald-600/20">
        <Sparkles className="size-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-zinc-100">
          CareerForge
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Intelligence Hub
        </span>
      </div>
    </div>
  )
}

/* Desktop sidebar — always visible on md+ */
function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-zinc-900 border-r border-zinc-800/80 z-30">
      <LogoSection />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  )
}

/* Mobile sidebar — Sheet overlay */
function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="w-72 p-0 bg-zinc-900 border-zinc-800/80 sm:max-w-none"
      >
        {/* Accessible title (visually hidden) */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* Remove default close button by positioning ours */}
        <LogoSection />
        <SidebarNav />
        <SidebarFooter />
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}
