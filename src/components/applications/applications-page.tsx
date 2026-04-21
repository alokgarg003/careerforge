'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  MoreHorizontal,
  ChevronRight,
  Edit3,
  Trash2,
  StickyNote,
  ArrowRight,
  LayoutGrid,
  List,
  Filter,
  X,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Briefcase,
  CalendarDays,
  Clock,
  User,
  Star,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────
type ApplicationStatus = 'interested' | 'applied' | 'interviewing' | 'offered' | 'rejected';
type Priority = 'high' | 'medium' | 'low';
type Platform = 'LinkedIn' | 'Naukri' | 'Company Site' | 'Referral' | 'Indeed' | 'Glassdoor' | 'AngelList' | 'Other';

interface HRContact {
  name: string;
  email: string;
  phone: string;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  priority: Priority;
  appliedDate: string;
  interviewDate?: string;
  offerAmount?: string;
  platform: Platform;
  hrContact: HRContact;
  notes: string;
  followedUp: boolean;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialApplications: Application[] = [
  {
    id: 'app-001',
    jobTitle: 'Senior Software Engineer',
    company: 'Microsoft',
    status: 'interviewing',
    priority: 'high',
    appliedDate: '2026-03-15',
    interviewDate: '2026-04-25',
    platform: 'Referral',
    hrContact: { name: 'Priya Sharma', email: 'priya.sharma@microsoft.com', phone: '+91 98765 43210' },
    notes: 'Round 2 cleared. System design round scheduled. Prepare distributed systems topics.',
    followedUp: true,
    createdAt: '2026-03-10',
  },
  {
    id: 'app-002',
    jobTitle: 'Staff Engineer - Platform',
    company: 'Google',
    status: 'applied',
    priority: 'high',
    appliedDate: '2026-04-02',
    platform: 'Company Site',
    hrContact: { name: 'Rahul Verma', email: 'rahul.v@google.com', phone: '' },
    notes: 'Applied through Google careers portal. Strong match for L5/L6 role.',
    followedUp: false,
    createdAt: '2026-03-28',
  },
  {
    id: 'app-003',
    jobTitle: 'SDE II - MFT Division',
    company: 'OpenText',
    status: 'offered',
    priority: 'high',
    appliedDate: '2026-02-20',
    interviewDate: '2026-03-15',
    offerAmount: '₹42 LPA',
    platform: 'Naukri',
    hrContact: { name: 'Anita Gupta', email: 'anita.gupta@opentext.com', phone: '+91 99887 76655' },
    notes: 'Offer received! ₹42 LPA base + stocks. Negotiating final numbers. Deadline Apr 30.',
    followedUp: true,
    createdAt: '2026-02-15',
  },
  {
    id: 'app-004',
    jobTitle: 'Technical Lead - Integration',
    company: 'GoAnywhere (Fortran)',
    status: 'interviewing',
    priority: 'high',
    appliedDate: '2026-03-25',
    interviewDate: '2026-04-22',
    platform: 'LinkedIn',
    hrContact: { name: 'Vikram Singh', email: 'vikram@goanywhere.io', phone: '+91 87654 32109' },
    notes: 'MFT domain specialist role. Cleared tech screen. Final round with CTO.',
    followedUp: true,
    createdAt: '2026-03-20',
  },
  {
    id: 'app-005',
    jobTitle: 'Senior Developer - B2B Connect',
    company: 'IBM Sterling',
    status: 'applied',
    priority: 'medium',
    appliedDate: '2026-04-10',
    platform: 'Company Site',
    hrContact: { name: '', email: '', phone: '' },
    notes: 'Applied for Sterling B2B Integrator team. MFT + supply chain focus.',
    followedUp: false,
    createdAt: '2026-04-08',
  },
  {
    id: 'app-006',
    jobTitle: 'Solutions Architect',
    company: 'Capgemini',
    status: 'interested',
    priority: 'medium',
    appliedDate: '',
    platform: 'LinkedIn',
    hrContact: { name: '', email: '', phone: '' },
    notes: 'Hybrid role in NCR. Good for work-life balance. Check salary bands.',
    followedUp: false,
    createdAt: '2026-04-12',
  },
  {
    id: 'app-007',
    jobTitle: 'Senior Backend Engineer',
    company: 'Nagarro',
    status: 'applied',
    priority: 'medium',
    appliedDate: '2026-04-05',
    platform: 'Naukri',
    hrContact: { name: 'Deepak Kumar', email: 'deepak.k@nagarro.com', phone: '' },
    notes: 'Applied through Naukri. Gurgaon office. Java/Go stack.',
    followedUp: false,
    createdAt: '2026-04-01',
  },
  {
    id: 'app-008',
    jobTitle: 'Principal Engineer',
    company: 'Snyk',
    status: 'interested',
    priority: 'low',
    appliedDate: '',
    platform: 'AngelList',
    hrContact: { name: '', email: '', phone: '' },
    notes: 'Remote-first security company. Interesting product but lower base comp.',
    followedUp: false,
    createdAt: '2026-04-14',
  },
  {
    id: 'app-009',
    jobTitle: 'Tech Lead - Observability',
    company: 'Grafana Labs',
    status: 'rejected',
    priority: 'medium',
    appliedDate: '2026-03-01',
    interviewDate: '2026-03-20',
    platform: 'Company Site',
    hrContact: { name: 'Sarah Chen', email: 'sarah@grafana.com', phone: '' },
    notes: 'Rejected after final round. Feedback: not enough distributed tracing experience.',
    followedUp: true,
    createdAt: '2026-02-25',
  },
  {
    id: 'app-010',
    jobTitle: 'SDE II',
    company: 'Amazon',
    status: 'rejected',
    priority: 'high',
    appliedDate: '2026-02-10',
    interviewDate: '2026-03-05',
    platform: 'Referral',
    hrContact: { name: 'Alex Johnson', email: 'alexj@amazon.com', phone: '' },
    notes: 'Loop failed. Leadership principles round was tough. Can reapply in 6 months.',
    followedUp: true,
    createdAt: '2026-02-05',
  },
];

// ─── Constants ──────────────────────────────────────────────────
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; borderColor: string; headerDot: string }> = {
  interested: { label: 'Interested', color: 'text-zinc-400', bgColor: 'bg-zinc-400/10', borderColor: 'border-zinc-400/30', headerDot: 'bg-zinc-400' },
  applied: { label: 'Applied', color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', headerDot: 'bg-blue-500' },
  interviewing: { label: 'Interviewing', color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', headerDot: 'bg-amber-500' },
  offered: { label: 'Offered', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', headerDot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', headerDot: 'bg-red-500' },
};

const STATUS_ORDER: ApplicationStatus[] = ['interested', 'applied', 'interviewing', 'offered', 'rejected'];

const PRIORITY_CONFIG: Record<Priority, { label: string; dotColor: string }> = {
  high: { label: 'High', dotColor: 'bg-red-500' },
  medium: { label: 'Medium', dotColor: 'bg-amber-500' },
  low: { label: 'Low', dotColor: 'bg-zinc-400' },
};

const PLATFORM_COLORS: Record<Platform, string> = {
  'LinkedIn': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  'Naukri': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Company Site': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Referral': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  'Indeed': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'Glassdoor': 'bg-lime-500/10 text-lime-600 border-lime-500/20',
  'AngelList': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'Other': 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
};

// ─── Helpers ────────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getDaysAgo = (dateStr: string) => {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
};

const getNextStatus = (current: ApplicationStatus): ApplicationStatus | null => {
  const idx = STATUS_ORDER.indexOf(current);
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
};

const createEmptyApplication = (): Application => ({
  id: `app-${Date.now()}`,
  jobTitle: '',
  company: '',
  status: 'interested',
  priority: 'medium',
  appliedDate: new Date().toISOString().split('T')[0],
  platform: 'LinkedIn',
  hrContact: { name: '', email: '', phone: '' },
  notes: '',
  followedUp: false,
  createdAt: new Date().toISOString().split('T')[0],
});

// ─── Sub-Components ─────────────────────────────────────────────

function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', PRIORITY_CONFIG[priority].dotColor)} />
      <span className="text-xs text-muted-foreground hidden sm:inline">{PRIORITY_CONFIG[priority].label}</span>
    </span>
  );
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium', PLATFORM_COLORS[platform])}>
      {platform}
    </span>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.color, config.borderColor, config.bgColor)}>
      <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', config.headerDot)} />
      {config.label}
    </Badge>
  );
}

// ─── Application Card ──────────────────────────────────────────
function ApplicationCard({
  app,
  onEdit,
  onMoveNext,
  onOpenNotes,
}: {
  app: Application;
  onEdit: (app: Application) => void;
  onMoveNext: (app: Application) => void;
  onOpenNotes: (app: Application) => void;
}) {
  const nextStatus = getNextStatus(app.status);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group"
    >
      <Card className="py-0 gap-0 border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer overflow-hidden">
        <div className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight truncate">{app.jobTitle}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{app.company}</p>
            </div>
            <PriorityDot priority={app.priority} />
          </div>

          {/* Date & Platform */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {app.appliedDate && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {getDaysAgo(app.appliedDate)}
              </span>
            )}
            <PlatformBadge platform={app.platform} />
            {app.followedUp && (
              <span className="text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5 font-medium">
                Followed up
              </span>
            )}
          </div>

          {/* HR Contact */}
          {app.hrContact.name && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2">
              <User className="h-3 w-3" />
              <span className="truncate">{app.hrContact.name}</span>
              {app.hrContact.email && (
                <Mail className="h-3 w-3 ml-1 text-muted-foreground/60" />
              )}
            </div>
          )}

          {/* Interview Date */}
          {app.interviewDate && app.status === 'interviewing' && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-500/10 rounded-md px-2 py-1 mb-2">
              <Clock className="h-3 w-3" />
              Interview: {formatDate(app.interviewDate)}
            </div>
          )}

          {/* Offer */}
          {app.offerAmount && app.status === 'offered' && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-500/10 rounded-md px-2 py-1 mb-2 font-semibold">
              <Star className="h-3 w-3" />
              {app.offerAmount}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center border-t border-border/50 bg-muted/20">
          <button
            onClick={() => onEdit(app)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Edit3 className="h-3 w-3" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          {nextStatus && (
            <button
              onClick={() => onMoveNext(app)}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-emerald-600 hover:bg-emerald-500/10 transition-colors"
            >
              <ArrowRight className="h-3 w-3" />
              <span className="hidden sm:inline">Move</span>
            </button>
          )}
          <button
            onClick={() => onOpenNotes(app)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <StickyNote className="h-3 w-3" />
            <span className="hidden sm:inline">Notes</span>
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Application Detail Dialog ──────────────────────────────────
function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (app: Application) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Application | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<string | null>(null);

  React.useEffect(() => {
    if (application) {
      setForm({ ...application });
    }
  }, [application]);

  if (!form) return null;

  const updateField = <K extends keyof Application>(key: K, value: Application[K]) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const updateHR = (field: keyof HRContact, value: string) => {
    setForm(prev =>
      prev ? { ...prev, hrContact: { ...prev.hrContact, [field]: value } } : null
    );
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
            <Briefcase className="h-5 w-5 text-emerald-500" />
            {form.id.startsWith('app-') && !initialApplications.find(a => a.id === form.id) ? 'Add Application' : 'Edit Application'}
          </DialogTitle>
          <DialogDescription>
            Track your job application details and progress
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={form.jobTitle}
                onChange={e => updateField('jobTitle', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={e => updateField('company', e.target.value)}
                placeholder="e.g. Google"
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => updateField('status', v as ApplicationStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map(s => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', STATUS_CONFIG[s].headerDot)} />
                        {STATUS_CONFIG[s].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => updateField('priority', v as Priority)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['high', 'medium', 'low'] as Priority[]).map(p => (
                    <SelectItem key={p} value={p}>
                      <span className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', PRIORITY_CONFIG[p].dotColor)} />
                        {PRIORITY_CONFIG[p].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => updateField('platform', v as Platform)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['LinkedIn', 'Naukri', 'Company Site', 'Referral', 'Indeed', 'Glassdoor', 'AngelList', 'Other'] as Platform[]).map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Applied Date</Label>
              <Popover open={calendarOpen === 'applied'} onOpenChange={o => setCalendarOpen(o ? 'applied' : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {form.appliedDate ? formatDate(form.appliedDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.appliedDate ? new Date(form.appliedDate) : undefined}
                    onSelect={d => {
                      if (d) updateField('appliedDate', d.toISOString().split('T')[0]);
                      setCalendarOpen(null);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Interview Date</Label>
              <Popover open={calendarOpen === 'interview'} onOpenChange={o => setCalendarOpen(o ? 'interview' : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {form.interviewDate ? formatDate(form.interviewDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.interviewDate ? new Date(form.interviewDate) : undefined}
                    onSelect={d => {
                      if (d) updateField('interviewDate', d.toISOString().split('T')[0]);
                      setCalendarOpen(null);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Offer Amount */}
          <div className="space-y-1.5">
            <Label>Offer Amount (if applicable)</Label>
            <Input
              value={form.offerAmount || ''}
              onChange={e => updateField('offerAmount', e.target.value)}
              placeholder="e.g. ₹45 LPA"
            />
          </div>

          <Separator />

          {/* HR Contact */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              HR Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.hrContact.name}
                  onChange={e => updateHR('name', e.target.value)}
                  placeholder="HR Name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.hrContact.email}
                  onChange={e => updateHR('email', e.target.value)}
                  placeholder="hr@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.hrContact.phone}
                  onChange={e => updateHR('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Add notes about this application..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Follow-up */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="followedUp"
              checked={form.followedUp}
              onCheckedChange={v => updateField('followedUp', !!v)}
            />
            <Label htmlFor="followedUp" className="cursor-pointer text-sm">
              I&apos;ve followed up on this application
            </Label>
          </div>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Notes Preview Dialog ──────────────────────────────────────
function NotesDialog({
  application,
  open,
  onOpenChange,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!application) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-amber-500" />
            Notes — {application.jobTitle}
          </DialogTitle>
          <DialogDescription>{application.company}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {application.notes ? (
            <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {application.notes}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">
              No notes added yet. Click Edit to add notes.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── List View ─────────────────────────────────────────────────
function ListView({
  applications,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onEdit,
  onDelete,
  onMoveNext,
}: {
  applications: Application[];
  statusFilter: string;
  priorityFilter: string;
  onStatusFilterChange: (v: string) => void;
  onPriorityFilterChange: (v: string) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveNext: (app: Application) => void;
}) {
  const filtered = useMemo(() => {
    return applications.filter(app => {
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && app.priority !== priorityFilter) return false;
      return true;
    }).sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [applications, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger size="sm" className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_ORDER.map(s => (
              <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {(['high', 'medium', 'low'] as Priority[]).map(p => (
              <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {applications.length} applications
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Job</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Status</TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">Priority</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Applied</TableHead>
              <TableHead className="font-semibold hidden xl:table-cell">HR Contact</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.map(app => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate">{app.jobTitle}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{app.company}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <PriorityDot priority={app.priority} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {formatDate(app.appliedDate)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-muted-foreground text-xs">
                    {app.hrContact.name || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(app)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {getNextStatus(app.status) && (
                          <DropdownMenuItem onClick={() => onMoveNext(app)}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Move to {STATUS_CONFIG[getNextStatus(app.status)!].label}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(app.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No applications found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [dialogApp, setDialogApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notesApp, setNotesApp] = useState<Application | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [listStatusFilter, setListStatusFilter] = useState('all');
  const [listPriorityFilter, setListPriorityFilter] = useState('all');

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      total: applications.length,
      appliedThisWeek: applications.filter(a => a.appliedDate && new Date(a.appliedDate) >= weekAgo).length,
      interviews: applications.filter(a => a.status === 'interviewing').length,
      offers: applications.filter(a => a.status === 'offered').length,
    };
  }, [applications]);

  // Kanban columns
  const columns = useMemo(() => {
    return STATUS_ORDER.map(status => ({
      status,
      ...STATUS_CONFIG[status],
      applications: applications.filter(a => a.status === status),
    }));
  }, [applications]);

  // Handlers
  const handleAdd = () => {
    const newApp = createEmptyApplication();
    setDialogApp(newApp);
    setDialogOpen(true);
  };

  const handleEdit = (app: Application) => {
    setDialogApp(app);
    setDialogOpen(true);
  };

  const handleSave = (updated: Application) => {
    setApplications(prev => {
      const exists = prev.find(a => a.id === updated.id);
      if (exists) return prev.map(a => (a.id === updated.id ? updated : a));
      return [...prev, updated];
    });
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const handleMoveNext = (app: Application) => {
    const next = getNextStatus(app.status);
    if (next) {
      const updated = { ...app, status: next };
      setApplications(prev => prev.map(a => (a.id === app.id ? updated : a)));
    }
  };

  const handleOpenNotes = (app: Application) => {
    setNotesApp(app);
    setNotesOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-emerald-500" />
            Application Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage your job applications
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Briefcase, color: 'text-foreground' },
          { label: 'Applied This Week', value: stats.appliedThisWeek, icon: CalendarDays, color: 'text-blue-500' },
          { label: 'Interviews', value: stats.interviews, icon: MessageSquare, color: 'text-amber-500' },
          { label: 'Offers', value: stats.offers, icon: CheckCircle2, color: 'text-emerald-500' },
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

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'kanban' | 'list')}>
          <TabsList>
            <TabsTrigger value="kanban" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {viewMode === 'kanban' && (
          <span className="text-xs text-muted-foreground hidden sm:block">
            Drag cards or use action buttons to move between stages
          </span>
        )}
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 min-w-max">
            {columns.map(column => (
              <div
                key={column.status}
                className={cn(
                  'w-[300px] sm:w-[320px] flex-shrink-0 rounded-xl border-2 border-dashed bg-card/30',
                  column.borderColor
                )}
              >
                {/* Column Header */}
                <div className="sticky top-0 z-10 bg-card rounded-t-xl px-4 pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2.5 w-2.5 rounded-full', column.headerDot)} />
                      <h3 className={cn('font-semibold text-sm', column.color)}>
                        {column.label}
                      </h3>
                      <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] text-xs">
                        {column.applications.length}
                      </Badge>
                    </div>
                    {column.status === 'interested' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleAdd}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Column Body */}
                <ScrollArea className="h-[calc(100vh-320px)] min-h-[200px]">
                  <div className="px-3 pb-3 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {column.applications.map(app => (
                        <ApplicationCard
                          key={app.id}
                          app={app}
                          onEdit={handleEdit}
                          onMoveNext={handleMoveNext}
                          onOpenNotes={handleOpenNotes}
                        />
                      ))}
                    </AnimatePresence>

                    {column.applications.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                      >
                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <p className="text-xs">No applications</p>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ListView
          applications={applications}
          statusFilter={listStatusFilter}
          priorityFilter={listPriorityFilter}
          onStatusFilterChange={setListStatusFilter}
          onPriorityFilterChange={setListPriorityFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveNext={handleMoveNext}
        />
      )}

      {/* Detail Dialog */}
      <ApplicationDetailDialog
        application={dialogApp}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Notes Dialog */}
      <NotesDialog
        application={notesApp}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />
    </div>
  );
}
