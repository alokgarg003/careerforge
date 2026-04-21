/**
 * Enhanced Job Match Engine
 * Ported from Python evaluator.py with weighted scoring,
 * bonuses, penalties, and exclusion signals.
 *
 * Scoring breakdown (max 100):
 *   Primary skills:  min(hits × 12, 60)   [max 60]
 *   Secondary skills: min(hits × 5, 15)   [max 15]
 *   MFT bonus:       +10 (if MFT keywords)
 *   On-call bonus:   +7  (if on-call/shift keywords)
 *   Cloud bonus:     +5  per cloud platform [max 10]
 *   ServiceNow/ITIL: +8
 *   CI/CD:           +4
 *   Support bonus:   +6  (if ≥2 support keywords)
 *   Dev penalty:     -30 (if ≥2 dev keywords)
 */

export interface ScoreResult {
  score: number;
  alignment: 'Strong Match' | 'Good Match' | 'Stretch' | 'Ignore';
  matchingSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
  penaltyReasons: string[];
  bonusPoints: number;
  penaltyPoints: number;
}

const MFT_KEYWORDS = [
  'mft', 'managed file transfer', 'goanywhere', 'sftp', 'ftps', 'ftp',
  'as2', 'file transfer', 'edi', 'axway', 'ibm sterling', 'cleo',
  'tibco', 'opentext', 'thru', 'fms', 'ftg', 'secure transport',
];

const ONCALL_KEYWORDS = [
  'on-call', 'oncall', '24/7', '24x7', 'shift', 'rotational',
  'after hours', 'on call', 'pager duty', 'pagerduty', 'standby',
];

const CLOUD_PLATFORMS = [
  'aws', 'azure', 'gcp', 'google cloud', 'oracle cloud',
];

const SERVICENOW_KEYWORDS = [
  'servicenow', 'service now', 'itil', 'incident management',
  'change management', 'problem management', 'sla management',
];

const SUPPORT_KEYWORDS = [
  'production support', 'application support', 'platform support',
  'l2 support', 'l3 support', 'troubleshoot', 'troubleshooting',
  'root cause', 'incident', 'support engineer', 'operations support',
  'production', 'support', 'monitoring', 'alerting',
];

const DEV_KEYWORDS = [
  'software engineer', 'senior backend', 'full stack', 'frontend developer',
  'frontend engineer', 'react developer', 'angular developer', 'vue developer',
  'mobile developer', 'android developer', 'ios developer',
  'game developer', 'embedded developer', 'data scientist',
  'machine learning engineer', 'ml engineer',
];

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
}

export function calculateMatchScore(
  jobText: string,
  primarySkills: string[],
  secondarySkills: string[],
  excludeSignals: string[] = [],
  jobSkills: string[] = [],
): ScoreResult {
  const lower = jobText.toLowerCase();
  const matchReasons: string[] = [];
  const penaltyReasons: string[] = [];
  let score = 0;

  // ── Step 1: Exclusion check ──
  const excludeHits = excludeSignals.filter(sig => {
    const s = sig.toLowerCase().trim();
    return s && lower.includes(s);
  });
  if (excludeHits.length > 0) {
    return {
      score: 0,
      alignment: 'Ignore',
      matchingSkills: [],
      missingSkills: [],
      matchReasons: [],
      penaltyReasons: [`Excluded: found "${excludeHits.join(', ')}"`],
      bonusPoints: 0,
      penaltyPoints: 0,
    };
  }

  // ── Step 2: Primary Skills (max 60) ──
  const primaryHits = primarySkills.filter(sk => {
    const s = sk.toLowerCase().trim();
    return s && (lower.includes(s) || jobSkills.some(js => js.toLowerCase().includes(s)));
  });
  const primaryScore = Math.min(primaryHits.length * 12, 60);
  score += primaryScore;
  if (primaryHits.length > 0) {
    matchReasons.push(`Primary skills match: ${primaryHits.length} (${primaryScore}pts)`);
  }

  // ── Step 3: Secondary Skills (max 15) ──
  const secondaryHits = secondarySkills.filter(sk => {
    const s = sk.toLowerCase().trim();
    return s && (lower.includes(s) || jobSkills.some(js => js.toLowerCase().includes(s)));
  });
  const secondaryScore = Math.min(secondaryHits.length * 5, 15);
  score += secondaryScore;
  if (secondaryHits.length > 0) {
    matchReasons.push(`Secondary skills match: ${secondaryHits.length} (${secondaryScore}pts)`);
  }

  let bonusPoints = 0;
  let penaltyPoints = 0;

  // ── Step 4: MFT Bonus (+10) ──
  const mftHits = countMatches(lower, MFT_KEYWORDS);
  if (mftHits >= 2) {
    score += 10;
    bonusPoints += 10;
    matchReasons.push('MFT/File Transfer domain match (+10)');
  }

  // ── Step 5: On-Call Bonus (+7) ──
  const oncallHits = countMatches(lower, ONCALL_KEYWORDS);
  if (oncallHits >= 1) {
    score += 7;
    bonusPoints += 7;
    matchReasons.push('On-call/Shift rotation match (+7)');
  }

  // ── Step 6: Cloud Bonus (+5 per platform, max 10) ──
  const cloudHits = countMatches(lower, CLOUD_PLATFORMS);
  if (cloudHits >= 1) {
    const cloudBonus = Math.min(cloudHits * 5, 10);
    score += cloudBonus;
    bonusPoints += cloudBonus;
    matchReasons.push(`Cloud platform match: ${cloudHits} (${cloudBonus}pts)`);
  }

  // ── Step 7: ServiceNow/ITIL Bonus (+8) ──
  const snHits = countMatches(lower, SERVICENOW_KEYWORDS);
  if (snHits >= 1) {
    score += 8;
    bonusPoints += 8;
    matchReasons.push('ServiceNow/ITIL match (+8)');
  }

  // ── Step 8: CI/CD Bonus (+4) ──
  const cicdKeywords = ['ci/cd', 'cicd', 'jenkins', 'gitlab ci', 'github actions', 'pipeline'];
  const cicdHits = countMatches(lower, cicdKeywords);
  if (cicdHits >= 1) {
    score += 4;
    bonusPoints += 4;
    matchReasons.push('CI/CD tooling match (+4)');
  }

  // ── Step 9: Support Oriented Bonus (+6) ──
  const supportHits = countMatches(lower, SUPPORT_KEYWORDS);
  if (supportHits >= 2) {
    score += 6;
    bonusPoints += 6;
    matchReasons.push('Support-oriented role (+6)');
  }

  // ── Step 10: Dev Penalty (-30) ──
  const devHits = countMatches(lower, DEV_KEYWORDS);
  if (devHits >= 2) {
    score -= 30;
    penaltyPoints += 30;
    penaltyReasons.push('Development-heavy role (-30)');
  }

  // ── Clamp score ──
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── Alignment ──
  const alignment: ScoreResult['alignment'] =
    score >= 70 ? 'Strong Match' :
    score >= 45 ? 'Good Match' :
    score >= 20 ? 'Stretch' : 'Ignore';

  // ── Missing skills ──
  const missingSkills = primarySkills.filter(sk => {
    const s = sk.toLowerCase().trim();
    return s && !lower.includes(s) && !jobSkills.some(js => js.toLowerCase().includes(s));
  });

  return {
    score,
    alignment,
    matchingSkills: [...primaryHits, ...secondaryHits],
    missingSkills,
    matchReasons,
    penaltyReasons,
    bonusPoints,
    penaltyPoints,
  };
}

/**
 * Build optimized search queries from target roles and preferences
 */
export function buildSearchQueries(
  targetRoles: string[],
  locations: string[],
  searchKeywords: string[] = [],
): { query: string; location: string; type: 'role' | 'keyword' | 'skill' }[] {
  const queries: { query: string; location: string; type: 'role' | 'keyword' | 'skill' }[] = [];
  const defaultLocations = locations.length > 0 ? locations : ['India'];

  // Role-based queries
  for (const role of targetRoles.slice(0, 5)) {
    for (const loc of defaultLocations.slice(0, 3)) {
      queries.push({ query: role, location: loc, type: 'role' });
    }
  }

  // Keyword-based queries
  for (const kw of searchKeywords.slice(0, 5)) {
    for (const loc of defaultLocations.slice(0, 2)) {
      queries.push({ query: kw, location: loc, type: 'keyword' });
    }
  }

  return queries;
}

/**
 * Deduplicate jobs by title + company name (case-insensitive)
 */
export function deduplicateJobs<T extends { title: string; companyName: string }>(
  jobs: T[]
): T[] {
  const seen = new Set<string>();
  return jobs.filter(job => {
    const key = `${job.title.toLowerCase().trim()}|${job.companyName.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
