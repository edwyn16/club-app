
# Club LMS — Clubs Domain

## Purpose

A club is the primary tenant entity within Club LMS.

Each club operates as an independent workspace with
its own members, permissions, subscription, settings,
and operational data.

## Supported Club Types

- ADVENTURER
- PATHFINDER

## Club Identity

Each club must have:

- A unique system-generated identifier.
- A club name.
- A club type.
- An operational status.
- Creation and update timestamps.

## Church Association

- A club may be associated with a church.
- A church may have multiple clubs.
- Churches do not function as tenants.
- Church association must not grant access to club data.

## Tenant Isolation

- Each club represents one tenant.
- Tenant-owned records must reference their owning club.
- Users may participate in multiple clubs.
- Membership in one club does not grant access to another.
- All protected club operations require authorization.

## Club Lifecycle

Club creation, approval, activation, suspension,
and archival must follow platform-controlled rules.

The exact lifecycle statuses and transitions will
be defined before implementation.

## Related Domains

The Club entity will connect to:

- Churches
- Club registration requests
- Club subscriptions
- Club settings
- Club years
- User club roles
- Annual enrollments

## Implementation Boundaries

This document defines the Clubs Domain architecture.

Prisma models, database constraints, migrations,
and API endpoints will be implemented separately.