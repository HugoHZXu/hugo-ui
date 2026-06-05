# Desensitization Rules

This repository is intended to be public-safe design-system work. It should present reusable UI
components, themes, tokens, and Storybook examples without carrying over an application domain.

## Do Not Add

- Private source code, screenshots, logs, endpoints, credentials, access tokens, or API keys
- Real names, identifiers, account data, emails, URLs, support records, telemetry, or production logs
- Application domain models such as organizations, tenants, customers, admins, roles, permissions,
  plans, domains, accounts, activity logs, or audit events
- Private operational workflows, escalation rules, incident details, pricing rules, or internal policy
  language
- Private token names, brand names, class names, icon names, or design-system wording copied from
  another project
- Public documentation that implies this package was extracted from a private application

## Allowed Neutral Examples

Use examples that demonstrate UI behavior without implying a specific product domain:

- Items, entries, examples, components, sections, panels, files, or notes
- UI states such as ready, review, hidden, success, warning, error, loading, selected, and disabled
- Abstract labels such as Alpha, Beta, Gamma, Primary, Secondary, and Sample
- Generic counts, dates, short descriptions, and placeholder text that only exist to exercise layout

When a component needs a realistic table, form, or template example, keep the data small, synthetic,
and clearly UI-focused.

## Review Checklist

- No secrets, credentials, tokens, private endpoints, screenshots, or production logs were introduced.
- Storybook examples and docs use neutral design-system examples rather than application-domain data.
- Component APIs remain generic and reusable.
- Technical UI terms such as `role`, `status`, `aria-*`, `StatusTag`, or semantic color roles are used
  only for component behavior, accessibility, or visual state.
- README and docs describe this as a standalone design-system repository, not an extracted private
  application.
