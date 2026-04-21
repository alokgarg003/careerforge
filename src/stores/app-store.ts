import { create } from 'zustand'

interface AppState {
  activeSection: 'dashboard' | 'jobs' | 'applications' | 'companies' | 'resume' | 'analytics' | 'settings'
  sidebarOpen: boolean
  setActiveSection: (s: AppState['activeSection']) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'dashboard',
  sidebarOpen: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))

export const sectionLabels: Record<AppState['activeSection'], string> = {
  dashboard: 'Dashboard',
  jobs: 'Jobs',
  applications: 'Applications',
  companies: 'Companies',
  resume: 'Resume',
  analytics: 'Analytics',
  settings: 'Settings',
}

export const sectionDescriptions: Record<AppState['activeSection'], string> = {
  dashboard: 'Overview of your career activity and key metrics',
  jobs: 'Browse and manage job opportunities',
  applications: 'Track your job applications and their status',
  companies: 'Research and save companies of interest',
  resume: 'Build and manage your resume',
  analytics: 'Insights and trends from your job search',
  settings: 'Configure your preferences and account',
}
