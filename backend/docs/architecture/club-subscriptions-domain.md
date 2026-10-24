
# Club LMS — Club Subscriptions Domain

## Purpose

The Club Subscriptions Domain manages the subscription
relationship between Club LMS and individual club tenants.

Each Adventurer or Pathfinder club is independently
responsible for its platform subscription.

## Subscription Ownership

- Each subscription belongs to exactly one club.
- A club may have multiple historical subscription records.
- A club must not have multiple active subscriptions
  for the same subscription period.
- A church does not own club subscriptions.
- Subscriptions must not be shared between club tenants.

## Subscription Identity

Each subscription must have:

- A unique system-generated identifier.
- An associated club identifier.
- A subscription status.
- A subscription start date.
- An optional subscription end date.
- Creation and update timestamps.

Additional billing and payment-related fields will
be defined when the billing requirements are finalized.

## Subscription Lifecycle

Initial subscription statuses:

- PENDING
- ACTIVE
- PAST_DUE
- SUSPENDED
- CANCELLED
- EXPIRED

Status transitions must be validated by the backend.

The complete transition rules will be defined before
implementation.

## Subscription Activation

- Subscription activation is platform-controlled.
- An approved registration request does not
  automatically guarantee an active subscription.
- A club must satisfy the required activation
  conditions before receiving subscription-protected
  access.
- Subscription activation must be auditable.

## Subscription Access Rules

- Subscription status must be validated by the backend.
- ACTIVE subscriptions permit access to the features
  included in the club's subscription.
- Other subscription statuses may restrict access
  according to platform-defined policies.
- Subscription restrictions must not result in
  unauthorized deletion of club records.
- Access restrictions must preserve tenant isolation.

## Club Operational Status

Club operational status and subscription status
are separate concepts.

A club may remain operationally registered while
its subscription is suspended, expired, or past due.

Subscription changes must not automatically modify
the club's operational status unless explicitly
required by a defined business rule.

## Subscription History

- Subscription history must be retained.
- Status changes must be auditable.
- Administrative actions must identify the
  responsible actor where applicable.
- Historical subscription records must not be
  overwritten to represent unrelated periods.

## Security Requirements

- Only authorized platform operations may modify
  subscription lifecycle states.
- Club users must not modify subscription status
  through ordinary club-level permissions.
- Subscription queries must enforce tenant isolation.
- Payment-related information must be protected
  according to applicable security requirements.

## Related Domains

- Clubs
- Club registration requests
- Users
- Platform administration

## Implementation Boundaries

This document defines the Club Subscriptions Domain
architecture.

Subscription pricing, payment providers, billing
cycles, trials, renewals, invoices, and payment
collection will be defined separately.

Prisma models, constraints, migrations, validation,
API endpoints, and subscription access middleware
will be implemented in subsequent steps.