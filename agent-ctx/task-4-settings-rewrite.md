# Task 4: Settings Page Rewrite - Work Record

## Summary
Rewrote `/home/z/my-project/src/components/settings/settings-page.tsx` to persist all data to the database via API calls instead of showing toast-only placeholders.

## Changes Made

### Toast System
- Replaced `import { useToast } from '@/hooks/use-toast'` with `import { toast } from 'sonner'` (consistent with other pages in the project)
- Updated all toast calls from `toast({ title: '...' })` to `toast.success('...')` and `toast.error('...')`

### Data Loading (on mount)
- Added `useEffect` that fetches `GET /api/profile` and populates ALL form fields:
  - Profile form fields (name, email, phone, currentRole, company→currentCompany, location, experience→experienceYears, linkedinUrl, githubUrl)
  - Skills arrays (primarySkills, secondarySkills, excludeSignals, targetRoles, preferredLocations) parsed from comma-separated DB strings
  - Salary data (salaryMin, salaryMax, salaryCurrency)
  - Search prefs (defaultLocation from profile location)
- Added `GET /api/jobs` and `GET /api/applications` count fetching for database size display
- Added loading skeleton component (`SettingsSkeleton`) shown during initial fetch

### Save Handlers (real API calls)
1. **Profile save**: `PUT /api/profile` with mapped fields (company→currentCompany, experience→experienceYears)
2. **Skills save**: `PUT /api/profile` with comma-joined arrays for primarySkills, secondarySkills, excludeSignals, targetRoles, preferredLocations
3. **Salary save**: `PUT /api/profile` with salaryMin, salaryMax, salaryCurrency
4. **Search prefs save**: `PUT /api/profile` with preferredLocations from defaultLocation

### Data Management
5. **Export JSON**: Fetches all 4 APIs, combines into single object, creates Blob and triggers download as `careerforge-export-{date}.json`
6. **Export CSV**: Fetches jobs, converts to CSV with headers (title, company, location, source, score, alignment, date), downloads as `careerforge-jobs-{date}.csv`
7. **Import Data**: Hidden file input, parses JSON, imports profile via PUT and jobs via POST
8. **Clear Jobs**: Fetches all jobs, deletes each via `DELETE /api/jobs/{id}`, shows count
9. **Clear Applications**: Fetches all applications, deletes each via `DELETE /api/applications/{id}`, shows count

### Dynamic Counts
- Database Size section shows real `{jobsCount} jobs, {applicationsCount} applications`
- Danger Zone dialogs show real counts from API, not hardcoded values
- Disabled Clear buttons when count is 0

### Visual Changes
- Added `Loader2` spinning icon on save buttons during save operations
- Added disabled state on save buttons while saving
- Removed custom `Target` and `Building` SVG components at the bottom, replaced with `Target` and `Building2` from lucide-react
- Added `LPA` as a currency option in the salary select

### UI Preservation
- ALL existing UI design, form layouts, TagInput component, AnimatedCard wrapper, and visual styling preserved exactly
- Loading skeleton matches the card layout for smooth loading experience

## Field Mapping Reference
| Form Field | API/DB Field | Notes |
|---|---|---|
| company | currentCompany | Renamed for API |
| experience | experienceYears | Renamed for API |
| primarySkills[] | primarySkills | Array ↔ comma string |
| secondarySkills[] | secondarySkills | Array ↔ comma string |
| excludeSignals[] | excludeSignals | Array ↔ comma string |
| targetRoles[] | targetRoles | Array ↔ comma string |
| preferredLocations[] | preferredLocations | Array ↔ comma string |
| minSalary | salaryMin | Renamed for API |
| maxSalary | salaryMax | Renamed for API |
| currency | salaryCurrency | Renamed for API |

## Validation
- ESLint passes with no errors
- Dev server compiles successfully with 200 responses
