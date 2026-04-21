name: Bug Report
about: Report a bug or unexpected behavior
title: "[BUG] "
labels: bug
assignees: alokgarg003
body:
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear description of what the bug is
      placeholder: "When I click on X, Y happens instead of Z..."
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
    validations:
      required: true
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots to help explain
  - type: input
    id: environment
    attributes:
      label: Environment
      description: "Browser, OS, Node version, etc."
      placeholder: "Chrome 120, macOS, Node 20"
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Low (minor UI glitch)
        - Medium (feature partially broken)
        - High (major feature broken)
        - Critical (app crashes / data loss)
    validations:
      required: true
