
# Club LMS — Club Years Domain

## Purpose

The Club Years Domain manages the annual operating
cycles of individual Adventurer and Pathfinder clubs.

Each club year represents a defined period during
which a club manages enrollments, activities,
attendance, curriculum progress, and achievements.

## Club Year Ownership

- Each club year belongs to exactly one club.
- A club may have multiple historical club years.
- A club may have only one active year at a time.
- Club years must not be shared between tenants.
- Clubs associated with the same church manage
  their operating years independently.

## Club Year Identity

Each club year must have:

- A unique system-generated identifier.
- An associated club identifier.
- A display name or year label.
- A start date.
- An end date.
- An operational status.
- Creation and update timestamps.

## Club Year Lifecycle

Initial statuses:

- PLANNED
- ACTIVE
- CLOSED

Lifecycle rules:

- A newly created club year begins as PLANNED.
- Only one club year may be ACTIVE per club.
- A PLANNED year may become ACTIVE.
- An ACTIVE year may become CLOSED.
- CLOSED years retain historical records.
- Reopening a CLOSED year requires an explicitly
  authorized administrative process.

Exact transition rules will be finalized before
implementation.

## Annual Enrollment

- Parents must enroll their children for each
  new club year.
- Annual enrollment is a single registration
  process associated with a club and club year.
- A child may have historical enrollments across
  multiple years.
- Creating a new club year does not automatically
  enroll children from the previous year.
- Enrollment must not duplicate the child's
  persistent identity record.
- Enrollment eligibility and approval rules will
  be defined within the Annual Enrollment Domain.

## Historical Records

Club-year-specific records may include:

- Annual enrollments.
- Class assignments.
- Attendance.
- Curriculum progress.
- Achievements and awards.
- Activities and events.

Historical records must remain associated with
their original club year.

Closing a club year must not automatically delete
or overwrite these records.

## Date Validation

- A club year's start date must precede its end date.
- Club-year date ranges must be validated.
- Rules governing overlapping club years will be
  finalized before database implementation.
- Club-year activation must respect the one-active-
  year-per-club restriction.

## Tenant Isolation

- Every club year must reference its owning club.
- Club-year operations must validate tenant access.
- Users must not access another club's records
  through a club-year identifier.
- Authorization must be enforced by the backend.

## Administration and Permissions

- Authorized club leadership may manage club years
  according to their assigned permissions.
- Platform Admins may perform authorized
  administrative operations.
- Other roles receive only explicitly permitted
  access.
- Sensitive lifecycle changes must be auditable.

## Related Domains

- Clubs
- Club settings
- Annual enrollments
- Children
- Classes
- Attendance
- Curriculum progress
- Achievements and awards
- Activities and events

## Implementation Boundaries

This document establishes the Club Years Domain
architecture.

Prisma models, database constraints, lifecycle
validation, migrations, API endpoints, and
administrative UI will be implemented in
subsequent steps.