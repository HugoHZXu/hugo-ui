---
name: portfolio-desensitization-review
description: Review design-system docs, Storybook examples, sample data, and public copy for public safety. Use before or after adding README/docs content, examples, domain-like copy, or code inspired by prior private projects.
---

# Public Design-System Safety Review

Use this skill whenever a change could expose private implementation details or make the design
system look like it was extracted from an application domain.

## Step 1: Identify Public Surface

Check changed or proposed files that contain:

- Storybook examples
- README/docs copy
- sample data
- route-like labels, navigation labels, or template examples
- permissions, roles, lifecycle labels, operational events, or application rules
- visual tokens, class names, component names, icon choices, or examples adapted from reference
  projects

## Step 2: Block Private Assets

The change must not include:

- private code, screenshots, logs, endpoints, credentials, access tokens, or API keys
- real names, identifiers, account data, emails, URLs, support records, telemetry, or production logs
- application domain models such as organizations, tenants, customers, admins, roles, permissions,
  plans, domains, accounts, activity logs, or audit events
- screenshots or data copied from private tools
- internal permission rules, operational policy details, escalation rules, incident details, or pricing
  logic
- private token names, brand names, class names, icon strings, or design-system wording
- copied source from private projects

## Step 3: Preserve Only Neutral UI Patterns

Allowed examples:

- items, entries, examples, components, sections, panels, files, and notes
- abstract labels such as Alpha, Beta, Gamma, Primary, Secondary, and Sample
- UI states such as ready, review, hidden, success, warning, error, loading, selected, and disabled
- generic counts, dates, short descriptions, and placeholder text that only exercise layout

Technical UI terms such as `role`, `status`, `aria-*`, `StatusTag`, or semantic color roles are
allowed only when they describe component behavior, accessibility, or visual state.

When adapting from prior experience, keep only the reusable UI pattern and rewrite implementation,
names, data, and copy.

## Step 4: Check Data Plausibility Without Identifiability

Sample data should be realistic enough to support UI behavior, but clearly synthetic and neutral.

- Prefer short neutral labels such as `Alpha pattern`, `Beta module`, or `Sample note`.
- Avoid customer-like, tenant-like, account-like, or domain-like combinations.
- Avoid production-looking identifiers.
- Keep lifecycle labels generic and UI-focused.

## Step 5: Report

End with:

- `Reviewed surface`
- `Findings`
- `Required changes`
- `Residual risk`
