name: Feature Request
about: Suggest a new feature or enhancement
title: "[FEATURE] "
labels: enhancement
assignees: alokgarg003
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem / Motivation
      description: Is your feature request related to a problem? Please describe
      placeholder: "I'm always frustrated when..."
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe the solution you'd like
      placeholder: "I would like to see..."
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - Job Search
        - Job Matching
        - Application Tracking
        - Analytics
        - Resume Builder
        - Companies Database
        - Settings / Profile
        - UI / UX
        - Other
    validations:
      required: true
