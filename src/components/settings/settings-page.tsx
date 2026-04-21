'use client'

import React, { useState, useCallback } from 'react'
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
import { useToast } from '@/hooks/use-toast'
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

// ── Main Component ─────────────────────────────────────────

export default function SettingsPage() {
  const { toast } = useToast()

  // ── Profile State ──
  const [profileData, setProfileData] = useState({
    name: 'Alok Garg',
    email: 'alok.garg@email.com',
    phone: '+91 98765 43210',
    currentRole: 'Application Support Engineer',
    company: 'Capgemini',
    location: 'Noida, India',
    experience: 1.5,
    linkedinUrl: 'https://linkedin.com/in/alokgarg',
    githubUrl: 'https://github.com/alokgarg',
  })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  // ── Skills State ──
  const [primarySkills, setPrimarySkills] = useState([
    'python', 'sql', 'linux', 'azure devops', 'powershell',
    'rest apis', 'docker', 'git', 'jenkins', 'kubernetes',
    'javascript', 'bash',
  ])
  const [secondarySkills, setSecondarySkills] = useState([
    'itil', 'servicenow', 'jira', 'confluence', 'oracle db',
    'mongodb', 'networking', 'ansible', 'terraform', 'grafana',
  ])
  const [excludeSignals, setExcludeSignals] = useState([
    'internship', 'fresher', 'walk-in', 'immediate joiner',
  ])
  const [targetRoles, setTargetRoles] = useState([
    'devops engineer', 'sre engineer', 'platform engineer',
    'cloud engineer', 'application support engineer',
  ])
  const [preferredLocations, setPreferredLocations] = useState([
    'noida', 'bangalore', 'hyderabad', 'pune', 'remote',
  ])

  // ── Salary State ──
  const [salaryData, setSalaryData] = useState({
    minSalary: 8,
    maxSalary: 25,
    currency: 'INR',
  })

  // ── Search Preferences State ──
  const [searchPrefs, setSearchPrefs] = useState({
    defaultLocation: 'Noida, India',
    jobType: 'full-time',
    workMode: 'hybrid',
    autoMatchThreshold: 65,
  })

  // ── Handlers ──
  const handleSaveProfile = () => {
    const values = profileForm.getValues()
    setProfileData(values as typeof profileData)
    toast({ title: 'Profile settings saved!' })
  }

  const handleSaveSkills = () => {
    toast({ title: 'Skills configuration saved!' })
  }

  const handleSaveSalary = () => {
    toast({ title: 'Salary preferences saved!' })
  }

  const handleSaveSearch = () => {
    toast({ title: 'Search preferences saved!' })
  }

  const handleExportJSON = () => {
    toast({ title: 'Data exported as JSON!' })
  }

  const handleExportCSV = () => {
    toast({ title: 'Data exported as CSV!' })
  }

  const handleImport = () => {
    toast({ title: 'Data imported successfully!' })
  }

  const handleClearJobs = () => {
    toast({ title: 'All jobs cleared.', description: 'This action cannot be undone.', variant: 'destructive' })
  }

  const handleClearApplications = () => {
    toast({ title: 'All applications cleared.', description: 'This action cannot be undone.', variant: 'destructive' })
  }

  return (
    <div className="space-y-6">
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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1.5">
                    <Building className="size-3.5" /> Company
                  </Label>
                  <Input
                    id="company"
                    {...profileForm.register('company')}
                    placeholder="Current company"
                  />
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

              <Button onClick={handleSaveProfile} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="size-4 mr-2" /> Save Profile
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

              <Button onClick={handleSaveSkills} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="size-4 mr-2" /> Save Skills
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
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range Visual */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Salary Range</span>
                  <span className="text-sm text-emerald-600 font-semibold">
                    {salaryData.currency === 'INR' ? '₹' : salaryData.currency === 'USD' ? '$' : '€'}
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

              <Button onClick={handleSaveSalary} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="size-4 mr-2" /> Save Salary Preferences
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

              <Button onClick={handleSaveSearch} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="size-4 mr-2" /> Save Search Preferences
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
                  <p className="text-xs text-muted-foreground">411 jobs, 156 applications, 12.4 MB total</p>
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
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="size-4 mr-2" /> Clear All Jobs
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Jobs?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all {411} saved jobs from your database.
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
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="size-4 mr-2" /> Clear All Applications
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Applications?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all {156} application records from your database.
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

// Needed for the icon import
function Target({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function Building({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}
