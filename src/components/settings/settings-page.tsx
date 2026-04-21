'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Settings,
  User,
  Briefcase,
  DollarSign,
  Search,
  Database,
  Download,
  Upload,
  Trash2,
  Shield,
  Save,
  X,
  Plus,
  MapPin,
  Linkedin,
  Github,
  Mail,
  Phone,
  GraduationCap,
  Globe,
  FileJson,
  FileSpreadsheet,
  Info,
  Target,
  Building2,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Zod Schemas ────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  currentRole: z.string().min(2, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  experience: z.number().min(0).max(50),
  linkedinUrl: z.string().url('Invalid URL').or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').or(z.literal('')),
})

const salarySchema = z.object({
  minSalary: z.number().min(0, 'Must be a positive number'),
  maxSalary: z.number().min(0, 'Must be a positive number'),
  currency: z.string(),
})

// ── Helpers ────────────────────────────────────────────────

function commaStringToArray(s: string | null | undefined): string[] {
  if (!s) return []
  return s.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
}

function arrayToCommaString(arr: string[]): string {
  return arr.join(',')
}

// ── Tag Input Component ────────────────────────────────────

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
  placeholder: string
}) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        const tag = inputValue.trim().toLowerCase()
        if (tag && !tags.includes(tag)) {
          onAdd(tag)
          setInputValue('')
        }
      }
      if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        onRemove(tags[tags.length - 1])
      }
    },
    [inputValue, tags, onAdd, onRemove]
  )

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border rounded-md bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs gap-1 pr-1 cursor-default"
        >
          {tag}
          <button
            onClick={() => onRemove(tag)}
            className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : 'Add more...'}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm border-none p-1"
      />
    </div>
  )
}

// ── Section Animation Wrapper ──────────────────────────────

function AnimatedCard({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Loading Skeleton ───────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-80 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-60 bg-muted animate-pulse rounded mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [jobsCount, setJobsCount] = useState(0)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Profile State ──
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    company: '',
    location: '',
    experience: 0,
    linkedinUrl: '',
    githubUrl: '',
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  // ── Skills State ──
  const [primarySkills, setPrimarySkills] = useState<string[]>([])
  const [secondarySkills, setSecondarySkills] = useState<string[]>([])
  const [excludeSignals, setExcludeSignals] = useState<string[]>([])
  const [targetRoles, setTargetRoles] = useState<string[]>([])
  const [preferredLocations, setPreferredLocations] = useState<string[]>([])

  // ── Salary State ──
  const [salaryData, setSalaryData] = useState({
    minSalary: 8,
    maxSalary: 25,
    currency: 'INR',
  })

  // ── Search Preferences State ──
  const [searchPrefs, setSearchPrefs] = useState({
    defaultLocation: '',
    jobType: 'full-time',
    workMode: 'hybrid',
    autoMatchThreshold: 65,
  })

  // ── Load profile and counts on mount ──
  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const profile = await res.json()

      // Populate profile form
      const formValues = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        currentRole: profile.currentRole || '',
        company: profile.currentCompany || '',
        location: profile.location || '',
        experience: profile.experienceYears ?? 0,
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
      }
      setProfileData(formValues)
      profileForm.reset(formValues)

      // Populate skills
      setPrimarySkills(commaStringToArray(profile.primarySkills))
      setSecondarySkills(commaStringToArray(profile.secondarySkills))
      setExcludeSignals(commaStringToArray(profile.excludeSignals))
      setTargetRoles(commaStringToArray(profile.targetRoles))
      setPreferredLocations(commaStringToArray(profile.preferredLocations))

      // Populate salary
      setSalaryData({
        minSalary: profile.salaryMin ?? 8,
        maxSalary: profile.salaryMax ?? 25,
        currency: profile.salaryCurrency || 'INR',
      })

      // Populate search prefs (use location as default location)
      setSearchPrefs((prev) => ({
        ...prev,
        defaultLocation: profile.location || '',
      }))
    } catch {
      toast.error('Failed to load profile data')
    }
  }, [profileForm])

  const loadCounts = useCallback(async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications'),
      ])
      if (jobsRes.ok) {
        const jobs = await jobsRes.json()
        setJobsCount(Array.isArray(jobs) ? jobs.length : 0)
      }
      if (appsRes.ok) {
        const apps = await appsRes.json()
        setApplicationsCount(Array.isArray(apps) ? apps.length : 0)
      }
    } catch {
      // Silent fail for counts
    }
  }, [])

  useEffect(() => {
    Promise.all([loadProfile(), loadCounts()]).finally(() => setLoading(false))
  }, [loadProfile, loadCounts])

  // ── Handlers ──

  const handleSaveProfile = async () => {
    const valid = await profileForm.trigger()
    if (!valid) return

    setSaving('profile')
    try {
      const values = profileForm.getValues()
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          currentRole: values.currentRole,
          currentCompany: values.company,
          location: values.location,
          experienceYears: values.experience,
          linkedinUrl: values.linkedinUrl,
          githubUrl: values.githubUrl,
        }),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      toast.success('Profile settings saved!')
    } catch {
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const handleSaveSkills = async () => {
    setSaving('skills')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primarySkills: arrayToCommaString(primarySkills),
          secondarySkills: arrayToCommaString(secondarySkills),
          excludeSignals: arrayToCommaString(excludeSignals),
          targetRoles: arrayToCommaString(targetRoles),
          preferredLocations: arrayToCommaString(preferredLocations),
        }),
      })
      if (!res.ok) throw new Error('Failed to save skills')
      toast.success('Skills configuration saved!')
    } catch {
      toast.error('Failed to save skills. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const handleSaveSalary = async () => {
    setSaving('salary')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salaryMin: salaryData.minSalary,
          salaryMax: salaryData.maxSalary,
          salaryCurrency: salaryData.currency,
        }),
      })
      if (!res.ok) throw new Error('Failed to save salary')
      toast.success('Salary preferences saved!')
    } catch {
      toast.error('Failed to save salary preferences. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const handleSaveSearch = async () => {
    setSaving('search')
    try {
      // Save preferredLocations from the default location
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredLocations: searchPrefs.defaultLocation
            ? searchPrefs.defaultLocation
            : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to save preferences')
      toast.success('Search preferences saved!')
    } catch {
      toast.error('Failed to save search preferences. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  const handleExportJSON = async () => {
    try {
      const [jobsRes, appsRes, companiesRes, profileRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications'),
        fetch('/api/companies'),
        fetch('/api/profile'),
      ])

      const jobs = jobsRes.ok ? await jobsRes.json() : []
      const applications = appsRes.ok ? await appsRes.json() : []
      const companies = companiesRes.ok ? await companiesRes.json() : []
      const profile = profileRes.ok ? await profileRes.json() : {}

      const exportData = {
        exportedAt: new Date().toISOString(),
        profile,
        jobs,
        applications,
        companies,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const date = new Date().toISOString().slice(0, 10)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `careerforge-export-${date}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data exported as JSON!')
    } catch {
      toast.error('Failed to export data. Please try again.')
    }
  }

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/jobs')
      if (!res.ok) throw new Error('Failed to fetch jobs')
      const jobs: any[] = await res.json()

      const headers = ['title', 'company', 'location', 'source', 'score', 'alignment', 'date']
      const csvRows: string[] = [headers.join(',')]

      for (const job of jobs) {
        const row = [
          `"${(job.title || '').replace(/"/g, '""')}"`,
          `"${(job.companyName || '').replace(/"/g, '""')}"`,
          `"${(job.location || '').replace(/"/g, '""')}"`,
          `"${(job.source || '').replace(/"/g, '""')}"`,
          job.match?.score ?? '',
          `"${(job.match?.alignment || '').replace(/"/g, '""')}"`,
          job.dateScraped ? new Date(job.dateScraped).toISOString().slice(0, 10) : '',
        ]
        csvRows.push(row.join(','))
      }

      const csvString = csvRows.join('\n')
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      const date = new Date().toISOString().slice(0, 10)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `careerforge-jobs-${date}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Jobs exported as CSV!')
    } catch {
      toast.error('Failed to export CSV. Please try again.')
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      let importedCount = 0

      // Import profile
      if (data.profile) {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.profile),
        })
        importedCount++
        // Refresh profile
        await loadProfile()
      }

      // Import jobs
      if (Array.isArray(data.jobs)) {
        for (const job of data.jobs) {
          await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: job.title,
              companyName: job.companyName,
              location: job.location,
              url: job.url,
              description: job.description,
              source: job.source || 'import',
              skills: typeof job.skills === 'string' ? job.skills : JSON.stringify(job.skills || []),
              workMode: job.workMode,
              jobType: job.jobType,
              experienceRange: job.experienceRange,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              isRemote: job.isRemote,
              companyIndustry: job.companyIndustry,
              status: job.status || 'new',
            }),
          })
        }
        importedCount += data.jobs.length
      }

      // Refresh counts
      await loadCounts()
      toast.success(`Data imported successfully! (${importedCount} items)`)
    } catch {
      toast.error('Failed to import data. Please ensure the file is valid JSON.')
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClearJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      if (!res.ok) throw new Error('Failed to fetch jobs')
      const jobs: any[] = await res.json()

      let deletedCount = 0
      for (const job of jobs) {
        const delRes = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
        if (delRes.ok) deletedCount++
      }

      setJobsCount(0)
      toast.success(`Cleared ${deletedCount} jobs from the database.`)
    } catch {
      toast.error('Failed to clear jobs. Please try again.')
    }
  }

  const handleClearApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error('Failed to fetch applications')
      const apps: any[] = await res.json()

      let deletedCount = 0
      for (const app of apps) {
        const delRes = await fetch(`/api/applications/${app.id}`, { method: 'DELETE' })
        if (delRes.ok) deletedCount++
      }

      setApplicationsCount(0)
      toast.success(`Cleared ${deletedCount} applications from the database.`)
    } catch {
      toast.error('Failed to clear applications. Please try again.')
    }
  }

  // ── Render ──

  if (loading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, skills, preferences, and data
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Profile Settings ── */}
        <AnimatedCard delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="size-5 text-emerald-600" /> Profile Settings
              </CardTitle>
              <CardDescription>Your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <User className="size-3.5" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    {...profileForm.register('name')}
                    placeholder="Your full name"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="size-3.5" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    placeholder="email@example.com"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="size-3.5" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    {...profileForm.register('phone')}
                    placeholder="+91 98765 43210"
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentRole" className="flex items-center gap-1.5">
                    <Briefcase className="size-3.5" /> Current Role
                  </Label>
                  <Input
                    id="currentRole"
                    {...profileForm.register('currentRole')}
                    placeholder="Your current role"
                  />
                  {profileForm.formState.errors.currentRole && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.currentRole.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" /> Company
                  </Label>
                  <Input
                    id="company"
                    {...profileForm.register('company')}
                    placeholder="Current company"
                  />
                  {profileForm.formState.errors.company && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.company.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Location
                  </Label>
                  <Input
                    id="location"
                    {...profileForm.register('location')}
                    placeholder="City, Country"
                  />
                  {profileForm.formState.errors.location && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" /> Experience: {profileForm.watch('experience')} years
                </Label>
                <Slider
                  value={[profileForm.watch('experience')]}
                  onValueChange={([val]) => profileForm.setValue('experience', val)}
                  max={20}
                  step={0.5}
                  min={0}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 years</span>
                  <span>20 years</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                    <Linkedin className="size-3.5" /> LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    {...profileForm.register('linkedinUrl')}
                    placeholder="https://linkedin.com/in/..."
                  />
                  {profileForm.formState.errors.linkedinUrl && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.linkedinUrl.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center gap-1.5">
                    <Github className="size-3.5" /> GitHub URL
                  </Label>
                  <Input
                    id="github"
                    {...profileForm.register('githubUrl')}
                    placeholder="https://github.com/..."
                  />
                  {profileForm.formState.errors.githubUrl && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.githubUrl.message}</p>
                  )}
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving === 'profile'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving === 'profile' ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                {saving === 'profile' ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* ── Skills Configuration ── */}
        <AnimatedCard delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="size-5 text-emerald-600" /> Skills Configuration
              </CardTitle>
              <CardDescription>Configure your skills, target roles, and search signals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Primary Skills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Skills</Label>
                <p className="text-xs text-muted-foreground">Skills you want to highlight in your resume</p>
                <TagInput
                  tags={primarySkills}
                  onAdd={(tag) => setPrimarySkills((prev) => [...prev, tag])}
                  onRemove={(tag) => setPrimarySkills((prev) => prev.filter((t) => t !== tag))}
                  placeholder="Add primary skill..."
                />
              </div>

              <Separator />

              {/* Secondary Skills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Secondary Skills</Label>
                <p className="text-xs text-muted-foreground">Additional skills and competencies</p>
                <TagInput
                  tags={secondarySkills}
                  onAdd={(tag) => setSecondarySkills((prev) => [...prev, tag])}
                  onRemove={(tag) => setSecondarySkills((prev) => prev.filter((t) => t !== tag))}
                  placeholder="Add secondary skill..."
                />
              </div>

              <Separator />

              {/* Exclude Signals */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Exclude Signals</Label>
                <p className="text-xs text-muted-foreground">Keywords to exclude from job matches</p>
                <TagInput
                  tags={excludeSignals}
                  onAdd={(tag) => setExcludeSignals((prev) => [...prev, tag])}
                  onRemove={(tag) => setExcludeSignals((prev) => prev.filter((t) => t !== tag))}
                  placeholder="Add exclusion keyword..."
                />
              </div>

              <Separator />

              {/* Target Roles */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Target Roles</Label>
                <p className="text-xs text-muted-foreground">Roles you are interested in applying to</p>
                <TagInput
                  tags={targetRoles}
                  onAdd={(tag) => setTargetRoles((prev) => [...prev, tag])}
                  onRemove={(tag) => setTargetRoles((prev) => prev.filter((t) => t !== tag))}
                  placeholder="Add target role..."
                />
              </div>

              <Separator />

              {/* Preferred Locations */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preferred Locations</Label>
                <p className="text-xs text-muted-foreground">Locations you would consider for work</p>
                <TagInput
                  tags={preferredLocations}
                  onAdd={(tag) => setPreferredLocations((prev) => [...prev, tag])}
                  onRemove={(tag) => setPreferredLocations((prev) => prev.filter((t) => t !== tag))}
                  placeholder="Add location..."
                />
              </div>

              <Button onClick={handleSaveSkills} disabled={saving === 'skills'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving === 'skills' ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                {saving === 'skills' ? 'Saving...' : 'Save Skills'}
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* ── Salary Preferences ── */}
        <AnimatedCard delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="size-5 text-emerald-600" /> Salary Preferences
              </CardTitle>
              <CardDescription>Set your salary expectations for job matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Minimum Salary (LPA)</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={salaryData.minSalary}
                    onChange={(e) => setSalaryData({ ...salaryData, minSalary: Number(e.target.value) })}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Maximum Salary (LPA)</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={salaryData.maxSalary}
                    onChange={(e) => setSalaryData({ ...salaryData, maxSalary: Number(e.target.value) })}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={salaryData.currency}
                  onValueChange={(value) => setSalaryData({ ...salaryData, currency: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                    <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                    <SelectItem value="LPA">LPA (Lakhs Per Annum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range Visual */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Salary Range</span>
                  <span className="text-sm text-emerald-600 font-semibold">
                    {salaryData.currency === 'INR' ? '₹' : salaryData.currency === 'USD' ? '$' : salaryData.currency === 'GBP' ? '£' : salaryData.currency === 'EUR' ? '€' : ''}
                    {salaryData.minSalary}L – {salaryData.maxSalary}L
                  </span>
                </div>
                <Slider
                  value={[salaryData.minSalary, salaryData.maxSalary]}
                  onValueChange={([min, max]) => setSalaryData({ ...salaryData, minSalary: min, maxSalary: max })}
                  min={0}
                  max={100}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0L</span>
                  <span>₹50L</span>
                  <span>₹100L</span>
                </div>
              </div>

              <Button onClick={handleSaveSalary} disabled={saving === 'salary'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving === 'salary' ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                {saving === 'salary' ? 'Saving...' : 'Save Salary Preferences'}
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* ── Search Preferences ── */}
        <AnimatedCard delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="size-5 text-emerald-600" /> Search Preferences
              </CardTitle>
              <CardDescription>Configure default search behavior and matching rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="defaultLocation" className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> Default Search Location
                </Label>
                <Input
                  id="defaultLocation"
                  value={searchPrefs.defaultLocation}
                  onChange={(e) => setSearchPrefs({ ...searchPrefs, defaultLocation: e.target.value })}
                  placeholder="City, State or Remote"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Briefcase className="size-3.5" /> Default Job Type
                </Label>
                <Select
                  value={searchPrefs.jobType}
                  onValueChange={(value) => setSearchPrefs({ ...searchPrefs, jobType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Globe className="size-3.5" /> Work Mode Preference
                </Label>
                <Select
                  value={searchPrefs.workMode}
                  onValueChange={(value) => setSearchPrefs({ ...searchPrefs, workMode: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-1.5">
                  <Target className="size-3.5" /> Auto-Match Threshold: {searchPrefs.autoMatchThreshold}%
                </Label>
                <p className="text-xs text-muted-foreground">
                  Minimum match score required for jobs to be auto-flagged as relevant
                </p>
                <Slider
                  value={[searchPrefs.autoMatchThreshold]}
                  onValueChange={([val]) => setSearchPrefs({ ...searchPrefs, autoMatchThreshold: val })}
                  min={0}
                  max={100}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% (Show all)</span>
                  <span>50%</span>
                  <span>100% (Perfect match only)</span>
                </div>
              </div>

              {/* Visual indicator */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    'h-3 w-3 rounded-full',
                    searchPrefs.autoMatchThreshold < 40 ? 'bg-amber-500' :
                    searchPrefs.autoMatchThreshold < 70 ? 'bg-emerald-500' : 'bg-blue-500'
                  )} />
                  <span className="text-sm font-medium">
                    {searchPrefs.autoMatchThreshold < 40
                      ? 'Relaxed matching — more jobs shown'
                      : searchPrefs.autoMatchThreshold < 70
                        ? 'Balanced matching — recommended'
                        : 'Strict matching — fewer, higher quality matches'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Jobs below {searchPrefs.autoMatchThreshold}% match score will be filtered out from auto-matches.
                </p>
              </div>

              <Button onClick={handleSaveSearch} disabled={saving === 'search'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving === 'search' ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                {saving === 'search' ? 'Saving...' : 'Save Search Preferences'}
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* ── Data Management ── */}
        <AnimatedCard delay={0.3}>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="size-5 text-emerald-600" /> Data Management
              </CardTitle>
              <CardDescription>Export, import, or clear your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Database Size */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Database className="size-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Database Size</p>
                  <p className="text-xs text-muted-foreground">
                    {jobsCount} job{jobsCount !== 1 ? 's' : ''}, {applicationsCount} application{applicationsCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">SQLite</Badge>
              </div>

              {/* Export / Import */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" onClick={handleExportJSON} className="w-full">
                  <FileJson className="size-4 mr-2" /> Export JSON
                </Button>
                <Button variant="outline" onClick={handleExportCSV} className="w-full">
                  <FileSpreadsheet className="size-4 mr-2" /> Export CSV
                </Button>
                <Button variant="outline" onClick={handleImport} className="w-full">
                  <Upload className="size-4 mr-2" /> Import Data
                </Button>
              </div>

              <Separator />

              {/* Destructive Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={jobsCount === 0}>
                        <Trash2 className="size-4 mr-2" /> Clear All Jobs
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Jobs?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all {jobsCount} saved job{jobsCount !== 1 ? 's' : ''} from your database.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearJobs} className="bg-destructive hover:bg-destructive/90">
                          Yes, Clear All Jobs
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={applicationsCount === 0}>
                        <Trash2 className="size-4 mr-2" /> Clear All Applications
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Applications?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all {applicationsCount} application record{applicationsCount !== 1 ? 's' : ''} from your database.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearApplications} className="bg-destructive hover:bg-destructive/90">
                          Yes, Clear All Applications
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* ── About ── */}
        <AnimatedCard delay={0.35}>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="size-5 text-emerald-600" /> About CareerForge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Version</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">v1.0.0-beta</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Built With</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">Next.js 16</Badge>
                    <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                    <Badge variant="secondary" className="text-xs">Tailwind CSS 4</Badge>
                    <Badge variant="secondary" className="text-xs">shadcn/ui</Badge>
                    <Badge variant="secondary" className="text-xs">Recharts</Badge>
                    <Badge variant="secondary" className="text-xs">Framer Motion</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">AI Powered By</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">LLM</Badge>
                    <Badge variant="secondary" className="text-xs">Web Search</Badge>
                    <Badge variant="secondary" className="text-xs">Web Reader</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Privacy</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
                    <Shield className="size-3 mr-1" /> Your data stays local
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    All data is stored locally in a SQLite database. Nothing is sent to external servers except AI processing requests.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </div>
  )
}
