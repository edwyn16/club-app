
# Club LMS — Club Settings Domain

## Purpose

The Club Settings Domain manages configuration
preferences for individual Adventurer and Pathfinder
club tenants.

Settings allow clubs to configure their workspace
without affecting other clubs or platform-wide rules.

## Settings Ownership

- Each club has exactly one settings record.
- Each settings record belongs to exactly one club.
- Settings must not be shared between club tenants.
- Clubs associated with the same church maintain
  independent settings.
- Settings must be created or initialized when
  a club is provisioned.

## Settings Identity

Each settings record must have:

- A unique system-generated identifier.
- An associated club identifier.
- Creation and update timestamps.

Specific configuration fields will be finalized
before database implementation.

## Configuration Categories

The initial architecture supports the following
categories of club configuration:

### General

- Club display preferences.
- Contact information.
- Club-specific organizational details.

### Branding

- Club logo.
- Permitted club branding preferences.

The platform login screen retains platform branding.

### Communication

- Club communication preferences.
- Notification configuration where supported.

### Operations

- Club-specific operational preferences.
- Defaults associated with club activities.

Club years and annual enrollment remain separate
domains with their own business rules.

## Configuration Authority

- Platform Admins may manage settings according
  to platform administration policies.
- Authorized club leadership may modify permitted
  club-level settings.
- Other club roles may receive limited read or
  update permissions where explicitly authorized.
- Permissions must be enforced by the backend.

## Platform-Controlled Restrictions

Club settings must not override:

- Tenant isolation.
- Role-based access control.
- Child protection and safeguarding requirements.
- Privacy and data protection requirements.
- Platform authentication rules.
- Subscription status or billing policies.
- Platform-wide security controls.

## Default Settings

- Newly provisioned clubs receive default settings.
- Defaults are defined and controlled by the platform.
- Club-specific changes must remain within
  permitted configuration boundaries.
- Missing optional settings must be handled safely.

## Security Requirements

- Every settings operation must validate club access.
- Club identifiers supplied by clients must not
  be trusted without authorization.
- Sensitive configuration changes must be auditable.
- Unauthorized users must not modify club settings.
- Settings changes must not expose data belonging
  to another tenant.

## Related Domains

- Clubs
- Users
- User club roles
- Club subscriptions
- Club years

## Implementation Boundaries

This document establishes the Club Settings Domain
architecture.

Exact configuration fields, default values,
validation rules, Prisma models, database constraints,
API endpoints, and administrative UI will be
implemented in subsequent steps.