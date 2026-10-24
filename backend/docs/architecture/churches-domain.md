
# Club LMS — Churches Domain

## Purpose

The Churches Domain represents churches associated with
Adventurer and Pathfinder clubs on the platform.

Churches are organizational reference entities and
do not function as SaaS tenants.

## Church Identity

Each church must have:

- A unique system-generated identifier.
- A church name.
- Creation and update timestamps.

Additional contact, address, and organizational
details may be introduced as requirements are finalized.

## Church and Club Relationships

- One church may be associated with multiple clubs.
- Each club belongs to one church.
- A church may have an Adventurer Club, a Pathfinder
  Club, or both.
- Each club remains an independent tenant.
- Clubs associated with the same church do not
  automatically share operational records.

## Tenant Boundaries

Churches do not own tenant-specific operational data.

Club-owned records must remain associated with their
respective clubs.

A shared church association must never be used as
authorization to access another club's records.

## Administration and Permissions

- Churches do not have a Church Admin role in the MVP.
- Platform administrators manage platform-level
  church records.
- Club-level permissions are assigned independently
  through club memberships and roles.
- A Director managing multiple clubs must be
  authorized separately for each club.

## Related Domains

The Churches Domain connects to:

- Clubs
- Club registration requests

Additional relationships may be introduced in later
development phases.

## Implementation Boundaries

This document establishes the Churches Domain
architecture.

Prisma models, database relationships, constraints,
migrations, and API endpoints will be implemented
in subsequent steps.