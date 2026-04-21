import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'all'

    // Build date filter based on range
    const dateFilter: Prisma.JobWhereInput['createdAt'] = {}
    const appDateFilter: Prisma.ApplicationWhereInput['createdAt'] = {}

    if (range !== 'all') {
      const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 0
      const since = new Date()
      since.setDate(since.getDate() - days)
      dateFilter.gte = since
      appDateFilter.gte = since
    }

    // Run all queries in parallel
    const [
      jobsBySourceRaw,
      allJobMatches,
      applicationsRaw,
      jobMatchesWithSkills,
      applicationsWithCompany,
      applicationsForTimeline,
      salaryJobsRaw,
      profile,
      totalJobsCount,
      totalApplications,
      offeredCount,
      activeAppsCount,
      interviewingCount,
    ] = await Promise.all([
      // 1. Jobs by source
      db.job.groupBy({
        by: ['source'],
        where: range !== 'all' ? { createdAt: dateFilter } : undefined,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // 2. All job matches (for match distribution)
      db.jobMatch.findMany({
        select: {
          score: true,
          jobId: true,
          job: { select: { createdAt: true } },
        },
      }),

      // 3. Applications by status
      db.application.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // 4. JobMatch records with skills (for skills gap)
      db.jobMatch.findMany({
        select: {
          matchingSkills: true,
          missingSkills: true,
        },
      }),

      // 5. Applications with company info (for top companies)
      db.application.findMany({
        select: {
          job: {
            select: { companyName: true },
          },
        },
      }),

      // 6. Applications with dates (for timeline)
      db.application.findMany({
        select: { appliedAt: true, createdAt: true },
        orderBy: { appliedAt: 'asc' },
      }),

      // 7. Jobs with salary data
      db.job.findMany({
        where: {
          salaryMin: { not: null },
          salaryMax: { not: null },
        },
        select: {
          title: true,
          experienceRange: true,
          salaryMin: true,
          salaryMax: true,
        },
      }),

      // 8. Profile
      db.profile.findFirst({
        select: {
          primarySkills: true,
          secondarySkills: true,
        },
      }),

      // Summary counts
      db.job.count(),
      db.application.count(),
      db.application.count({ where: { status: 'offered' } }),
      db.application.count({
        where: {
          status: { notIn: ['rejected', 'offered'] },
        },
      }),
      db.application.count({ where: { status: 'interviewing' } }),
    ])

    // ── 1. Jobs by Source ──────────────────────────────
    const sourceLabels: Record<string, string> = {
      web_search: 'Web Search',
      linkedin: 'LinkedIn',
      naukri: 'Naukri',
      manual: 'Manual',
    }
    const sourceColors = ['#059669', '#10b981', '#34d399', '#6ee7b7']
    const jobsBySource = jobsBySourceRaw.map((item, i) => ({
      source: sourceLabels[item.source] || item.source,
      count: item._count.id,
      fill: sourceColors[i % sourceColors.length],
    }))

    // ── 2. Match Score Distribution ────────────────────
    // Filter by date range if needed
    const filteredMatches = allJobMatches.filter((m) => {
      if (range === 'all') return true
      if (range === '7d' || range === '30d' || range === '90d') {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
        const since = new Date()
        since.setDate(since.getDate() - days)
        return m.job.createdAt >= since
      }
      return true
    })

    const matchBuckets = [
      { range: '0-20', min: 0, max: 20, jobs: 0 },
      { range: '20-45', min: 20, max: 45, jobs: 0 },
      { range: '45-70', min: 45, max: 70, jobs: 0 },
      { range: '70-100', min: 70, max: 100, jobs: 0 },
    ]
    for (const m of filteredMatches) {
      if (m.score >= 70) matchBuckets[3].jobs++
      else if (m.score >= 45) matchBuckets[2].jobs++
      else if (m.score >= 20) matchBuckets[1].jobs++
      else matchBuckets[0].jobs++
    }
    const matchDistribution = matchBuckets

    // ── 3. Application Pipeline ────────────────────────
    const stageConfig = [
      { stage: 'Interested', color: '#10b981' },
      { stage: 'Applied', color: '#34d399' },
      { stage: 'Interviewing', color: '#f59e0b' },
      { stage: 'Offered', color: '#059669' },
      { stage: 'Rejected', color: '#ef4444' },
    ]
    const appCountsByStatus = new Map<string, number>()
    for (const a of applicationsRaw) {
      appCountsByStatus.set(a.status, a._count.id)
    }
    const applicationPipeline = stageConfig.map((sc) => ({
      stage: sc.stage,
      count: appCountsByStatus.get(sc.stage.toLowerCase()) || 0,
      color: sc.color,
    }))

    // ── 4. Skills Gap Analysis ─────────────────────────
    const skillsGap: Array<{ skill: string; yourLevel: number; requiredLevel: number }> = []

    // Parse profile skills
    const profileSkills = new Set<string>()
    if (profile?.primarySkills) {
      profile.primarySkills.split(',').forEach((s) => profileSkills.add(s.trim().toLowerCase()))
    }
    if (profile?.secondarySkills) {
      profile.secondarySkills.split(',').forEach((s) => profileSkills.add(s.trim().toLowerCase()))
    }

    // Count skill occurrences across all job matches
    const skillRequiredCount = new Map<string, number>()
    const skillMatchedCount = new Map<string, number>()

    for (const jm of jobMatchesWithSkills) {
      // Count required skills from missingSkills
      if (jm.missingSkills) {
        const missing = jm.missingSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        for (const s of missing) {
          skillRequiredCount.set(s, (skillRequiredCount.get(s) || 0) + 1)
        }
      }
      // Count matched skills from matchingSkills
      if (jm.matchingSkills) {
        const matching = jm.matchingSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        for (const s of matching) {
          skillRequiredCount.set(s, (skillRequiredCount.get(s) || 0) + 1)
          skillMatchedCount.set(s, (skillMatchedCount.get(s) || 0) + 1)
        }
      }
    }

    // Get top skills sorted by required count
    const sortedSkills = [...skillRequiredCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    const totalJobsForSkills = jobMatchesWithSkills.length || 1

    for (const [skill, requiredCount] of sortedSkills) {
      const matchedCount = skillMatchedCount.get(skill) || 0
      const isProfileSkill = profileSkills.has(skill)

      // yourLevel: how well you have this skill (higher if in profile AND frequently matched)
      let yourLevel: number
      if (isProfileSkill) {
        // If the skill is in your profile and it's frequently matched, high level
        yourLevel = Math.min(100, Math.round(70 + (matchedCount / requiredCount) * 30))
      } else if (matchedCount > 0) {
        // Partially present
        yourLevel = Math.round((matchedCount / requiredCount) * 70)
      } else {
        yourLevel = 0
      }

      // requiredLevel: percentage of jobs requiring this skill
      const requiredLevel = Math.min(100, Math.round((requiredCount / totalJobsForSkills) * 100))

      // Capitalize skill name nicely
      const niceName = skill
        .split(/[_\-\s]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

      skillsGap.push({
        skill: niceName.length > 15 ? niceName.substring(0, 14) + '…' : niceName,
        yourLevel,
        requiredLevel,
      })
    }

    // ── 5. Top Companies ───────────────────────────────
    const companyCounts = new Map<string, number>()
    for (const a of applicationsWithCompany) {
      const name = a.job?.companyName || 'Unknown'
      if (name.trim()) {
        companyCounts.set(name, (companyCounts.get(name) || 0) + 1)
      }
    }
    const topCompanies = [...companyCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([company, applications]) => ({ company, applications }))

    // ── 6. Application Timeline (weekly) ───────────────
    const weekMap = new Map<string, number>()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (const a of applicationsForTimeline) {
      const date = a.appliedAt || a.createdAt
      if (!date) continue

      // Filter by range
      if (range !== 'all') {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
        const since = new Date()
        since.setDate(since.getDate() - days)
        if (date < since) continue
      }

      // Get ISO week number
      const d = new Date(date)
      const startOfYear = new Date(d.getFullYear(), 0, 1)
      const weekNum = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
      const key = `${monthNames[d.getMonth()]} W${Math.min(weekNum, 5)}`

      weekMap.set(key, (weekMap.get(key) || 0) + 1)
    }

    // Deduplicate if same label appears (keep latest value)
    const seenWeeks = new Map<string, number>()
    for (const [key, val] of weekMap) {
      seenWeeks.set(key, (seenWeeks.get(key) || 0) + val)
    }

    const applicationTimeline = [...seenWeeks.entries()].map(([date, apps]) => ({ date, apps }))

    // ── 7. Salary Data ─────────────────────────────────
    const salaryDataMap = new Map<string, { sumX: number; sumY: number; sumZ: number; count: number }>()

    for (const job of salaryJobsRaw) {
      let expYears = 0
      if (job.experienceRange) {
        // Try to parse experience range like "1-3", "2-5 years", "3+ years"
        const match = job.experienceRange.match(/(\d+(?:\.\d+)?)/g)
        if (match) {
          const nums = match.map(Number)
          expYears = nums.reduce((a, b) => a + b, 0) / nums.length
        }
      }

      const salaryMin = job.salaryMin || 0
      const salaryMax = job.salaryMax || 0
      const avgSalary = (salaryMin + salaryMax) / 2

      // Create a short title key by grouping similar titles
      let titleKey = job.title
      // Simplify title to first meaningful words
      const words = titleKey.replace(/[-_]/g, ' ').split(/\s+/).slice(0, 2)
      titleKey = words.join(' ')

      const existing = salaryDataMap.get(titleKey)
      if (existing) {
        existing.sumX += expYears
        existing.sumY += avgSalary
        existing.sumZ += 1
        existing.count++
      } else {
        salaryDataMap.set(titleKey, { sumX: expYears, sumY: avgSalary, sumZ: 1, count: 1 })
      }
    }

    const salaryData = [...salaryDataMap.entries()].map(([name, data]) => ({
      x: Math.round(data.sumX / data.count * 10) / 10,
      y: Math.round(data.sumY / data.count * 10) / 10,
      z: data.sumZ,
      name: name.length > 20 ? name.substring(0, 19) + '…' : name,
    }))

    // ── 8. Summary Stats ───────────────────────────────
    const allScores = filteredMatches.map((m) => m.score)
    const avgMatchScore = allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : 0

    const successRate = totalApplications > 0
      ? Math.round((offeredCount / totalApplications) * 1000) / 10
      : 0

    const stats = {
      totalJobs: totalJobsCount,
      avgMatch: avgMatchScore,
      successRate,
      activeApps: activeAppsCount,
      interviewing: interviewingCount,
    }

    return NextResponse.json({
      jobsBySource,
      matchDistribution,
      applicationPipeline,
      skillsGap,
      topCompanies,
      applicationTimeline,
      salaryData,
      stats,
    })
  } catch (error) {
    console.error('GET /api/analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
