'use client'

import React, { useState, useCallback, useRef } from 'react'
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
import { Input } from '@/components/ui/input'
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
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// ── Mock Data ──────────────────────────────────────────────
const PROFILE = {
  name: 'Alok Garg',
  initials: 'AG',
  role: 'Application Support Engineer @ Capgemini',
  location: 'Noida, India',
  experience: '1.5 years',
  primarySkills: [
    'Python',
    'SQL',
    'Linux',
    'Azure DevOps',
    'PowerShell',
    'REST APIs',
    'Docker',
    'Git',
    'Jenkins',
    'Kubernetes',
    'JavaScript',
    'Bash',
  ],
}

const PARSED_RESUME = {
  skills: [
    'Python',
    'SQL',
    'Linux',
    'Azure DevOps',
    'PowerShell',
    'REST APIs',
    'Docker',
    'Git',
    'Jenkins',
    'Kubernetes',
    'JavaScript',
    'Bash',
    'ITIL',
    'ServiceNow',
    'JIRA',
    'Confluence',
    'Oracle DB',
    'MongoDB',
  ],
  experienceLevel: 'Mid-Level (1-3 years)',
  roles: [
    'Application Support Engineer',
    'DevOps Engineer',
    'Systems Administrator',
    'IT Support Specialist',
  ],
  education: [
    {
      degree: 'Bachelor of Technology in Computer Science',
      institution: 'Dr. A.P.J. Abdul Kalam Technical University',
      year: '2019 - 2023',
    },
  ],
  certifications: [
    'Microsoft Certified: Azure Fundamentals (AZ-900)',
    'AWS Certified Cloud Practitioner',
    'ITIL 4 Foundation',
    'Docker Certified Associate',
  ],
  achievements: [
    'Reduced incident resolution time by 35% through automation scripts',
    'Implemented CI/CD pipeline serving 12+ microservices',
    'Mentored 3 junior team members on DevOps best practices',
    'Achieved 99.5% uptime SLA for production applications',
  ],
}

const SAVED_JOBS = [
  { id: '1', title: 'Senior DevOps Engineer', company: 'Microsoft', location: 'Noida' },
  { id: '2', title: 'Platform Engineer', company: 'Amazon', location: 'Bangalore' },
  { id: '3', title: 'SRE Engineer', company: 'Google', location: 'Hyderabad' },
  { id: '4', title: 'Cloud Infrastructure Engineer', company: 'Infosys', location: 'Pune' },
]

const TAILORED_RESUME = `## Alok Garg
**Application Support Engineer** | Noida, India | alok.garg@email.com | linkedin.com/in/alokgarg

---

### Professional Summary
Results-driven DevOps and Application Support Engineer with **1.5+ years** of experience in cloud infrastructure automation, CI/CD pipeline management, and production system reliability. Proven track record of reducing incident resolution times by 35% and maintaining 99.5% SLA uptime. Seeking to leverage expertise in Azure, Docker, Kubernetes, and Infrastructure as Code to drive operational excellence at **Microsoft**.

### Technical Skills
- **Cloud & DevOps:** Azure DevOps, Azure CLI, Kubernetes, Docker, Jenkins, CI/CD Pipelines, Terraform *(added for this role)*
- **Programming:** Python, PowerShell, Bash, JavaScript
- **Databases:** SQL, Oracle DB, MongoDB
- **Monitoring:** ServiceNow, JIRA, Grafana *(added)*, Prometheus *(added)*
- **Methodologies:** ITIL 4, Agile/Scrum, Incident Management

### Professional Experience

**Application Support Engineer — Capgemini** (Nov 2023 – Present)
- *Enhanced description:* Led production support for enterprise applications serving 500K+ users, managing incident lifecycle from detection to resolution
- Automated deployment workflows using Azure DevOps pipelines, reducing release time by **40%** *(highlighted)*
- Developed Python automation scripts for log analysis and alerting, cutting MTTR by 35%
- Configured Docker containers and Kubernetes orchestration for 12+ microservices
- Implemented infrastructure monitoring dashboards, achieving 99.5% uptime SLA

**Technical Support Intern — Wipro** (Jun 2023 – Oct 2023)
- Resolved 200+ L1/L2 support tickets with 95% first-contact resolution rate
- Managed Active Directory, Exchange Server, and VPN configurations
- Documented knowledge base articles reducing team escalations by 20%

### Education
**B.Tech Computer Science** — Dr. A.P.J. Abdul Kalam Technical University (2019-2023)
- CGPA: 8.2/10

### Certifications
- Microsoft Certified: Azure Fundamentals (AZ-900)
- AWS Certified Cloud Practitioner
- ITIL 4 Foundation
- Docker Certified Associate`

const HIGHLIGHTED_CHANGES = [
  { type: 'added', text: 'Added Terraform, Grafana, Prometheus to Technical Skills' },
  { type: 'added', text: 'Tailored Professional Summary for Microsoft Sr DevOps role' },
  { type: 'enhanced', text: 'Enhanced experience bullet points with quantified metrics' },
  { type: 'reordered', text: 'Reordered skills to match job description priority' },
  { type: 'added', text: 'Added "500K+ users" context to experience description' },
  { type: 'optimized', text: 'Optimized keywords: infrastructure, orchestration, automation' },
]

const COVER_LETTER = `Dear Hiring Manager,

I am writing to express my strong interest in the **Senior DevOps Engineer** position at **Microsoft**. With over 1.5 years of hands-on experience in application support, cloud infrastructure automation, and DevOps practices at Capgemini, I am confident in my ability to contribute meaningfully to your team.

During my tenure at Capgemini, I have led production support for enterprise applications serving over 500,000 users, consistently maintaining a 99.5% uptime SLA. I have hands-on experience with **Azure DevOps**, **Docker**, **Kubernetes**, and **CI/CD pipeline management** — all technologies that are central to this role.

Key accomplishments that align with your requirements:
- Reduced incident resolution time by 35% through Python and PowerShell automation
- Implemented CI/CD pipelines serving 12+ microservices using Azure DevOps and Jenkins
- Configured container orchestration with Kubernetes for production workloads
- Mentored team members on DevOps best practices and infrastructure as code

I hold certifications in **Azure Fundamentals (AZ-900)**, **AWS Cloud Practitioner**, **ITIL 4 Foundation**, and **Docker**, demonstrating my commitment to continuous learning and professional development.

Microsoft's mission to empower every person and organization resonates deeply with me. I am excited about the opportunity to bring my technical expertise and passion for automation to your team.

I would welcome the opportunity to discuss how my background, skills, and certifications align with your needs. Thank you for considering my application.

Warm regards,
Alok Garg
alok.garg@email.com | +91 98765 43210 | linkedin.com/in/alokgarg`

const INTERVIEW_QUESTIONS = [
  {
    id: '1',
    question: 'Can you walk us through your experience with CI/CD pipelines and how you have implemented them in production?',
    answer:
      'At Capgemini, I implemented CI/CD pipelines using Azure DevOps and Jenkins for a suite of 12+ microservices. The pipeline included automated build, unit testing, integration testing, containerization with Docker, and deployment to Kubernetes clusters. I reduced the average release cycle from 2 days to 4 hours by automating the entire workflow. I also set up automated rollback mechanisms and canary deployments to minimize production risk.',
    difficulty: 'Medium',
  },
  {
    id: '2',
    question: 'Describe a challenging production incident you managed. How did you troubleshoot and resolve it?',
    answer:
      'During a peak traffic period, one of our critical services experienced intermittent 503 errors affecting approximately 30% of requests. I followed a structured approach: first checked monitoring dashboards and identified the issue was with the Kubernetes pod health. Upon investigation, I found that a memory leak in one of the microservices was causing OOMKills. I quickly scaled the deployment, applied a hotfix, and then conducted a thorough root cause analysis. We implemented memory limits and alerting to prevent recurrence, and documented the entire incident in our post-mortem.',
    difficulty: 'Hard',
  },
  {
    id: '3',
    question: 'How do you approach infrastructure as code? What tools have you used?',
    answer:
      'I believe in the principle that everything should be codified and version-controlled. At Capgemini, I used Azure DevOps YAML pipelines extensively for pipeline-as-code. I have experience with Docker for container configuration and Kubernetes manifests for orchestration. While I have working knowledge of Terraform and Ansible, I have been actively upskilling in these areas, particularly Terraform for multi-cloud infrastructure provisioning. I follow the practice of storing all infrastructure definitions in Git repositories with proper code reviews.',
    difficulty: 'Medium',
  },
  {
    id: '4',
    question: 'Explain your experience with containerization and orchestration.',
    answer:
      'I have extensive hands-on experience with Docker and Kubernetes. At Capgemini, I containerized legacy applications and new microservices using Docker, writing optimized multi-stage Dockerfiles. For orchestration, I manage Kubernetes clusters including deployments, services, configmaps, secrets, and horizontal pod autoscalers. I have handled rolling updates, blue-green deployments, and canary releases. I also implemented resource quotas and limit ranges to ensure fair resource allocation across teams.',
    difficulty: 'Medium',
  },
  {
    id: '5',
    question: 'What monitoring and alerting strategies have you implemented?',
    answer:
      'I have implemented a comprehensive monitoring stack including Application Insights for APM, custom dashboards in Grafana for infrastructure metrics, and ServiceNow for ITSM integration. I set up alerting rules based on SLA thresholds, with different severity levels triggering different response workflows. I also created synthetic monitoring scripts using Python to proactively detect issues before users report them. My approach is to monitor the four golden signals: latency, traffic, errors, and saturation.',
    difficulty: 'Easy',
  },
  {
    id: '6',
    question: 'How do you handle security in a DevOps environment?',
    answer:
      'Security is integral to the DevOps pipeline, not an afterthought. I implement security at multiple layers: image scanning in the CI/CD pipeline using tools like Trivy, secret management using Azure Key Vault, network policies in Kubernetes, and RBAC for access control. I follow the principle of least privilege and regularly audit access permissions. I also ensure all secrets are rotated regularly and that security patches are applied promptly through automated workflows.',
    difficulty: 'Medium',
  },
  {
    id: '7',
    question: 'Describe your experience with cloud services, particularly Azure.',
    answer:
      'I work extensively with Azure services including Azure DevOps for CI/CD, Azure App Services, Azure Container Instances, Azure Kubernetes Service (AKS), and Azure Monitor. I manage resource groups, virtual networks, and storage accounts using Azure CLI and ARM templates. I have set up Azure Active Directory for authentication and authorization. For the AZ-900 certification, I gained comprehensive knowledge of Azure governance, compliance, and cost management features.',
    difficulty: 'Easy',
  },
  {
    id: '8',
    question: 'How do you balance between stability and innovation in a production environment?',
    answer:
      'I believe in the principle of "move fast, but don\'t break things." I implement this through feature flags for gradual rollouts, automated testing gates in the CI/CD pipeline, and clear rollback procedures. I allocate specific windows for disruptive changes and maintain a comprehensive runbook for all production procedures. Innovation is important, but it must be balanced with reliability — I always ensure there\'s a fallback plan before deploying any significant change to production.',
    difficulty: 'Hard',
  },
  {
    id: '9',
    question: 'What scripting and automation tasks have you performed?',
    answer:
      'I have written extensive Python and PowerShell scripts for various automation tasks. These include automated log analysis and correlation scripts that reduced investigation time by 60%, deployment automation scripts that handle database migrations and service restarts, health check scripts running every 5 minutes that proactively alert on anomalies, and bulk configuration management scripts for environment provisioning. I also created Slack/Teams webhook integrations for real-time incident notifications.',
    difficulty: 'Easy',
  },
  {
    id: '10',
    question: 'Where do you see yourself in 3-5 years, and how does this role fit into your career goals?',
    answer:
      'In 3-5 years, I aspire to become a Staff-level DevOps/SRE engineer leading platform engineering initiatives. I want to deepen my expertise in infrastructure as code, build comprehensive internal developer platforms, and contribute to open-source projects. This role at Microsoft is a perfect fit because it offers exposure to large-scale distributed systems, cutting-edge tooling, and a culture of engineering excellence. The opportunity to work with world-class engineers and contribute to products used by millions is exactly the kind of challenge I am looking for to accelerate my growth.',
    difficulty: 'Medium',
  },
]

// ── Sub-Components ─────────────────────────────────────────

function ProfileCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-emerald-200 dark:border-emerald-900/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-16 w-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {PROFILE.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold">{PROFILE.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Briefcase className="size-3.5" /> {PROFILE.role}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {PROFILE.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {PROFILE.experience}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              <User className="size-3.5 mr-1.5" /> Edit Profile
            </Button>
          </div>
          <Separator className="my-4" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Primary Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {PROFILE.primarySkills.slice(0, 8).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {PROFILE.primarySkills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{PROFILE.primarySkills.length - 8} more
                </Badge>
              )}
            </div>
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
    if (file) setUploadedFile(file.name)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file.name)
  }, [])

  const handleParse = useCallback(() => {
    if (!uploadedFile) return
    setIsParsing(true)
    setTimeout(() => {
      setIsParsing(false)
      setParsed(true)
      toast({ title: 'Resume parsed successfully!', description: 'AI extracted 18 skills, 4 roles, and more.' })
    }, 2000)
  }, [uploadedFile, toast])

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null)
    setParsed(false)
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
            {parsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Separator />

                {/* Extracted Skills */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Target className="size-4 text-emerald-600" /> Extracted Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {PARSED_RESUME.skills.map((skill) => (
                      <Badge key={skill} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <Briefcase className="size-4 text-emerald-600" /> Detected Experience Level
                  </h4>
                  <Badge variant="outline" className="text-sm">
                    {PARSED_RESUME.experienceLevel}
                  </Badge>
                </div>

                {/* Detected Roles */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <User className="size-4 text-emerald-600" /> Detected Roles
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {PARSED_RESUME.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-emerald-600" /> Education
                  </h4>
                  {PARSED_RESUME.education.map((edu, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">{edu.degree}</p>
                      <p className="text-xs text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Award className="size-4 text-emerald-600" /> Certifications
                  </h4>
                  <ul className="space-y-1">
                    {PARSED_RESUME.certifications.map((cert, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <ChevronRight className="size-3 text-emerald-600" /> {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Star className="size-4 text-emerald-600" /> Achievements
                  </h4>
                  <ul className="space-y-1">
                    {PARSED_RESUME.achievements.map((ach, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="size-3 text-emerald-600 mt-1 shrink-0" /> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ResumeTailoringSection() {
  const [selectedJob, setSelectedJob] = useState('')
  const [jdText, setJdText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<typeof TAILORED_RESUME | null>(null)
  const [changes, setChanges] = useState<typeof HIGHLIGHTED_CHANGES | null>(null)
  const { toast } = useToast()

  const atsScore = 87

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId)
    if (jobId) {
      setJdText(
        'Senior DevOps Engineer - Microsoft\n\nRequirements:\n- 2+ years of experience in DevOps/SRE roles\n- Strong expertise in CI/CD pipelines (Azure DevOps, Jenkins)\n- Proficiency with Docker, Kubernetes, and container orchestration\n- Experience with Infrastructure as Code (Terraform, Ansible)\n- Monitoring & observability: Grafana, Prometheus, Datadog\n- Strong scripting skills: Python, Bash, PowerShell\n- Understanding of networking, security best practices\n- Experience with Azure/AWS cloud services\n- ITIL certification preferred\n- Excellent problem-solving and communication skills'
      )
    } else {
      setJdText('')
    }
  }

  const handleGenerate = () => {
    if (!jdText) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setResult(TAILORED_RESUME)
      setChanges(HIGHLIGHTED_CHANGES)
      toast({ title: 'Tailored resume generated!', description: 'ATS Score: 87/100' })
    }, 3000)
  }

  const handleDownload = () => {
    toast({ title: 'Resume downloaded', description: 'PDF generated successfully.' })
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
            <Select value={selectedJob} onValueChange={handleJobSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a saved job..." />
              </SelectTrigger>
              <SelectContent>
                {SAVED_JOBS.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={!jdText || isGenerating}
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
                {changes && (
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
                      <Download className="size-3.5 mr-1.5" /> Download PDF
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

function CoverLetterSection() {
  const [selectedJob, setSelectedJob] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!selectedJob) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCoverLetter(COVER_LETTER)
      toast({ title: 'Cover letter generated successfully!' })
    }, 2500)
  }

  const handleCopy = () => {
    if (!coverLetter) return
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    toast({ title: 'Copied to clipboard!' })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    toast({ title: 'Cover letter downloaded!' })
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
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a saved job..." />
              </SelectTrigger>
              <SelectContent>
                {SAVED_JOBS.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedJob || isGenerating}
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

function InterviewPrepSection() {
  const [selectedJob, setSelectedJob] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<typeof INTERVIEW_QUESTIONS | null>(null)
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!selectedJob) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setQuestions(INTERVIEW_QUESTIONS)
      toast({ title: '10 interview questions generated!' })
    }, 2500)
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
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a saved job..." />
              </SelectTrigger>
              <SelectContent>
                {SAVED_JOBS.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedJob || isGenerating}
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
            {questions && (
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
      <ProfileCard />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <ResumeUploadSection />
          <InterviewPrepSection />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ResumeTailoringSection />
          <CoverLetterSection />
        </div>
      </div>
    </div>
  )
}
