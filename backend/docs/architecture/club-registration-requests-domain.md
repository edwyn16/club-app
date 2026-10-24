
# Club LMS — Club Registration Requests Domain

## Purpose

The Club Registration Requests Domain manages applications
from churches or their authorized representatives seeking
to register an Adventurer or Pathfinder club.

A registration request does not represent an active tenant.

## Registration Request Identity

Each request must have:

- A unique system-generated identifier.
- Proposed club name.
- Requested club type.
- Associated church information.
- Applicant identity and contact information.
- Registration status.
- Creation and update timestamps.

## Supported Club Types

- ADVENTURER
- PATHFINDER

Each club type requires its own registration request.

## Registration Lifecycle

Supported registration statuses:

- PENDING
- APPROVED
- REJECTED

New requests begin with PENDING status.

Only Platform Admins may approve or reject requests.

## Approval Rules

- An approved request may result in the creation
  of a new club tenant.
- Approval must not create duplicate club tenants
  from the same registration request.
- The created club must retain a reference to its
  originating registration request.
- Approval must be recorded for auditing purposes.
- The applicant must not receive club-level access
  before the appropriate membership and role
  assignments are established.

## Rejection Rules

- A rejected request must not create a club tenant.
- The rejection decision must be recorded.
- Rejection reasons may be retained for administrative
  review and communication.

## Church Association

- A registration request may reference an existing
  church or provide information for a new church.
- A church may be associated with multiple requests.
- Church association does not grant tenant access.

## Security Requirements

- Applicants must not approve their own requests
  through the public registration workflow.
- Registration decisions are restricted to authorized
  Platform Admins.
- Applicant information must be protected against
  unauthorized access.
- Administrative decisions must be auditable.

## Related Domains

- Churches
- Clubs
- Users
- Club subscriptions

## Implementation Boundaries

This document establishes the registration request
architecture.

Prisma models, validation schemas, approval transactions,
API endpoints, notifications, and administrative UI
will be implemented in subsequent steps.