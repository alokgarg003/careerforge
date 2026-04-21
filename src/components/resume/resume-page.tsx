'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileUp,
  User,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  Upload,
  FileText,
  Award,
  GraduationCap,
  Target,
  ChevronRight,
  Brain,
  MessageSquare,
  X,
  Star,
  AlertCircle,
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
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────

interface ProfileData {
  id: string
  name: string
  email: string
  currentRole: string
  currentCompany: string
  location: string
  experienceYears: number
  phone?: string
  linkedinUrl?: string
  githubUrl?: string
  resumeText: string
  resumeFile?: string
  summary: string
  primarySkills: string
  secondarySkills: string
  excludeSignals: string
  targetRoles: string
  preferredLocations: string
  education: string
  certifications: string
  achievements: string
  createdAt: string
  updatedAt: string
}

interface JobData {
  id: string
  externalId: string
  source: string
  title: string
  companyName: string
  location: string
  url: string
  description: string
  jobType: string
  experienceRange: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  isRemote: boolean
  workMode: string
  skills: string
  companyIndustry: string
  datePosted: string
  dateScraped: string
  status: string
  notes: string
  companyId: string | null
  match: {
    id: string
    score: number
    alignment: string
    matchingSkills: string
    missingSkills: string
  } | null
}

interface ParsedResumeData {
  skills: string[]
  experienceLevel: string
  roles: string[]
  education: { degree: string; institution: string; year: string }[]
  certifications: string[]
  achievements: string[]
}

interface HighlightedChange {
  type: string
  text: string
}

interface InterviewQuestion {
  id: string
  question: string
  answer: string
  difficulty: string
}

// ── Download Helper ────────────────────────────────────────

const handleDownloadText = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Job Select Empty State ─────────────────────────────────

function JobSelectEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <AlertCircle className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No jobs found.</p>
      <p className="text-xs text-muted-foreground">Use AI Search to discover jobs first.</p>
    </div>
  )
}

// ── Sub-Components ─────────────────────────────────────────

function ProfileCard({ profile, isLoading }: { profile: ProfileData | null; isLoading: boolean }) {
  const initials = profile
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const skills = profile
    ? profile.primarySkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const role = profile
    ? `${profile.currentRole}${profile.currentCompany ? ` @ ${profile.currentCompany}` : ''}`
    : ''

  const experience = profile ? `${profile.experienceYears} years` : ''

  const handleEditProfile = () => {
    toast.info('Navigate to Settings to edit your profile')
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-emerald-200 dark:border-emerald-900/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-emerald-200 dark:border-emerald-900/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-16 w-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold">{profile?.name || 'No name set'}</h2>
              {role && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Briefcase className="size-3.5" /> {role}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {profile.location}
                  </span>
                )}
                {experience && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {experience}
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={handleEditProfile}>
              <User className="size-3.5 mr-1.5" /> Edit Profile
            </Button>
          </div>
          <Separator className="my-4" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Primary Skills</p>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{skills.length - 8} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet. Edit your profile to add skills.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ResumeUploadSection() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileObjectRef = useRef<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file.name)
      fileObjectRef.current = file
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      fileObjectRef.current = file
    }
  }, [])

  const handleParse = useCallback(async () => {
    if (!uploadedFile || !fileObjectRef.current) return
    setIsParsing(true)
    try {
      const file = fileObjectRef.current
      const fileName = file.name.toLowerCase()
      let extractedText = ''

      if (fileName.endsWith('.txt')) {
        extractedText = await file.text()
      } else if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        extractedText = await file.text()
      }

      if (extractedText.trim().length < 50) {
        if (!fileName.endsWith('.txt')) {
          toast.error('Could not extract text from this file. Please upload a plain text (.txt) resume for best results.')
        } else {
          toast.error('Resume text is too short. Please upload a resume with more content.')
        }
        setIsParsing(false)
        return
      }

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, fileName: uploadedFile }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to parse resume')
        setIsParsing(false)
        return
      }

      const allSkills = [
        ...(data.technicalSkills?.primary || []),
        ...(data.technicalSkills?.secondary || []),
        ...(data.technicalSkills?.tools || []),
      ]

      setParsedData({
        skills: allSkills,
        experienceLevel: data.totalExperience || 'Not detected',
        roles: data.currentRole ? [data.currentRole] : [],
        education: (data.education || []).map((edu: string) => ({
          degree: edu,
          institution: data.currentCompany || '',
          year: '',
        })),
        certifications: data.certifications || [],
        achievements: data.achievements || [],
      })
      setParsed(true)
      toast.success('Resume parsed successfully!', {
        description: `AI extracted ${allSkills.length} skills and more.`,
      })
    } catch {
      toast.error('Failed to parse resume. Please try again.')
    } finally {
      setIsParsing(false)
    }
  }, [uploadedFile])

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null)
    setParsed(false)
    setParsedData(null)
    fileObjectRef.current = null
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileUp className="size-5 text-emerald-600" /> Resume Upload & Parsing
          </CardTitle>
          <CardDescription>Upload your resume for AI-powered analysis and skill extraction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
              isDragging
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              Drag & drop your resume here, or <span className="text-emerald-600">browse files</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, TXT (max 5MB)</p>
          </div>

          {/* File selected */}
          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
            >
              <FileText className="size-4 text-emerald-600" />
              <span className="text-sm flex-1 truncate">{uploadedFile}</span>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="h-7 w-7 p-0">
                <X className="size-3.5" />
              </Button>
            </motion.div>
          )}

          <Button
            onClick={handleParse}
            disabled={!uploadedFile || isParsing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isParsing ? (
              <>
                <Sparkles className="size-4 mr-2 animate-spin" /> Parsing Resume...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> Parse Resume with AI
              </>
            )}
          </Button>

          {/* Parsed results */}
          <AnimatePresence>
            {parsed && parsedData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Separator />

                {/* Extracted Skills */}
                {parsedData.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Target className="size-4 text-emerald-600" /> Extracted Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.skills.map((skill) => (
                        <Badge key={skill} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Level */}
                {parsedData.experienceLevel && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                      <Briefcase className="size-4 text-emerald-600" /> Detected Experience Level
                    </h4>
                    <Badge variant="outline" className="text-sm">
                      {parsedData.experienceLevel}
                    </Badge>
                  </div>
                )}

                {/* Detected Roles */}
                {parsedData.roles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <User className="size-4 text-emerald-600" /> Detected Roles
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {parsedData.education.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <GraduationCap className="size-4 text-emerald-600" /> Education
                    </h4>
                    {parsedData.education.map((edu, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">{edu.degree}</p>
                        {edu.institution && <p className="text-xs text-muted-foreground">{edu.institution}</p>}
                        {edu.year && <p className="text-xs text-muted-foreground">{edu.year}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {parsedData.certifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Award className="size-4 text-emerald-600" /> Certifications
                    </h4>
                    <ul className="space-y-1">
                      {parsedData.certifications.map((cert, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <ChevronRight className="size-3 text-emerald-600" /> {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {parsedData.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Star className="size-4 text-emerald-600" /> Achievements
                    </h4>
                    <ul className="space-y-1">
                      {parsedData.achievements.map((ach, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <ChevronRight className="size-3 text-emerald-600 mt-1 shrink-0" /> {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ResumeTailoringSection({ jobs, isLoadingJobs }: { jobs: JobData[]; isLoadingJobs: boolean }) {
  const [selectedJob, setSelectedJob] = useState('')
  const [jdText, setJdText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [changes, setChanges] = useState<HighlightedChange[] | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState('')

  const atsScore = 87

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId)
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      setSelectedJobTitle(`${job.title} — ${job.companyName}`)
      setJdText(job.description || '')
    } else {
      setSelectedJobTitle('')
      setJdText('')
    }
  }

  const handleGenerate = async () => {
    if (!selectedJob || !jdText) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJob, type: 'tailor' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate tailored resume')
        setIsGenerating(false)
        return
      }
      const tailoredResume = data.tailoredResume
      if (tailoredResume) {
        setResult(tailoredResume)
      }
      toast.success('Tailored resume generated!', {
        description: `Generated for "${data.jobTitle || selectedJobTitle}"`,
      })
    } catch {
      toast.error('Failed to generate tailored resume. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const safeTitle = selectedJobTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    handleDownloadText(result, `tailored_resume_${safeTitle}.txt`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-emerald-600" /> Resume Tailoring
          </CardTitle>
          <CardDescription>Generate a tailored resume optimized for a specific job description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Job to Tailor For</label>
            {isLoadingJobs ? (
              <Skeleton className="h-10 w-full" />
            ) : jobs.length === 0 ? (
              <JobSelectEmptyState />
            ) : (
              <Select value={selectedJob} onValueChange={handleJobSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a saved job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} — {job.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[160px] text-sm"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!jdText || isGenerating || jobs.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isGenerating ? (
              <>
                <Sparkles className="size-4 mr-2 animate-spin" /> Generating Tailored Resume...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> Generate Tailored Resume
              </>
            )}
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <Separator />

                {/* ATS Score */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      <Target className="size-4 text-emerald-600" /> ATS Compatibility Score
                    </span>
                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{atsScore}/100</span>
                  </div>
                  <Progress value={atsScore} className="h-2.5 [&>div]:bg-emerald-600" />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Excellent! Your resume is well-optimized for this job description.
                  </p>
                </div>

                {/* Highlighted Changes */}
                {changes && changes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Highlighted Changes</h4>
                    <div className="space-y-1.5">
                      {changes.map((change, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center gap-2 text-xs p-2 rounded-md',
                            change.type === 'added' && 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
                            change.type === 'enhanced' && 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
                            change.type === 'reordered' && 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
                            change.type === 'optimized' && 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                          )}
                        >
                          <ChevronRight className="size-3 shrink-0" />
                          <span className="font-medium uppercase mr-1">[{change.type}]</span> {change.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tailored Resume Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">Tailored Resume</h4>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="size-3.5 mr-1.5" /> Download
                    </Button>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-lg border text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                    {result}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CoverLetterSection({ jobs, isLoadingJobs }: { jobs: JobData[]; isLoadingJobs: boolean }) {
  const [selectedJob, setSelectedJob] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedJobTitle, setSelectedJobTitle] = useState('')

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId)
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      setSelectedJobTitle(`${job.title} — ${job.companyName}`)
    } else {
      setSelectedJobTitle('')
    }
  }

  const handleGenerate = async () => {
    if (!selectedJob) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJob, type: 'coverLetter' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate cover letter')
        setIsGenerating(false)
        return
      }
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter)
      }
      toast.success('Cover letter generated successfully!')
    } catch {
      toast.error('Failed to generate cover letter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!coverLetter) return
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!coverLetter) return
    const safeTitle = selectedJobTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    handleDownloadText(coverLetter, `cover_letter_${safeTitle}.txt`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="size-5 text-emerald-600" /> Cover Letter Generator
          </CardTitle>
          <CardDescription>Generate a personalized cover letter for your target job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Job</label>
            {isLoadingJobs ? (
              <Skeleton className="h-10 w-full" />
            ) : jobs.length === 0 ? (
              <JobSelectEmptyState />
            ) : (
              <Select value={selectedJob} onValueChange={handleJobSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a saved job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} — {job.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedJob || isGenerating || jobs.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isGenerating ? (
              <>
                <Sparkles className="size-4 mr-2 animate-spin" /> Generating Cover Letter...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> Generate Cover Letter
              </>
            )}
          </Button>

          <AnimatePresence>
            {coverLetter && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                <Separator />
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Generated Cover Letter</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="size-3.5 mr-1.5" /> : <Copy className="size-3.5 mr-1.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="size-3.5 mr-1.5" /> Download
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                  {coverLetter}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function InterviewPrepSection({ jobs, isLoadingJobs }: { jobs: JobData[]; isLoadingJobs: boolean }) {
  const [selectedJob, setSelectedJob] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null)

  const handleGenerate = async () => {
    if (!selectedJob) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJob, type: 'interview' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate interview questions')
        setIsGenerating(false)
        return
      }
      const qaList = Array.isArray(data.interviewQa) ? data.interviewQa : []
      const mapped = qaList.map((q: { question?: string; answer?: string; category?: string }, i: number) => ({
        id: String(i + 1),
        question: q.question || '',
        answer: q.answer || '',
        difficulty: q.category === 'technical' ? 'Hard' : q.category === 'behavioral' ? 'Medium' : 'Easy',
      }))
      setQuestions(mapped.length > 0 ? mapped : null)
      toast.success(`${mapped.length} interview questions generated!`)
    } catch {
      toast.error('Failed to generate interview questions. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'Easy': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      case 'Hard': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      default: return ''
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="size-5 text-emerald-600" /> Interview Preparation
          </CardTitle>
          <CardDescription>AI-generated interview questions with suggested answers based on the job description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Job</label>
            {isLoadingJobs ? (
              <Skeleton className="h-10 w-full" />
            ) : jobs.length === 0 ? (
              <JobSelectEmptyState />
            ) : (
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a saved job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} — {job.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedJob || isGenerating || jobs.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isGenerating ? (
              <>
                <Brain className="size-4 mr-2 animate-spin" /> Generating Questions...
              </>
            ) : (
              <>
                <Brain className="size-4 mr-2" /> Generate Interview Questions
              </>
            )}
          </Button>

          <AnimatePresence>
            {questions && questions.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Separator className="mb-4" />
                <Accordion type="multiple" className="w-full">
                  {questions.map((q, i) => (
                    <AccordionItem key={q.id} value={q.id}>
                      <AccordionTrigger className="text-left text-sm hover:no-underline">
                        <div className="flex items-start gap-2 pr-2">
                          <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-semibold">
                            {i + 1}
                          </span>
                          <span>{q.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-xs', difficultyColor(q.difficulty))}>
                              {q.difficulty}
                            </Badge>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-sm leading-relaxed">
                            <p className="font-medium text-xs text-muted-foreground mb-1.5">Suggested Answer:</p>
                            {q.answer}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Main Page Component ────────────────────────────────────

export default function ResumePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isJobsLoading, setIsJobsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setIsProfileLoading(false)
      }
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs')
        if (res.ok) {
          const data = await res.json()
          setJobs(data)
        }
      } catch {
        toast.error('Failed to load jobs')
      } finally {
        setIsJobsLoading(false)
      }
    }

    fetchProfile()
    fetchJobs()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Resume Intelligence</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered resume analysis, tailoring, and optimization
            </p>
          </div>
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 w-fit text-xs px-3 py-1">
            <Sparkles className="size-3 mr-1" /> AI-Powered
          </Badge>
        </div>
      </motion.div>

      {/* Profile Card */}
      <ProfileCard profile={profile} isLoading={isProfileLoading} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <ResumeUploadSection />
          <InterviewPrepSection jobs={jobs} isLoadingJobs={isJobsLoading} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ResumeTailoringSection jobs={jobs} isLoadingJobs={isJobsLoading} />
          <CoverLetterSection jobs={jobs} isLoadingJobs={isJobsLoading} />
        </div>
      </div>
    </div>
  )
}
