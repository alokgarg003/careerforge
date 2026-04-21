'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { JobCard } from '@/components/jobs/job-card';
import { JobDetailDrawer } from '@/components/jobs/job-detail-drawer';
import { mockJobs } from '@/lib/mock-data';
import {
  Job,
  ViewMode,
  SortOption,
  getScoreColor,
  getSourceBadgeColor,
  getWorkModeBadgeColor,
} from '@/lib/types';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const locations = ['All Locations', 'Noida', 'Delhi NCR', 'Remote', 'Bangalore', 'Jaipur'];
const sources = ['All', 'Web Search', 'LinkedIn', 'Naukri', 'Manual'];
const alignments = ['All', 'Strong Match', 'Good Match', 'Stretch', 'Ignore'];
const workModes = ['All', 'Remote', 'Hybrid', 'Onsite'];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'score', label: 'Score' },
  { value: 'date', label: 'Date' },
  { value: 'company', label: 'Company' },
];

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [alignmentFilter, setAlignmentFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedTableRows, setSelectedTableRows] = useState<Set<string>>(new Set());

  const filteredJobs = useMemo(() => {
    let jobs = [...mockJobs];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Location filter
    if (selectedLocation !== 'All Locations') {
      jobs = jobs.filter((j) => j.location === selectedLocation);
    }

    // Source filter
    if (sourceFilter !== 'All') {
      jobs = jobs.filter((j) => j.source === sourceFilter);
    }

    // Alignment filter
    if (alignmentFilter !== 'All') {
      jobs = jobs.filter((j) => {
        const score = j.matchScore ?? 0;
        const alignment =
          score >= 70
            ? 'Strong Match'
            : score >= 45
              ? 'Good Match'
              : score >= 20
                ? 'Stretch'
                : 'Ignore';
        return alignment === alignmentFilter;
      });
    }

    // Work mode filter
    if (workModeFilter !== 'All') {
      jobs = jobs.filter(
        (j) => j.workMode?.toLowerCase() === workModeFilter.toLowerCase()
      );
    }

    // Sort
    jobs.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.matchScore ?? 0) - (a.matchScore ?? 0);
        case 'date':
          return (
            new Date(b.datePosted ?? '').getTime() -
            new Date(a.datePosted ?? '').getTime()
          );
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    return jobs;
  }, [
    searchQuery,
    selectedLocation,
    sourceFilter,
    alignmentFilter,
    workModeFilter,
    sortBy,
  ]);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  const handleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const handleToggleTableRow = (jobId: string) => {
    setSelectedTableRows((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const handleToggleAllRows = () => {
    if (selectedTableRows.size === filteredJobs.length) {
      setSelectedTableRows(new Set());
    } else {
      setSelectedTableRows(new Set(filteredJobs.map((j) => j.id)));
    }
  };

  const activeFiltersCount =
    (sourceFilter !== 'All' ? 1 : 0) +
    (alignmentFilter !== 'All' ? 1 : 0) +
    (workModeFilter !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All Locations' ? 1 : 0);

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground">Job Discovery</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and analyze jobs that match your career goals
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div variants={fadeIn}>
        <Card className="py-5 px-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, skills..."
                className="pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location dropdown */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-[160px] h-10">
                <MapPin className="size-4 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
                <Search className="size-4" />
                Search Jobs
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                <Plus className="size-4" />
                Add Job Manually
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={fadeIn}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <span className="font-medium">
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
                  {activeFiltersCount}
                </Badge>
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger size="sm" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'All' ? 'All Sources' : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={alignmentFilter} onValueChange={setAlignmentFilter}>
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {alignments.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a === 'All' ? 'All Alignments' : a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={workModeFilter} onValueChange={setWorkModeFilter}>
              <SelectTrigger size="sm" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workModes.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w === 'All' ? 'All Modes' : w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger size="sm" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

            {/* View toggle */}
            <div className="flex rounded-md border bg-muted/50 p-0.5">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode('cards')}
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode('table')}
              >
                <List className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Results count */}
          <span className="text-xs text-muted-foreground sm:ml-auto">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </motion.div>

      {/* Card View */}
      {viewMode === 'cards' && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={stagger}
        >
          {filteredJobs.map((job) => (
            <motion.div key={job.id} variants={fadeIn}>
              <JobCard
                job={{ ...job, saved: savedJobs.has(job.id) }}
                onViewDetails={handleViewDetails}
                onSave={handleSave}
              />
            </motion.div>
          ))}
          {filteredJobs.length === 0 && (
            <motion.div variants={fadeIn} className="col-span-full">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Filter className="size-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No jobs match your filters
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div variants={fadeIn}>
          <Card className="py-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          filteredJobs.length > 0 &&
                          selectedTableRows.size === filteredJobs.length
                        }
                        onCheckedChange={handleToggleAllRows}
                      />
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() =>
                          setSortBy(sortBy === 'company' ? 'score' : 'company')
                        }
                      >
                        Job
                        {sortBy === 'company' && (
                          <ChevronUp className="size-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[80px]">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() =>
                          setSortBy(sortBy === 'score' ? 'company' : 'score')
                        }
                      >
                        Score
                        {sortBy === 'score' && <ChevronUp className="size-3" />}
                      </button>
                    </TableHead>
                    <TableHead>Alignment</TableHead>
                    <TableHead className="min-w-[100px]">Source</TableHead>
                    <TableHead className="min-w-[80px]">Mode</TableHead>
                    <TableHead className="min-w-[100px]">
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() =>
                          setSortBy(sortBy === 'date' ? 'score' : 'date')
                        }
                      >
                        Date
                        {sortBy === 'date' && <ChevronUp className="size-3" />}
                      </button>
                    </TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => {
                    const score = job.matchScore ?? 0;
                    const alignment =
                      score >= 70
                        ? 'Strong Match'
                        : score >= 45
                          ? 'Good Match'
                          : score >= 20
                            ? 'Stretch'
                            : 'Ignore';
                    const scoreColorClass = getScoreColor(score);
                    const sourceColor = getSourceBadgeColor(job.source);
                    const workModeColor = getWorkModeBadgeColor(job.workMode ?? '');

                    return (
                      <TableRow
                        key={job.id}
                        className="cursor-pointer"
                        onClick={() => handleViewDetails(job)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedTableRows.has(job.id)}
                            onCheckedChange={() => handleToggleTableRow(job.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {job.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {job.companyName} · {job.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold border ${scoreColorClass}`}
                          >
                            {score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              score >= 70
                                ? 'default'
                                : score >= 45
                                  ? 'secondary'
                                  : 'outline'
                            }
                            className={
                              score >= 70
                                ? 'bg-emerald-600 text-[10px]'
                                : score >= 45
                                  ? 'bg-amber-500 text-white text-[10px]'
                                  : 'text-[10px]'
                            }
                          >
                            {alignment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${sourceColor}`}
                          >
                            {job.source}
                          </span>
                        </TableCell>
                        <TableCell>
                          {job.workMode && (
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${workModeColor}`}
                            >
                              {job.workMode}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {job.datePosted
                            ? new Date(job.datePosted).toLocaleDateString(
                                'en-US',
                                { month: 'short', day: 'numeric' }
                              )
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-emerald-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(job);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredJobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Filter className="size-8 text-muted-foreground/40 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No jobs match your filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Job Detail Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </motion.div>
  );
}
