'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Star,
  ExternalLink,
  Globe,
  Linkedin,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Eye,
  Briefcase,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BookmarkPlus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────
type CompanyTier = 1 | 2 | 3 | 4 | 5 | 6;
type CompanyStatus = 'Targeted' | 'Applied' | 'Interviewed' | 'Offered' | 'Passed';

interface Company {
  id: string;
  name: string;
  industry: string;
  sectors: string[];
  tier: CompanyTier;
  location: string;
  locations: string[];
  employeeCount: string;
  salaryRange: string;
  priority: number; // 1-5 stars
  status: CompanyStatus;
  careerPage: string;
  linkedinPage: string;
  notes: string;
  applicationIds: string[];
}

// ─── Constants ──────────────────────────────────────────────────
const TIER_CONFIG: Record<CompanyTier, { label: string; color: string; bgColor: string; borderColor: string; starColor: string; textColor: string }> = {
  1: { label: 'Tier 1', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/40', starColor: 'text-yellow-500', textColor: 'text-yellow-600' },
  2: { label: 'Tier 2', color: 'bg-slate-400', bgColor: 'bg-slate-400/10', borderColor: 'border-slate-400/40', starColor: 'text-slate-400', textColor: 'text-slate-500' },
  3: { label: 'Tier 3', color: 'bg-amber-700', bgColor: 'bg-amber-700/10', borderColor: 'border-amber-700/40', starColor: 'text-amber-700', textColor: 'text-amber-600' },
  4: { label: 'Tier 4', color: 'bg-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/40', starColor: 'text-blue-500', textColor: 'text-blue-600' },
  5: { label: 'Tier 5', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/40', starColor: 'text-emerald-500', textColor: 'text-emerald-600' },
  6: { label: 'Tier 6', color: 'bg-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/40', starColor: 'text-purple-500', textColor: 'text-purple-600' },
};

const STATUS_CONFIG: Record<CompanyStatus, { icon: typeof Target; color: string; bgColor: string }> = {
  Targeted: { icon: Target, color: 'text-sky-600', bgColor: 'bg-sky-500/10 border-sky-500/20' },
  Applied: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  Interviewed: { icon: Briefcase, color: 'text-amber-600', bgColor: 'bg-amber-500/10 border-amber-500/20' },
  Offered: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  Passed: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10 border-red-500/20' },
};

// ─── Mock Data ──────────────────────────────────────────────────
const initialCompanies: Company[] = [
  {
    id: 'co-001',
    name: 'Microsoft',
    industry: 'Technology',
    sectors: ['Cloud', 'AI/ML', 'Productivity'],
    tier: 1,
    location: 'Noida, UP',
    locations: ['Hyderabad', 'Bengaluru', 'Noida'],
    employeeCount: '10,000+',
    salaryRange: '₹35-80 LPA',
    priority: 5,
    status: 'Interviewed',
    careerPage: 'https://careers.microsoft.com',
    linkedinPage: 'https://linkedin.com/company/microsoft',
    notes: 'Applied for SSE role in Azure DevOps team. Strong referral connection through college alumni network. Great WLB and stock refreshers.',
    applicationIds: ['app-001'],
  },
  {
    id: 'co-002',
    name: 'Google',
    industry: 'Technology',
    sectors: ['Cloud', 'AI/ML', 'Search'],
    tier: 1,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Gurgaon', 'Hyderabad'],
    employeeCount: '10,000+',
    salaryRange: '₹40-90 LPA',
    priority: 5,
    status: 'Applied',
    careerPage: 'https://careers.google.com',
    linkedinPage: 'https://linkedin.com/company/google',
    notes: 'Applied for L5 position through Google careers. GS hiring committee process. Need to prepare system design heavily.',
    applicationIds: ['app-002'],
  },
  {
    id: 'co-003',
    name: 'Amazon',
    industry: 'Technology',
    sectors: ['E-Commerce', 'Cloud', 'Logistics'],
    tier: 1,
    location: 'Hyderabad, TS',
    locations: ['Hyderabad', 'Bengaluru', 'Chennai'],
    employeeCount: '100,000+',
    salaryRange: '₹30-75 LPA',
    priority: 4,
    status: 'Passed',
    careerPage: 'https://amazon.jobs',
    linkedinPage: 'https://linkedin.com/company/amazon',
    notes: 'Loop failed previously. Leadership principles round was the bottleneck. Need to prepare LP stories before reapplying in 6 months.',
    applicationIds: ['app-010'],
  },
  {
    id: 'co-004',
    name: 'OpenText',
    industry: 'Enterprise Software',
    sectors: ['MFT', 'Information Management'],
    tier: 5,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Pune'],
    employeeCount: '5,000+',
    salaryRange: '₹25-50 LPA',
    priority: 5,
    status: 'Offered',
    careerPage: 'https://opentext.com/careers',
    linkedinPage: 'https://linkedin.com/company/opentext',
    notes: 'MFT leader. Offer received for MFT team. Strong domain match with B2B integration experience. Negotiating comp package.',
    applicationIds: ['app-003'],
  },
  {
    id: 'co-005',
    name: 'GoAnywhere (Fortran)',
    industry: 'Enterprise Software',
    sectors: ['MFT', 'Managed File Transfer'],
    tier: 5,
    location: 'NCR Region',
    locations: ['Gurgaon'],
    employeeCount: '500-1000',
    salaryRange: '₹28-55 LPA',
    priority: 5,
    status: 'Interviewed',
    careerPage: 'https://goanywhere.io/careers',
    linkedinPage: 'https://linkedin.com/company/goanywhere',
    notes: 'Specialized MFT company. Direct competitor to OpenText MFT. CTO round pending. Great for MFT domain expertise growth.',
    applicationIds: ['app-004'],
  },
  {
    id: 'co-006',
    name: 'IBM Sterling',
    industry: 'Enterprise Software',
    sectors: ['MFT', 'B2B Integration', 'Supply Chain'],
    tier: 5,
    location: 'Pune, MH',
    locations: ['Pune', 'Bengaluru'],
    employeeCount: '10,000+',
    salaryRange: '₹22-48 LPA',
    priority: 4,
    status: 'Applied',
    careerPage: 'https://ibm.com/careers',
    linkedinPage: 'https://linkedin.com/company/ibm',
    notes: 'Sterling B2B Integrator team. Legacy but stable MFT product. Good for enterprise integration experience. Remote friendly.',
    applicationIds: ['app-005'],
  },
  {
    id: 'co-007',
    name: 'Capgemini',
    industry: 'IT Services',
    sectors: ['Consulting', 'Digital', 'Cloud'],
    tier: 3,
    location: 'Gurgaon, HR',
    locations: ['Mumbai', 'Bengaluru', 'Gurgaon', 'Hyderabad'],
    employeeCount: '100,000+',
    salaryRange: '₹15-35 LPA',
    priority: 3,
    status: 'Targeted',
    careerPage: 'https://capgemini.com/careers',
    linkedinPage: 'https://linkedin.com/company/capgemini',
    notes: 'Solutions Architect role. Hybrid work model in NCR. Good WLB. Lower comp than product companies but stable.',
    applicationIds: ['app-006'],
  },
  {
    id: 'co-008',
    name: 'Accenture',
    industry: 'IT Services',
    sectors: ['Consulting', 'Technology', 'Outsourcing'],
    tier: 3,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Mumbai', 'Hyderabad', 'Gurgaon'],
    employeeCount: '200,000+',
    salaryRange: '₹14-38 LPA',
    priority: 3,
    status: 'Targeted',
    careerPage: 'https://accenture.com/careers',
    linkedinPage: 'https://linkedin.com/company/accenture',
    notes: 'Large consulting firm. Multiple technology verticals. Good for broad exposure. Project-based work can be hit or miss.',
    applicationIds: [],
  },
  {
    id: 'co-009',
    name: 'TCS',
    industry: 'IT Services',
    sectors: ['IT Services', 'Consulting', 'Digital'],
    tier: 3,
    location: 'Mumbai, MH',
    locations: ['Mumbai', 'Chennai', 'Bengaluru', 'Hyderabad'],
    employeeCount: '500,000+',
    salaryRange: '₹10-30 LPA',
    priority: 2,
    status: 'Targeted',
    careerPage: 'https://tcs.com/careers',
    linkedinPage: 'https://linkedin.com/company/tcs',
    notes: 'India\'s largest IT company. Stable but lower pay. Good for freshers. Consider only if nothing better available.',
    applicationIds: [],
  },
  {
    id: 'co-010',
    name: 'Nagarro',
    industry: 'Technology Services',
    sectors: ['Digital Engineering', 'Cloud'],
    tier: 4,
    location: 'Gurgaon, HR',
    locations: ['Gurgaon', 'Bengaluru', 'Noida'],
    employeeCount: '10,000+',
    salaryRange: '₹18-42 LPA',
    priority: 4,
    status: 'Applied',
    careerPage: 'https://nagarro.com/careers',
    linkedinPage: 'https://linkedin.com/company/nagarro',
    notes: 'Growing digital engineering company. Gurgaon HQ. Java/Go stack positions available. Good culture per Glassdoor reviews.',
    applicationIds: ['app-007'],
  },
  {
    id: 'co-011',
    name: 'Snyk',
    industry: 'Cybersecurity',
    sectors: ['DevSecOps', 'Security', 'Developer Tools'],
    tier: 4,
    location: 'Remote (India)',
    locations: ['Remote'],
    employeeCount: '1,000-5,000',
    salaryRange: '₹25-55 LPA',
    priority: 3,
    status: 'Targeted',
    careerPage: 'https://snyk.io/careers',
    linkedinPage: 'https://linkedin.com/company/snyk',
    notes: 'Remote-first security company. Developer-focused security tools. Interesting product but slightly lower base compared to FAANG. Stock options.',
    applicationIds: ['app-008'],
  },
  {
    id: 'co-012',
    name: 'Grafana Labs',
    industry: 'Observability',
    sectors: ['Monitoring', 'Observability', 'Open Source'],
    tier: 4,
    location: 'Remote (Global)',
    locations: ['Remote'],
    employeeCount: '500-1000',
    salaryRange: '₹28-60 LPA',
    priority: 4,
    status: 'Passed',
    careerPage: 'https://grafana.com/about/careers',
    linkedinPage: 'https://linkedin.com/company/grafana-labs',
    notes: 'Rejected after final round. Need more distributed tracing experience. Open source culture. Can reapply after gaining more observability expertise.',
    applicationIds: ['app-009'],
  },
  {
    id: 'co-013',
    name: 'Infosys',
    industry: 'IT Services',
    sectors: ['IT Services', 'Consulting', 'Digital'],
    tier: 3,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Mysore'],
    employeeCount: '300,000+',
    salaryRange: '₹10-28 LPA',
    priority: 2,
    status: 'Targeted',
    careerPage: 'https://infosys.com/careers',
    linkedinPage: 'https://linkedin.com/company/infosys',
    notes: 'Major Indian IT firm. Large training programs. Lower pay but stable. Consider for backup options.',
    applicationIds: [],
  },
  {
    id: 'co-014',
    name: 'Atlassian',
    industry: 'Developer Tools',
    sectors: ['Collaboration', 'DevOps', 'Project Management'],
    tier: 2,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru'],
    employeeCount: '5,000-10,000',
    salaryRange: '₹35-70 LPA',
    priority: 4,
    status: 'Targeted',
    careerPage: 'https://atlassian.com/company/careers',
    linkedinPage: 'https://linkedin.com/company/atlassian',
    notes: 'Maker of Jira, Confluence. Strong engineering culture. Team Anywhere model. Good for product engineering growth.',
    applicationIds: [],
  },
  {
    id: 'co-015',
    name: 'Stripe',
    industry: 'Fintech',
    sectors: ['Payments', 'API', 'Financial Infrastructure'],
    tier: 2,
    location: 'Remote (India)',
    locations: ['Remote', 'Singapore'],
    employeeCount: '5,000-10,000',
    salaryRange: '₹40-85 LPA',
    priority: 5,
    status: 'Targeted',
    careerPage: 'https://stripe.com/jobs',
    linkedinPage: 'https://linkedin.com/company/stripe',
    notes: 'Top fintech company. Very high bar. Remote-friendly for India. Excellent comp with RSU. Need strong systems design.',
    applicationIds: [],
  },
  {
    id: 'co-016',
    name: 'Coinbase',
    industry: 'Fintech',
    sectors: ['Crypto', 'Blockchain', 'Exchange'],
    tier: 4,
    location: 'Remote (India)',
    locations: ['Remote'],
    employeeCount: '1,000-5,000',
    salaryRange: '₹30-65 LPA',
    priority: 3,
    status: 'Targeted',
    careerPage: 'https://coinbase.com/careers',
    linkedinPage: 'https://linkedin.com/company/coinbase',
    notes: 'Leading crypto exchange. Remote-first. Crypto market volatility is a risk factor. Good engineering challenges.',
    applicationIds: [],
  },
  {
    id: 'co-017',
    name: 'Flipkart',
    industry: 'E-Commerce',
    sectors: ['E-Commerce', 'Marketplace', 'FinTech'],
    tier: 2,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru'],
    employeeCount: '10,000-30,000',
    salaryRange: '₹25-55 LPA',
    priority: 4,
    status: 'Targeted',
    careerPage: 'https://flipkart.com/careers',
    linkedinPage: 'https://linkedin.com/company/flipkart',
    notes: 'India\'s leading e-commerce platform. High scale engineering problems. Good ESOP program. Bengaluru based.',
    applicationIds: [],
  },
  {
    id: 'co-018',
    name: 'Cleartax',
    industry: 'Fintech',
    sectors: ['Tax', 'Compliance', 'SaaS'],
    tier: 4,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru'],
    employeeCount: '500-1000',
    salaryRange: '₹20-45 LPA',
    priority: 3,
    status: 'Targeted',
    careerPage: 'https://cleartax.in/careers',
    linkedinPage: 'https://linkedin.com/company/cleartax',
    notes: 'Fintech SaaS company. Tax compliance domain. Smaller team means more ownership. Good growth potential.',
    applicationIds: [],
  },
  {
    id: 'co-019',
    name: 'Wipro',
    industry: 'IT Services',
    sectors: ['IT Services', 'Consulting', 'Cloud'],
    tier: 6,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Chennai'],
    employeeCount: '200,000+',
    salaryRange: '₹8-25 LPA',
    priority: 1,
    status: 'Targeted',
    careerPage: 'https://wipro.com/careers',
    linkedinPage: 'https://linkedin.com/company/wipro',
    notes: 'Large IT services company. Lower compensation. Consider only as last resort. Better options available in market.',
    applicationIds: [],
  },
  {
    id: 'co-020',
    name: 'Zerodha',
    industry: 'Fintech',
    sectors: ['Trading', 'Stock Broking', 'FinTech'],
    tier: 3,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru'],
    employeeCount: '500-1000',
    salaryRange: '₹20-50 LPA',
    priority: 4,
    status: 'Targeted',
    careerPage: 'https://zerodha.com/careers',
    linkedinPage: 'https://linkedin.com/company/zerodha',
    notes: 'India\'s largest stock broker. Bootstrapped and profitable. Engineering-driven culture. Bengaluru office only. Niche domain expertise needed.',
    applicationIds: [],
  },
  {
    id: 'co-021',
    name: 'Razorpay',
    industry: 'Fintech',
    sectors: ['Payments', 'SaaS', 'API'],
    tier: 2,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru'],
    employeeCount: '1,000-5,000',
    salaryRange: '₹30-65 LPA',
    priority: 4,
    status: 'Targeted',
    careerPage: 'https://razorpay.com/careers',
    linkedinPage: 'https://linkedin.com/company/razorpay',
    notes: 'Leading Indian payment gateway. High-growth fintech. Strong engineering culture. ESOPs are valuable. Good for backend engineers.',
    applicationIds: [],
  },
  {
    id: 'co-022',
    name: 'Databricks',
    industry: 'Data & AI',
    sectors: ['Big Data', 'AI/ML', 'Analytics'],
    tier: 1,
    location: 'Bengaluru, KA',
    locations: ['Bengaluru', 'Remote'],
    employeeCount: '5,000-10,000',
    salaryRange: '₹40-90 LPA',
    priority: 5,
    status: 'Targeted',
    careerPage: 'https://databricks.com/company/careers',
    linkedinPage: 'https://linkedin.com/company/databricks',
    notes: 'Top data/AI company. Unity Lakehouse platform. Very high compensation. Remote-friendly. Strong IPO potential.',
    applicationIds: [],
  },
];

// ─── Sub-Components ─────────────────────────────────────────────

function TierBadge({ tier }: { tier: CompanyTier }) {
  const config = TIER_CONFIG[tier];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold',
      config.bgColor, config.borderColor, config.textColor
    )}>
      {tier <= 2 ? (
        <Star className="h-3 w-3 fill-current" />
      ) : (
        <Building2 className="h-3 w-3" />
      )}
      {config.label}
    </span>
  );
}

function PriorityStars({ priority, size = 'sm' }: { priority: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i <= priority
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-zinc-300 dark:text-zinc-600'
          )}
        />
      ))}
    </span>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
      config.bgColor, config.color
    )}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

// ─── Company Card ───────────────────────────────────────────────
function CompanyCard({
  company,
  onView,
  onEdit,
}: {
  company: Company;
  onView: (c: Company) => void;
  onEdit: (c: Company) => void;
}) {
  const config = TIER_CONFIG[company.tier];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        'py-0 gap-0 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer',
        'border-l-4',
        config.borderColor
      )}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm truncate">{company.name}</h3>
                <TierBadge tier={company.tier} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
            </div>
            <PriorityStars priority={company.priority} />
          </div>

          {/* Sectors */}
          <div className="flex flex-wrap gap-1 mb-3">
            {company.sectors.map(s => (
              <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                {s}
              </Badge>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{company.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3 flex-shrink-0" />
              <span>{company.employeeCount}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <DollarSign className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium text-foreground">{company.salaryRange}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={company.status} />
            {company.applicationIds.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {company.applicationIds.length} application{company.applicationIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Notes preview */}
          {company.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {company.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center border-t border-border/50 bg-muted/20">
          <button
            onClick={() => onView(company)}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            onClick={() => onEdit(company)}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
          <a
            href={company.careerPage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] text-emerald-600 hover:bg-emerald-500/10 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Careers
          </a>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Company Detail Dialog ──────────────────────────────────────
function CompanyDetailDialog({
  company,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (c: Company) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Company | null>(null);

  React.useEffect(() => {
    if (company) setForm({ ...company });
  }, [company]);

  if (!form) return null;

  const updateField = <K extends keyof Company>(key: K, value: Company[K]) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSave = () => {
    if (form) onSave(form);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (form) onDelete(form.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-500" />
            {form.name}
          </DialogTitle>
          <DialogDescription>
            Company details and intelligence
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Industry</Label>
              <p className="text-sm font-medium">{form.industry}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <p className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {form.location}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Employees</Label>
              <p className="text-sm font-medium">{form.employeeCount}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Salary Range</Label>
              <p className="text-sm font-semibold text-emerald-600">{form.salaryRange}</p>
            </div>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Tier</Label>
              <Select value={String(form.tier)} onValueChange={v => updateField('tier', Number(v) as CompanyTier)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([1, 2, 3, 4, 5, 6] as CompanyTier[]).map(t => (
                    <SelectItem key={t} value={String(t)}>
                      <span className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', TIER_CONFIG[t].color)} />
                        {TIER_CONFIG[t].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => updateField('status', v as CompanyStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['Targeted', 'Applied', 'Interviewed', 'Offered', 'Passed'] as CompanyStatus[]).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority (1-5)</Label>
              <Select value={String(form.priority)} onValueChange={v => updateField('priority', Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      <span className="flex items-center gap-1">
                        {'★'.repeat(n)}{'☆'.repeat(5 - n)}
                        <span className="text-xs text-muted-foreground ml-1">({n})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-1.5">
            <Label>Office Locations</Label>
            <div className="flex flex-wrap gap-1.5">
              {form.locations.map(loc => (
                <Badge key={loc} variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {loc}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-1.5">
            <Label>Sectors</Label>
            <div className="flex flex-wrap gap-1.5">
              {form.sectors.map(s => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Add company intelligence notes..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Separator />

          {/* External Links */}
          <div className="space-y-2">
            <Label>External Links</Label>
            <div className="flex flex-wrap gap-2">
              {form.careerPage && (
                <a href={form.careerPage} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Globe className="h-3.5 w-3.5" />
                    Career Page
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              )}
              {form.linkedinPage && (
                <a href={form.linkedinPage} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Application History */}
          {form.applicationIds.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-emerald-500" />
                  Application History ({form.applicationIds.length})
                </Label>
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                  {form.applicationIds.length} application(s) found for this company. Visit the Application Tracker for details.
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function CompaniesPage() {
  const [dbCompanies, setDbCompanies] = useState<Company[] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'tier'>('priority');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [detailCompany, setDetailCompany] = useState<Company | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const companies = dbCompanies || initialCompanies;

  // Stats
  const stats = useMemo(() => ({
    total: companies.length,
    tier1: companies.filter(c => c.tier === 1).length,
    tier2: companies.filter(c => c.tier === 2).length,
    applied: companies.filter(c => ['Applied', 'Interviewed', 'Offered'].includes(c.status)).length,
  }), [companies]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    let result = companies.filter(c => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q) && !c.sectors.some(s => s.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (tierFilter !== 'all' && c.tier !== Number(tierFilter)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });

    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'priority') return (b.priority - a.priority) * dir;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortBy === 'tier') return (a.tier - b.tier) * dir;
      return 0;
    });

    return result;
  }, [companies, searchQuery, tierFilter, statusFilter, sortBy, sortDir]);

  const loadCompanies = useCallback(async () => {
    try {
      const res = await fetch('/api/companies');
      if (!res.ok) throw new Error('Failed to fetch');
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : (raw.companies || []);
      const mapped: Company[] = list.map((c: any) => ({
        id: c.id,
        name: c.name,
        industry: c.industry || '',
        sectors: c.sector ? c.sector.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        tier: c.tier as CompanyTier,
        location: c.hqLocation || '',
        locations: c.ncrOffice ? [c.ncrOffice] : [],
        employeeCount: c.employeeCount || '',
        salaryRange: c.salaryRange || '',
        priority: c.priority,
        status: (c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : 'Targeted') as CompanyStatus,
        careerPage: c.careerPageUrl || '',
        linkedinPage: c.linkedinUrl || '',
        notes: c.notes || '',
        applicationIds: [],
      }));
      setDbCompanies(mapped);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setDbCompanies(null);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Handlers
  const handleSave = async (updated: Company) => {
    try {
      const payload = {
        name: updated.name,
        industry: updated.industry,
        sector: updated.sectors.join(', '),
        tier: updated.tier,
        hqLocation: updated.location,
        ncrOffice: updated.locations[0] || '',
        employeeCount: updated.employeeCount,
        careerPageUrl: updated.careerPage,
        linkedinUrl: updated.linkedinPage,
        salaryRange: updated.salaryRange,
        notes: updated.notes,
        priority: updated.priority,
        status: updated.status.toLowerCase(),
      };
      const res = await fetch(`/api/companies/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Company updated');
      loadCompanies();
    } catch {
      toast.error('Failed to save company');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Company deleted');
      loadCompanies();
    } catch {
      toast.error('Failed to delete company');
    }
  };

  const handleView = (c: Company) => {
    setDetailCompany(c);
    setDetailOpen(true);
  };

  const handleEdit = (c: Company) => {
    setDetailCompany(c);
    setDetailOpen(true);
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-500" />
            Target Companies
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Company intelligence database and research tracker
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Companies', value: stats.total, icon: Building2, color: 'text-foreground' },
          { label: 'Tier 1 (Dream)', value: stats.tier1, icon: Star, color: 'text-yellow-500' },
          { label: 'Tier 2 (Stretch)', value: stats.tier2, icon: Star, color: 'text-slate-400' },
          { label: 'Applications Made', value: stats.applied, icon: Briefcase, color: 'text-emerald-500' },
        ].map(stat => (
          <Card key={stat.label} className="py-0 gap-0 shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <div className={cn('h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center', stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search, Filters, View Toggle */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search companies, industries, sectors..."
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger size="sm" className="w-[120px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {([1, 2, 3, 4, 5, 6] as CompanyTier[]).map(t => (
                <SelectItem key={t} value={String(t)}>{TIER_CONFIG[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger size="sm" className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(['Targeted', 'Applied', 'Interviewed', 'Offered', 'Passed'] as CompanyStatus[]).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Button variant="outline" size="sm" onClick={() => toggleSort('priority')} className="gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortBy === 'priority' ? 'Priority' : sortBy === 'name' ? 'Name' : 'Tier'}
            {sortBy === sortBy && (
              sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <Select value={sortBy} onValueChange={v => { setSortBy(v as typeof sortBy); setSortDir('desc'); }}>
            <SelectTrigger size="sm" className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="tier">Tier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'grid' | 'table')} className="ml-auto">
          <TabsList>
            <TabsTrigger value="grid" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-1.5">
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} of {companies.length} companies</span>
        {selectedIds.size > 0 && (
          <span className="text-emerald-600 font-medium">{selectedIds.size} selected</span>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onView={handleView}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Building2 className="h-12 w-12 mb-3 text-muted-foreground/30" />
              <p className="text-sm">No companies match your filters</p>
              <Button variant="link" size="sm" onClick={() => { setSearchQuery(''); setTierFilter('all'); setStatusFilter('all'); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Industry</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Tier</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Location</TableHead>
                <TableHead className="font-semibold hidden xl:table-cell">Salary</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Priority</TableHead>
                <TableHead className="font-semibold hidden sm:table-cell">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map(company => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(company.id)}
                        onCheckedChange={() => toggleSelect(company.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{company.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{company.industry}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {company.industry}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <TierBadge tier={company.tier} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {company.location}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs font-medium">
                      {company.salaryRange}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <PriorityStars priority={company.priority} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge status={company.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleView(company)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(company)}>
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <a href={company.careerPage} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No companies match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <CompanyDetailDialog
        company={detailCompany}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
