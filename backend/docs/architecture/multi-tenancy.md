
# Club LMS — Multi-Tenant Architecture

## Architecture

Club LMS is a multi-tenant SaaS application supporting
independent Adventurer and Pathfinder clubs.

## Tenant Model

- A tenant represents one club workspace.
- Each club has an independent subscription.
- Multiple clubs may be associated with one church.
- Churches are not tenants.
- A single user may participate in multiple clubs.
- Club membership and permissions are tenant-scoped.

## Database Strategy

The platform uses a shared PostgreSQL database.

Tenant-owned records must be associated with their
owning tenant.

Tenant isolation must be enforced through backend
authorization and tenant-scoped database operations.

## Identity

Users have a platform-wide identity.

Club-specific access is determined through club
membership and assigned roles.

Platform administrators are managed separately from
club-level roles.

## Club Types

Supported club types:

- ADVENTURER
- PATHFINDER

## Subscription Model

- One subscription belongs to one club.
- Subscription management is platform-controlled.
- A church may have multiple club subscriptions.

## Security Requirements

- Deny access when tenant context is missing or invalid.
- Validate tenant membership before protected operations.
- Prevent cross-tenant data access.
- Never trust a client-provided tenant ID without
  authorization.
- Apply least-privilege access to sensitive child data.
- Record security-relevant administrative actions.

## Implementation Boundaries

This document establishes architectural rules.

Database models, migrations, tenant resolution,
authorization middleware, and subscription lifecycle
logic will be implemented in subsequent steps.