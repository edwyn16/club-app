
# Club LMS — Phase 3 Domain Relationships

## Purpose

This document consolidates the foundational domain
relationships for the Club LMS multi-tenant architecture.

It serves as a reference for implementing Prisma models,
database constraints, and tenant-aware backend operations.

## Core Relationships

### Church to Club

- One church may have multiple clubs.
- Each club belongs to one church.
- Churches are not tenants.
- Clubs sharing a church remain isolated tenants.

Relationship: churches 1:N clubs

### Club to Subscription

- Each subscription belongs to one club.
- A club may have multiple historical subscriptions.
- A club must not have conflicting active subscriptions.

Relationship: clubs 1:N club_subscriptions

### Club to Settings

- Each club has exactly one settings record.
- Settings belong exclusively to their owning club.

Relationship: clubs 1:1 club_settings

### Club to Club Years

- Each club may have multiple operating years.
- Only one year may be active per club.
- Historical years must remain available.

Relationship: clubs 1:N club_years

### Church to Registration Requests

- A church may be associated with multiple requests.
- A request may reference an existing church or
  provide information for a new church.

Relationship: churches 1:N club_registration_requests
when an existing church is referenced.

### Registration Request to Club

- A registration request does not initially own a tenant.
- An approved request may result in one club.
- Rejected requests must not create clubs.
- Approval must not create duplicate clubs.

Relationship: club_registration_requests 1:0..1 clubs

## Tenant Ownership

The clubs table establishes the primary tenant boundary.

Tenant-owned records must reference the appropriate club
and must be accessed through authorized tenant context.

Church association does not grant access across clubs.

## Identity and Authorization

- Users have platform-wide identities.
- Users may belong to multiple clubs.
- Club-level roles and permissions are tenant-scoped.
- Platform administration is separate from club roles.
- No Church Admin role exists in the MVP.

## Annual Enrollment

- Each child retains a persistent identity.
- Parents register their children for each new club year.
- Annual enrollment is one registration process.
- Previous enrollment does not automatically carry
  forward into the next year.

## Database Implementation Requirements

The Prisma implementation must enforce:

- Referential integrity between related entities.
- Unique club settings per club.
- Prevention of duplicate club creation from one request.
- At most one active club year per club.
- Subscription lifecycle consistency.
- Tenant-aware queries and authorization.
- Auditable administrative lifecycle operations.

Constraints that cannot be expressed directly in Prisma
must be evaluated for PostgreSQL-level enforcement.

## Implementation Boundaries

This document consolidates architectural decisions.

It does not introduce database models, migrations,
API endpoints, or application behavior.

Implementation will follow after architectural review.